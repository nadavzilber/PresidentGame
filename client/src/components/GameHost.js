import React from 'react';

const GameHost = ({ currentPlayer, numOfCardsNeeded, valueToBeat, isMaxed, selectedAmount }) => {
    return (
        <div className="gamehost-container">
            <h5>Current players turn: {currentPlayer}</h5>
            <h5>numOfCardsNeeded: {numOfCardsNeeded} valueToBeat: {valueToBeat}</h5>
            {isMaxed && <h5>No more moves available. Must pick up the pile</h5>}
        </div>
    )
}

export default GameHost;