import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Popover,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import React, { useState } from "react";

type Props = { activeTab: string; setActiveTab: (tab: string) => void };

export default function Menue({}: Props) {
  const [opened, setOpened] = useState(false);
  return (
    <Group position="center" sx={{
        position:"fixed",
        width: "100vw",
        bottom: "0",
    }}>
      <div
        style={{
          maxWidth: "900px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          flexGrow: 1,
        }}
      >
        <Popover opened={opened} onChange={setOpened}>
          <Popover.Target>
            <ActionIcon
              variant="filled"
              color="Reseda-green"
              onClick={() => setOpened((o) => !o)}
              style={{
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                margin: "10px",
              }}
            >
              <IconMenu2 size={25}></IconMenu2>
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown>
            <Button.Group>
              <Button variant="default">First</Button>
              <Button variant="default">Second</Button>
              <Button variant="default">Third</Button>
            </Button.Group>
          </Popover.Dropdown>
        </Popover>
      </div>
    </Group>
  );
}
