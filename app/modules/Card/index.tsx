import { Box, Heading } from "degen";
import React from "react";

export default function Card() {
  return (
    <Box padding="8">
      {/* <ToastContainer />
      <Loader loading={loading} text="" />
      <Box padding="8" display="flex">
        <Container
          borderRightWidth="0.375"
          height="full"
          style={{ width: "75%" }}
        >
          <Stack direction="vertical">
            <NameInput
              placeholder="Enter card name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Stack direction="horizontal" wrap>
              <TagModal
                name={cardType}
                type="card"
                label="Change"
                selectedOption="Task"
              />
              <TagModal
                name={space.columns && space.columns[columnId as string]?.title}
                type="column"
                label="Change"
                selectedOption={columnId as string}
              />
              <TagModal
                name={
                  assignees
                    ? space.memberDetails &&
                      space.memberDetails[assignees]?.username
                    : "Assignee"
                }
                type="assignee"
                label={assignees ? "Change" : "Add"}
              />
              <TagModal
                name={new Date(date).toDateString() || "Deadline"}
                type="deadline"
                label="Add"
              />
              <TagModal
                name={value ? `${value} ${token.symbol}` : "Reward"}
                type="reward"
                label={value ? "Change" : "Add"}
              />
            </Stack>
            <Stack direction="horizontal">
              <TagModal name="Labels" type="labels" tone="accent" label="Add" />
              {labels.map((label) => (
                <TagModal name={label} type="labels" tone="accent" />
              ))}
            </Stack>
            <Button
              size="small"
              prefix={<IconPlusSmall />}
              variant="tertiary"
              center
              width="1/4"
              onClick={() => {
                setSubTasks([...subTasks, { title: "", assignee: "" }]);
              }}
            >
              Add Subtasks
            </Button>
            <Accordian
              name={`Sub Tasks (${subTasks.length})`}
              defaultOpen={false}
            >
              <Stack>
                {subTasks?.map((subTask, index) => (
                  <EditableSubTask subTaskIndex={index} key={index} />
                ))}
              </Stack>
            </Accordian>
            <Box style={{ minHeight: "10rem" }} marginRight="4" paddingLeft="4">
              {!loading && (
                <TextEditor
                  value={description}
                  onChange={(txt) => {
                    setDescription(txt);
                  }}
                />
              )}
            </Box>
            <Tabs
              tabs={["Submissions", "Comments", "Activity"]}
              selectedTab={selectedTab}
              onTabClick={handleTabClick}
              orientatation="horizontal"
              unselectedColor="transparent"
            />
            {selectedTab === 0 && !loading && (
              <TextEditor
                value={submission}
                onChange={(txt) => {
                  setSubmission(txt);
                }}
              />
            )}
            {selectedTab === 1 && (
              <Box style={{ width: "50%" }}>
                <Textarea label="comment" />
              </Box>
            )}
            {selectedTab === 2 && <Text>0xavp created this card</Text>}
          </Stack>
        </Container>
        <Box style={{ width: "25%" }}>
          <Stack direction="vertical">
            <Box style={{ width: "100%" }} paddingX="4">
              <Stack>
                <Stack>
                  <Button
                    center
                    prefix={<IconCheck />}
                    width="full"
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      onSave(tid as string);
                    }}
                  >
                    <Text>Save!</Text>
                  </Button>
                </Stack>
                <Stack>
                  <Button
                    center
                    prefix={<IconClose />}
                    width="full"
                    size="small"
                    variant="secondary"
                    tone="red"
                  >
                    <Text>Close Task</Text>
                  </Button>
                </Stack>
                <DiscordThread />
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box> */}
    </Box>
  );
}
