import loginPocketBase, { loginViaCookie } from "@/helpers/pocketbase";
import {
  Anchor,
  Button,
  Container,
  Group,
  MediaQuery,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React from "react";
import { AppContext } from "../contexts/appContext";
import { IconEyeOff, IconEyeCheck } from "@tabler/icons-react";

export function AuthenticationForm(props: PaperProps) {
  const { setAuthData } = React.useContext(AppContext);

  React.useEffect(() => {
    loginViaCookie().then((auth: any) => {
      if (auth) {
        setAuthData(auth);
        notifications.show({
          title: `Willkommen zurück, ${auth.record.username}!`,
          color: "green",
          message: "Du wurdest automatisch eingeloggt.",
        });
      }
    });
  }, [setAuthData]);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Container size={420} my={40}>
      <Stack mb="xl">
        <Text size={30} weight={600} mb={5}>
          Willkommen zurück!
        </Text>

        <form
          onSubmit={form.onSubmit((values) => {
            loginPocketBase({
              ...values,
            })
              .then((auth) => {
                if (auth) {
                  setAuthData(auth);
                }
              })
              .catch((err) => {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message: JSON.stringify(err),
                });
              });
          })}
        >
          <Stack>
            <TextInput
              size="xl"
              label="Benutzername"
              placeholder="Syndrome2570"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              radius="md"
            />

            <PasswordInput
              required
              size="xl"
              visibilityToggleIcon={({ reveal, size }) =>
                reveal ? (
                  <IconEyeOff color="#03292c" size={size} />
                ) : (
                  <IconEyeCheck color="#03292c" size={size} />
                )
              }
              label="Passwort"
              placeholder="$a3crB6hS2&PkDoXAu"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Group position="center" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => {}}
              size="xs"
            >
              Sie haben noch kein Konto? Kontaktieren Sie mich.
            </Anchor>
          </Group>
          <Group position="right" mt="xl">
            <Button size="xl" type="submit" radius="xl">
              Anmelden
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
