import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, MemberDetails } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AddRole from "./AddRoleModal";
import InviteMemberModal from "./InviteMembersModal";
import MemberDisplay from "./MemberDisplay";

const RoleSection = ({ roleName }: { roleName: string }) => {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  let isMemberThere = false;
  return (
    <Box>
      <Heading>{roleName}</Heading>
      <Box display="flex" flexWrap="wrap">
        {circle?.members.map((mem) => {
          // if no member has role keep track of it
          if (circle.memberRoles[mem]?.includes(roleName)) {
            isMemberThere = true;
            return (
              <MemberDisplay
                key={mem}
                member={mem}
                memberDetails={memberDetails?.memberDetails}
              />
            );
          }
          return null;
        })}
        {!isMemberThere && (
          <Box marginTop="4">
            <Text variant="label">No members have this role</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Contributors = () => {
  const { canDo } = useRoleGate();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  if (!circle) {
    return <div>Loading...</div>;
  }

  return (
    <Box padding="2">
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
      >
        <Box
          width={{
            xs: "full",
            md: "1/3",
          }}
          marginBottom={{
            xs: "0",
            md: "4",
          }}
        >
          {canDo("inviteMembers") && <InviteMemberModal />}
        </Box>
        <Box
          width={{
            xs: "full",
            md: "1/3",
          }}
        >
          {canDo("manageRoles") && <AddRole />}
        </Box>
      </Stack>
      <Stack>
        {Object.keys(circle?.roles).map((role) => (
          <RoleSection key={role} roleName={role} />
        ))}
      </Stack>
    </Box>
  );
};

export default Contributors;
