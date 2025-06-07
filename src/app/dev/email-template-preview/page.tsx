"use client";

import { useState } from "react";
import {
  EmailTemplateService,
  EmailTemplateTestUtils,
} from "@/domains/auth/templates";

export default function EmailTemplatePreviewPage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<"magic-link">("magic-link");
  const [previewData, setPreviewData] = useState({
    userEmail: "user@example.com",
    magicLink: "https://app.goguryeo.ai/auth/callback?token=sample-token-123",
    expirationTime: "2024년 12월 31일 오후 11:59",
  });

  const [testResults, setTestResults] = useState<any>(null);

  const generatePreview = () => {
    const preview = EmailTemplateService.generatePreview(
      selectedTemplate,
      previewData,
    );
    return preview;
  };

  const runTests = () => {
    const results = EmailTemplateTestUtils.runAllTests();
    setTestResults(results);
  };

  const preview = generatePreview();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              📧 이메일 템플릿 미리보기 & 테스트
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Goguryeo Gaemamusa AI의 이메일 템플릿을 미리보고 테스트할 수
              있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* 설정 패널 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  🔧 템플릿 설정
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      템플릿 타입
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) =>
                        setSelectedTemplate(e.target.value as "magic-link")
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="magic-link">Magic Link</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      사용자 이메일
                    </label>
                    <input
                      type="email"
                      value={previewData.userEmail}
                      onChange={(e) =>
                        setPreviewData({
                          ...previewData,
                          userEmail: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      매직 링크 URL
                    </label>
                    <textarea
                      value={previewData.magicLink}
                      onChange={(e) =>
                        setPreviewData({
                          ...previewData,
                          magicLink: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      만료 시간
                    </label>
                    <input
                      type="text"
                      value={previewData.expirationTime}
                      onChange={(e) =>
                        setPreviewData({
                          ...previewData,
                          expirationTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* 테스트 버튼들 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  🧪 테스트 도구
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={runTests}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    전체 테스트 실행
                  </button>

                  <button
                    onClick={() =>
                      EmailTemplateTestUtils.openPreviewInBrowser(
                        selectedTemplate,
                      )
                    }
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    새 창에서 미리보기
                  </button>

                  <button
                    onClick={() => EmailTemplateTestUtils.logSupabaseConfig()}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Supabase 설정 출력 (콘솔)
                  </button>
                </div>
              </div>

              {/* 테스트 결과 */}
              {testResults && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    📊 테스트 결과
                  </h2>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-2">
                      <span className="font-medium">검증 통과:</span>
                      <span
                        className={`ml-2 ${testResults.validation.hasRequiredElements ? "text-green-600" : "text-red-600"}`}
                      >
                        {testResults.validation.hasRequiredElements
                          ? "✅ 성공"
                          : "❌ 실패"}
                      </span>
                    </div>

                    {testResults.validation.issues.length > 0 && (
                      <div>
                        <span className="font-medium">문제점:</span>
                        <ul className="list-disc list-inside ml-4 text-sm text-red-600">
                          {testResults.validation.issues.map(
                            (issue: string, index: number) => (
                              <li key={index}>{issue}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 제목 표시 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  📝 이메일 제목
                </h2>
                <div className="bg-gray-50 p-3 rounded-md border">
                  <code className="text-sm">{preview.subject}</code>
                </div>
              </div>
            </div>

            {/* 미리보기 패널 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                👁️ HTML 미리보기
              </h2>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div
                  className="w-full h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: preview.html }}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  📄 텍스트 버전
                </h3>
                <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto h-32 border">
                  {preview.text}
                </pre>
              </div>
            </div>
          </div>

          {/* 설정 가이드 */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Supabase 설정 가이드
            </h2>

            <div className="bg-blue-50 p-4 rounded-md">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Supabase Dashboard
                  </a>
                  에서 프로젝트 선택
                </li>
                <li>Authentication → Settings → Email Templates 이동</li>
                <li>Magic Link 섹션에서 템플릿 편집</li>
                <li>
                  위의 &quot;Supabase 설정 출력&quot; 버튼을 클릭하여 콘솔에서
                  템플릿 복사
                </li>
                <li>Subject, HTML Body, Text Body를 각각 붙여넣기</li>
                <li>저장 후 테스트 이메일 발송으로 확인</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
