import React from 'react';
import './styles.css';
import Card from './Card';

function DiscardPile({ cards, lastMove }) {

    let lastMoveContainer = {
        width: "100%",
        display: "inline-flex"
    }

    return (
        <div className="discard" >
            <div className="facedown-cards">
                {cards && cards.map((card, index) => (
                    <Card key={index}
                        id={card.id}
                        value={card.num}
                        suit={card.suit}
                        inDiscardPile={true}
                        isFaceDown={true}
                        isSelected={card.isSelected}
                    />)
                )}
            </div>
            <div style={lastMoveContainer}>
                {lastMove && lastMove.map((card, index) => <Card key={index}
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
