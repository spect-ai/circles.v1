import { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { Box, IconArrowRight, Input, Stack, Text } from "degen";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Props = {
  setStep: (step: number) => void;
  setDetails: (details: RetroForm) => void;
  details?: RetroForm;
};

export type RetroForm = {
  title: string;
  description: string;
  strategy: OptionType;
  // startTime: string;
  duration: number;
};

export const slideIn = {
  hidden: { x: -400, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
};

export default function RetroDetails({ setStep, setDetails, details }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RetroForm>({
    defaultValues: details,
  });
  const onSubmit: SubmitHandler<RetroForm> = (data) => {
    console.log({ data });
    if (!data.title || !data.description || !data.strategy || !data.duration) {
      toast.error("Please fill out all fields");
      return;
    }
    setStep(1);
    setDetails(data);
    console.log({ errors });
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexDirection="column"
          style={{
            height: "31rem",
          }}
        >
          <Stack>
            <Text variant="label">Details</Text>
            <Input
              label="Title"
              placeholder="Sprint Retro Period"
              {...register("title")}
              // error={errors.title}
            />
            <Input
              label="Description"
              placeholder="Retro period for recognizing efforts made during the sprint"
              {...register("description")}
            />
            <Box marginLeft="4">
              <Text weight="semiBold">Strategy</Text>
            </Box>
            <Controller
              name="strategy"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    {
                      label: "Normal Voting",
                      value: "Normal Voting",
                    },
                    {
                      label: "Quadratic Voting",
                      value: "Quadratic Voting",
                    },
                  ]}
                  {...field}
                />
              )}
            />
            <Input
              label="Duration"
              placeholder="7"
              {...register("duration")}
              type="number"
              units="days"
              error={errors.duration}
            />
          </Stack>
          <Box flexGrow={1} />
          <Box marginTop="8">
            <Stack direction="horizontal">
              <Box width="full" />

              <Box width="full">
                <PrimaryButton suffix={<IconArrowRight />} type="submit">
                  Continue
                </PrimaryButton>
              </Box>
            </Stack>
          </Box>
        </Box>
      </form>
    </motion.div>
  );
}
