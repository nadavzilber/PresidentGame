import { atom } from 'recoil';

export const handsState = atom({
    key: 'handsState',
    default: [],
});
export const discardState = atom({
    key: 'discardState',
    default: { discard: [], lastMove: [] },
});
export const playerHandState = atom({
    key: 'playerHandState',
    default: [],
});
export const myState = atom({
    key: 'myState',
    default: {},
});
export const clientState = atom({
    key: 'clientState',
    default: []
});
export const gameState = atom({
    key: 'gameState',
    default: { stage: "lobby" },
});
export const msgState = atom({
    key: 'msgState',
    default: {},
});
export const lobbyState = atom({
    key: "lobbyState",
    default: {}
});
export const gameInfo = atom({
    key: 'gameInfo',
    default: { numOfCardsNeeded: 0, isMaxed: false, vtb: 0 }
});
export const playersState = atom({
    key: 'playersState',
    default: []
});

// const elementState = atomFamily({
//     key: 'element',
//     default: ()=> ({top: 0, left: 0, color: generateRandomColor()})
//     });


// player hand
// all player hands
// discard
// last move cards
// vtb
// selected cards
// current player (turn)
// ranks - president etc..
// game messsages