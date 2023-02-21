import Modal from "@/app/common/components/Modal";
import { createTemplateFlow } from "@/app/services/Templates";
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
import { useCircle } from "../../CircleContext";
import GrantTemplate from "../../Templates/GrantTemplate";
import KanbanProject from "../../Templates/KanbanProject";
import OnboardingTemplate from "../../Templates/OnboardingTemplate";
interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function TemplateModal({ handleClose, setLoading }: Props) {
  const { localCircle: circle, registry, setCircleData } = useCircle();
  const [template, setTemplate] = useState(0);

  const useTemplate = async () => {
    handleClose(false);
    setLoading(true);
    const res = await createTemplateFlow(
      circle?.id,
      {
        registry: {
          "137": registry?.["137"],
        } as Registry,
      },
      3
    );
    console.log(res);
    if (res?.id) {
      setLoading(false);
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
                <a href="https://scribehow.com/shared/Create_a_Grants_Workflow_on_Spect__Of7YjSwlRhW8ZiYbjgkO3g" target="_blank">
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
                <a href="https://scribehow.com/shared/Run_a_onboarding_program__SxE6ihIxQzKbePZ8yVFu6A" target="_blank">
                <Box cursor="pointer">
                  <Text variant="label">
                    <HelpCircle size={20} />
                  </Text>
                </Box>
                </a>
              }
            >
              <Box height="28">
              <Text>
                Create a new DAO onboarding workflow
              </Text>
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
              onClick={async() => {
                await useTemplate();
                // setTemplate(3);
              }}
              // suffix={
              //   <Box cursor="pointer">
              //     <Text variant="label">
              //       <HelpCircle size={20} />
              //     </Text>
              //   </Box>
              // }
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
