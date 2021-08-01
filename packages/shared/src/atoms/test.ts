import { atom } from 'recoil';

export const testState = atom<string>({
  key: 'testAtom',
  default: 'Hello World'
});
