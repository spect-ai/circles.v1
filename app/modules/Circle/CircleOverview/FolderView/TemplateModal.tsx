import Modal from "@/app/common/components/Modal";
import {
  Box,
  ButtonCard,
  IconLightningBolt,
  IconSparkles,
  Stack,
  Text,
} from "degen";
import { useState } from "react";
import { HelpCircle, Trello } from "react-feather";
import GrantTemplate from "../../Templates/GrantTemplate";
import KanbanProject from "../../Templates/KanbanProject";
import OnboardingTemplate from "../../Templates/OnboardingTemplate";
interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function TemplateModal({ handleClose, setLoading }: Props) {
  const [template, setTemplate] = useState(0);
  return (
    <Modal
      handleClose={() => handleClose(false)}
      title="Use Template"
      size="large"
    >
      <Box padding="8">
        {!template && (
          <Stack direction="horizontal" space="4">
            <ButtonCard
              buttonText="Create Grant Workflow"
              prefix={<IconLightningBolt color="accent" />}
              width="full"
              onClick={() => {
                setTemplate(1);
              }}
              // suffix={
              //   <Box cursor="pointer">
              //     <Text variant="label">
              //       <HelpCircle size={20} />
              //     </Text>
              //   </Box>
              // }
            >
              <Text>Create a new grant workflow with the template.</Text>
              <Text color="inherit">
                It will create an application form and 2 projects
              </Text>
            </ButtonCard>
            <ButtonCard
              buttonText="Create Onboarding Workflow"
              prefix={<IconSparkles color="accent" />}
              width="full"
              onClick={() => {
                setTemplate(2);
              }}
              // suffix={
              //   <Box cursor="pointer">
              //     <Text variant="label">
              //       <HelpCircle size={20} />
              //     </Text>
              //   </Box>
              // }
            >
              <Text>
                Create a new DAO onboarding workflow with the template.
              </Text>
              <Text color="inherit">
                It will create an onboarding form and a project
              </Text>
            </ButtonCard>
            <ButtonCard
              buttonText="Create a Kanban Project"
              prefix={
                <Text color="accent">
                  <Trello />
                </Text>
              }
              width="full"
              onClick={() => {
                setTemplate(3);
              }}
              // suffix={
              //   <Box cursor="pointer">
              //     <Text variant="label">
              //       <HelpCircle size={20} />
              //     </Text>
              //   </Box>
              // }
            >
              <Text>Create a new kanban project management board</Text>
              <Text color="inherit">
                It will create a project with 4 columns
              </Text>
            </ButtonCard>
          </Stack>
        )}
        {template == 1 && (
          <GrantTemplate handleClose={handleClose} setLoading={setLoading} />
        )}
        {template === 2 && <OnboardingTemplate handleClose={handleClose} />}
        {template === 3 && (
          <KanbanProject handleClose={handleClose} setLoading={setLoading} />
        )}
      </Box>
    </Modal>
  );
}
