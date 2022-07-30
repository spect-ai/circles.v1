import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CircleType, MemberDetails } from '@/app/types';
import MultipleDropdown, { OptionType } from "./MultipleDropDown";
import Popover from '@/app/common/components/Popover';
import { Box, Button, Text, Input, IconGrid, IconList, IconDotsVertical} from "degen";
import styled from "styled-components";
import PrimaryButton from '@/app/common/components/PrimaryButton';
import { createViews } from "@/app/services/ProjectViews";
import { cardType, priorityType, labels } from "./constants";
import Link from "next/link";
import { filterCards } from "./filterCards";

export const ViewBar = () => {

  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { localProject: project , setView } = useLocalProject();
  const [viewName, setViewName] = useState<string>('');
  // {project?.viewOrder?.map((viewId, idx)=> {
  //   const view = project.viewDetails?.[viewId];
  //   console.log(view?.filters);
  // })}

  return(
    <>
      <Box display="flex" flexDirection="row" gap="4">
        {project?.viewOrder && project?.viewOrder?.length > 0 &&
          <Link href={`/${cId}/${pId}`}>
            <Button variant="transparent" size="small" onClick={()=> setViewName('')}>
              Default View
            </Button>
          </Link>
        }
        {project?.viewOrder?.map((viewId )=> {
          const view = project.viewDetails?.[viewId];
          return(
            <>
              <Link href={`/${cId}/${pId}#view-${viewId}`}>
                <Button 
                  prefix={view?.type == 'Board' ? <IconGrid size="4"/> : <IconList size="4"/>} 
                  variant={ viewName == viewId ? "secondary" : "transparent" }
                  size="small"
                  key={viewId}
                  onClick={()=> 
                    setViewName(viewId)
                  }
                  suffix={
                    viewName == viewId ? 
                    <>
                      <Box>
                        <IconDotsVertical size="4" />
                      </Box>
                    </> : <></>
                  }
                >
                  View
                </Button>
              </Link>
            </>
            
          )
        })}
      </Box>
    </>
  )
}