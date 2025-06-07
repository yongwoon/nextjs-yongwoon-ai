# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `pnpm run dev` - Start development server with memory optimization (4GB)
- `pnpm run build` - Production build
- `pnpm run type-check` - TypeScript type checking (run after code changes)
- `pnpm run lint` - ESLint code quality check (run after code changes)

### Testing
- `pnpm run test` - Run Vitest tests
- `pnpm run test:run` - Run tests once (CI mode)
- `pnpm run test:coverage` - Generate test coverage report

### Database (Supabase)
- `./scripts/supabase-local-setup.sh` - Automated local Supabase setup
- `supabase db push` - Apply migrations to database
- `supabase status` - Check local Supabase status

### Docker
- `pnpm run docker:dev` - Start full stack with Docker Compose
- `pnpm run docker:down` - Stop Docker services
- `pnpm run docker:clean` - Clean Docker volumes and containers

## Architecture Overview

This is a Next.js 15 + React 19 AI platform following Domain-Driven Design principles with Clean Architecture patterns.

### Core Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API routes, Supabase (PostgreSQL + Auth)
- **AI Integration**: OpenAI, Anthropic Claude, Google AI via AI SDK
- **Vector Search**: Pinecone for RAG (Retrieval-Augmented Generation)
- **Caching**: Redis via ioredis and Upstash
- **File Processing**: LangChain for document parsing and embedding
- **Package Manager**: pnpm (required)

### Project Structure
```
src/
├── app/                    # Next.js App Router (pages and API routes)
├── components/             # Shared UI components (shadcn/ui based)
├── domains/                # Domain-driven business logic
│   ├── auth/              # Authentication domain (magic links, rate limiting)
│   ├── chat/              # AI chat functionality (future)
│   ├── documents/         # Document management and RAG (future)
│   └── templates/         # Prompt templates (future)
├── lib/                   # Core utilities and configurations
├── utils/                 # Helper functions
└── types/                 # TypeScript type definitions
```

### Domain Layer Architecture
Each domain follows this structure:
- `entities/` - Domain models and types
- `services/` - Business logic and orchestration
- `templates/` - Domain-specific templates (like email templates)

## Development Guidelines

### File Organization
- Use kebab-case for folders and descriptive naming
- Follow domain boundaries - auth logic stays in `domains/auth/`
- Components should be in folders with `index.tsx` pattern
- Separate hooks and business logic into dedicated files

### Authentication Domain
- Magic link authentication via Supabase
- Rate limiting system with Redis backing
- Email templates with internationalization support
- Comprehensive error handling and security measures

### Code Quality
- Always run `pnpm run type-check` and `pnpm run lint` after code changes
- Use TypeScript strictly - no `any` types
- Follow existing patterns for error handling and service structure
- Maintain consistency with established naming conventions

### Supabase Integration
- Database schema managed through migrations in `supabase/migrations/`
- RLS (Row Level Security) policies implemented for data isolation
- Client and server-side utilities in `src/utils/supabase/`
- Local development setup via provided script

### Task Management
- Project uses Task Master AI for development workflow
- Configuration in `.taskmasterconfig` (managed via `task-master models` command)
- Task breakdown and dependency management available
- See `.cursor/rules/dev_workflow.mdc` for detailed workflow

## Environment Setup

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Providers (for future features)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_ai_key

# Vector Database (for future RAG features)
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=your_index_name

# Caching
REDIS_URL=redis://localhost:6379
```

### Getting Started
1. Install dependencies: `pnpm install`
2. Set up environment variables in `.env.local`
3. Run local Supabase setup: `./scripts/supabase-local-setup.sh`
4. Start development: `pnpm run dev`

## AI Services Architecture (Future Implementation)

The codebase is prepared for comprehensive AI integration:
- Multi-provider AI model support (OpenAI, Anthropic, Google AI)
- RAG system with vector search capabilities
- Prompt caching for performance optimization
- Document processing pipeline (PDF, Word, images)
- Template system for reusable prompts

## Development Workflow

1. Check task status with task-master tools if available
2. Make code changes following domain boundaries
3. Run type checking and linting before commits
4. Test locally with development server
5. Use Supabase Studio (localhost:54323) for database inspection

## Important Notes

- This project uses pnpm as package manager - do not use npm or yarn
- Supabase local instance required for full functionality
- Rate limiting system requires Redis for production usage
- AI features are architected but not yet implemented
- Follow existing authentication patterns when extending auth features