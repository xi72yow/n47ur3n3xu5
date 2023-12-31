"use client";

import { AppContextProvider } from "@/components/contexts/appContext";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./app";
import ConfirmationContextProvider from "@/components/hooks/confirm";
import { DatesProvider } from "@mantine/dates";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryShade: 0,
        colors: {
          red: [
            "#c92a2a",
            "#b52424",
            "#a11f1f",
            "#8d1a1a",
            "#781515",
            "#641010",
            "#4f0b0b",
            "#3b0606",
            "#260101",
          ],

          "Pink-lavender": [
            "#d1b1c8",
            "#bc9fb4",
            "#927c8c",
            "#a78ea0",
            "#7d6a78",
            "#695964",
            "#544750",
            "#3f353c",
            "#2a2328",
          ],
          Peach: [
            "#fee8b0",
            "#feeab8",
            "#feedc0",
            "#feefc8",
            "#fef1d0",
            "#fff4d8",
            "#fff6e0",
            "#fff8e8",
            "#fffaf0",
          ],
          "Robin-egg-blue": [
            "#0bc9cd",
            "#0ab5b9",
            "#09a1a4",
            "#088d90",
            "#07797c",
            "#066568",
            "#055154",
            "#043d40",
            "#03292c",
          ],
          "Ultra-Violet": [
            "#5c5d8d",
            "#4c4d7d",
            "#3c3d6d",
            "#2c2d5d",
            "#1c1d4",
            "0c0d3d",
            "#0c0d2d",
            "#0c0d1d",
            "#0c0d0d",
          ],
          "Reseda-green": [
            "#7c9070",
            "#6c8060",
            "#5c7050",
            "#4c6040",
            "#3c5030",
            "#2c4020",
            "#1c3010",
            "#0c2000",
            "#0c1c00",
          ],
        },
        primaryColor: "Reseda-green",
      }}
    >
      <AppContextProvider>
        <DatesProvider
          settings={{ locale: "de", firstDayOfWeek: 0, weekendDays: [0] }}
        >
          <ConfirmationContextProvider>
            <Notifications position="top-center" />
            <QueryClientProvider client={queryClient}>
              <ModalsProvider>
                <App></App>
              </ModalsProvider>
            </QueryClientProvider>
          </ConfirmationContextProvider>
        </DatesProvider>
      </AppContextProvider>
    </MantineProvider>
  );
}
