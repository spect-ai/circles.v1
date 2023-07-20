import { Box, FileInput, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import PublicForm from "@/app/modules/PublicForm";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import styled from "@emotion/styled";
import {
  DeformBase,
  DeformThemes,
  GFormBase,
  GformThemes,
  SpectBase,
  SpectThemes,
  TypeformBase,
  TypeformThemes,
} from "@avp1598/vibes";
import { updateFormCollection } from "@/app/services/Collection";
import { storeImage } from "@/app/common/utils/ipfs";
import { toast } from "react-toastify";
import { HeaderButton } from "../FormEditor/EditorHeader";
import { BsHexagon } from "react-icons/bs";
import { FaPager } from "react-icons/fa";
import Popover from "@/app/common/components/Popover";
import { motion } from "framer-motion";
import ColorPicker from "react-best-gradient-color-picker";
import PrimaryButton from "@/app/common/components/PrimaryButton";

const themeMapper: {
  [key: string]: any;
} = {
  spect: SpectThemes,
  typeform: TypeformThemes,
  gform: GformThemes,
  deform: DeformThemes,
};

const colorLabelMapper = [
  "Background",
  "Page Background",
  "Primary",
  "Accent",
  "Secondary",
];

const FormDesigner = () => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const logoInputRef = React.useRef<HTMLDivElement>(null);
  const coverInputRef = React.useRef<HTMLDivElement>(null);

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [editColorForOption, setEditColorForOption] = useState(-1);
  const [colorPickerColor, setColorPickerColor] = useState("#000000");
  const [activeColor, setActiveColor] = useState("");

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
            <Text variant="label">Layouts</Text>
            <Stack direction="horizontal" wrap>
              <Box
                onClick={() => {
                  const update = {
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: {
                        layout: {
                          ...SpectBase,
                          colorPalette:
                            themeMapper.spect[
                              Object.keys(themeMapper.spect)[0]
                            ],
                        },
                        selectedLayout: "spect",
                        selectedTheme: Object.keys(themeMapper.spect)[0],
                      },
                    },
                  };
                  updateCollection(update);
                  updateFormCollection(collection.id, update);
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.theme?.selectedLayout === "spect"
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
                  const update = {
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: {
                        layout: {
                          ...TypeformBase,
                          colorPalette:
                            themeMapper.typeform[
                              Object.keys(themeMapper.typeform)[0]
                            ],
                        },
                        selectedLayout: "typeform",
                        selectedTheme: Object.keys(themeMapper.typeform)[0],
                      },
                    },
                  };
                  updateCollection(update);
                  updateFormCollection(collection.id, update);
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.theme.selectedLayout === "typeform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Type
                </Tag>
              </Box>
              <Box
                onClick={() => {
                  const update = {
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: {
                        layout: {
                          ...GFormBase,
                          colorPalette:
                            themeMapper.gform[
                              Object.keys(themeMapper.gform)[0]
                            ],
                        },
                        selectedLayout: "gform",
                        selectedTheme: Object.keys(themeMapper.gform)[0],
                      },
                    },
                  };
                  updateCollection(update);
                  updateFormCollection(collection.id, update);
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.theme.selectedLayout === "gform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Classic
                </Tag>
              </Box>
              <Box
                onClick={() => {
                  const update = {
                    ...collection,
                    formMetadata: {
                      ...collection.formMetadata,
                      theme: {
                        layout: {
                          ...DeformBase,
                          colorPalette:
                            themeMapper.deform[
                              Object.keys(themeMapper.deform)[0]
                            ],
                        },
                        selectedLayout: "deform",
                        selectedTheme: Object.keys(themeMapper.deform)[0],
                      },
                    },
                  };
                  updateCollection(update);
                  updateFormCollection(collection.id, update);
                }}
                cursor="pointer"
              >
                <Tag
                  tone={
                    collection.formMetadata.theme.selectedLayout === "deform"
                      ? "accent"
                      : undefined
                  }
                  hover
                >
                  Futuristic
                </Tag>
              </Box>
              {/* <Box
                cursor="pointer"
                onClick={() => {
                  toast("Coming soon!");
                }}
              >
                <Tag hover>Custom</Tag>
              </Box> */}
            </Stack>
          </Stack>
          <Stack>
            <Text variant="label">Themes</Text>
            <Stack direction="horizontal" wrap>
              {Object.keys(
                themeMapper[collection.formMetadata.theme.selectedLayout]
              ).map((theme) => (
                <Box
                  key={theme}
                  onClick={() => {
                    const update = {
                      ...collection,
                      formMetadata: {
                        ...collection.formMetadata,
                        theme: {
                          ...collection.formMetadata.theme,
                          layout: {
                            ...collection.formMetadata.theme.layout,
                            colorPalette:
                              themeMapper[
                                collection.formMetadata.theme.selectedLayout
                              ][theme],
                          },
                          selectedTheme: theme,
                        },
                      },
                    };
                    console.log({ update: update.formMetadata.theme });
                    updateCollection(update);
                    updateFormCollection(collection.id, update);
                  }}
                  cursor="pointer"
                >
                  <Tag
                    tone={
                      collection.formMetadata.theme.selectedTheme === theme
                        ? "accent"
                        : undefined
                    }
                    hover
                  >
                    {theme}
                  </Tag>
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack>
            <Box color="inherit" width="1/3">
              <Popover
                isOpen={openColorPicker}
                setIsOpen={(isOpen) => {
                  setOpenColorPicker(isOpen);
                }}
                butttonComponent={<Box></Box>}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto", transition: { duration: 0.2 } }}
                  exit={{ height: 0 }}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <Box backgroundColor="background" padding="2">
                    <ColorPicker
                      // hideInputs={true}
                      // hideControls={true}
                      hidePresets={true}
                      hideColorTypeBtns={activeColor !== "primaryBg"}
                      hideAdvancedSliders={true}
                      hideColorGuide={true}
                      hideInputType={true}
                      value={colorPickerColor}
                      hideOpacity={true}
                      onChange={(color: string) => {
                        console.log({ color });
                        setColorPickerColor(color);
                        // return;

                        // color comes as rgba(0,0,0,1)
                        const [r, g, b] = color.slice(5, -1).split(",");
                        console.log({ r, g, b });
                        let selectedColor = `${r},${g},${b}`;
                        if (activeColor === "primaryBg") {
                          selectedColor = color;
                        }
                        console.log({ selectedColor, activeColor });
                        const update = {
                          ...collection,
                          formMetadata: {
                            ...collection.formMetadata,
                            theme: {
                              ...collection.formMetadata.theme,
                              layout: {
                                ...collection.formMetadata.theme.layout,
                                colorPalette: {
                                  ...collection.formMetadata.theme.layout
                                    .colorPalette,
                                  [activeColor]: selectedColor,
                                },
                              },
                            },
                          },
                        };
                        console.log({ update: update.formMetadata.theme });
                        updateCollection(update);
                        updateFormCollection(collection.id, update);
                      }}
                    />
                  </Box>
                </motion.div>
              </Popover>
            </Box>
            <Text variant="label">Customize</Text>
            <Stack>
              {Object.keys(
                collection.formMetadata.theme.layout.colorPalette
              ).map((color, index) => (
                <Stack direction="horizontal" align="center">
                  <Box width="1/2">
                    <Text>{colorLabelMapper[index] || color} </Text>
                  </Box>
                  <Box
                    key={color}
                    onClick={() => {
                      setColorPickerColor(
                        index === 0
                          ? collection.formMetadata.theme.layout.colorPalette[
                              color as keyof typeof collection.formMetadata.theme.layout.colorPalette
                            ] || "#000000"
                          : `rgb(${
                              collection.formMetadata.theme.layout.colorPalette[
                                color as keyof typeof collection.formMetadata.theme.layout.colorPalette
                              ]
                            })`
                      );
                      setActiveColor(color);
                      setOpenColorPicker(true);
                    }}
                    height="8"
                    width="8"
                    borderRadius="full"
                    borderWidth="0.375"
                    cursor="pointer"
                    style={{
                      background:
                        index === 0
                          ? collection.formMetadata.theme.layout.colorPalette[
                              color as keyof typeof collection.formMetadata.theme.layout.colorPalette
                            ]
                          : `rgb(${
                              collection.formMetadata.theme.layout.colorPalette[
                                color as keyof typeof collection.formMetadata.theme.layout.colorPalette
                              ]
                            })`,
                    }}
                  />
                </Stack>
              ))}
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
