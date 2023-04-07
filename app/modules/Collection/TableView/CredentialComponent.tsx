import { UserOutlined } from "@ant-design/icons";
import { Box, Button } from "degen";
import { CellProps } from "react-datasheet-grid";
import NewTabIcon from "@/app/assets/icons/newTabIcon.svg";
import { useLocalCollection } from "../Context/LocalCollectionContext";

const CredentialComponent = ({ rowData }: CellProps) => {
  const { localCollection: collection } = useLocalCollection();
  return (
    <Box
      marginLeft="1"
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="full"
    >
      <a
        href={`/profile/${
          collection.profiles[collection.dataOwner[rowData.id]].username
        }`}
        target="_blank"
        rel="noreferrer"
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
      </a>
    </Box>
  );
};

export default CredentialComponent;
