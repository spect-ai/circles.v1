import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CircleType, MemberDetails } from '@/app/types';
import MultipleDropdown, { OptionType } from "./MultipleDropDown";
import Popover from '@/app/common/components/Popover';
import { Box, IconPlusSmall, Text, Input } from "degen";
import styled from "styled-components";
import PrimaryButton from '@/app/common/components/PrimaryButton';
import { createViews } from "@/app/services/ProjectViews";
import { cardType, priorityType, labels } from "./constants"
import { toast } from "react-toastify";
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
  const { circle: cId } = router.query;
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
  const [circleMembers, setCircleMembers] = useState<
    {
      name: string;
      id: string;
    }[]
  >([] as any);

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
      }));
      setFilteredMembers(circleMembersArray);
      setCircleMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  const { localProject: project, setLocalProject } = useLocalProject();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [field, setfield] = useState<string>('');
  const [reviewer, setReviewer] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [label, setLabels] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [column, setColumn] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  const columns = project?.columnOrder?.map((column: string) => ({
    name: project?.columnDetails[column].name,
    id: column,
  }));
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(project.viewOrder && project.viewOrder?.length < 9 ){
      setAnchorEl(event.currentTarget);
      // setOpen(true);
      setViewOpen(true);
    }else{
      toast.warning("You cannot create more than 3 views");
    }
    
  };
  const handleViewClose = () => setViewOpen(false);

   const main = async() => {
    const newView = await createViews({
      type: 'Board',
      hidden: true,
      filters: {
        assignee: assignee,
        reviewer: reviewer,
        column: column,
        label: label,
        status: {
          active: true,
          paid: true,
          archived: true,
        },
        title: title,
        type: type,
        priority: priority,
        deadline: 'meme',
      },
      name: 'hello',
    }, project.id)
    console.log(newView);
    if (newView !== null) setLocalProject(newView);
  }

  const onViewSubmit = () => {
    handleViewClose();
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
              {/* <Input label="title" hideLabel placeholder="Title" onChange={handleTitleChange}/> */}
              <PrimaryButton onClick={onViewSubmit}>
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




