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
        cursor: "pointer"
    }


    //todo: add emotes button (rendered probably in gamehost)
    return (
        <div>
            <div className="player-msgs-container">
                <label>Player {playerId}'s hand</label>
                <label>selectedAmount:{selectedAmount}</label>
            </div>
            <div className="player-buttons-container">
                <button style={buttonStyle} onClick={() => pickupCards(playerId)}>Pick up cards</button>
                <button style={buttonStyle} onClick={() => select(null, playerId, 'clearAll')}>Clear selection</button>
                <button style={buttonStyle} onClick={() => playSelected(playerId)}>Play cards</button>
                <button style={buttonStyle} onClick={() => sortHand(playerId)}>Sort hand</button>
            </div>
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
