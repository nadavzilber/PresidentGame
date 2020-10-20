import { atom } from 'recoil';
export const handsState = atom({
    key: 'handsState',
    default: [],
});

export const discardState = atom({
    key: 'discardState',
    default: [],
});