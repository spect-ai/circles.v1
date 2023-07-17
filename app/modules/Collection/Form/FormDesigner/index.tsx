import { Box, FileInput, Stack, Tag, Text } from "degen";
import React from "react";
import PublicForm from "@/app/modules/PublicForm";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import styled from "@emotion/styled";
import {
  DeformProps,
  GFormProps,
  SpectProps,
  TypeformProps,
} from "@avp1598/vibes";
import { updateFormCollection } from "@/app/services/Collection";
import { storeImage } from "@/app/common/utils/ipfs";
import { toast } from "react-toastify";
import { HeaderButton } from "../FormEditor/EditorHeader";
import { BsHexagon } from "react-icons/bs";
import { FaPager } from "react-icons/fa";

const FormDesigner = () => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const logoInputRef = React.useRef<HTMLDivElement>(null);
  const coverInputRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 xl:flex-row overflow-auto">
        <div className="flex flex-col gap-4 w-full xl:w-1/3">
          <Stack>
            <Text variant="label">Branding</Text>
            <Stack direction="horizontal" wrap>
              <FileInput
                accept="image/*"
                ref={logoInputRef}
                onChange={async (file) => {
                  const res = await storeImage(file);
                  const newCollection = await updateFormCollection(
                    collection.id,
                    {
                      formMetadata: {
                        ...collection.formMetadata,
                        logo: res.imageGatewayURL,
                      },
                    }
                  );
                  if (!newCollection.id) {
                    toast.error(
                      "Error updating collection, refresh and try again"
                    );
                  } else updateCollection(newCollection);
                }}
              >
                {() => (
                  <HeaderButton
                    icon={<BsHexagon size={20} />}
                    label={
                      collection.formMetadata.logo ? "Change Logo" : "Add Logo"
                    }
                    onClick={() => {
                      const grandChildrenInput =
                        logoInputRef.current?.querySelector("input");
                      grandChildrenInput?.click();
                    }}
                    active={collection.formMetadata.logo ? true : false}
                  />
                )}
              </FileInput>
              <FileInput
                accept="image/*"
                ref={coverInputRef}
                onChange={async (file) => {
                  const res = await storeImage(file);
                  const newCollection = await updateFormCollection(
                    collection.id,
                    {
                      formMetadata: {
                        ...collection.formMetadata,
                        cover: res.imageGatewayURL,
                      },
                    }
                  );
                  if (!newCollection.id) {
                    toast.error(
                      "Error updating collection, refresh and try again"
                    );
                  } else updateCollection(newCollection);
                }}
              >
                {() => (
                  <HeaderButton
                    icon={<FaPager size={20} />}
                    label={
                      collection.formMetadata.cover
                        ? "Change Cover"
                        : "Add Cover"
                    }
                    onClick={() => {
                      const grandChildrenInput =
                        coverInputRef.current?.querySelector("input");
                      grandChildrenInput?.click();
                    }}
                    active={collection.formMetadata.cover ? true : false}
                  />
                )}
              </FileInput>
            </Stack>
          </Stack>
          <Stack>
            <Text variant="label">Themes</Text>
            <Stack direction="horizontal" wrap>
              <Box
                onClick={() => {
                  updateCollection({
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: SpectProps,
                      selectedTheme: "spect",
                    },
                  });
                  updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: SpectProps,
                      selectedTheme: "spect",
                    },
                  });
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.selectedTheme === "spect"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Spect
                </Tag>
              </Box>
              <Box
                onClick={() => {
                  updateCollection({
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: TypeformProps,
                      selectedTheme: "typeform",
                    },
                  });
                  updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: TypeformProps,
                      selectedTheme: "typeform",
                    },
                  });
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.selectedTheme === "typeform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Hype
                </Tag>
              </Box>
              <Box
                onClick={() => {
                  updateCollection({
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: GFormProps,
                      selectedTheme: "gform",
                    },
                  });
                  updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: GFormProps,
                      selectedTheme: "gform",
                    },
                  });
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.selectedTheme === "gform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Refi
                </Tag>
              </Box>
              <Box
                onClick={() => {
                  updateCollection({
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: DeformProps,
                      selectedTheme: "deform",
                    },
                  });
                  updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: DeformProps,
                      selectedTheme: "deform",
                    },
                  });
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.selectedTheme === "deform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Futuristic
                </Tag>
              </Box>
              <Box
                cursor="pointer"
                onClick={() => {
                  toast("Coming soon!");
                }}
              >
                <Tag hover>Custom</Tag>
              </Box>
            </Stack>
          </Stack>
        </div>
        <div className="w-full xl:w-2/3">
          <ScrollContainer>
            <PublicForm form={collection} preview />
          </ScrollContainer>
        </div>
      </div>
    </div>
  );
};

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 1279px) {
    height: calc(100vh - 28rem);
  }
  height: calc(100vh - 16rem);
  border-radius: 1rem;
`;

export default FormDesigner;
