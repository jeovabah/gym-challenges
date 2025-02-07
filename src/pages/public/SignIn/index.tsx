import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useReducerForm } from "@/hooks/form/reducerForm";
import { useSession } from "@/providers/SessionProvider";
import { showToast } from "@/utils/toast";
import { Layout } from "@/components/Layout";
import Logo from "../../../../assets/gymgreen-no-bg.png";
import { CardHeader } from "@/components/CardHeader";

export const SignIn = () => {
  const { signIn, register } = useSession();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const { form, setFieldValue, setFieldError } = useReducerForm({
    email: { required: true },
    password: { required: true },
    name: { required: activeTab === "signup" },
    confirmPassword: { required: activeTab === "signup" },
  });

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn(form.email.value, form.password.value);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (form.name.value.length < 3) {
      setFieldError("name", "Nome deve ter pelo menos 3 caracteres");
      return;
    }
    if (form.password.value !== form.confirmPassword.value) {
      showToast("error", "As senhas não correspondem");
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
      });

      const registeredEmail = form.email.value;
      const registeredPassword = form.password.value;
      setFieldValue("name", "");
      setFieldValue("confirmPassword", "");
      setFieldValue("email", registeredEmail);
      setFieldValue("password", registeredPassword);

      setActiveTab("signin");
      showToast(
        "success",
        "Cadastro realizado com sucesso! Por favor, faça login."
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === "signin") {
      return handleSignIn();
    }
    return handleRegister();
  };

  return (
    <Layout noPadding useSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-[#232323]">
          <View className="bg-[#D9D9D90F] py-2 px-2 flex-row items-center">
            <Image
              source={Logo}
              className="w-[50px] h-[50px]"
              resizeMode="contain"
            />
            <Text className="text-green-500 text-xl font-bold font-poppins-regular">
              Gym Green
            </Text>
          </View>

          <View className="h-[20%] mt-8 px-6 flex-row justify-between items-center gap-3">
            <CardHeader
              title={`Seja, Bem ${`\n`} Vindo`}
              description={"Transforme seus objetivos em realidade."}
            />
          </View>

          <View className="bg-[#D9D9D90F] mt-6 px-6 pt-10 pb-8">
            {activeTab === "signup" && (
              <Input
                placeholder="Nome"
                label="Nome"
                placeholderTextColor="#666"
                variantStyle="white"
                value={form.name.value}
                onChangeText={(value) => setFieldValue("name", value)}
                error={form.name.error}
                size="medium"
              />
            )}

            <Input
              placeholder="email@email.com"
              label="Email"
              placeholderTextColor="#666"
              variantStyle="white"
              value={form.email.value}
              onChangeText={(value) => setFieldValue("email", value)}
              error={form.email.error}
              size="medium"
            />

            <Input
              placeholder="********"
              label="Senha"
              placeholderTextColor="#666"
              variantStyle="white"
              value={form.password.value}
              onChangeText={(value) => setFieldValue("password", value)}
              error={form.password.error}
              variant="password"
              size="medium"
            />

            {activeTab === "signup" && (
              <Input
                placeholder="Confirmar Senha"
                label="Confirmar Senha"
                placeholderTextColor="#666"
                variantStyle="white"
                value={form.confirmPassword.value}
                onChangeText={(value) =>
                  setFieldValue("confirmPassword", value)
                }
                error={form.confirmPassword.error}
                variant="password"
                size="medium"
              />
            )}

            {activeTab === "signin" && (
              <TouchableOpacity className="self-end mb-4">
                <Text className="text-red-500 font-poppins-regular">
                  Esqueceu a Senha?
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="mb-6 mt-6">
            <View className="w-[200px] self-center">
              <Button
                size="large"
                variant="secondary"
                onPress={handleSubmit}
                loading={isLoading}
              >
                {activeTab === "signin" ? "Entrar" : "Cadastrar"}
              </Button>
            </View>
          </View>
          <View className="flex-row justify-center">
            {activeTab === "signin" ? (
              <Text className="text-gray-400 font-poppins-regular">
                Não possui uma conta?
              </Text>
            ) : (
              <Text className="text-gray-400 font-poppins-regular">
                Já possui uma conta?
              </Text>
            )}
            <TouchableOpacity
              onPress={() =>
                setActiveTab(activeTab === "signin" ? "signup" : "signin")
              }
            >
              <Text className="text-red-500 ml-2 font-poppins-regular">
                {activeTab === "signin" ? "Cadastrar-se" : "Entrar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};
