import { CollectionType } from "@/app/types";
import WalletOutlined from "@ant-design/icons/WalletOutlined";
import { Box, Text } from "degen";
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
          <Text weight="semiBold">
            ⛩️ This form is role gated using guild.xyz
          </Text>
        )}
      {form.formMetadata.poapEventId && (
        <Text weight="semiBold">
          🏅 This form distributes a POAP to responders{" "}
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap} / ${poapQuizValidFields}  or higher`
            : null}
        </Text>
      )}
      {form.formMetadata.mintkudosTokenId && (
        <Text weight="semiBold">
          🎉 This form distributes soulbound tokens to responders{" "}
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos} / ${kudosQuizValidFields} or higher`
            : null}
        </Text>
      )}
      {form.formMetadata.surveyTokenId && (
        <Text weight="semiBold">
          💰 This form distributes erc20 tokens to responders
        </Text>
      )}
      {form.formMetadata.sybilProtectionEnabled && (
        <Text weight="semiBold">✋ This form is Sybil protected</Text>
      )}
      {form.formMetadata.pages["connect"] && (
        <Box display="flex" flexDirection="row" gap="2">
          <Text weight="semiBold" color="accent">
            <WalletOutlined />
          </Text>{" "}
          <Text weight="semiBold">This form requires you to sign in</Text>
        </Box>
      )}
      {form.formMetadata.pages["connectDiscord"] && (
        <Box display="flex" flexDirection="row" gap="2">
          <Text weight="semiBold" color="accent">
            <BsDiscord />
          </Text>{" "}
          <Text weight="semiBold">
            This form requires you to connect Discord
          </Text>
        </Box>
      )}
    </Box>
  );
}
