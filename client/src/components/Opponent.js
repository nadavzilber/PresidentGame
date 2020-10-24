import React from 'react';
import Card from './Card';
import './styles.css';

const Opponent = ({ name, cards, position, select, playerId }) => {

    return (
        <div className={`opponent pos-${position}`}>
            {name}
            {cards && cards.map((card, index) => (
                <Card key={index}
                    position={index}
                    uniqueId={card.uniqueId}
                    id={card.id}
                    num={card.num}
                    suit={card.suit}
                    inDiscardPile={false}
                    select={select}
                    playerId={playerId}
                    isSelected={card.isSelected} />
            ))}
        </div>
    )
}

export default Opponent;