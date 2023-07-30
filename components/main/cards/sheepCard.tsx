import { useConfirm } from "@/components/hooks/confirm";
import dayjs from "dayjs";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { LegacyRef } from "react";
import { pb } from "@/helpers/pocketbase";
import { useMutation, useQueryClient } from "react-query";
import { modals } from "@mantine/modals";
import SheepLogForm from "@/components/forms/sheepLogForm";
import { notifications } from "@mantine/notifications";

type Props = { data: any };

const SheepCard = React.forwardRef(({ data }: Props, ref) => {
  const confirm = useConfirm();

  const queryClient = useQueryClient();

  const updateLog = useMutation(
    async (formData: any) => {
      const { id, ...rest } = formData;
      const data = await pb.collection("sheep_log").update(id, rest);
      return data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData("sheep_log", (oldData: any) => {
          const newData = oldData.pages.map((page: any) => {
            const newItems = page.items.map((item: any) => {
              if (item.id === variables.id) {
                return { ...item, ...variables };
              }
              return item;
            });
            return { ...page, items: newItems };
          });
          return { ...oldData, pages: newData };
        });
      },
    }
  );

  const deleteLog = useMutation(
    async (id: string) => {
      const data = await pb.collection("sheep_log").delete(id);
      return data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData("sheep_log", (oldData: any) => {
          const newData = oldData.pages.map((page: any) => {
            const newItems = page.items.filter(
              (item: any) => item.id !== variables
            );
            return { ...page, items: newItems };
          });
          return { ...oldData, pages: newData };
        });
      },
    }
  );

  const todoContent = (
    <Card withBorder>
      <Group position="apart">
        <Text size={"lg"} weight={600}>
          {dayjs(data.logDate).format("DD.MM.YYYY")}
        </Text>
        <Group>
          <ActionIcon
            variant="subtle"
            color="primary"
            onClick={() => {
              modals.open({
                title: (
                  <Text weight={600} size="lg">
                    Log bearbeiten
                  </Text>
                ),
                closeButtonProps: {
                  "aria-label": "close modal",
                  color: "primary",
                  size: "xl",
                },
                size: "xl",
                children: (
                  <>
                    <SheepLogForm
                      onSubmit={(values) => {
                        updateLog.mutateAsync(values).catch((error) => {
                          notifications.show({
                            title: "Fehler",
                            message: error.message,
                            color: "red",
                            autoClose: 5000,
                          });
                        });
                        modals.closeAll();
                      }}
                      initialValues={data}
                    />
                  </>
                ),
              });
            }}
          >
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
                  deleteLog.mutateAsync(data.id);
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
