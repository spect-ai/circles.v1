import Modal from "@/app/common/components/Modal";
import { Registry } from "@/app/types";
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
import createTemplateFlow from "@/app/services/Templates";
import { useCircle } from "../../CircleContext";
import GrantTemplate from "../../Templates/GrantTemplate";
import KanbanProject from "../../Templates/KanbanProject";
import OnboardingTemplate from "../../Templates/OnboardingTemplate";

interface Props {
  handleClose: (close: boolean) => void;
}

const TemplateModal = ({ handleClose }: Props) => {
  const { circle, registry, setCircleData } = useCircle();
  const [template, setTemplate] = useState(0);

  const createTemplate = async () => {
    handleClose(false);
    const res = await createTemplateFlow(
      circle?.id || "",
      {
        registry: {
          137: registry?.["137"],
        } as Registry,
      },
      3
    );
    if (res?.id) {
      setCircleData(res);
    }
  };
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
              suffix={
                <a
                  href="https://scribehow.com/shared/Create_a_Grants_Workflow_on_Spect__Of7YjSwlRhW8ZiYbjgkO3g"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box cursor="pointer">
                    <Text variant="label">
                      <HelpCircle size={20} />
                    </Text>
                  </Box>
                </a>
              }
            >
              <Box height="28">
                <Text>Create a new grant workflow</Text>
                <Text color="inherit">
                  It will create an application form and 2 projects
                </Text>
              </Box>
            </ButtonCard>
            <ButtonCard
              buttonText="Create Onboarding Workflow"
              prefix={<IconSparkles color="accent" />}
              width="full"
              onClick={() => {
                setTemplate(2);
              }}
              suffix={
                <a
                  href="https://scribehow.com/shared/Run_a_onboarding_program__SxE6ihIxQzKbePZ8yVFu6A"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box cursor="pointer">
                    <Text variant="label">
                      <HelpCircle size={20} />
                    </Text>
                  </Box>
                </a>
              }
            >
              <Box height="28">
                <Text>Create a new DAO onboarding workflow</Text>
                <Text color="inherit">
                  It will create an onboarding form and a project
                </Text>
              </Box>
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
                createTemplate();
              }}
            >
              <Box height="28">
                <Text>Create a new kanban project management board</Text>
                <Text color="inherit">
                  It will create a project with 4 columns
                </Text>
              </Box>
            </ButtonCard>
          </Stack>
        )}
        {template === 1 && <GrantTemplate handleClose={handleClose} />}
        {template === 2 && <OnboardingTemplate handleClose={handleClose} />}
        {template === 3 && <KanbanProject handleClose={handleClose} />}
      </Box>
    </Modal>
  );
};

export default TemplateModal;
