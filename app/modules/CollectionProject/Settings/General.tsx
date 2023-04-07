import { Input, Stack, Text } from "degen";
import { Visible } from "react-grid-system";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import FormRoles from "../../Collection/Form/FormRoles";

type Props = {
  name: string;
  setName: (name: string) => void;
};

const General = ({ name, setName }: Props) => (
  <Stack space="6">
    <Stack space="1">
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
  </Stack>
);

export default General;
