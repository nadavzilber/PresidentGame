import React, { useState } from 'react';
import './styles.css';
import Card from './Card';

function PlayerHand({ select, playerId, stackType, cards, playSelected, pickupCards, sortHand, selectedAmount }) {
    const buttonStyle = {
        height: '27px',
        backgroundColor: "orange",
        color: "white",
        padding: "4px",
        marginLeft: "10px",
        marginRight: "10px",
    }

    console.log('playerHand cards:',cards)

    return (
        <div>
            {playerId && <label className="stack-title">Player {playerId}'s hand</label>}
            <button style={buttonStyle} onClick={() => pickupCards(playerId)}>Pick up cards</button>
            <button style={buttonStyle} onClick={() => select(null, playerId, 'clearAll')}>Clear selection</button>
            <button style={buttonStyle} onClick={() => playSelected(playerId)}>Play cards</button>
            <button style={buttonStyle} onClick={() => sortHand(playerId)}>Sort hand</button>
            {selectedAmount > 0 && <span>selected:{selectedAmount}</span>}
            <div className={stackType}>
                {cards && cards.map((card, index) => (
                    <Card key={index}
                        position={index}
                        uniqueId={card.uniqueId}
                        id={card.id}
                        num={card.num}
                        suit={card.suit}
                        inDiscardPile={false}
                        select={stackType === 'hand' ? select : null}
                        playerId={playerId}
                        isSelected={card.isSelected} />
                ))}
            </div>
        </div>
    );
}

export default PlayerHand;
