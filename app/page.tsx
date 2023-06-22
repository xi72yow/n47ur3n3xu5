"use client";

import { AppContextProvider } from "@/components/contexts/appContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./app";

export default function Home() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppContextProvider>
        <Notifications position="top-center" />
        <App></App>
      </AppContextProvider>
    </MantineProvider>
  );
}
