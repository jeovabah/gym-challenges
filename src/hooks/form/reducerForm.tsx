import { useReducer } from "react";

interface Field {
  value: string;
  required: boolean;
  error?: string;
}

interface FormState {
  [key: string]: Field;
}

type FormAction =
  | { type: "SET_FIELD_VALUE"; field: string; value: string }
  | { type: "SET_FIELD_ERROR"; field: string; error: string }
  | { type: "CLEAR_FIELD_ERROR"; field: string }
  | { type: "VALIDATE_FORM" };

interface FieldConfig {
  required: boolean;
  value?: string;
}

export const useReducerForm = (initialFields: {
  [key: string]: FieldConfig;
}) => {
  const initialState: FormState = Object.entries(initialFields).reduce(
    (acc, [key, config]) => {
      acc[key] = {
        value: config?.value ?? "",
        required: config?.required ?? false,
        error: undefined,
      };
      return acc;
    },
    {} as FormState
  );

  const reducerForm = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case "SET_FIELD_VALUE":
        return {
          ...state,
          [action.field]: {
            ...state[action.field],
            value: action.value,
            error: undefined,
          },
        };

      case "SET_FIELD_ERROR":
        return {
          ...state,
          [action.field]: {
            ...state[action.field],
            error: action.error,
          },
        };

      case "CLEAR_FIELD_ERROR":
        return {
          ...state,
          [action.field]: {
            ...state[action.field],
            error: undefined,
          },
        };

      case "VALIDATE_FORM":
        const newState = { ...state };
        Object.entries(state).forEach(([key, field]) => {
          if (field.required && !field.value) {
            newState[key] = {
              ...field,
              error: "Campo obrigatório",
            };
          }
          if (key === "email" && !field.value.includes("@")) {
            newState[key] = {
              ...field,
              error: "Email inválido",
            };
          }
        });
        return newState;

      default:
        return state;
    }
  };

  const [form, dispatch] = useReducer(reducerForm, initialState);

  const isValid = () => {
    dispatch({ type: "VALIDATE_FORM" });
    const hasErrors = Object.values(form).some(
      (field) => (field.required && !field.value) || field.error
    );
    return !hasErrors;
  };

  const formSubmit = (onSubmit: (formData: FormState) => void) => {
    return () => {
      if (isValid()) {
        onSubmit(form);
      }
    };
  };

  const setFieldValue = (field: string, value: string) => {
    dispatch({ type: "SET_FIELD_VALUE", field, value });
  };

  const setFieldError = (field: string, error: string) => {
    dispatch({ type: "SET_FIELD_ERROR", field, error });
  };

  return {
    form,
    dispatch,
    isValid,
    formSubmit,
    setFieldValue,
    setFieldError,
  };
};
