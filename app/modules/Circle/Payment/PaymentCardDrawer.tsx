// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Drawer from "@/app/common/components/Drawer";
// import Editor from "@/app/common/components/Editor";
// import PrimaryButton from "@/app/common/components/PrimaryButton";
// import { reorder } from "@/app/common/utils/utils";
// import {
//   addCollectionData,
//   updateCollectionDataGuarded,
//   updateFormCollection,
// } from "@/app/services/Collection";
// import { MemberDetails, Option } from "@/app/types";
// import {
//   Box,
//   Button,
//   IconChevronRight,
//   IconDotsVertical,
//   IconPlusSmall,
//   Stack,
//   Text,
//   useTheme,
// } from "degen";
// import { AnimatePresence, motion } from "framer-motion";
// import { useRouter } from "next/router";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   DragDropContext,
//   Draggable,
//   DraggableProvided,
//   DraggableStateSnapshot,
//   Droppable,
//   DroppableProvided,
//   DropResult,
// } from "react-beautiful-dnd";
// import ReactDOM from "react-dom";
// import { Save } from "react-feather";
// import { useQuery } from "react-query";
// import { toast } from "react-toastify";
// import styled from "styled-components";
// import AddField from "../../Collection/AddField";
// import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

// type Props = {
//   handleClose: () => void;
//   defaultValue?: any;
// };

// export default function PaymentCardDrawer({ handleClose, defaultValue }: Props) {
//   const { mode } = useTheme();
//   const { localCollection: collection, updateCollection } =
//     useLocalCollection();

//   const [value, setValue] = useState<any>(defaultValue || {});

//   const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);

//   const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);
//   const [loading, setLoading] = useState(false);
//   const { push, pathname, query } = useRouter();
//   const { cardSlug, newCard, circle: cId } = query;

//   const { data: memberDetails } = useQuery<MemberDetails>(
//     ["memberDetails", cId],
//     {
//       enabled: false,
//     }
//   );

//   const PropertyDraggable = ({
//     provided,
//     snapshot,
//     property,
//     value,
//   }: {
//     provided: DraggableProvided;
//     snapshot: DraggableStateSnapshot;
//     property: string;
//     value: any;
//   }) => {
//     const [hover, setHover] = useState(false);
//     const usePortal = snapshot.isDragging;
//     const child = (
//       <Box
//         key={property}
//         marginY="1"
//         ref={provided.innerRef}
//         {...provided.draggableProps}
//         onMouseOver={() => setHover(true)}
//         onMouseLeave={() => setHover(false)}
//       >
//         <Stack direction="horizontal" align="center" space="0">
//           <Box
//             style={{
//               marginLeft: "-1rem",
//             }}
//             marginTop="1"
//             {...provided.dragHandleProps}
//             display={snapshot.isDragging ? "none" : hover ? "block" : "none"}
//           >
//             <Text variant="label">
//               <IconDotsVertical size="4" />
//             </Text>
//           </Box>
//           <EditProperty propertyName={property} />
//           <EditValue
//             propertyName={property}
//             value={value[property]}
//             setValue={(val) => {
//               setValue({ ...value, [property]: val });
//               void onChange({ [property]: val }, value.slug);
//             }}
//             dataId={value.slug}
//           />
//         </Stack>
//       </Box>
//     );

//     return usePortal ? ReactDOM.createPortal(child, document.body) : child;
//   };

//   const PropertyDraggableCallback = useCallback(PropertyDraggable, []);

//   const PropertyList = (provided: DroppableProvided) => (
//     <Box ref={provided.innerRef} {...provided.droppableProps}>
//       {propertyOrder.map((property, index) => {
//         if (property !== "Title" && property !== "Description") {
//           return (
//             <Draggable key={property} draggableId={property} index={index}>
//               {(provided, snapshot) => {
//                 return (
//                   <PropertyDraggableCallback
//                     provided={provided}
//                     property={property}
//                     snapshot={snapshot}
//                     value={value}
//                   />
//                 );
//               }}
//             </Draggable>
//           );
//         }
//       })}
//       {provided.placeholder}
//     </Box>
//   );

//   const ProperyListCallback = useCallback(PropertyList, [
//     PropertyDraggableCallback,
//     propertyOrder,
//     value,
//   ]);

