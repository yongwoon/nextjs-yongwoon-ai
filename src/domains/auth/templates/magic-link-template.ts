export interface MagicLinkTemplateProps {
  magicLink: string;
  userEmail: string;
  expirationTime: string;
  companyName?: string;
  supportEmail?: string;
}

export const generateMagicLinkEmailHTML = ({
  magicLink,
  userEmail,
  expirationTime,
  companyName = "Goguryeo",
  supportEmail = "support@goguryeo.ai",
}: MagicLinkTemplateProps): string => {
  console.log("expirationTime", expirationTime);

  return `<style>
    body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f8fafc;
        color: #334155;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    .email-wrapper {
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 40px 30px;
        text-align: center;
    }
    .logo {
        color: #ffffff;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        margin-top: 8px;
        font-weight: 400;
    }
    .content {
        padding: 40px;
    }
    .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 16px;
    }
    .message {
        font-size: 16px;
        line-height: 1.6;
        color: #475569;
        margin-bottom: 32px;
    }
    .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: transform 0.2s ease;
        box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.3);
    }
    .cta-button:hover {
        transform: translateY(-2px);
    }
    .alternative-link {
        margin-top: 32px;
        padding: 20px;
        background-color: #f1f5f9;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }
    .alternative-link-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8px;
    }
    .alternative-link-url {
        word-break: break-all;
        color: #475569;
        font-size: 14px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
    }
    .security-note {
        margin-top: 32px;
        padding: 20px;
        background-color: #fef7f0;
        border-radius: 8px;
        border-left: 4px solid #f59e0b;
    }
    .security-note-title {
        font-weight: 600;
        color: #92400e;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
    }
    .security-note-text {
        color: #b45309;
        font-size: 14px;
        line-height: 1.5;
    }
    .footer {
        background-color: #f8fafc;
        padding: 32px 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
    }
    .footer-text {
        color: #64748b;
        font-size: 14px;
        line-height: 1.5;
    }
    .footer-links {
        margin-top: 16px;
    }
    .footer-link {
        color: #667eea;
        text-decoration: none;
        margin: 0 8px;
    }
    .expiration {
        color: #ef4444;
        font-weight: 600;
    }
    @media (max-width: 640px) {
        .container {
            padding: 20px 16px;
        }
        .content, .header, .footer {
            padding: 24px;
        }
        .greeting {
            font-size: 20px;
        }
        .cta-button {
            display: block;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
        }
    }
</style>

<h2>${companyName} 로그인을 위한 매직 링크</h2>

<div class="container">
    <div class="email-wrapper">
        <div class="header">
            <div class="logo">${companyName}</div>
            <div class="subtitle">Gaemamusa AI Assistant</div>
        </div>

        <div class="content">
            <div class="greeting">안전한 로그인을 위한 매직 링크</div>

            <div class="message">
                안녕하세요!<br><br>
                <strong>${userEmail}</strong> 계정으로 로그인하기 위한 매직 링크를 요청하셨습니다.
                아래 버튼을 클릭하여 안전하게 로그인하세요.
            </div>

            <div style="text-align: center; margin: 32px 0;">
                <a href="${magicLink}" class="cta-button">
                    🔐 안전하게 로그인하기
                </a>
            </div>

            <div class="alternative-link">
                <div class="alternative-link-title">버튼이 작동하지 않나요?</div>
                <div style="color: #64748b; font-size: 14px; margin-bottom: 12px;">
                    아래 링크를 복사하여 브라우저에 직접 붙여넣으세요:
                </div>
                <div class="alternative-link-url">${magicLink}</div>
            </div>

            <div class="security-note">
                <div class="security-note-title">
                    ⚠️ 보안 안내
                </div>
                <div class="security-note-text">
                    • 이 링크는 <span class="expiration">1시간</span>까지 유효합니다<br>
                    • 링크는 일회용이며, 사용 후 자동으로 만료됩니다<br>
                    • 로그인을 요청하지 않으셨다면 이 이메일을 무시하세요<br>
                    • 의심스러운 활동이 있다면 즉시 ${supportEmail}로 연락주세요
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-text">
                이 이메일은 ${companyName} Gaemamusa AI에서 자동으로 발송되었습니다.<br>
                로그인을 요청하지 않으셨다면 이 이메일을 무시하세요.
            </div>
            <div class="footer-links">
                <a href="mailto:${supportEmail}" class="footer-link">고객 지원</a>
                <a href="#" class="footer-link">개인정보처리방침</a>
                <a href="#" class="footer-link">이용약관</a>
            </div>
        </div>
    </div>
</div>`;
};

export const generateMagicLinkEmailText = ({
  magicLink,
  userEmail,
  expirationTime,
  companyName = "Goguryeo",
  supportEmail = "support@goguryeo.ai",
}: MagicLinkTemplateProps): string => {
  return `
${companyName} Gaemamusa AI - 매직 링크 로그인

안녕하세요!

${userEmail} 계정으로 로그인하기 위한 매직 링크를 요청하셨습니다.

아래 링크를 클릭하여 안전하게 로그인하세요:
${magicLink}

보안 안내:
- 이 링크는 ${expirationTime}까지 유효합니다
- 링크는 일회용이며, 사용 후 자동으로 만료됩니다
- 로그인을 요청하지 않으셨다면 이 이메일을 무시하세요
- 의심스러운 활동이 있다면 즉시 ${supportEmail}로 연락주세요

---
이 이메일은 ${companyName} Gaemamusa AI에서 자동으로 발송되었습니다.
로그인을 요청하지 않으셨다면 이 이메일을 무시하세요.

고객 지원: ${supportEmail}
`.trim();
};
