import { Button, Group, Input, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";

type Props = {
  onSubmit: (data: any) => void;
  initialValues?: any;
};

export default function SheepLogForm({ initialValues, onSubmit }: Props) {
  const { logDate, logText, id } = initialValues || {};
  const form = useForm({
    initialValues: initialValues
      ? { logDate, logText, id }
      : {
          logDate: dayjs().toISOString(),
          logText: "",
        },

    validate: {
      logDate: (
        value: string | number | dayjs.Dayjs | Date | null | undefined
      ) => {
        if (!dayjs(value).isValid()) {
          return "Bitte Datum angeben";
        }
      },
      logText: (value: any) => {
        if (!value) {
          return "Bitte Text angeben";
        }
      },
    },
  });
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Stack spacing="xs">
          <Text>Datum</Text>
          <Input
            size="lg"
            style={{ display: "flex" }}
            icon={<IconCalendar />}
            type="datetime-local"
            value={dayjs(form.values.logDate).format("YYYY-MM-DDTHH:mm")}
            onChange={(event) => {
              form.setFieldValue("logDate", event.currentTarget.value);
            }}
            name="logDate"
          />
        </Stack>
        <Textarea
          placeholder="..."
          label="Logbuch Eintrag"
          minRows={12}
          {...form.getInputProps("logText")}
        />
      </Stack>
      <Group mt={"md"}>
        <Button fullWidth type="submit">
          Speichern
        </Button>
      </Group>
    </form>
  );
}
