import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { storeImage } from "@/app/common/utils/ipfs";
import { updateFormCollection } from "@/app/services/Collection";
import { connectedUserAtom } from "@/app/state/global";
import { Avatar, Box, FileInput, Stack } from "degen";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../../Context/LocalCollectionContext";
import Footer from "./Footer";
import Messages from "./Messages";

type Props = {
  setCurrentPage: (page: string) => void;
};

const NameInput = styled.textarea`
  resize: none;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  font-family: Inter;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
  overflow: hidden;
`;

const BuilderStartPage = ({ setCurrentPage }: Props) => {
  const [connectedUser] = useAtom(connectedUserAtom);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [logo, setLogo] = useState(collection.formMetadata?.logo || "");
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);

  const [captchaVerified, setCaptchaVerified] = useState(false);

  return (
    <Box
      style={{
        height: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Stack space="2">
        {logo && <Avatar src={logo} label="" size="20" />}
        <FileInput
          onChange={async (file) => {
            const res = await storeImage(file);
            setLogo(res.imageGatewayURL);
            if (connectedUser) {
              const newCollection = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  logo: res.imageGatewayURL,
                },
              });
              if (!newCollection.id) {
                toast.error("Error updating collection, refresh and try again");
              } else updateCollection(newCollection);
            }
          }}
        >
          {() => (
            <ClickableTag
              onClick={() => {}}
              name={logo ? "Change logo" : "Add Logo"}
            />
          )}
        </FileInput>
        <NameInput
          placeholder="Enter name"
          autoFocus
          value={name}
          rows={Math.floor((name?.length || 60) / 60) + 1}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={async () => {
            if (connectedUser && name !== collection.name) {
              const res = await updateFormCollection(collection.id, {
                name,
              });
              res.id && updateCollection(res);
            }
          }}
        />
        <Box
          width="full"
          borderRadius="large"
          maxHeight="56"
          overflow="auto"
          id="editorContainer"
        >
          <Editor
            value={description}
            onSave={async (value) => {
              setDescription(value);
              if (connectedUser) {
                const res = await updateFormCollection(collection.id, {
                  description: value,
                });
                res.id && updateCollection(res);
              }
            }}
            placeholder="Edit description"
            isDirty
          />
        </Box>
        <Messages form={collection} />
      </Stack>
      <Footer
        collection={collection}
        setCaptchaVerified={setCaptchaVerified}
        captchaVerified={captchaVerified}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
};

export default BuilderStartPage;
