/**
 * useRecaptcha — React hook for Google reCAPTCHA v3
 *
 * Wraps the reCAPTCHA v3 script loading and token execution.
 * Must be used inside a GoogleReCaptchaProvider (set up in main.tsx).
 */

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";

/**
 * Returns a stable `executeRecaptcha` function.
 * Call it with an action name before submitting any form.
 *
 * @example
 *   const getToken = useRecaptcha();
 *   const token = await getToken("login");
 *   // send token to backend as `recaptchaToken`
 */
export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = useCallback(
    async (action: string): Promise<string> => {
      if (!executeRecaptcha) {
        console.warn("[reCAPTCHA] executeRecaptcha not available yet.");
        return "";
      }
      const token = await executeRecaptcha(action);
      return token;
    },
    [executeRecaptcha]
  );

  return getToken;
}
