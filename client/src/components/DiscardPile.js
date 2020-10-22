import React from 'react';
import './styles.css';
import Card from './Card';

function DiscardPile({ cards, lastMove }) {

    console.log('DiscardPile props:', cards, lastMove)

    // const getLastMoveCards = () => {
    //     let cardsCopy = [...cards];
    //     const lastMoveCards = [];
    //     for (let i = 0; i < lastMove.length; i++) {
    //         lastMoveCards.push(cardsCopy.pop());
    //     }
    //     console.log('getDiscarded :: lastMoveCards:', JSON.stringify(lastMoveCards))
    //     return lastMoveCards;
    // }

    // const getDiscarded = () => {
    //     let cardsCopy = [...cards];
    //     console.log('getDiscarded :: cardsCopy >>>', JSON.stringify(cardsCopy))
    //     //console.log('getDiscarded :: lastMove >>', lastMove)
    //     const discardedCards = [];
    //     for (let i = 0; i < cardsCopy.length - lastMove.length; i++) {
    //         discardedCards.push(cardsCopy.pop());
    //     }
    //     console.log('getDiscarded :: discardedCards:', JSON.stringify(discardedCards))
    //     return discardedCards;
    // }

    return (
        <div className="discard-pile-container" >
            <div className="facedown-cards-container">
                {cards.map((card, index) =>
                    <Card key={index}
                        id={card.id}
                        value={card.num}
                        suit={card.suit}
                        inDiscardPile={true}
                        isFaceDown={true}
                        isSelected={card.isSelected}
                    />)}
            </div>
            <div className="last-move-container">
                {lastMove.map((card, index) => <Card key={index}
                    id={card.id}
                    value={card.num}
                    suit={card.suit}
                    inDiscardPile={true}
                    isLastMove={true}
                    isSelected={card.isSelected}
                />)}
            </div>
        </div>
    );
}

export default DiscardPile;
