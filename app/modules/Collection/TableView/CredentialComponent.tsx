import { UserOutlined } from "@ant-design/icons";
import { Box, Button } from "degen";
import { CellProps } from "react-datasheet-grid";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import NewTabIcon from "@/app/assets/icons/newTabIcon.svg";

const CredentialComponent = ({ rowData }: CellProps) => {
  const { localCollection: collection } = useLocalCollection();
  return (
    <>
      <Box
        marginLeft="1"
        display="flex"
        flexDirection="row"
        alignItems="center"
        width="full"
      >
        <Button
          variant="transparent"
          width="full"
          justifyContent="flex-start"
          size="small"
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Box display="flex" flexDirection="row" gap="2">
              <UserOutlined />
              {collection.profiles[collection.dataOwner[rowData.id]].username}
            </Box>
            <Box width="4">
              <NewTabIcon />
            </Box>
          </Box>
        </Button>
      </Box>
    </>
  );
};

export default CredentialComponent;
