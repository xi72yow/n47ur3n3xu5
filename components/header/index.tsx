import { logout } from "@/helpers/pocketbase";
import {
  Avatar,
  Container,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { AppContext } from "../contexts/appContext";
import { useMediaQuery } from "@mantine/hooks";
import Logo from "./logo.js";

const useStyles = createStyles((theme) => ({
  mainSection: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    maxWidth: "none",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.Peach[6]
        : theme.colors.Peach[1],
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
    marginBottom: rem(120),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors["Pink-lavender"][2]
          : theme.colors["Pink-lavender"][6],
    },
  },
}));

interface HeaderProps {
  user: { name: string; image: string };
  tabs: { label: string; value: string; icon?: ReactNode }[];
}

export function Header({ user, tabs }: HeaderProps) {
  const { classes, theme, cx } = useStyles();
  const { setAuthData } = React.useContext(AppContext);
  const matches = useMediaQuery("(min-width: 600px )");

  return (
    <Container className={classes.mainSection}>
      <Group
        style={{
          maxWidth: "900px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Logo
          width={matches ? 200 : 170}
          fill={
            theme.colorScheme === "dark"
              ? theme.colors.gray[2]
              : theme.colors.dark[7]
          }
        />
        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
        >
          <Menu.Target>
            <UnstyledButton className={cx(classes.user)}>
              <Group spacing={7}>
                <Avatar
                  src={user.image}
                  alt={user.name}
                  radius="xl"
                  size={matches ? 60 : 50}
                />
                <Stack
                  align="center"
                  style={{
                    gap: 0,
                  }}
                >
                  <Text weight={800} size="md">
                    {user.name}
                  </Text>
                  <Text size="sm" color="Pink-lavender" ml={7}>
                    {"online"}
                  </Text>
                </Stack>
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
              Account settings
            </Menu.Item>
            <Menu.Item
              icon={<IconLogout size="0.9rem" stroke={1.5} />}
              onClick={() => {
                logout();
                setAuthData(null);
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Container>
  );
}
