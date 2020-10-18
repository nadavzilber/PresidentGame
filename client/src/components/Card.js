import React from 'react';
import './styles.css';

function Card({ playerId, isSelected, select, position, name, value, inDiscardPile, isLastMove, isFaceDown }) {

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

    let lastMoveStyle = {
        marginLeft: "-102px",
        height: "200px"
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

    if (!!isFaceDown)
        cardStyle.backgroundColor = "green"

    //if (isLastMove)
    //  cardStyle = lastMoveStyle;
    //todo: add suits to cards
    return (
        <div>
            {!inDiscardPile && <button
                style={buttonStyle}
                onClick={() => select && select(position, playerId, !isSelected ? 'selectAll' : 'deselectAll')}>
                {!isSelected ? 'Select' : 'Deselect'} All {name}</button>}

            <div className={isFaceDown ? 'facedown-card' : 'card'} //style={cardStyle}
                onClick={() => select && select(position, playerId, 'one')}>
                {!isFaceDown &&
                    <>
                        <div class="top number">{name}</div>
                        <div class="top undersuit">&spades;</div>
                        <div class="suit">&spades;</div>
                        <div class="bottom number">{name}</div>
                    </>
                }
            </div>
        </div>
    );
}

export default Card;
