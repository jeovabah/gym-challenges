import createEvent from "@/hooks/createEvent";
import { useEffect } from "react";

type StatusToastProps = "success" | "error" | "warning" | "info";

interface ToastData {
  message: string;
  status: StatusToastProps;
}

const toastEvent = createEvent<ToastData | null>(null);

export const useToastEvent = () => {
  const { useListener, dispatch } = toastEvent;

  const showToast = (message: string, status: StatusToastProps) => {
    dispatch({ message, status });
  };

  const useToast = () => useListener();

  const onClose = (callback: () => any) =>
    useEffect(() => {
      const toast = useListener();
      if (!toast) {
        callback();
      }
    }, [useListener]);

  return { showToast, useToast, onClose, dispatch };
};
