//todo: create a unique id for each card
const deck = {
    suits: ['♥', '♣', '♠', '♦'],
    numbers: [{ num: 14, id: 'A' }, { num: 15, id: '2' }, { num: 3, id: '3' }, { num: 4, id: '4' }, { num: 5, id: '5' }, { num: 6, id: '6' },
    { num: 7, id: '7' }, { num: 8, id: '8' }, { num: 9, id: '9' }, { num: 10, id: '10' }, { num: 11, id: 'J' }, { num: 12, id: 'Q' }, { num: 13, id: 'K' }],
    create: () => {
        let newDeck = [];
        for (let suit of deck.suits) {
            for (let value of deck.numbers) {
                newDeck.push({ id: value.id, num: value.num, suit, uniqueId: `${value.id}-${suit}`, isSelected: false })
            }
        }
        return newDeck;
    },
    //todo: add shuffle
    //todo: add createXRandomCards
    //todo: add deal cards (optional- for the beginning of the game)
}
const valueToBeatToString = (vtb) => {
    //todo: it shouldnt be both here and in the client...
    //console.log('valueToBeatToString:', vtb)
    if (vtb === 2 || vtb === 15) return 'Joker';
    if (vtb === 14) return 'Ace';
    if (vtb === 13) return 'King';
    if (vtb === 12) return 'Queen';
    if (vtb === 11) return 'Jack';
    return vtb;
}
const initGame = (clients) => {
    //todo: remove duplicates from players hands and discard pile- otherwise uniqueId wont work well
    //console.log('===initGame===')
    let state = {};
    let newDeck = deck.create();
    let numberOfPlayers = clients.length;
    let numOfCardsInHand = 8;
    let numOfPlayedCardsInDiscard = 5;
    let newHands = [];//{ hand1: [], hand2: [], hand3: [], hand4: [] };
    for (let player = 1; player <= numberOfPlayers; player++) {
        let currentHand = [];
        for (let i = 0; i < numOfCardsInHand; i++) {
            let randomIndex = Math.floor(Math.random() * newDeck.length);
            let card = newDeck.splice(randomIndex, 1)[0];
            currentHand.push(card);
        }
        newHands.push(currentHand);
    }
    //console.log('newHands ===>', newHands)

    let discard = [];
    for (let i = 0; i < numOfPlayedCardsInDiscard; i++) {
        let randomIndex = Math.floor(Math.random() * newDeck.length);
        let card = newDeck.splice(randomIndex, 1)[0];
        discard.push(card);
    }
    let randomIndex = Math.floor(Math.random() * newDeck.length);
    let lastMoveCard = newDeck.splice(randomIndex, 1)[0];

    clients.forEach((client, index) => {
        client.playerId = index + 1;
    });

    console.log('Initial randomly generated hands:', [...newHands]);
    console.log('Initial randomly generated discard pile:', discard);
    console.log('Initial randomly generated lastMoveCard: ', lastMoveCard);
    let newValueToBeat = valueToBeatToString(lastMoveCard.num);
    console.log('Initial newValueToBeat:', newValueToBeat)
    console.log('Initial DiscardPile ==>', discard)

    // let opps = [
    //     { name: "moshe" },
    //     { name: "donald" },
    //     { name: "robin" }
    // ];
    state = { vtb: newValueToBeat, isMaxed: newValueToBeat === 'Joker', lastMove: [lastMoveCard], numOfCardsNeeded: 1, hands: newHands, discard, clients, stage: "game" }
    //console.log('opponents:', opps)
    return state;
}
module.exports = {initGame, valueToBeatToString};