import { useToastEvent } from "@/components/Toast/toastEvent";

export const showToast = (
  type: "success" | "error" | "info",
  message: string
) => {
  const { showToast: showEventToast } = useToastEvent();
  switch (type) {
    case "success":
      showEventToast(message, "success");
      break;
    case "error":
      showEventToast(message, "error");
      break;
    case "info":
      showEventToast(message, "info");
      break;
    default:
      showEventToast(message, "info");
      break;
  }
};
