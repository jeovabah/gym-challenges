import { RegisterProps } from "@/stores/RegisterStore";
import { handleApiError } from "../ApiError";
import { loginApi, registerApi } from "../auth";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await loginApi(email, password);
    return response?.data;
  },
  register: async (props: RegisterProps) => {
    try {
      const response = await registerApi(props);
      return response?.data;
    } catch (error) {
      handleApiError(error, "Não foi possível registrar o usuário");
    }
  },
};
