import React, { useState } from "react";
import { AuthenticationForm } from "@/components/forms/loginForm";
import { AppContext } from "@/components/contexts/appContext";
import { Header } from "@/components/header";
import { IconHome2 } from "@tabler/icons-react";
import { pb, pocketbaseURL } from "@/helpers/pocketbase";
import Menue from "@/components/menu";
import { SegmentedControl } from "@mantine/core";
import CardList from "@/components/main";

type Props = {};

const tabs = [
  {
    label: "Overview",
    value: "overview",
    icon: <IconHome2></IconHome2>,
  },
  { label: "Geflügel", value: "gefluegel" },
  { label: "Schafe", value: "schafe" },
  { label: "Bienen", value: "bienen" },
];

export default function App({}: Props) {
  const { authData } = React.useContext(AppContext);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

  if (!pb.authStore.isValid || !authData)
    return (
      <div>
        <AuthenticationForm></AuthenticationForm>
      </div>
    );

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Header
          user={{
            name: authData.record.username,
            image: `${pocketbaseURL}/api/files/${authData.record.collectionId}/${authData.record.id}/${authData.record.avatar}`,
          }}
          tabs={tabs}
        ></Header>
        {/* <SegmentedControl
          fullWidth
          size="lg"
          color="primary"
          style={{
            backgroundColor: "#f5f5f5cc",
          }}
          data={[
            { label: "Schafe", value: "SHEEPS" },
            { label: "Bienen", value: "BEES" },
            { label: "Hühner", value: "CHICKENS" },
          ]}
        /> */}
      </div>

      <CardList></CardList>

      {/*  <Menue activeTab={activeTab} setActiveTab={setActiveTab}></Menue> */}
    </>
  );
}
