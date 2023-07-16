import { CollectionType } from "@/app/types";
import WalletOutlined from "@ant-design/icons/WalletOutlined";
import { Text } from "@avp1598/vibes";
import { Box, Stack } from "degen";
import { BsDiscord } from "react-icons/bs";

type Props = {
  form: CollectionType;
};

export default function Messages({ form }: Props) {
  const kudosQuizValidFields = Object.keys(
    form.formMetadata.responseDataForMintkudos || {}
  ).length;
  const poapQuizValidFields = Object.keys(
    form.formMetadata.responseDataForPoap || {}
  ).length;
  return (
    <Box display="flex" flexDirection="column" marginTop="4" gap="4">
      {form.formMetadata.formRoleGating &&
        form.formMetadata.formRoleGating.length > 0 && (
          <Text>⛩️ This form is role gated using guild.xyz</Text>
        )}
      {form.formMetadata.poapEventId && (
        <Text>
          🏅 This form distributes a POAP to responders
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap} / ${poapQuizValidFields}  or higher`
            : null}
        </Text>
      )}
      {form.formMetadata.mintkudosTokenId && (
        <Text>
          🎉 This form distributes soulbound tokens to responders
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos} / ${kudosQuizValidFields} or higher`
            : null}
        </Text>
      )}
      {form.formMetadata.surveyTokenId && (
        <Text>💰 This form distributes erc20 tokens to responders</Text>
      )}
      {form.formMetadata.zealyXP && (
        <Text>😎 This form distributes XP on Zealy to responders</Text>
      )}
      {form.formMetadata.sybilProtectionEnabled && (
        <Text>✋ This form is Sybil protected</Text>
      )}
      {form.formMetadata.pages["connect"] && (
        <Stack direction="horizontal" align="center" space="2">
          <Text color="secondary">
            <WalletOutlined />
          </Text>
          <Text>This form requires you to sign in</Text>
        </Stack>
      )}
      {form.formMetadata.pages["connectDiscord"] && (
        <Box display="flex" flexDirection="row" gap="2">
          <Text color="secondary">
            <BsDiscord />
          </Text>
          <Text>This form requires you to connect Discord</Text>
        </Box>
      )}
    </Box>
  );
}
