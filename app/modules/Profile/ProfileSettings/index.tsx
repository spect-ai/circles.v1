import React from "react";
import {
  useProviderLocalProfile,
  LocalProfileContext,
} from "./LocalProfileContext";
import ProfileSettings from "./ProfileSettings";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProfileModal({ setIsOpen }: Props) {
  const context = useProviderLocalProfile();

  return (
    <LocalProfileContext.Provider value={context}>
      <ProfileSettings setIsOpen={setIsOpen} />
    </LocalProfileContext.Provider>
  );
}
