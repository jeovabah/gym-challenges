import { createUseStore } from "@/hooks/StatesStore/useStore";

export type RegisterProps = {
  // First Screen
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  // Second Screen
  full_name?: string;
  document?: string;
  birthday?: string;
  zipcode?: string;
  address?: string;
  number?: string;
  complement?: string;
  phone?: string;
  id_course?: string;
};

const [useRegisterStore, setRegisterStore] = createUseStore<RegisterProps>(
  {} as RegisterProps
);

const updateRegisterStore = (props: RegisterProps) => {
  setRegisterStore(props);
};

export { useRegisterStore, updateRegisterStore };
