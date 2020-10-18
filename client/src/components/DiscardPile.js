import React from 'react';
import './styles.css';
import Card from './Card';

function DiscardPile({ cards }) {

    return (
        <div className="discard" >
            {cards && cards.map((card, index) => <Card key={index}
                name={card.name}
                value={card.value}
                inDiscardPile={true}
                isSelected={card.isSelected} />)}
        </div>
    );
}

export default DiscardPile;
