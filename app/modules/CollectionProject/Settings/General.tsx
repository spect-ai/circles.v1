import { Input, Stack, Text } from "degen";
import { Visible } from "react-grid-system";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import FormRoles from "../../Collection/Form/FormRoles";
import VotingModule from "../../Collection/VotingModule";

type Props = {
  name: string;
  setName: (name: string) => void;
};

export default function General({ name, setName }: Props) {
  return (
    <Stack space="6">
      <Stack space={"1"}>
        <Text variant="label">Name</Text>
        <Input
          label=""
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {}}
        />
        <Visible xs sm>
          <InviteMemberModal />
        </Visible>
      </Stack>

      <FormRoles />
      <VotingModule />
    </Stack>
  );
}
