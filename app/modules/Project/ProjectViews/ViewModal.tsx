import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CircleType, MemberDetails } from '@/app/types';
import MultipleDropdown, { OptionType } from "./MultipleDropDown";
import Popover from '@/app/common/components/Popover';
import { Box, IconPlusSmall, Text, useTheme, IconGrid, IconList  } from "degen";
import styled from "styled-components";
import PrimaryButton from '@/app/common/components/PrimaryButton';
import { createViews } from "@/app/services/ProjectViews";
import { cardType, priorityType, labels, Status } from "./constants"
import { toast } from "react-toastify";
import { Input, InputBox } from "./MultipleDropDown";
import { WechatFilled } from "@ant-design/icons";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 40rem;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: row;
`;

function CreateViewModal (){

  const router = useRouter();
  const {mode} = useTheme();

  const { circle: cId } = router.query;
  const { localProject: project, setLocalProject } = useLocalProject();
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { data: memberDetails, refetch: fetchMemberDetails } =
    useQuery<MemberDetails>(["memberDetails", cId], {
      enabled: false,
    });

    const [filteredMembers, setFilteredMembers] = useState<
    { name: string; id: string }[]
  >([] as any);


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
  
  const [viewOpen, setViewOpen] = useState(false);
  const [viewName, setViewName] = useState<string>('');
  const [layout, setLayout] = useState<"Board" | "List">('Board');
  const [reviewer, setReviewer] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [label, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [column, setColumn] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  const handleClick = () => {
    if(project.viewOrder && project.viewOrder?.length < 3 ){
      setViewOpen(true);
    }else{
      toast.warning("You cannot create more than 3 views");
    }
  };

   const main = async() => {
    const newView = await createViews({
      type: layout,
      hidden: false,
      filters: {
        assignee: assignee,
        reviewer: reviewer,
        column: column,
        label: label,
        status: status,
        title: title,
        type: type,
        priority: priority,
        deadline: '',
      },
      name: viewName,
    }, project.id)
    console.log(newView);
    if (newView !== null) setLocalProject(newView);
  }

  const onViewSubmit = () => {
    setViewOpen(false)
    main();
  };

  return(
    <>
      <Box style={{"borderRadius": "2px"}}>
        <Popover
          butttonComponent={
            <Box
              cursor="pointer"
              onClick={handleClick}
              color="foreground"
              display="flex"
              flexDirection="row"
              gap="1"
              alignItems="center"
            >
              <IconPlusSmall color="textSecondary" size="4"/>
              <Text color="textSecondary">View</Text>
            </Box>
          }
          isOpen={viewOpen}
          setIsOpen={setViewOpen}
        >
          <Container
            backgroundColor="background"
            borderWidth="0.5"
            borderRadius="large"
          >
            <Box >
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
                options={filteredMembers as OptionType[]}
                value={assignee}
                setValue={setAssignee}
                title={'Assignee'}
              />
              <MultipleDropdown
                options={filteredMembers as OptionType[]}
                value={reviewer}
                setValue={setReviewer}
                title={'Reviewer'}
              />
              <MultipleDropdown
                options={labels as OptionType[]}
                value={label}
                setValue={setLabels}
                title={'Labels'}
              />
              <MultipleDropdown
                options={columns as OptionType[]}
                value={column}
                setValue={setColumn}
                title={'Column'}
              />
              <MultipleDropdown
                options={cardType as OptionType[]}
                value={type}
                setValue={setType}
                title={'Type'}
              />
              <MultipleDropdown
                options={priorityType as OptionType[]}
                value={priority}
                setValue={setPriority}
                title={'Priority'}
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
          </Container>
        </Popover>
      </Box>
    </>
  )
}

export default CreateViewModal;




