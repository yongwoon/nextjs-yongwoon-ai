import {
  generateMagicLinkEmailHTML,
  generateMagicLinkEmailText,
  type MagicLinkTemplateProps,
} from "./magic-link-template";

export interface EmailTemplateConfig {
  companyName: string;
  supportEmail: string;
  logoUrl?: string;
  brandColor?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  metadata?: Record<string, any>;
}

export class EmailTemplateService {
  private static config: EmailTemplateConfig = {
    companyName: "Goguryeo",
    supportEmail: "support@goguryeo.ai",
  };

  /**
   * 이메일 템플릿 설정을 업데이트합니다
   */
  static updateConfig(config: Partial<EmailTemplateConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 매직 링크 이메일 템플릿을 생성합니다
   */
  static generateMagicLinkEmail(
    magicLink: string,
    userEmail: string,
    expirationMinutes: number = 60,
  ): {
    subject: string;
    html: string;
    text: string;
  } {
    const expirationTime = new Date(
      Date.now() + expirationMinutes * 60 * 1000,
    ).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul",
    });

    const templateProps: MagicLinkTemplateProps = {
      magicLink,
      userEmail,
      expirationTime,
      companyName: this.config.companyName,
      supportEmail: this.config.supportEmail,
    };

    return {
      subject: `${this.config.companyName} 로그인을 위한 매직 링크`,
      html: generateMagicLinkEmailHTML(templateProps),
      text: generateMagicLinkEmailText(templateProps),
    };
  }

  /**
   * 이메일 템플릿을 미리보기용으로 생성합니다
   */
  static generatePreview(
    templateType: "magic-link",
    sampleData: Partial<MagicLinkTemplateProps> = {},
  ): {
    subject: string;
    html: string;
    text: string;
  } {
    const defaultData: MagicLinkTemplateProps = {
      magicLink: "https://example.com/auth/callback?token=sample-token",
      userEmail: "user@example.com",
      expirationTime: "2024년 1월 1일 오후 3:00",
      companyName: this.config.companyName,
      supportEmail: this.config.supportEmail,
    };

    const props = { ...defaultData, ...sampleData };

    switch (templateType) {
      case "magic-link":
        return {
          subject: `${this.config.companyName} 로그인을 위한 매직 링크`,
          html: generateMagicLinkEmailHTML(props),
          text: generateMagicLinkEmailText(props),
        };
      default:
        throw new Error(`Unknown template type: ${templateType}`);
    }
  }

  /**
   * Supabase 이메일 템플릿 설정을 위한 구성
   *
   * 이 메서드는 Supabase Dashboard에서 설정할 수 있는 이메일 템플릿 구성을 반환합니다.
   * Authentication > Settings > Email Templates 에서 사용할 수 있습니다.
   */
  static getSupabaseEmailTemplateConfig(): {
    magicLink: {
      subject: string;
      body: string;
      bodyText: string;
    };
  } {
    // Supabase 이메일 템플릿에서 사용할 수 있는 변수들:
    // {{ .Email }} - 사용자 이메일
    // {{ .Token }} - 인증 토큰
    // {{ .TokenHash }} - 토큰 해시
    // {{ .SiteURL }} - 사이트 URL
    // {{ .RedirectTo }} - 리다이렉트 URL
    // {{ .ConfirmationURL }} - Supabase에서 자동 생성하는 완전한 매직 링크 URL (권장)
    // {{ .Data }} - 추가 메타데이터

    // Supabase의 표준 ConfirmationURL 사용 (자동으로 모든 필요한 파라미터 포함)
    const magicLinkUrl = "{{ .ConfirmationURL }}";

    const templateProps: MagicLinkTemplateProps = {
      magicLink: magicLinkUrl,
      userEmail: "{{ .Email }}",
      expirationTime: "1시간",
      companyName: this.config.companyName,
      supportEmail: this.config.supportEmail,
    };

    return {
      magicLink: {
        subject: `${this.config.companyName} 로그인을 위한 매직 링크`,
        body: generateMagicLinkEmailHTML(templateProps),
        bodyText: generateMagicLinkEmailText(templateProps),
      },
    };
  }

  /**
   * 이메일 클라이언트 호환성을 위한 인라인 CSS 변환
   */
  static inlineCSS(html: string): string {
    // 프로덕션에서는 juice 라이브러리나 similar tool을 사용하는 것을 권장
    // 현재는 기본적인 인라인 CSS가 이미 적용되어 있음
    return html;
  }

  /**
   * 이메일 렌더링 테스트를 위한 유틸리티
   */
  static testEmailRendering(html: string): {
    hasRequiredElements: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    let hasRequiredElements = true;

    // 기본적인 HTML 구조 확인
    if (!html.includes("<!DOCTYPE html>")) {
      issues.push("DOCTYPE이 누락되었습니다");
      hasRequiredElements = false;
    }

    if (!html.includes('<meta charset="UTF-8">')) {
      issues.push("문자 인코딩이 설정되지 않았습니다");
      hasRequiredElements = false;
    }

    if (!html.includes('meta name="viewport"')) {
      issues.push("모바일 뷰포트 설정이 누락되었습니다");
      hasRequiredElements = false;
    }

    // 매직 링크 관련 요소 확인
    if (!html.includes("href=")) {
      issues.push("매직 링크가 포함되지 않았습니다");
      hasRequiredElements = false;
    }

    return {
      hasRequiredElements,
      issues,
    };
  }
}