//   return (
//     <Box>
//       <Drawer
//         width="50%"
//         handleClose={() => {
//           handleClose();
//         }}
//         header={
//           <Box marginLeft="-4">
//             <Stack
//               direction="horizontal"
//               align="center"
//               justify="space-between"
//             >
//               <Button
//                 shape="circle"
//                 size="small"
//                 variant="transparent"
//                 onClick={() => {
//                   closeCard();
//                 }}
//               >
//                 <Stack direction="horizontal" align="center" space="0">
//                   <IconChevronRight />
//                   <Box marginLeft="-4">
//                     <IconChevronRight />
//                   </Box>
//                 </Stack>
//               </Button>
//               <Box width="56">
//                 {newCard && (
//                   <PrimaryButton
//                     loading={loading}
//                     icon={<Save size="22" />}
//                     disabled={Object.keys(value).length === 0}
//                     onClick={async () => {
//                       setLoading(true);
//                       const res = await addCollectionData(collection.id, value);
//                       setLoading(false);
//                       if (res.id) {
//                         updateCollection(res);
//                         closeCard();
//                       } else toast.error("Error adding card");
//                     }}
//                   >
//                     Create Card
//                   </PrimaryButton>
//                 )}
//               </Box>
//             </Stack>
//           </Box>
//         }
//       >
//         <AnimatePresence>
//           {isAddFieldOpen && (
//             <AddField handleClose={() => setIsAddFieldOpen(false)} />
//           )}
//         </AnimatePresence>
//         {(value.slug || newCard) && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <Container paddingX="8" paddingY="4" overflow="auto">
//               <Stack space="1">
//                 <Stack
//                   direction="horizontal"
//                   justify="space-between"
//                   align="center"
//                 >
//                   <NameInput
//                     mode={mode}
//                     placeholder="Untitled"
//                     value={value.Title}
//                     onChange={(e) => {
//                       setIsDirty(true);
//                       setValue({ ...value, Title: e.target.value });
//                     }}
//                   />
//                   <CardOptions
//                     handleDrawerClose={closeCard}
//                     cardSlug={value.slug}
//                   />
//                 </Stack>
//                 <DragDropContext onDragEnd={handleDragEnd}>
//                   <Droppable droppableId="droppable" type="PROPERTY">
//                     {ProperyListCallback}
//                   </Droppable>
//                 </DragDropContext>
//                 <Box
//                   width={{
//                     xs: "full",
//                     md: "1/4",
//                   }}
//                 >
//                   <PrimaryButton
//                     variant="tertiary"
//                     icon={<IconPlusSmall />}
//                     onClick={() => setIsAddFieldOpen(true)}
//                   >
//                     Add Field
//                   </PrimaryButton>
//                 </Box>
//                 <Box padding="2" borderBottomWidth="0.375" marginTop="4">
//                   <Editor
//                     placeholder="Describe your card here...."
//                     value={value.Description}
//                     onSave={(val) => {
//                       void onChange({ Description: val }, value.slug);
//                     }}
//                     onChange={(val) => {
//                       setIsDirty(true);
//                       setValue({ ...value, Description: val });
//                     }}
//                     isDirty={isDirty}
//                     setIsDirty={setIsDirty}
//                   />
//                 </Box>
//                 {!newCard && (
//                   <CardActivity
//                     activities={collection.dataActivities[value.slug]}
//                     activityOrder={collection.dataActivityOrder[value.slug]}
//                     dataId={value.slug}
//                     collectionId={collection.id}
//                     dataOwner={
//                       collection.profiles[collection.dataOwner[value.slug]]
//                     }
//                     getMemberDetails={getMemberDetails}
//                   />
//                 )}
//               </Stack>
//             </Container>
//           </motion.div>
//         )}
//       </Drawer>
//     </Box>
//   );
// }

// const NameInput = styled.input<{ mode: string }>`
//   width: 100%;
//   background: transparent;
//   padding: 8px;
//   border: 0;
//   border-style: none;
//   border-color: transparent;
//   outline: none;
//   outline-offset: 0;
//   box-shadow: none;
//   font-size: 1.9rem;
//   caret-color: rgb(191, 90, 242);
//   color: rgb(191, 90, 242);
//   font-weight: 700;
//   ::placeholder {
//     color: ${(props) =>
//       props.mode === "dark"
//         ? "rgb(255, 255, 255, 0.1)"
//         : "rgb(20, 20, 20, 0.5)"};
//   }
//   letter-spacing: 0.05rem;
// `;

// const Container = styled(Box)`
//   ::-webkit-scrollbar {
//     display: none;
//   }
//   -ms-overflow-style: none;
//   scrollbar-width: none;

//   height: calc(100vh - 4rem);
// `;
