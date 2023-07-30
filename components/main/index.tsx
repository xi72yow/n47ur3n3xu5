import React from "react";
import { useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useInView } from "react-intersection-observer";
import SheepCard from "./cards/sheepCard";
import { Button, Group, SimpleGrid, Text } from "@mantine/core";
import { pb } from "@/helpers/pocketbase";
import { modals } from "@mantine/modals";
import SheepLogForm from "../forms/sheepLogForm";
import { notifications } from "@mantine/notifications";

type Props = {};

export default function CardList({}: Props) {
  const { ref, inView } = useInView();

  const fetchData = async (page: any) => {
    const data = await pb
      .collection("sheep_log")
      //sort by date newest first
      .getList(page, 10, { sort: "-logDate" });

    return data;
  };

  const queryClient = useQueryClient();

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("sheep_log", ({ pageParam = 1 }) => fetchData(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.page < lastPage.totalPages ? allPages.length + 1 : false;
        return nextPage;
      },
    });

  const addLog = useMutation(
    async (formData: any) => {
      const data = await pb.collection("sheep_log").create(formData);
      return data;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData("sheep_log", (oldData: any) => {
          const newData = oldData.pages.map((page: any) => {
            if (page.page === 1) {
              const newItems = [{ ...variables, id: data.id }, ...page.items];
              return { ...page, items: newItems };
            }
            return page;
          });
          return { ...oldData, pages: newData };
        });
      },
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.items.map((pageData: any) => {
        if (
          pageData.id ===
          data.pages[data.pages.length - 1].items[
            data.pages[data.pages.length - 1].items.length - 1
          ].id
        ) {
          return <SheepCard ref={ref} key={pageData.id} data={pageData} />;
        }
        return <SheepCard key={pageData.id} data={pageData} />;
      })
    );

  return (
    <>
      <SimpleGrid
        m={"lg"}
        cols={1}
        breakpoints={[
          { maxWidth: 900, cols: 1 },
          { maxWidth: 1200, cols: 2 },
          { maxWidth: 1500, cols: 3 },
          { maxWidth: 2000, cols: 4 },
        ]}
      >
        {content}
        {isFetchingNextPage && <h3>Loading...</h3>}
      </SimpleGrid>
      <Button
        style={{ position: "fixed", bottom: "40px", right: "40px" }}
        size="lg"
        onClick={() => {
          modals.open({
            title: (
              <Text weight={600} size="lg">
                Neuer Eintrag
              </Text>
            ),
            closeButtonProps: {
              "aria-label": "close modal",
              color: "primary",
              size: "xl",
            },
            children: (
              <SheepLogForm
                onSubmit={(values) => {
                  addLog.mutateAsync(values).catch((error) => {
                    notifications.show({
                      title: "Fehler",
                      message: error.message,
                      color: "red",
                      autoClose: 5000,
                    });
                  });
                  modals.closeAll();
                }}
              />
            ),
          });
        }}
      >
        + Neuer Eintrag
      </Button>
    </>
  );
}
