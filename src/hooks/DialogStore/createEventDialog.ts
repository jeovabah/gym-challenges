import { useEffect } from "react";
import createEventModal from "./createEventModal";

interface DialogData {
  cancel?: boolean;
  title: string;
  message?: string;
  onConfirm: any;
}

export const createEventDialog = <T = DialogData>({
  data = {} as T,
  open: initOpen = false,
}: { data?: T; open?: boolean } = {}) => {
  let open = initOpen;
  let currentData: T = data;

  const [useListener, dispatch] = createEventModal(() => open);

  const useOpen = () => useListener();

  const setOpen = (value: boolean) => {
    open = value;
    dispatch();
  };

  const setData = (data: T) => {
    currentData = data;
    dispatch();
  };

  const getData = (): T => currentData;

  const setDataAndOpen = (data: T) => {
    setData(data);
    setOpen(true);
  };

  const onClose = (callback: () => any) =>
    useEffect(() => {
      if (!open) {
        callback();
      }
    }, [open]);

  const actions = {
    useOpen,
    setOpen,
    setData,
    getData,
    onClose,
    open: setDataAndOpen,
  };

  return actions;
};
