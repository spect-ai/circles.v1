// import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { storeImage } from "@/app/common/utils/ipfs";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { updateFormCollection } from "@/app/services/Collection";
import { connectedUserAtom } from "@/app/state/global";
import { Avatar, Box, FileInput, Stack, Text, useTheme } from "degen";
import { useAtom } from "jotai";
import { useState } from "react";
import { useLocalCollection } from "../../../Context/LocalCollectionContext";
import Footer from "./Footer";
import Messages from "./Messages";
import { logError } from "@/app/common/utils/utils";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import Editor from "@/app/common/components/Editor";

type Props = {
  setCurrentPage: (page: string) => void;
};

const BuilderStartPage = ({ setCurrentPage }: Props) => {
  const [connectedUser] = useAtom(connectedUserAtom);
  const { circle, setCircleData } = useCircle();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [logo, setLogo] = useState(collection.formMetadata?.logo || "");
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  return (
    <Box
      className="bounds"
      style={{
        minHeight: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Stack space="2">
        {logo && <Avatar src={logo} label="" size="20" />}
        {/* <FileInput
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
                logError("Error updating collection");
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
        </FileInput> */}
        <NameInput
          placeholder="Enter name"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={async () => {
            if (connectedUser && name !== collection.name) {
              const res = await updateFormCollection(collection.id, {
                name,
              });
              if (res.id) {
                updateCollection(res);
                if (circle)
                  setCircleData({
                    ...circle,
                    collections: {
                      ...(circle.collections || {}),
                      [res.id]: {
                        ...circle.collections[res.id],
                        name: res.name,
                      },
                    },
                  });
              }
            }
          }}
          disabled
        />
        <Editor
          bounds=".bounds"
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
          placeholder={`Edit description`}
          isDirty={true}
          version={collection.editorVersion}
        />
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
