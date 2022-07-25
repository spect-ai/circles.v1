import { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import {
  Box,
  IconArrowRight,
  IconChevronRight,
  Input,
  Stack,
  Text,
} from "degen";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  handleClose: () => void;
};

type RetroForm = {
  title: string;
  description: string;
  strategy: OptionType;
  // startTime: string;
  duration: number;
};

export default function CreateRetroModal({ handleClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RetroForm>({
    defaultValues: {
      strategy: {
        label: "Normal Voting",
        value: "Normal Voting",
      },
    },
  });
  const onSubmit: SubmitHandler<RetroForm> = (data) => console.log({ data });

  return (
    <Modal title="Start Retro" handleClose={handleClose}>
      <Box padding="8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Input
              label="Title"
              placeholder="Sprint Retro Period"
              {...register("title")}
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
            />

            <PrimaryButton type="submit" icon={<IconArrowRight />}>
              Continue
            </PrimaryButton>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
