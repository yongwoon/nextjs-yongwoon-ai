import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export const useLogin = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error && message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  return { t, errorMessage };
};
