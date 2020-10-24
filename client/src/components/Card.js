import React from 'react';
import './styles.css';

function Card({ playerId, isSelected, select, position, uniqueId, id, num, suit, inDiscardPile, isLastMove, isFaceDown }) {

    let cardStyle = {
        margin: "5px",
        padding: "8px",
        backgroundColor: "rebeccapurple",
        color: "white",
        cursor: "pointer",
        width: "40px",
        height: "50px",
        borderStyle: "none"
    }

    let buttonStyle = {
        fontSize: "10px",
        color: "red",
        marginBottom: "10px"
    }

    if (!!inDiscardPile) {
        cardStyle.position = "absolute";
    }
    if (!!isSelected)
        cardStyle.borderStyle = cardStyle.borderStyle === "none" ? "dashed" : "none";

    if (!!isFaceDown)
        cardStyle.backgroundColor = "green"

    return (
        <div>
            {/* {!inDiscardPile && <button
                style={buttonStyle}
                onClick={() => select && select(uniqueId, playerId, !isSelected ? 'selectAll' : 'deselectAll')}>
                {!isSelected ? 'Select' : 'Deselect'} All {id}</button>} */}

            <div className={`${isFaceDown ? 'facedown-card' : 'card'} ${isSelected ? 'selected' : ''}`}
                onClick={() => select && select(uniqueId, playerId, 'one')}>
                {!isFaceDown &&
                    <div className={(suit === '♥' || suit === '♦') ? 'red' : 'black'}>
                        <div className="top number">{id}</div>
                        <div className="top undersuit">{suit}</div>
                        <div className="suit">{suit}</div>
                        <div className="bottom number">{id}</div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Card;
