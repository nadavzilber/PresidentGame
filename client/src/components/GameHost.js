import React from 'react';
import './styles.css';

const GameHost = ({ currentPlayer, numOfCardsNeeded, valueToBeat, isMaxed, gameMsgs }) => {
    return (
        <div className="gamehost-container">
            <label>Current players turn: {currentPlayer}</label>
            <label>numOfCardsNeeded: {numOfCardsNeeded} valueToBeat: {valueToBeat}</label>
            {isMaxed && <label>No more moves available. Must pick up the pile</label>}
            {gameMsgs && gameMsgs.playerWon && <label>`Player ${gameMsgs.playerWon.winner} finished in ${gameMsgs.playerWon.place} place`</label>}
        </div>
    )
}

export default GameHost;