import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { Box, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";

export default function ConnectQuestbook() {
  const [isOpen, setIsOpen] = useState(false);
  const { circle, registry, setCircleData } = useCircle();

  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [milestoneProject, setMilestoneProject] = useState({} as OptionType);
  const [applicantProject, setApplicantProject] = useState({} as OptionType);
  const [projectOptions, setProjectOptions] = useState([] as OptionType[]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    let workspaceId;
    try {
      const url = new URL(workspaceUrl);
      workspaceId = url.searchParams.get("daoId");
    } catch (err) {
      toast.error("Invalid Workspace Url");
      setIsLoading(false);
      return;
    }

    if (!workspaceId) {
      toast.error("DAO ID not found in Url");
      setIsLoading(false);
      return;
    }
    const res = await updateCircle(
      {
        questbookWorkspaceId: workspaceId,
        questbookWorkspaceUrl: workspaceUrl,
        grantMilestoneProject: milestoneProject?.value,
        grantApplicantProject: applicantProject?.value,
      },
      circle?.id as string
    );
    console.log({ res });
    setIsLoading(false);
    if (res) {
      setCircleData(res);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (circle?.projects) {
      const options = circle.projects.map((p) => {
        if (circle.grantApplicantProject === p.id)
          setApplicantProject({
            label: p.name,
            value: p.id,
          });
        if (circle.grantMilestoneProject === p.id)
          setMilestoneProject({
            label: p.name,
            value: p.id,
          });
        return {
          label: p.name,
          value: p.id,
        };
      });
      setProjectOptions(options);
      setWorkspaceUrl(circle.questbookWorkspaceUrl || "");
    }
  }, [circle]);

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>
        {workspaceUrl
          ? workspaceUrl
            ? "Questbook Connected"
            : "Connect Questbook"
          : "Connect Questbook"}
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Connect Questbook Workspace"
          >
            <Box padding="8">
              <Stack>
                <Box marginBottom="4">
                  <Text>1. Add Workspace Url</Text>
                  <Input
                    label=""
                    placeholder="Questbook workspace Url"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    inputMode="url"
                  />
                </Box>

                <Box marginBottom="4">
                  <Text>
                    2. Pick a project to link approved grant applicants
                  </Text>
                  <Dropdown
                    options={projectOptions}
                    selected={applicantProject}
                    onChange={(value) => {
                      setApplicantProject(value);
                    }}
                  />
                </Box>

                <Box marginBottom="4">
                  <Text>3. Pick a project to link milestones</Text>
                  <Dropdown
                    options={projectOptions}
                    selected={milestoneProject}
                    onChange={(value) => {
                      setMilestoneProject(value);
                    }}
                  />{" "}
                </Box>

                <PrimaryButton
                  shape="circle"
                  onClick={onSubmit}
                  loading={isLoading}
                >
                  Save
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
