import { useEffect, useState } from "react";

export default function useProjectOnboarding() {
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("projectOnboarding")) {
      setOnboarded(false);
    }
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("projectOnboarding", "true");
    setOnboarded(true);
  };

  return {
    onboarded,
    finishOnboarding,
  };
}
