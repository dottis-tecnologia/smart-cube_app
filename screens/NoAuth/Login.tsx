import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Icon,
  Input,
  Text,
  Pressable,
  Spinner,
  HStack,
} from "native-base";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import { TRPCClientError } from "@trpc/client";
import useAuth from "../../hooks/useAuth";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { useTranslation } from "react-i18next";
import ChangeLanguageButtons from "../../components/ChangeLanguageButtons";

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

type FormValues = {
  email: string;
  password: string;
};
export default function Login({}: LoginProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const auth = useAuth();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await auth.signIn({ email: data.email.trim(), password: data.password });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        const message = e.message;

        // t('error', 'Something went wrong')
        if (message === "Invalid email") {
          setError("email", { type: "notFound" });
        } else if (message === "Incorrect password") {
          setError("password", { message: "incorrect" });
        } else if (message === "Network request failed") {
          setError("root", { message: "couldNotConnect" });
        }

        return;
      }
      throw e;
    }
  };

  return (
    <Box flex={1} safeArea>
      <FocusAwareStatusBar style="dark" />

      <Box position={"absolute"} right={4} bottom={4}>
        <ChangeLanguageButtons />
      </Box>
      <Center flex={1} alignItems={"stretch"} w="80%" mx="auto">
        <Heading fontWeight={"normal"} mb={5} fontSize={"4xl"}>
          {t("login.login", "Log In")}
        </Heading>
        <Text mb={1} color="primary.500">
          {t("login.enterCredentials", "Enter your credentials")}
        </Text>
        <Text color="dark.400" mb={5}>
          {t(
            "login.internetAccess",
            "You need internet access to login for the first time"
          )}
        </Text>
        <Box mb={5}>
          <Controller
            control={control}
            rules={{
              required: "is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isRequired={true} isInvalid={!!errors.email} mb={3}>
                <Input
                  variant={"filled"}
                  bgColor={"light.200"}
                  p={3}
                  size="xl"
                  placeholder={t("email", "Email")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                />
                {errors.email && (
                  <FormControl.ErrorMessage
                    mt={1}
                    leftIcon={<Icon as={FontAwesome} name="info" size="xs" />}
                  >
                    {
                      // t('error_notFound', 'Not found')
                      t("error", "Something went wrong", {
                        context: errors.email.type,
                      })
                    }
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: "is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl
                isRequired={true}
                isInvalid={!!errors.password}
                mb={3}
              >
                <Input
                  size="xl"
                  p={3}
                  variant={"filled"}
                  bgColor={"light.200"}
                  placeholder={t("password", "Password")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  value={value}
                />
                {errors.password && (
                  <FormControl.ErrorMessage
                    mt={1}
                    leftIcon={<Icon as={FontAwesome} name="info" size="xs" />}
                  >
                    {
                      // t('error_incorrect', 'Incorrect')
                      t("error", "Something went wrong", {
                        context: errors.password.type,
                      })
                    }
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            )}
            name="password"
          />
          {errors.root && (
            <Text color="danger.500">
              {
                // t('error_couldNotConnect', 'Could not connect')
                t("error", "Something went wrong", {
                  context: errors.root.type,
                })
              }
            </Text>
          )}
        </Box>

        <Pressable onPress={handleSubmit(onSubmit)}>
          {({ isPressed }) => (
            <HStack
              space={3}
              justifyContent={"center"}
              opacity={isPressed || isSubmitting ? 0.5 : 1}
              rounded="full"
              bg={{
                linearGradient: {
                  colors: ["primary.500", "cyan.500"],
                  start: [1, 0],
                  end: [0, 0],
                },
              }}
              p={3}
            >
              {isSubmitting ? <Spinner color={"white"} /> : null}
              <Text color="white">{t("login.connect", "CONNECT")}</Text>
            </HStack>
          )}
        </Pressable>
      </Center>
    </Box>
  );
}
