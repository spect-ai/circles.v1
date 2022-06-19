import { GitHub } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';
import { Box, Button, Heading, Stack, Text } from 'degen';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import getTheme from '../../../../constants/muiTheme';
import { useDataContext } from '../../../../context/dataContext';
import useMoralisFunction from '../../../../hooks/useMoralisFunction';
import { BoardData, Channel } from '../../../../types';
import CommonAutocomplete from '../../autoComplete';
import ConnectDiscord from '../../connectDiscord';

export default function Integrations() {
  const { space, setSpace } = useDataContext();
  const [discussionChannel, setDiscussionChannel] = useState<Channel>(
    {} as Channel
  );
  const [serverChannels, setServerChannels] = useState<Channel[]>([]);
  const { runMoralisFunction } = useMoralisFunction();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log({ space });
    if (space.team && space.team[0].guildId) {
      runMoralisFunction('getGuildChannels', {
        guildId: space.team[0].guildId,
      }).then((res) => {
        console.log({ res });
        if (res.guildChannels) {
          setServerChannels(res.guildChannels);
        }
      });
      setDiscussionChannel(space.discussionChannel);
    }
  }, [space]);

  return (
    <Stack>
      <Heading>Github</Heading>
      <Text>Connect github to link PR to cards</Text>
      <a
        href={`https://github.com/apps/spect-github-bot/installations/new?state=${space.objectId}`}
        target="_blank"
        rel="noreferrer"
        style={{
          textDecoration: 'none',
        }}
      >
        <Button as="a" size="small" variant="secondary">
          {space.githubRepos?.length > 0
            ? 'Github Connected'
            : 'Connect Github'}
        </Button>
      </a>
      {space.team && !space.team[0].guildId ? (
        <Stack>
          <Heading>Discord</Heading>
          <Text>
            Connect discord to role gate space and receive updates on your
            server
          </Text>
          <ConnectDiscord entity="space" />
        </Stack>
      ) : (
        <Box>
          <Text>
            Assign a channel in your discord server where tasks can be discussed
          </Text>
          <ThemeProvider theme={createTheme(getTheme(0))}>
            <CommonAutocomplete
              options={serverChannels}
              optionLabels={(option: any) => `#${option.name}`}
              currOption={discussionChannel}
              setCurrOption={setDiscussionChannel}
              closeOnSelect={false}
              sx={{ mt: 2 }}
              placeholder="Search for channels"
            />
            <Box marginTop="4">
              <Button
                size="small"
                variant="secondary"
                disabled={!discussionChannel}
                loading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  runMoralisFunction('updateBoard', {
                    boardId: space.objectId,
                    discussionChannel,
                  }).then((res: any) => {
                    setSpace(res as BoardData);
                    setIsLoading(false);
                    toast('Saved', {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      theme: 'dark',
                    });
                  });
                }}
              >
                Save
              </Button>
            </Box>
          </ThemeProvider>
        </Box>
      )}
    </Stack>
  );
}
