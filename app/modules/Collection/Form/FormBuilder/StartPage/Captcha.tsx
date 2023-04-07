import { useRef } from "react";
import { toast } from "react-toastify";
import Reaptcha from "reaptcha";

type Props = {
  setCaptchaVerified: (value: boolean) => void;
};

const Captcha = ({ setCaptchaVerified }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const captchaRef = useRef<any>(null);

  return (
    <Reaptcha
      sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
      ref={captchaRef}
      onVerify={() => {
        captchaRef.current
          ?.getResponse()
          .then(async (res: string) => {
            const verify = await fetch("/api/verifyCaptcha", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: res }),
            });
            const data = await verify.json();
            if (data.success) {
              setCaptchaVerified(true);
            } else {
              toast.error("Captcha verification failed");
              setCaptchaVerified(false);
            }
          })
          .catch((err: unknown) => {
            console.error(err);
          });
      }}
    />
  );
};

export default Captcha;
