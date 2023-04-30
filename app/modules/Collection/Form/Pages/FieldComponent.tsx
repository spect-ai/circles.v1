import { getPropertyIcon } from "@/app/modules/CollectionProject/EditProperty/Utils";
import { updateField } from "@/app/services/Collection";
import { PropertyType } from "@/app/types";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Box, Stack, Text } from "degen";
import { motion } from "framer-motion";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { smartTrim } from "@/app/common/utils/utils";
import { toast } from "react-toastify";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

type Props = {
  field: string;
  type: PropertyType;
  index: number;
  setIsAddFieldOpen: (open: boolean) => void;
  setPropertyId: (name: string) => void;
};

const FieldComponent = ({
  field,
  type,
  index,
  setIsAddFieldOpen,
  setPropertyId,
}: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [hover, setHover] = useState(false);
  const property = collection.properties[field];
  const { formActions } = useRoleGate();

  return (
    <Draggable draggableId={field} key={field} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          opacity={property.isPartOfFormView ? "100" : "50"}
        >
          <Stack key={field} space="0" direction="horizontal" align="center">
            <ConnectorLine
              width="4"
              height="4"
              borderLeftWidth="0.375"
              borderBottomWidth="0.375"
              borderBottomLeftRadius="medium"
            />

            <PropertyButton
              paddingX="4"
              paddingY="1"
              borderWidth="0.375"
              borderRadius="medium"
              marginTop="2"
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="2"
              onClick={() => {
                if (!formActions("manageSettings")) {
                  toast.error(
                    "You do not have permission to add fields, make sure your role has permission to manage settings"
                  );
                  return;
                }
                setPropertyId(property.id);
                setIsAddFieldOpen(true);
              }}
            >
              <Text color="accent">{getPropertyIcon(type, 14)}</Text>
              <Text variant="label">{smartTrim(property.name, 30)}</Text>
            </PropertyButton>
            <Stack direction="horizontal" align="center" space="2">
              <Box />
              {property.required && (
                <Box marginTop="3">
                  <Text color="red">*</Text>
                </Box>
              )}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box cursor="pointer" marginLeft="2">
                  <Text color="red">
                    <IconTrash size="4" />
                  </Text>
                </Box>
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: "5px" }}
              >
                {property.isPartOfFormView ? (
                  <Box
                    cursor="pointer"
                    onClick={async () => {
                      const res = await updateField(collection.id, {
                        id: field,
                        isPartOfFormView: false,
                      });
                      updateCollection(res);
                    }}
                  >
                    <Text variant="label">
                      <EyeInvisibleFilled />
                    </Text>
                  </Box>
                ) : (
                  <Box
                    cursor="pointer"
                    onClick={async () => {
                      const res = await updateField(collection.id, {
                        id: field,
                        isPartOfFormView: true,
                      });
                      updateCollection(res);
                    }}
                  >
                    <Text variant="label">
                      <EyeFilled />
                    </Text>
                  </Box>
                )}
              </motion.div>
            </Stack>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
};

const PropertyButton = styled(Box)<{}>`
  &:hover {
    background: rgb(255, 255, 255, 0.1);
  }
  width: fit-content;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const ConnectorLine = styled(Box)<{}>`
  margin-top: -10px;
  margin-left: 8px;
`;

export default FieldComponent;
