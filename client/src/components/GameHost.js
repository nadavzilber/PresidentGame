import React from 'react';

const GameHost = ({ currentPlayer, numOfCardsNeeded, valueToBeat, isMaxed, gameMsgs }) => {
    return (
        <div className="gamehost-container">
            <h5>Current players turn: {currentPlayer}</h5>
            <h5>numOfCardsNeeded: {numOfCardsNeeded} valueToBeat: {valueToBeat}</h5>
            {isMaxed && <h5>No more moves available. Must pick up the pile</h5>}
            {gameMsgs && gameMsgs.playerWon && `Player ${gameMsgs.playerWon.winner} finished in ${gameMsgs.playerWon.place} place`}
        </div>
    )
}

export default GameHost;