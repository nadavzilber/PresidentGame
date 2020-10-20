//todo: create a unique id for each card
const Deck = {
    suits: ['♥', '♣', '♠', '♦'],
    numbers: [{ num: 14, id: 'A' }, { num: 2, id: '2' }, { num: 3, id: '3' }, { num: 4, id: '4' }, { num: 5, id: '5' }, { num: 6, id: '6' },
    { num: 7, id: '7' }, { num: 8, id: '8' }, { num: 9, id: '9' }, { num: 10, id: '10' }, { num: 11, id: 'J' }, { num: 12, id: 'Q' }, { num: 13, id: 'K' }],
    createDeck: () => {
        let deck = [];
        for (let suit of Deck.suits) {
            for (let value of Deck.numbers) {
                deck.push({ id: value.id, num: value.num, suit, uniqueId: `${value.id}-${suit}`, isSelected: false })
            }
        }
        return deck;
    },
    //todo: add shuffle
    //todo: add createXRandomCards
    //todo: add deal cards (optional- for the beginning of the game)
}
export default Deck;