# AI 서비스 구현 가이드

> 🤖 **AI 기능 구현을 위한 실용적인 개발 가이드**

이 문서는 프로젝트의 AI 기능 구현에 특화된 가이드입니다. 기본 설정은 [`GETTING_STARTED.md`](./GETTING_STARTED.md)를, 전체 아키텍처는 [`DIRECTORY_ARCHITECTURE.md`](./DIRECTORY_ARCHITECTURE.md)를 참조하세요.

## 🎯 AI 서비스 핵심 기능

### 지원하는 AI 기능
- **다중 AI 모델**: OpenAI, Anthropic, Google AI 통합
- **RAG 시스템**: 문서 기반 컨텍스트 생성
- **프롬프트 캐싱**: Redis 기반 성능 최적화
- **실시간 스트리밍**: SSE 기반 실시간 응답
- **파일 처리**: PDF, Word, 이미지 분석
- **템플릿 시스템**: 재사용 가능한 프롬프트 관리

## 📦 AI 패키지 구성

### 핵심 AI SDK
```json
{
  "@ai-sdk/openai": "^0.0.66",
  "@ai-sdk/anthropic": "^0.0.54",
  "@ai-sdk/google": "^0.0.52",
  "ai": "^4.0.36"
}
```

### RAG & 벡터 검색
```json
{
  "@langchain/core": "^0.3.29",
  "@langchain/openai": "^0.3.15",
  "@langchain/community": "^0.3.21",
  "@pinecone-database/pinecone": "^4.0.0"
}
```

### 파일 처리 & 스토리지
```json
{
  "@vercel/blob": "^0.27.0",
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.8.0",
  "sharp": "^0.33.5"
}
```

### 캐싱 & 성능
```json
{
  "ioredis": "^5.4.1",
  "@upstash/redis": "^1.36.1"
}
```

## 🚀 AI 모델 통합

### 1. AI 모델 클라이언트 구현

```typescript
// src/infrastructure/ai-providers/openai/client.ts
import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

export class OpenAIClient {
  private model: string

  constructor(model: string = 'gpt-4') {
    this.model = model
  }

  async generateResponse(prompt: string, options?: GenerateOptions) {
    const result = await generateText({
      model: openai(this.model),
      prompt,
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 1000,
    })

    return result.text
  }

  async streamResponse(messages: Message[]) {
    const result = await streamText({
      model: openai(this.model),
      messages,
      onFinish: async ({ text, usage }) => {
        // 사용량 로깅, DB 저장 등
        await this.logUsage(usage)
      }
    })

    return result.toDataStreamResponse()
  }

  private async logUsage(usage: any) {
    // 사용량 추적 로직
  }
}
```

### 2. 다중 모델 관리자

```typescript
// src/domains/chat/services/ai-model-manager.ts
export class AIModelManager {
  private providers = new Map<string, AIProvider>()

  constructor() {
    this.providers.set('openai', new OpenAIClient())
    this.providers.set('anthropic', new AnthropicClient())
    this.providers.set('google', new GoogleAIClient())
  }

  async generateResponse(
    provider: string,
    prompt: string,
    options?: GenerateOptions
  ): Promise<string> {
    const client = this.providers.get(provider)
    if (!client) {
      throw new Error(`Unsupported AI provider: ${provider}`)
    }

    return await client.generateResponse(prompt, options)
  }

  async streamResponse(provider: string, messages: Message[]) {
    const client = this.providers.get(provider)
    if (!client) {
      throw new Error(`Unsupported AI provider: ${provider}`)
    }

    return await client.streamResponse(messages)
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}
```

## 🧠 프롬프트 캐싱 시스템

### 1. 캐시 관리자

