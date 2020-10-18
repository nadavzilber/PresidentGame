import React from 'react';
import './styles.css';
import Card from './Card';

function DiscardPile({ cards, lastMove }) {

    const getLastMoveCards = () => {
        let cardsCopy = [...cards];
        const lastMoveCards = [];
        for (let i = 0; i < lastMove.length; i++) {
            lastMoveCards.push(cardsCopy.pop());
        }
        console.log('lastMoveCards:', lastMoveCards)
        return lastMoveCards;
    }

    const getDiscarded = () => {
        let cardsCopy = [...cards];
        const discardedCards = [];
        for (let i = 0; i < cards.length - lastMove.length; i++) {
            discardedCards.push(cardsCopy.pop());
        }
        console.log('discardedCards:', discardedCards)
        return discardedCards;
    }

    let lastMoveContainer = {
        width: "100%",
        display: "inline-flex"
    }

    return (
        <div className="discard" >
            {/* {cards && cards.map((card, index) => <Card key={index}
                name={card.name}
                value={card.value}
                inDiscardPile={true}
                isSelected={card.isSelected}
            />)} */}
            <div className="facedown-cards">
                {getDiscarded().map((card, index) => <Card key={index}
                    name={card.name}
                    value={card.value}
                    inDiscardPile={true}
                    isFaceDown={true}
                    isSelected={card.isSelected}
                />)}
            </div>
            <div style={lastMoveContainer}>
                {getLastMoveCards().map((card, index) => <Card key={index}
                    name={card.name}
                    value={card.value}
                    inDiscardPile={true}
                    isLastMove={true}
                    isSelected={card.isSelected}
                />)}
            </div>
        </div>
    );
}

export default DiscardPile;
