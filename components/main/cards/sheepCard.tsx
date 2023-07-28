import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { LegacyRef } from "react";

type Props = { data: any };

const SheepCard = React.forwardRef(({ data }: Props, ref) => {
  const todoContent = (
    <Card withBorder>
      <Group position="apart">
        <Text size={"lg"} weight={600}>
          {data.logDate}
        </Text>
        <Group>
          <ActionIcon variant="subtle" color="primary">
            <IconEdit size="xl" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="primary">
            <IconTrash size="xl" />
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
