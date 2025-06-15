import { proxy, useSnapshot } from 'valtio';

const menuDisplayOptionState = proxy({
  isTable: false,
});

export const useMenuDisplayOptionState = () => {
  return useSnapshot(menuDisplayOptionState);
};

export const setMenuDisplayOptionState = (option: boolean) => {
  menuDisplayOptionState.isTable = option;
};

export const toggleMenuDisplayOptionState = () => {
  menuDisplayOptionState.isTable = !menuDisplayOptionState.isTable;
};
