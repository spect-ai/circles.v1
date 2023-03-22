import { useRef } from "react";
import { toast } from "react-toastify";
import Reaptcha from "reaptcha";

type Props = {
  setCaptchaVerified: (value: boolean) => void;
  setVerifyingCaptcha: (value: boolean) => void;
};

function Captcha({ setCaptchaVerified, setVerifyingCaptcha }: Props) {
  const captchaRef = useRef<any>(null);

  return (
    <Reaptcha
      sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
      ref={captchaRef}
      onVerify={() => {
        setVerifyingCaptcha(true);
        captchaRef.current
          ?.getResponse()
          .then(async (res: any) => {
            const verify = await fetch("/api/verifyCaptcha", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: res }),
            });
            console.log({ verify });
            const data = await verify.json();
            console.log({ data });
            if (data.success) {
              setCaptchaVerified(true);
              setVerifyingCaptcha(false);
            } else {
              toast.error("Captcha verification failed");
              setCaptchaVerified(false);
              setVerifyingCaptcha(false);
            }
          })
          .catch((err: any) => {
            console.log(err);
            setVerifyingCaptcha(false);
          });
      }}
    />
  );
}

export default Captcha;
