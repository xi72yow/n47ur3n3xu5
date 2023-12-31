import { Button, Dialog, Group, Text } from "@mantine/core";
import React, { useContext, useRef, useState } from "react";

type UseConfirmShowReturnType = {
  show: boolean;
  setShow: (value: boolean) => void;
  onHide: () => void;
};

const useConfirmShow = (): UseConfirmShowReturnType => {
  const [show, setShow] = useState(false);

  const handleOnHide = () => {
    setShow(false);
  };

  return {
    show,
    setShow,
    onHide: handleOnHide,
  };
};

type ContextType = {
  showConfirmation: (
    message: string | JSX.Element,
    dangerYes?: boolean
  ) => Promise<boolean>;
};

type ConfirmationContextProviderProps = {
  children: React.ReactNode;
};

const ConfirmationContext = React.createContext<ContextType>({} as ContextType);

const ConfirmationContextProvider: React.FC<
  ConfirmationContextProviderProps
> = (props) => {
  const { setShow, show, onHide } = useConfirmShow();
  const [content, setContent] = useState<{
    message: string | JSX.Element;
    dangerYes?: boolean;
  } | null>();
  const resolver = useRef<Function>();

  const handleShow = (
    message: string | JSX.Element,
    dangerYes?: boolean
  ): Promise<boolean> => {
    setContent({
      message,
      dangerYes,
    });
    setShow(true);
    return new Promise(function (resolve) {
      resolver.current = resolve;
    });
  };

  const modalContext: ContextType = {
    showConfirmation: handleShow,
  };

  const handleOk = () => {
    resolver.current && resolver.current(true);
    onHide();
  };

  const handleCancel = () => {
    resolver.current && resolver.current(false);
    onHide();
  };

  return (
    <ConfirmationContext.Provider value={modalContext}>
      {props.children}

      {content && (
        <Dialog
          zIndex={1000}
          opened={show}
          withCloseButton
          onClose={onHide}
          size="xl"
          radius="md"
          styles={{
            root: {
              backgroundColor: content.dangerYes ? "#fee8b0" : "#ffffff",
            },
          }}
        >
          <Text
            size="xl"
            style={{ marginBottom: 10, maxWidth: "95%" }}
            weight={500}
          >
            {content.message}
          </Text>

          <Group position="right">
            <Button size="lg" onClick={handleCancel}>
              Nein
            </Button>
            <Button
              size="lg"
              color={content.dangerYes ? "Pink-lavender" : "blue"}
              onClick={handleOk}
            >
              Ja
            </Button>
          </Group>
        </Dialog>
      )}
    </ConfirmationContext.Provider>
  );
};

const useConfirm = (): ContextType => useContext(ConfirmationContext);

export { useConfirmShow as useModalShow, useConfirm };

export default ConfirmationContextProvider;
