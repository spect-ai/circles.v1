import {
  useProviderLocalProfile,
  LocalProfileContext,
} from "./LocalProfileContext";
import ProfileSettings from "./ProfileSettings";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  openTab?: number;
}

const ProfileModal = ({ setIsOpen, openTab }: Props) => {
  const context = useProviderLocalProfile();

  return (
    <LocalProfileContext.Provider value={context}>
      <ProfileSettings setIsOpen={setIsOpen} openTab={openTab} />
    </LocalProfileContext.Provider>
  );
};

ProfileModal.defaultProps = {
  openTab: 0,
};

export default ProfileModal;
