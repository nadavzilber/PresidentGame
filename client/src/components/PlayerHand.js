import React, { useState } from 'react';
import './styles.css';
import Card from './Card';
import { useRecoilState } from 'recoil';
import { handsState, discardState } from '../Atoms';

function PlayerHand({ select, playerId, stackType, cards, playSelected, pickupCards, sortHand, selectedAmount }) {

    //todo: change to cards instead of hands...
    //but how do i subscribe to 1 specific player hand?
    const [hands, setHands] = useRecoilState(handsState);
    const [isGroup, setIsGroup] = useState(false)
    const buttonStyle = {
        height: '27px',
        backgroundColor: "orange",
        color: "white",
        padding: "4px",
        marginLeft: "10px",
        marginRight: "10px",
    }

    //console.log('playerHand cards:',cards)

    const groupCardsByNum = () => {
        let handsCopy = [...hands];
        let handCopy = handsCopy[[playerId - 1]]
        let newHand = [];
        for (let i = 2; i <= 14; i++) {
            newHand.push(handCopy.filter(card => card.num === i));
        }
        console.log('newHand 1:', newHand)
        newHand = newHand.filter(cardArr => cardArr.length)
        let finalHand = [];
        //newHand = 
        newHand.forEach(cardGroup => cardGroup.forEach(card => finalHand.push(card)))
        console.log('finalHand:', finalHand)
        console.log('----------------')
        handsCopy[[playerId - 1]] = finalHand;
        setHands(handsCopy);
        setIsGroup(true);
    }

    //todo: add emotes button (rendered probably in gamehost)
    return (
        <div>
            {playerId && <label className="stack-title">Player {playerId}'s hand</label>}
            <button style={buttonStyle} onClick={() => pickupCards(playerId)}>Pick up cards</button>
            <button style={buttonStyle} onClick={() => select(null, playerId, 'clearAll')}>Clear selection</button>
            <button style={buttonStyle} onClick={() => playSelected(playerId)}>Play cards</button>
            <button style={buttonStyle} onClick={() => sortHand(playerId)}>Sort hand</button>
            <button style={buttonStyle} onClick={() => groupCardsByNum()}>groupCardsByNum</button>

            {selectedAmount > 0 && <span>selected:{selectedAmount}</span>}
            <div className={!!isGroup ? stackType : `${stackType} group`}>
                {!isGroup ? hands && hands[playerId - 1] && hands[playerId - 1].map((card, index) => (
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
                )) :
                    hands && hands[playerId - 1] && hands[playerId - 1].map((card, index) => (
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
                    ))
                }
            </div>
        </div>
    );
}

export default PlayerHand;
