import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { updateFormCollection } from "@/app/services/Collection";
import { connectedUserAtom } from "@/app/state/global";
import { Avatar, Box, FileInput, Stack, Text } from "degen";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { useLocalCollection } from "../../../Context/LocalCollectionContext";

type Props = {
  setCurrentPage: (page: string) => void;
};

const BuilderStartPage = ({ setCurrentPage }: Props) => {
  const [connectedUser] = useAtom(connectedUserAtom);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [logo, setLogo] = useState(collection.formMetadata?.logo || "");
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);

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
              newCollection.id && updateCollection(newCollection);
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
          rows={Math.floor(name?.length / 60) + 1}
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
            placeholder={`Edit description`}
            isDirty={true}
          />
        </Box>
        <Box display="flex" flexDirection="column" marginTop="4" gap="4">
          {collection.formMetadata.formRoleGating &&
            collection.formMetadata.formRoleGating.length > 0 && (
              <Text weight="semiBold" variant="large">
                This form is role gated
              </Text>
            )}
          {collection.formMetadata.mintkudosTokenId && (
            <Text weight="semiBold" variant="large">
              This form distributes soulbound tokens to responders
            </Text>
          )}
          {collection.formMetadata.surveyTokenId && (
            <Text weight="semiBold" variant="large">
              This form distributes erc20 tokens to responders
            </Text>
          )}
          {collection.formMetadata.sybilProtectionEnabled && (
            <Text weight="semiBold" variant="large">
              This form is Sybil protected
            </Text>
          )}
          {collection.formMetadata.poapEventId && (
            <Text weight="semiBold" variant="large">
              This form distributes POAP tokens to responders
            </Text>
          )}
          {collection.formMetadata.walletConnectionRequired && (
            <Text weight="semiBold" variant="large">
              This form requires you to connect your wallet
            </Text>
          )}
        </Box>
      </Stack>
      <Stack direction="horizontal" justify="space-between">
        <Box paddingX="5" paddingBottom="4" width="1/2" />
        <Box paddingX="5" paddingBottom="4" width="1/2">
          <PrimaryButton
            onClick={() => {
              setCurrentPage(collection.formMetadata.pageOrder[1]);
            }}
          >
            Start
          </PrimaryButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default BuilderStartPage;
