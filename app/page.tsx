"use client";

import { AuthenticationForm } from "@/components/forms/loginForm";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function Home() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <AuthenticationForm></AuthenticationForm>
    </MantineProvider>
  );
}