```typescript
// src/domains/chat/services/prompt-cache.service.ts
import { createHash } from 'crypto'
import Redis from 'ioredis'

export class PromptCacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!)
  }

  // 프롬프트 해시 생성
  private generatePromptHash(prompt: string, model: string, options: any): string {
    const content = JSON.stringify({ prompt, model, options })
    return createHash('sha256').update(content).digest('hex')
  }

  // 캐시된 응답 조회
  async getCachedResponse(
    prompt: string,
    model: string,
    options: any = {}
  ): Promise<string | null> {
    const hash = this.generatePromptHash(prompt, model, options)
    const cached = await this.redis.get(`prompt:${hash}`)

    if (cached) {
      // 캐시 히트 메트릭 기록
      await this.recordCacheHit(hash)
    }

    return cached
  }

  // 응답 캐시 저장
  async setCachedResponse(
    prompt: string,
    model: string,
    response: string,
    options: any = {},
    ttl: number = 3600
  ): Promise<void> {
    const hash = this.generatePromptHash(prompt, model, options)
    await this.redis.setex(`prompt:${hash}`, ttl, response)
  }

  // 사용자별 컨텍스트 캐시
  async getUserContext(userId: string): Promise<any> {
    const context = await this.redis.get(`user_context:${userId}`)
    return context ? JSON.parse(context) : null
  }

  async setUserContext(userId: string, context: any, ttl: number = 1800): Promise<void> {
    await this.redis.setex(
      `user_context:${userId}`,
      ttl,
      JSON.stringify(context)
    )
  }

  // 세션 기반 대화 기록
  async getSessionHistory(sessionId: string): Promise<Message[]> {
    const history = await this.redis.get(`session:${sessionId}`)
    return history ? JSON.parse(history) : []
  }

  async addToSessionHistory(sessionId: string, message: Message): Promise<void> {
    const history = await this.getSessionHistory(sessionId)
    history.push(message)

    // 최근 20개 메시지만 유지
    const recentHistory = history.slice(-20)

    await this.redis.setex(
      `session:${sessionId}`,
      3600, // 1시간
      JSON.stringify(recentHistory)
    )
  }

  private async recordCacheHit(hash: string): Promise<void> {
    await this.redis.incr(`cache_hits:${hash}`)
  }
}
```

### 2. 캐시 전략 구현

```typescript
// src/domains/chat/services/application-services/chat.service.ts
export class ChatService {
  constructor(
    private aiModelManager: AIModelManager,
    private promptCache: PromptCacheService,
    private ragService: RAGService
  ) {}

  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const { prompt, model, userId, sessionId, useRAG } = request

    // 1. RAG 컨텍스트 생성 (필요시)
    let enhancedPrompt = prompt
    if (useRAG) {
      const context = await this.ragService.getRelevantContext(prompt)
      enhancedPrompt = this.buildRAGPrompt(prompt, context)
    }

    // 2. 캐시 확인
    const cachedResponse = await this.promptCache.getCachedResponse(
      enhancedPrompt,
      model,
      request.options
    )

    if (cachedResponse) {
      return {
        response: cachedResponse,
        cached: true,
        usage: null
      }
    }

    // 3. AI 모델 호출
    const response = await this.aiModelManager.generateResponse(
      model,
      enhancedPrompt,
      request.options
    )

    // 4. 응답 캐시 저장
    await this.promptCache.setCachedResponse(
      enhancedPrompt,
      model,
      response,
      request.options
    )

    // 5. 세션 히스토리 업데이트
    await this.promptCache.addToSessionHistory(sessionId, {
      role: 'user',
      content: prompt
    })
    await this.promptCache.addToSessionHistory(sessionId, {
      role: 'assistant',
      content: response
    })

    return {
      response,
      cached: false,
      usage: null // 실제 사용량 정보
    }
  }

  private buildRAGPrompt(query: string, context: string[]): string {
    return `
컨텍스트 정보:
${context.join('\n\n')}

질문: ${query}

위의 컨텍스트 정보를 바탕으로 질문에 답변해주세요.
    `.trim()
  }
}
```

## 🔍 RAG 시스템 구현

### 1. 벡터 저장소 관리

