import React from "react";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import SheepCard from "./cards/sheepCard";
import { Group, SimpleGrid } from "@mantine/core";

type Props = {};

export default function CardList({}: Props) {
  const { ref, inView } = useInView();
  const LIMIT = 10;

  const fetchTodos = async (page: any) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`
    );
    return response.json();
  };
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("todos", ({ pageParam = 1 }) => fetchTodos(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.map((todo: { id: any }, i: number) => {
        if (page.length === i + 1) {
          return <SheepCard ref={ref} key={todo.id} data={todo} />;
        }
        return <SheepCard key={todo.id} data={todo} />;
      })
    );

  return (
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
  );
}
