import React from "react";
import { useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useInView } from "react-intersection-observer";
import SheepCard from "./cards/sheepCard";
import { Button, Group, SimpleGrid } from "@mantine/core";
import { pb } from "@/helpers/pocketbase";

type Props = {};

export default function CardList({}: Props) {
  const { ref, inView } = useInView();
  const FETCH_LIMIT = 3;

  const fetchData = async (page: any) => {
    const data = await pb
      .collection("sheep_log")
      //sort by date newest first
      .getList(page, 3, { sort: "-logDate" });

    return data;
  };

  const queryClient = useQueryClient();

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("sheep_log", ({ pageParam = 1 }) => fetchData(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.totalItems > allPages.length * FETCH_LIMIT
            ? allPages.length + 1
            : undefined;
        return nextPage;
      },
    });

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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.items.map((data: any) => {
        if (data.id === page.items[page.items.length - 1].id) {
          return (
            <SheepCard
              ref={ref}
              key={data.id}
              data={data}
              deleteLog={deleteLog.mutateAsync}
            />
          );
        }
        return (
          <SheepCard
            key={data.id}
            data={data}
            deleteLog={deleteLog.mutateAsync}
          />
        );
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
        size="xl"
        onClick={() => {
          addLog.mutateAsync({
            logDate: new Date(),
            logText: "test",
          });
        }}
      >
        + Neuer Eintrag
      </Button>
    </>
  );
}
