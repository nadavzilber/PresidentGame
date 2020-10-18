import React from 'react';
//import './card.css';

function Card({ playerId, isSelected, select, position, name, value, inDiscardPile }) {

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
        color: "red"
    }

    if (!!inDiscardPile) {
        cardStyle.position = "absolute";
    }
    if (!!isSelected)
        cardStyle.borderStyle = cardStyle.borderStyle === "none" ? "dashed" : "none";

    return (
        <div>
            {!inDiscardPile && <button
                style={buttonStyle}
                onClick={() => select && select(position, playerId, !isSelected ? 'selectAll' : 'deselectAll')}>
                {!isSelected ? 'Select' : 'Deselect'} All {name
                }</button>}
            <div className="card" style={cardStyle}
                onClick={() => select && select(position, playerId, 'one')}>
                {name}
            </div>
        </div>
    );
}

export default Card;
