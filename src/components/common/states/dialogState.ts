import { proxy, useSnapshot } from 'valtio';

interface confirmDialog {
  open: boolean;
}

const defaultConfirmDialog: confirmDialog = {
  open: false,
};

const confirmDialog = proxy(defaultConfirmDialog);

export const useConfirmDialog = () => {
  const props = useSnapshot(confirmDialog, { sync: true });
  return {
    open: props.open,
  };
};

export const setConfirmDialog = (open: boolean) => {
  confirmDialog.open = open;
};
