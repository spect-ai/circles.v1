import { useEffect, useState } from "react";

export default function useExploreOnboarding() {
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("exploreOnboarding")) {
      setOnboarded(false);
    }
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("exploreOnboarding", "true");
    setOnboarded(true);
  };

  return {
    onboarded,
    finishOnboarding,
  };
}
