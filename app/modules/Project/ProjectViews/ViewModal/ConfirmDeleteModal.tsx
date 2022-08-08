import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { deleteViews } from "@/app/services/ProjectViews";
import { useLocalProject } from "../../Context/LocalProjectContext";
import { useRouter } from "next/router";
import { useGlobal } from "@/app/context/globalContext";

interface Props {
  setDeleteModal: (deleteModal: boolean) => void;
  viewId: string;
  setViewOpen: (viewOpen: boolean) => void;
}

export default function ConfirmDelete({
  setDeleteModal,
  viewId,
  setViewOpen,
}: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { localProject: project, setLocalProject } = useLocalProject();
  const { setViewName } = useGlobal();

  const onDelete = async () => {
    void router.push(`/${cId}/${pId}/`);
    setViewName("");
    setViewOpen(false);
    const updatedProject = await deleteViews(project.id, viewId);
    if (updatedProject !== null) setLocalProject(updatedProject);
  };

  return (
    <>
      <ConfirmModal
        title="Are you sure about deleting this view ? This action is permanent and cannot be undone."
        handleClose={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
        onConfirm={onDelete}
      />
    </>
  );
}
