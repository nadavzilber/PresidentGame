import React from 'react';
import './styles.css';

function Card({ playerId, isSelected, select, position, id, num, suit, inDiscardPile, isLastMove, isFaceDown }) {

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

    //TODO - &clubs; &spades; &hearts; &diamonds;

    // suit === 'diamond' && <div class="top undersuit">&diamonds;</div>
    // suit === 'club' && <div class="top undersuit">&clubs;</div>
    // suit === 'spade' && <div class="top undersuit">&spades;</div>

    return (
        <div>
            {!inDiscardPile && <button
                style={buttonStyle}
                onClick={() => select && select(position, playerId, !isSelected ? 'selectAll' : 'deselectAll')}>
                {!isSelected ? 'Select' : 'Deselect'} All {id}</button>}

            {/* <div className={(isFaceDown ? 'facedown-card' : 'card')(isSelected ? 'selected' : '')} //style={cardStyle} */}
            <div className={`${isFaceDown ? 'facedown-card' : 'card'} ${isSelected ? 'selected' : ''}`}
                onClick={() => select && select(position, playerId, 'one')}>
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
