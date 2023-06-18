import loginPocketBase from "@/helpers/pocketbase";
import {
  Anchor,
  Button,
  Container,
  Group,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
export function AuthenticationForm(props: PaperProps) {
  const router = useRouter();
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
      <Text size="lg" weight={500}>
        Willkommen zurück!
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          loginPocketBase({
            ...values,
          })
            .then((auth) => {
              if (auth) {
                router.push("/dashboard");
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

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => {}}
            size="xs"
          >
            Sie haben noch kein Konto? Kontaktieren Sie mich.
          </Anchor>
          <Button type="submit" radius="xl">
            Anmelden
          </Button>
        </Group>
      </form>
    </Container>
  );
}
