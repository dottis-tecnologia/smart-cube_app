import { FontAwesome } from "@expo/vector-icons";
import { type IInputProps, Input, Icon, IconButton } from "native-base";
import { useState } from "react";

export type PasswordFieldProps = IInputProps;

export default function PasswordField({ ...props }: PasswordFieldProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!isShown}
      InputRightElement={
        <IconButton
          colorScheme={"primary"}
          variant={"ghost"}
          mr={2}
          icon={<Icon as={FontAwesome} name={isShown ? "eye-slash" : "eye"} />}
          onPress={() => setIsShown((v) => !v)}
        />
      }
    />
  );
}
