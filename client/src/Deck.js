const Deck = {
    suits: ['Heart', 'Club', 'Spade', 'Diamond'],
    numbers: [{ num: 1, id: 'Ace' }, { num: 2, id: '2' }, { num: 3, id: '3' }, { num: 4, id: '4' }, { num: 5, id: '5' }, { num: 6, id: '6' },
    { num: 7, id: '7' }, { num: 8, id: '8' }, { num: 9, id: '9' }, { num: 10, id: '10' }, { num: 11, id: 'J' }, { num: 12, id: 'Q' }, { num: 13, id: 'K' }],
    createDeck: () => {
        let deck = [];
        for (let suit of Deck.suits) {
            for (let value of Deck.numbers) {
                deck.push({ id: value.id, num: value.num, suit })
            }
        }
        console.log('done creating deck:', deck)
        return deck;
    }
}
export default Deck;