import { useRouter } from "next/router";
import React, { useState } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, IconGrid, IconList, IconDotsVertical, Text, IconPlusSmall} from "degen";
import Link from "next/link";
import { toast } from "react-toastify";
import CreateViewModal from "./ViewModal/CreateViewModal";
import EditViewModal from "./ViewModal/EditViewModal";
import { AnimatePresence } from "framer-motion";

export const ViewBar = () => {

  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { localProject: project } = useLocalProject();
  const { canDo } = useRoleGate();

  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState('');
  const [viewId, setViewId] = useState('');
  

  return(
    <>
      <Box display="flex" flexDirection="row" gap="4">
        {project?.viewOrder && project?.viewOrder?.length > 0 &&
          <Link href={`/${cId}/${pId}`}>
            <Button variant="transparent" size="small" onClick={()=> setViewId('')}>
              Default View
            </Button>
          </Link>
        }
        {project?.viewOrder?.map((viewId, idx)=> {
          const view = project.viewDetails?.[viewId];
          
          return(
            <>
              <Link href={`/${cId}/${pId}?view=${view?.slug}`}>
                <Button 
                  prefix={view?.type == 'Board' ? <IconGrid size="4"/> : <IconList size="4"/>} 
                  variant={ view?.slug == vId ? "tertiary" : "transparent" }
                  size="small"
                  key={viewId}
                  onClick={()=> setViewId(viewId)}
                  suffix={
                    view?.slug == vId  && canDo(["steward"]) ? 
                    <>
                      <Box onClick={()=> {
                        setViewMode('edit');
                        setOpenModal(true);
                      }}>
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
      {project?.name && canDo(["steward"]) && 
        <Box
          cursor="pointer"
          onClick={()=> {
            if(project.viewOrder && project.viewOrder?.length < 3 ){
              setViewMode('create');
              setOpenModal(true);
            }else{
              toast.warning("You cannot create more than 3 views");
            }}}
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
      {openModal && 
        <AnimatePresence>
          {viewMode == 'create' && <CreateViewModal setViewOpen={setOpenModal}/>}
          {viewMode == 'edit' && <EditViewModal setViewOpen={setOpenModal} viewId={viewId}/>}
        </AnimatePresence>
      }
    </>
  )
}