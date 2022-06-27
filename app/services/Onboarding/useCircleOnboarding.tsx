import { useEffect, useState } from "react";

export default function useCircleOnboarding() {
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    console.log(localStorage.getItem("circleOnboarding"));
    if (!localStorage.getItem("circleOnboarding")) {
      setOnboarded(false);
    }
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("circleOnboarding", "true");
    setOnboarded(true);
  };

  return {
    onboarded,
    finishOnboarding,
  };
}
