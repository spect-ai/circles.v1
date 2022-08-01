import { useRouter } from "next/router";
import React from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, IconGrid, IconList, IconDotsVertical} from "degen";
import Link from "next/link";

export const ViewBar = () => {

  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { localProject: project } = useLocalProject();
  const { canDo } = useRoleGate();

  return(
    <>
      <Box display="flex" flexDirection="row" gap="4">
        {project?.viewOrder && project?.viewOrder?.length > 0 &&
          <Link href={`/${cId}/${pId}`}>
            <Button variant="transparent" size="small">
              Default View
            </Button>
          </Link>
        }
        {project?.viewOrder?.map((viewId, idx)=> {
          const view = project.viewDetails?.[viewId];
          
          return(
            <>
              <Link href={`/${cId}/${pId}/view/${view?.slug}`}>
                <Button 
                  prefix={view?.type == 'Board' ? <IconGrid size="4"/> : <IconList size="4"/>} 
                  variant={ view?.slug == vId ? "tertiary" : "transparent" }
                  size="small"
                  key={viewId}
                  suffix={
                    view?.slug == vId  && canDo(["steward"]) ? 
                    <>
                      <Box>
                        <IconDotsVertical size="4" />
                      </Box>
                    </> : <></>
                  }
                >
                  {view?.name}
                </Button>
              </Link>
            </>
          )
        })}
      </Box>
    </>
  )
}