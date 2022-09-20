import { Task } from "gantt-task-react/dist/types/public-types";

import { Box, Text, Button, useTheme } from "degen";
import styled from "styled-components";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 18rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  }
`;

const CardText = styled.div<{ mode: string }>`
  padding: 0.78rem 0rem;
  align-items: none;
  background-color: ${({ mode }) =>
    mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
`;

export default function TaskBar({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { mode } = useTheme();
  return (
    <Container>
      <CardText mode={mode}>
        <Text variant="base" weight="semiBold" align="center">
          Name
        </Text>
      </CardText>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {tasks?.map((task) => {
          return (
            <Box key={task?.id} width="60" style={{ margin: "0.32rem 0rem" }}>
              <Button
                size="small"
                width="full"
                variant="transparent"
                onClick={() => {
                  void router.push(`/${cId}/${pId}/${task.project}`);
                }}
              >
                <Text
                  variant="base"
                  weight="semiBold"
                  color="textSecondary"
                  ellipsis
                >
                  {task?.name}
                </Text>
              </Button>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
