import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { CircleType, MemberDetails } from '@/app/types';
import MultipleDropdown, { OptionType } from "../MultipleDropDown";
import { Box, Text, useTheme, IconGrid, IconList  } from "degen";
import PrimaryButton from '@/app/common/components/PrimaryButton';
import { createViews } from "@/app/services/ProjectViews";
import { cardType, priorityType, labels, Status } from "../constants"
import { Input, InputBox } from "../MultipleDropDown";
import Modal from "@/app/common/components/Modal";

interface Props{
  setViewOpen: (viewOpen: boolean) => void;
}

function CreateViewModal ({setViewOpen}: Props){

  const router = useRouter();
  const {mode} = useTheme();

  const { circle: cId } = router.query;
  const { localProject: project, setLocalProject } = useLocalProject();
  const { data: circle } = useQuery<CircleType>(["circle", cId], {enabled: false});
  const { data: memberDetails } = useQuery<MemberDetails>(["memberDetails", cId], { enabled: false });

  const [filteredMembers, setFilteredMembers] = useState<{ name: string; id: string }[]>([] as any);

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
      }));
      setFilteredMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  const columns = project?.columnOrder?.map((column: string) => ({
    name: project?.columnDetails[column].name,
    id: column,
  }));
  
  const [viewName, setViewName] = useState<string>('');
  const [layout, setLayout] = useState<"Board" | "List">('Board');
  const [reviewer, setReviewer] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [label, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [column, setColumn] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  const create = async() => {
    const updatedProject = await createViews({
      type: layout,
      hidden: false,
      filters: {
        assignee: assignee,
        reviewer: reviewer,
        column: column,
        label: label,
        status: [],
        title: title,
        type: type,
        priority: priority,
        deadline: '',
      },
      name: viewName,
    }, project.id)
    console.log(updatedProject);
    if (updatedProject !== null) setLocalProject(updatedProject);
  }

  const onViewSubmit = () => {
    setViewOpen(false)
    create();
  };

  return(
    <>
        <Modal handleClose={()=>setViewOpen(false)} title={'Create View'} size="small">
          <Box padding={"4"}>
              <InputBox mode={mode}>
                <Input
                  placeholder={'View Name'}
                  value={viewName}
                  onChange={(e) => 
                  setViewName(e.target.value)}
                />
              </InputBox>
              {viewName.length == 0 && <Text variant="small" color="purple">Please name it</Text>}
              <Box 
                display="flex" 
                flexDirection="row" 
                padding="1" 
                paddingBottom="2" 
                paddingLeft="4" 
                justifyContent="space-between"
              >
                <Text color="textSecondary" weight="medium" variant="base">Layout</Text>
                <Box display="flex" flexDirection="row" >
                  <Box
                    color="textSecondary"
                    padding="2"
                    borderRadius="large"
                    backgroundColor={layout == 'Board' ? "accentSecondary" : "background"}
                    onClick={() => setLayout('Board')}
                  >
                    <IconGrid size="4" />
                  </Box>
                  <Box
                    color="textSecondary"
                    padding="2"
                    borderRadius="large"
                    backgroundColor={layout == 'List' ? "accentSecondary" : "background"}
                    onClick={() => setLayout('List')}
                  >
                    <IconList size="4" />
                  </Box>
                </Box>
              </Box>
              <MultipleDropdown
                width="30"
                options={filteredMembers as OptionType[]}
                value={assignee}
                setValue={setAssignee}
                title={'Assignee'}
              />
              <MultipleDropdown
                width="30"
                options={filteredMembers as OptionType[]}
                value={reviewer}
                setValue={setReviewer}
                title={'Reviewer'}
              />
              <MultipleDropdown
                width="30"
                options={labels as OptionType[]}
                value={label}
                setValue={setLabels}
                title={'Labels'}
              />
              <MultipleDropdown
                width="30"
                options={columns as OptionType[]}
                value={column}
                setValue={setColumn}
                title={'Column'}
              />
              <MultipleDropdown
                width="30"
                options={priorityType as OptionType[]}
                value={priority}
                setValue={setPriority}
                title={'Priority'}
              />
              <MultipleDropdown
                width="30"
                options={cardType as OptionType[]}
                value={type}
                setValue={setType}
                title={'Type'}
              />
              <InputBox mode={mode}>
                <Input
                  placeholder={'Title'}
                  value={title}
                  onChange={(e) => 
                    setTitle(e.target.value)}
                />
              </InputBox> 
              <PrimaryButton onClick={onViewSubmit} disabled={viewName.length == 0} >
                Create View
              </PrimaryButton>
            </Box>
        </Modal>
    </>
  )
}
export default CreateViewModal;



