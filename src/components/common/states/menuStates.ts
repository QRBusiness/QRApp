import { MENU_SWITCH_SELECT } from '@/constants';
import { proxy, useSnapshot } from 'valtio';
import { loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';

const initialMenuDisplayOption = loadFromLocalStorage(MENU_SWITCH_SELECT, false);
const menuDisplayOptionState = proxy({
  isTable: initialMenuDisplayOption,
});

export const useMenuDisplayOptionState = () => {
  return useSnapshot(menuDisplayOptionState);
};

export const setMenuDisplayOptionState = (option: boolean) => {
  menuDisplayOptionState.isTable = option;
  saveToLocalStorage(MENU_SWITCH_SELECT, option);
};

export const toggleMenuDisplayOptionState = () => {
  const previousState = menuDisplayOptionState.isTable;
  menuDisplayOptionState.isTable = !previousState;
  saveToLocalStorage(MENU_SWITCH_SELECT, !previousState);
};
