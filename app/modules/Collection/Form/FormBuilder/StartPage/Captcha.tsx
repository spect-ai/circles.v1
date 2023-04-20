import { Box } from "degen";
import { useRef } from "react";
import { toast } from "react-toastify";
import Reaptcha from "reaptcha";

type Props = {
  setCaptchaVerified: (value: boolean) => void;
};

function Captcha({ setCaptchaVerified }: Props) {
  const captchaRef = useRef<any>(null);

  return (
    <Box
      style={{
        marginLeft: "-7.5rem",
      }}
    >
      <Reaptcha
        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
        ref={captchaRef}
        onVerify={() => {
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
              } else {
                toast.error("Captcha verification failed");
                setCaptchaVerified(false);
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        }}
      />
    </Box>
  );
}

export default Captcha;
