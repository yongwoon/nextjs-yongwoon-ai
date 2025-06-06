import { EmailTemplateService } from "./email-template-service";

/**
 * 이메일 템플릿 테스트를 위한 유틸리티 함수들
 */
export class EmailTemplateTestUtils {
  /**
   * 템플릿 미리보기를 생성하고 콘솔에 출력
   */
  static logPreview(templateType: "magic-link" = "magic-link") {
    const preview = EmailTemplateService.generatePreview(templateType);

    console.group(`📧 이메일 템플릿 미리보기: ${templateType}`);
    console.log("📝 Subject:", preview.subject);
    console.log("🌐 HTML 길이:", preview.html.length, "characters");
    console.log("📄 Text 길이:", preview.text.length, "characters");
    console.groupEnd();

    return preview;
  }

  /**
   * Supabase 설정용 템플릿을 콘솔에 출력
   */
  static logSupabaseConfig() {
    const config = EmailTemplateService.getSupabaseEmailTemplateConfig();

    console.group("🔧 Supabase 이메일 템플릿 설정");
    console.log("📝 Subject:");
    console.log(config.magicLink.subject);
    console.log("\n🌐 HTML Body:");
    console.log(config.magicLink.body);
    console.log("\n📄 Text Body:");
    console.log(config.magicLink.bodyText);
    console.groupEnd();

    return config;
  }

  /**
   * 브라우저에서 이메일 템플릿 미리보기를 여는 함수
   */
  static openPreviewInBrowser(templateType: "magic-link" = "magic-link") {
    if (typeof window === "undefined") {
      console.warn("이 함수는 브라우저 환경에서만 사용할 수 있습니다.");
      return;
    }

    const preview = EmailTemplateService.generatePreview(templateType);
    const blob = new Blob([preview.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url, "_blank");
    if (newWindow) {
      newWindow.document.title = `이메일 템플릿 미리보기: ${templateType}`;
    }

    return url;
  }

  /**
   * 이메일 템플릿 검증 테스트
   */
  static runValidationTests(templateType: "magic-link" = "magic-link") {
    const preview = EmailTemplateService.generatePreview(templateType);
    const testResult = EmailTemplateService.testEmailRendering(preview.html);

    console.group("🧪 이메일 템플릿 검증 테스트");
    console.log(
      "✅ 필수 요소 포함:",
      testResult.hasRequiredElements ? "통과" : "실패",
    );

    if (testResult.issues.length > 0) {
      console.log("⚠️ 발견된 문제점들:");
      testResult.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    } else {
      console.log("🎉 모든 검증 테스트 통과!");
    }
    console.groupEnd();

    return testResult;
  }

  /**
   * 다양한 데이터로 템플릿 테스트
   */
  static runDataVariationTests() {
    const testCases = [
      {
        name: "기본 케이스",
        data: {
          userEmail: "user@example.com",
          magicLink: "https://app.goguryeo.ai/auth/callback?token=test123",
        },
      },
      {
        name: "긴 이메일 주소",
        data: {
          userEmail: "very.long.email.address.for.testing@example-domain.com",
          magicLink: "https://app.goguryeo.ai/auth/callback?token=test123",
        },
      },
      {
        name: "한국어 도메인",
        data: {
          userEmail: "사용자@한국.kr",
          magicLink: "https://app.goguryeo.ai/auth/callback?token=test123",
        },
      },
      {
        name: "긴 URL",
        data: {
          userEmail: "user@example.com",
          magicLink:
            "https://very-long-domain-name-for-testing.goguryeo.ai/auth/callback?token=very-long-token-string-for-testing-purposes-123456789",
        },
      },
    ];

    console.group("🎯 다양한 데이터 케이스 테스트");

    testCases.forEach((testCase, index) => {
      console.log(`\n${index + 1}. ${testCase.name}:`);

      try {
        const preview = EmailTemplateService.generatePreview(
          "magic-link",
          testCase.data,
        );
        const validation = EmailTemplateService.testEmailRendering(
          preview.html,
        );

        console.log(`   ✅ 생성 성공 (HTML: ${preview.html.length}자)`);
        console.log(
          `   ✅ 검증 결과: ${validation.hasRequiredElements ? "통과" : "실패"}`,
        );

        if (validation.issues.length > 0) {
          console.log(`   ⚠️  문제점: ${validation.issues.join(", ")}`);
        }
      } catch (error) {
        console.log(`   ❌ 생성 실패:`, error);
      }
    });

    console.groupEnd();
  }

  /**
   * 이메일 클라이언트별 호환성 체크
   */
  static checkEmailClientCompatibility(html: string) {
    const checks = {
      Gmail: {
        // Gmail은 <style> 태그를 지원하지 않음
        hasInlineStyles: !html.includes("<style>") || html.includes("style="),
        hasTable: html.includes("<table>"), // Gmail은 table 기반 레이아웃 선호
      },
      Outlook: {
        // Outlook은 특정 CSS 속성을 지원하지 않음
        noFlexbox: !html.includes("display: flex"),
        noGridLayout: !html.includes("display: grid"),
        hasConditionalComments: html.includes("<!--[if"),
      },
      "Apple Mail": {
        // Apple Mail은 대부분의 CSS를 잘 지원
        hasWebkitStyles: html.includes("-webkit-"),
        hasMediaQueries: html.includes("@media"),
      },
    };

    console.group("📱 이메일 클라이언트 호환성 체크");
    Object.entries(checks).forEach(([client, clientChecks]) => {
      console.log(`\n${client}:`);
      Object.entries(clientChecks).forEach(([check, passed]) => {
        console.log(`  ${passed ? "✅" : "⚠️"} ${check}`);
      });
    });
    console.groupEnd();

    return checks;
  }

  /**
   * 모든 테스트를 실행하는 종합 테스트
   */
  static runAllTests() {
    console.group("🚀 이메일 템플릿 종합 테스트");

    // 1. 기본 미리보기 생성
    const preview = this.logPreview();

    // 2. 검증 테스트
    const validation = this.runValidationTests();

    // 3. 다양한 데이터 테스트
    this.runDataVariationTests();

    // 4. 이메일 클라이언트 호환성 체크
    this.checkEmailClientCompatibility(preview.html);

    // 5. Supabase 설정 출력
    this.logSupabaseConfig();

    console.log("\n🎉 모든 테스트 완료!");
    console.groupEnd();

    return {
      preview,
      validation,
      supabaseConfig: EmailTemplateService.getSupabaseEmailTemplateConfig(),
    };
  }
}

/**
 * 개발 환경에서 쉽게 사용할 수 있는 전역 함수들
 */
if (typeof window !== "undefined") {
  // @ts-ignore - 개발용 전역 함수
  window.testEmailTemplate = EmailTemplateTestUtils.runAllTests;
  // @ts-ignore - 개발용 전역 함수
  window.previewEmailTemplate = EmailTemplateTestUtils.openPreviewInBrowser;
  // @ts-ignore - 개발용 전역 함수
  window.getSupabaseEmailConfig = EmailTemplateTestUtils.logSupabaseConfig;
}
