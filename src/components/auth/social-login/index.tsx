import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export default function SocialLogin() {
  const t = useTranslations();
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center border border-border rounded-lg py-3 mb-4 font-semibold bg-background text-foreground hover:bg-gray-200 hover:text-foreground transition"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      {t("authComponent.socialLogin.google")}
    </button>
  );
}
