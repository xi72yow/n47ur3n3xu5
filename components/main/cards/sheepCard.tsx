import { useConfirm } from "@/components/hooks/confirm";
import dayjs from "dayjs";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { LegacyRef } from "react";

type Props = { data: any; deleteLog: any };

const SheepCard = React.forwardRef(({ data, deleteLog }: Props, ref) => {
  const confirm = useConfirm();
  const todoContent = (
    <Card withBorder>
      <Group position="apart">
        <Text size={"lg"} weight={600}>
          {dayjs(data.logDate).format("DD.MM.YYYY")}
        </Text>
        <Group>
          <ActionIcon variant="subtle" color="primary">
            <IconEdit size={25} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="primary"
            onClick={() => {
              confirm
                .showConfirmation(
                  `Den Log vom ${dayjs(data.logDate).format(
                    "DD.MM.YYYY"
                  )} wirklich löschen?`,
                  true
                )
                .then((confirmed) => {
                  if (!confirmed) return;
                  deleteLog(data.id);
                });
            }}
          >
            <IconTrash size={25} />
          </ActionIcon>
        </Group>
      </Group>
      <Text size={"lg"} weight={400}>
        {data.logText}
      </Text>
    </Card>
  );

  const content = ref ? (
    <article
      className="article"
      ref={ref as LegacyRef<HTMLElement> | undefined}
    >
      {todoContent}
    </article>
  ) : (
    <article className="article">{todoContent}</article>
  );
  return content;
});

SheepCard.displayName = "SheepCard";

export default SheepCard;
