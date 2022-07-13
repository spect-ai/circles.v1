import PrimaryButton from "@/app/common/components/PrimaryButton";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { createThread } from "@/app/services/Discord";

export default function Discuss() {
  const { title, project } = useLocalCard();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  return (
    <PrimaryButton
      variant="tertiary"
      icon={<DiscordIcon />}
      onClick={async () => {
        if (!project?.discordDiscussionChannel) {
          toast.error("Add discord discussion channel to project");
          return;
        }
        if (!currentUser?.discordId) {
          toast.error("Connect your discord account to use this feature");
          return;
        }
        const data = await createThread(
          title,
          project.discordDiscussionChannel.id,
          currentUser?.discordId,
          project.parents[0].discordGuildId
        );
        if (data) {
          const url = `https://discord.com/channels/${project.parents[0].discordGuildId}/${data.result}`;
          window.open(url, "_blank");
        }
      }}
    >
      Discuss
    </PrimaryButton>
  );
}
