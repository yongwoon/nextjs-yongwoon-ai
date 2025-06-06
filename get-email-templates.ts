import { EmailTemplateService } from "./src/domains/auth/templates";

console.log("🔧 Supabase 이메일 템플릿 설정 정보\n");

const config = EmailTemplateService.getSupabaseEmailTemplateConfig();

console.log("📧 Magic Link Subject:");
console.log("─".repeat(50));
console.log(config.magicLink.subject);
console.log("\n");

console.log("🌐 Magic Link HTML Body:");
console.log("─".repeat(50));
console.log(config.magicLink.body);
console.log("\n");

console.log("📄 Magic Link Text Body:");
console.log("─".repeat(50));
console.log(config.magicLink.bodyText);
console.log("\n");

console.log("✅ 이제 위의 내용을 Supabase Dashboard에 복사하여 붙여넣으세요!");
console.log(
  "📍 경로: Authentication > Settings > Email Templates > Magic Link",
);