```typescript
// src/domains/documents/services/vector-store.service.ts
import { PineconeStore } from '@langchain/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Pinecone } from '@pinecone-database/pinecone'

export class VectorStoreService {
  private pinecone: Pinecone
  private vectorStore: PineconeStore
  private embeddings: OpenAIEmbeddings

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    })

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!
    })

    this.initializeVectorStore()
  }

  private async initializeVectorStore() {
    const index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME!)

    this.vectorStore = await PineconeStore.fromExistingIndex(
      this.embeddings,
      { pineconeIndex: index }
    )
  }

  // 문서 임베딩 및 저장
  async addDocument(
    content: string,
    metadata: DocumentMetadata
  ): Promise<void> {
    const chunks = this.chunkDocument(content)

    const documents = chunks.map((chunk, index) => ({
      pageContent: chunk,
      metadata: {
        ...metadata,
        chunkIndex: index,
        chunkCount: chunks.length
      }
    }))

    await this.vectorStore.addDocuments(documents)
  }

  // 유사도 검색
  async searchSimilarDocuments(
    query: string,
    k: number = 5,
    filter?: Record<string, any>
  ): Promise<SearchResult[]> {
    const results = await this.vectorStore.similaritySearchWithScore(
      query,
      k,
      filter
    )

    return results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      similarity: score
    }))
  }

  // 문서 청킹
  private chunkDocument(content: string, chunkSize: number = 1000): string[] {
    const chunks: string[] = []
    const sentences = content.split(/[.!?]+/)

    let currentChunk = ''

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim())
          currentChunk = ''
        }
      }
      currentChunk += sentence + '. '
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  // 배치 임베딩 생성
  async batchAddDocuments(documents: DocumentInput[]): Promise<void> {
    const batchSize = 10

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)

      await Promise.all(
        batch.map(doc => this.addDocument(doc.content, doc.metadata))
      )

      // API 레이트 리밋 방지
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

### 2. RAG 서비스

```typescript
// src/domains/chat/services/rag.service.ts
export class RAGService {
  constructor(
    private vectorStore: VectorStoreService,
    private documentService: DocumentService
  ) {}

  async getRelevantContext(
    query: string,
    userId: string,
    maxChunks: number = 5
  ): Promise<string[]> {
    // 사용자의 문서만 검색
    const filter = { userId }

    const results = await this.vectorStore.searchSimilarDocuments(
      query,
      maxChunks,
      filter
    )

    // 유사도 임계값 적용
    const relevantResults = results.filter(result => result.similarity > 0.7)

    return relevantResults.map(result => result.content)
  }

  async enhancePromptWithContext(
    prompt: string,
    userId: string
  ): Promise<string> {
    const context = await this.getRelevantContext(prompt, userId)

    if (context.length === 0) {
      return prompt
    }

    return `
참고 문서:
${context.map((chunk, index) => `${index + 1}. ${chunk}`).join('\n\n')}

질문: ${prompt}

위의 참고 문서를 바탕으로 질문에 답변해주세요. 답변에 사용한 문서의 번호를 명시해주세요.
    `.trim()
  }

  // 문서 관련성 점수 계산
  async calculateRelevanceScore(
    query: string,
    documentId: string
  ): Promise<number> {
    const document = await this.documentService.getDocument(documentId)
    if (!document) return 0

    const results = await this.vectorStore.searchSimilarDocuments(
      query,
      10,
      { documentId }
    )

    if (results.length === 0) return 0

    // 평균 유사도 점수 반환
    const avgScore = results.reduce((sum, result) => sum + result.similarity, 0) / results.length
    return avgScore
  }
}
```

## 📁 파일 처리 시스템

### 1. 문서 파서

```typescript
// src/domains/documents/services/document-parser.service.ts
import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import sharp from 'sharp'

export class DocumentParserService {
  async parseDocument(file: File): Promise<ParsedDocument> {
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    switch (file.type) {
      case 'application/pdf':
        return await this.parsePDF(uint8Array)

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await this.parseWord(uint8Array)

      case 'text/plain':
        return await this.parseText(uint8Array)

      case 'image/jpeg':
      case 'image/png':
        return await this.parseImage(uint8Array)

      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }
  }

