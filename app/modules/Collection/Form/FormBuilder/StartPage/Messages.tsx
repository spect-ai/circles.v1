import { quizValidFieldTypes } from "@/app/modules/Plugins/common/ResponseMatchDistribution";
import { CollectionType } from "@/app/types";
import { WalletOutlined } from "@ant-design/icons";
import { Box, Text } from "degen";

type Props = {
  form: CollectionType;
};

const Messages = ({ form }: Props) => {
  const quizValidFields =
    form?.propertyOrder &&
    form.propertyOrder.filter(
      (propertyName) =>
        form.properties[propertyName].isPartOfFormView &&
        quizValidFieldTypes.includes(form.properties[propertyName].type)
    );
  return (
    <Box display="flex" flexDirection="column" marginTop="4" gap="4">
      {form.formMetadata.formRoleGating &&
        form.formMetadata.formRoleGating.length > 0 && (
          <Text weight="semiBold">⛩️ This form is role gated</Text>
        )}
      {form.formMetadata.poapEventId && (
        <Text weight="semiBold">
          🏅 This form distributes a POAP to responders{" "}
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap} / ${quizValidFields?.length}  or higher`
            : null}
        </Text>
      )}
      {form.formMetadata.mintkudosTokenId && (
        <Text weight="semiBold">
          🎉 This form distributes soulbound tokens to responders{" "}
          {form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos
            ? `who get a score of ${form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForMintkudos} / ${quizValidFields?.length} or higher`
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
      {form.formMetadata.pages.connect && (
        <Box display="flex" flexDirection="row" gap="2">
          <Text weight="semiBold" color="accent">
            <WalletOutlined />
          </Text>{" "}
          <Text weight="semiBold">
            This form requires you to connect your wallet
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Messages;
