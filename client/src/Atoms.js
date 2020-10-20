import { atom } from 'recoil';
export const handsState = atom({
    key: 'handsState',
    default: [],
});
export const playerHandState = atom({
    key: 'playerHandState',
    default: [],
});
export const gameState = atom({
    key: 'gameState',
    default: {},
})