  private async parsePDF(buffer: Uint8Array): Promise<ParsedDocument> {
    const data = await pdf(buffer)

    return {
      content: data.text,
      metadata: {
        pages: data.numpages,
        title: data.info?.Title || '',
        author: data.info?.Author || '',
        creationDate: data.info?.CreationDate
      }
    }
  }

  private async parseWord(buffer: Uint8Array): Promise<ParsedDocument> {
    const result = await mammoth.extractRawText({ buffer })

    return {
      content: result.value,
      metadata: {
        warnings: result.messages
      }
    }
  }

  private async parseText(buffer: Uint8Array): Promise<ParsedDocument> {
    const content = new TextDecoder().decode(buffer)

    return {
      content,
      metadata: {
        encoding: 'utf-8',
        size: buffer.length
      }
    }
  }

  private async parseImage(buffer: Uint8Array): Promise<ParsedDocument> {
    // OCR 처리 (Tesseract.js 등 사용)
    // 현재는 기본 메타데이터만 추출
    const image = sharp(buffer)
    const metadata = await image.metadata()

    return {
      content: '', // OCR 결과가 들어갈 자리
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      }
    }
  }

  // 문서 전처리
  async preprocessDocument(content: string): Promise<string> {
    return content
      .replace(/\s+/g, ' ') // 연속 공백 제거
      .replace(/\n{3,}/g, '\n\n') // 연속 줄바꿈 정리
      .trim()
  }
}
```

### 2. 문서 처리 워크플로우

```typescript
// src/domains/documents/services/document-processing.service.ts
export class DocumentProcessingService {
  constructor(
    private parser: DocumentParserService,
    private vectorStore: VectorStoreService,
    private storage: StorageService,
    private eventBus: EventBus
  ) {}

  async processDocument(
    file: File,
    userId: string
  ): Promise<ProcessedDocument> {
    try {
      // 1. 파일 저장
      const fileUrl = await this.storage.uploadFile(file, userId)

      // 2. 문서 파싱
      const parsed = await this.parser.parseDocument(file)

      // 3. 전처리
      const processedContent = await this.parser.preprocessDocument(parsed.content)

      // 4. 데이터베이스 저장
      const document = await this.saveDocument({
        userId,
        filename: file.name,
        fileUrl,
        content: processedContent,
        metadata: parsed.metadata,
        contentType: file.type,
        size: file.size
      })

      // 5. 벡터 임베딩 생성 (비동기)
      this.generateEmbeddings(document.id, processedContent, {
        userId,
        documentId: document.id,
        filename: file.name
      })

      // 6. 이벤트 발행
      await this.eventBus.publish(
        new DocumentProcessedEvent(document.id, userId)
      )

      return document
    } catch (error) {
      await this.eventBus.publish(
        new DocumentProcessingFailedEvent(file.name, userId, error.message)
      )
      throw error
    }
  }

  private async generateEmbeddings(
    documentId: string,
    content: string,
    metadata: any
  ): Promise<void> {
    try {
      await this.vectorStore.addDocument(content, metadata)

      // 임베딩 완료 상태 업데이트
      await this.updateDocumentStatus(documentId, 'embedded')

      await this.eventBus.publish(
        new DocumentEmbeddedEvent(documentId)
      )
    } catch (error) {
      await this.updateDocumentStatus(documentId, 'embedding_failed')

      await this.eventBus.publish(
        new DocumentEmbeddingFailedEvent(documentId, error.message)
      )
    }
  }

  private async saveDocument(data: CreateDocumentData): Promise<Document> {
    // 데이터베이스 저장 로직
    return await this.documentRepository.create(data)
  }

  private async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus
  ): Promise<void> {
    await this.documentRepository.updateStatus(documentId, status)
  }
}
```

## 🎨 프롬프트 템플릿 시스템

### 1. 템플릿 관리

```typescript
// src/domains/templates/services/prompt-template.service.ts
export class PromptTemplateService {
  constructor(
    private templateRepository: PromptTemplateRepository
  ) {}

  async createTemplate(data: CreateTemplateData): Promise<PromptTemplate> {
    const template = new PromptTemplate({
      name: data.name,
      content: data.content,
      variables: this.extractVariables(data.content),
      category: data.category,
      isPublic: data.isPublic || false,
      userId: data.userId
    })

    return await this.templateRepository.save(template)
  }

  async renderTemplate(
    templateId: string,
    variables: Record<string, string>
  ): Promise<string> {
    const template = await this.templateRepository.findById(templateId)
    if (!template) {
      throw new Error('Template not found')
    }

    return this.interpolateVariables(template.content, variables)
  }

  // 템플릿에서 변수 추출
  private extractVariables(content: string): string[] {
    const variableRegex = /\{\{(\w+)\}\}/g
    const variables: string[] = []
    let match

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    return variables
  }

  // 변수 치환
  private interpolateVariables(
    content: string,
    variables: Record<string, string>
  ): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return variables[variable] || match
    })
  }

  // 카테고리별 템플릿 조회
  async getTemplatesByCategory(
    category: string,
    userId?: string
  ): Promise<PromptTemplate[]> {
    return await this.templateRepository.findByCategory(category, userId)
  }

  // 인기 템플릿 조회
  async getPopularTemplates(limit: number = 10): Promise<PromptTemplate[]> {
    return await this.templateRepository.findPopular(limit)
  }
}
```

### 2. 템플릿 예시

```typescript
// src/domains/templates/data/default-templates.ts
export const DEFAULT_TEMPLATES = [
  {
    name: '코드 리뷰',
    category: 'development',
    content: `
다음 {{language}} 코드를 리뷰해주세요:

\`\`\`{{language}}
{{code}}
\`\`\`

다음 관점에서 검토해주세요:
- 코드 품질
- 성능 최적화
- 보안 이슈
- 베스트 프랙티스
    `.trim(),
    variables: ['language', 'code']
  },

  {
    name: '문서 요약',
    category: 'productivity',
    content: `
다음 문서를 {{length}} 길이로 요약해주세요:

{{document}}

요약 시 다음 사항을 포함해주세요:
- 핵심 내용
- 주요 결론
- 실행 가능한 인사이트
    `.trim(),
    variables: ['length', 'document']
  },

  {
    name: '이메일 작성',
    category: 'communication',
    content: `
{{recipient}}에게 보낼 {{tone}} 톤의 이메일을 작성해주세요.

목적: {{purpose}}
주요 내용: {{content}}

이메일 구조:
- 적절한 인사말
- 명확한 본문
- 정중한 마무리
    `.trim(),
    variables: ['recipient', 'tone', 'purpose', 'content']
  }
]
```

## 📊 성능 모니터링

### 1. AI 사용량 추적

```typescript
// src/domains/analytics/services/ai-usage-tracker.service.ts
export class AIUsageTrackerService {
  constructor(
    private metricsService: MetricsService,
    private usageRepository: UsageRepository
  ) {}

  async trackAPICall(data: APICallData): Promise<void> {
    // 메트릭 기록
    this.metricsService.recordCounter('ai.api.calls', 1, {
      provider: data.provider,
      model: data.model,
      userId: data.userId
    })

    this.metricsService.recordDuration('ai.api.latency', data.latency, {
      provider: data.provider,
      model: data.model
    })

    // 사용량 데이터베이스 저장
    await this.usageRepository.create({
      userId: data.userId,
      provider: data.provider,
      model: data.model,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      cost: this.calculateCost(data),
      latency: data.latency,
      timestamp: new Date()
    })
  }

  async getUserUsage(
    userId: string,
    period: 'day' | 'week' | 'month'
  ): Promise<UsageSummary> {
    const startDate = this.getStartDate(period)
    const usage = await this.usageRepository.findByUserAndPeriod(userId, startDate)

    return {
      totalCalls: usage.length,
      totalTokens: usage.reduce((sum, u) => sum + u.inputTokens + u.outputTokens, 0),
      totalCost: usage.reduce((sum, u) => sum + u.cost, 0),
      averageLatency: usage.reduce((sum, u) => sum + u.latency, 0) / usage.length,
      byProvider: this.groupByProvider(usage)
    }
  }

  private calculateCost(data: APICallData): number {
    // 제공자별 토큰 가격 계산
    const pricing = {
      openai: {
        'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
        'gpt-3.5-turbo': { input: 0.001, output: 0.002 }
      },
      anthropic: {
        'claude-3': { input: 0.015, output: 0.075 }
      }
    }

    const modelPricing = pricing[data.provider]?.[data.model]
    if (!modelPricing) return 0

    const inputCost = (data.inputTokens / 1000) * modelPricing.input
    const outputCost = (data.outputTokens / 1000) * modelPricing.output

    return inputCost + outputCost
  }
}
```

### 2. 캐시 성능 모니터링

```typescript
// src/domains/analytics/services/cache-analytics.service.ts
export class CacheAnalyticsService {
  constructor(
    private redis: Redis,
    private metricsService: MetricsService
  ) {}

  async getCacheStats(): Promise<CacheStats> {
    const info = await this.redis.info('stats')
    const keyspaceInfo = await this.redis.info('keyspace')

    return {
      hitRate: this.calculateHitRate(info),
      totalKeys: this.getTotalKeys(keyspaceInfo),
      memoryUsage: await this.getMemoryUsage(),
      topKeys: await this.getTopKeys()
    }
  }

  async recordCacheOperation(
    operation: 'hit' | 'miss' | 'set',
    key: string,
    latency?: number
  ): Promise<void> {
    this.metricsService.recordCounter(`cache.${operation}`, 1, {
      keyType: this.getKeyType(key)
    })

    if (latency) {
      this.metricsService.recordDuration(`cache.${operation}.latency`, latency)
    }
  }

  private getKeyType(key: string): string {
    if (key.startsWith('prompt:')) return 'prompt'
    if (key.startsWith('session:')) return 'session'
    if (key.startsWith('user_context:')) return 'user_context'
    return 'other'
  }

  private async getTopKeys(): Promise<Array<{ key: string, ttl: number }>> {
    const keys = await this.redis.keys('*')
    const keyData = await Promise.all(
      keys.slice(0, 100).map(async key => ({
        key,
        ttl: await this.redis.ttl(key)
      }))
    )

    return keyData.sort((a, b) => b.ttl - a.ttl).slice(0, 10)
  }
}
```

## 🔧 AI 서비스 전용 환경 변수

```env
# AI 모델 API 키
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# 벡터 데이터베이스
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=yongwoon-ai
PINECONE_ENVIRONMENT=us-west1-gcp

# AI 서비스 설정
DEFAULT_AI_PROVIDER=openai
DEFAULT_MODEL=gpt-4
MAX_TOKENS=2000
TEMPERATURE=0.7

# RAG 설정
EMBEDDING_MODEL=text-embedding-ada-002
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
MAX_CONTEXT_CHUNKS=5

# 성능 설정
ENABLE_PROMPT_CACHING=true
ENABLE_RAG=true
ENABLE_USAGE_TRACKING=true
```

## 🚀 배포 및 최적화 고려사항

### 1. AI API 비용 최적화
- 프롬프트 캐싱으로 중복 호출 방지
- 토큰 사용량 모니터링 및 제한
- 모델별 비용 효율성 분석

### 2. 성능 최적화
- 벡터 검색 인덱스 최적화
- 배치 처리를 통한 임베딩 생성
- CDN을 통한 정적 리소스 캐싱

### 3. 확장성 고려
- 마이크로서비스 아키텍처 준비
- 로드 밸런싱 및 오토 스케일링
- 데이터베이스 샤딩 전략

이 가이드를 통해 AI 서비스의 핵심 기능들을 체계적으로 구현할 수 있습니다. 각 기능은 독립적으로 개발하고 테스트할 수 있도록 설계되었습니다.