import React, { useEffect, useState } from 'react';
import './board.css';
import Button from './Button';
import GameHost from './GameHost';
import PlayerHand from './PlayerHand';
import DiscardPile from './DiscardPile';

const Board = ({ config }) => {

    //todos:
    //show the last played set spread out like a fan face up on top of the face down discard pile
    //group the same numbers in your hand - that would require a refactor for how i pull them => i would have to switch to an id based query instead of index
    const numberOfPlayers = config.numberOfPlayers;

    const [discardPile, setDiscardPile] = useState([{ name: '5', value: 5 }, { name: '4', value: 4 }, { name: '3', value: 3 }, { name: '2', value: 2 }, { name: 'A', value: 14 }, { name: '6', value: 6 }, { name: '4', value: 4 }]);
    const [hands, setHands] = useState([
        [{ name: 'K', value: 13 }, { name: '9', value: 9 }, { name: '7', value: 7 }, { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '9', value: 9 }, { name: '6', value: 6 }, { name: 'J', value: 11 }, { name: '9', value: 9 }],
        [{ name: 'K', value: 13 }, { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '8', value: 8 }, { name: '2', value: 2 }, { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '9', value: 9 }, { name: '9', value: 9 }]
    ]);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [numOfCardsNeeded, setNumOfCardsNeeded] = useState(0);
    const [isMaxed, setMaxed] = useState(false);
    const [valueToBeat, setValueToBeat] = useState(0);
    const [lastMove, setLastMove] = useState([]);
    const [selectedAmount, setSelectedAmount] = useState(0);

    useEffect(() => {
        console.log('useEffect')
        setValueToBeat(discardPile[discardPile.length - 1].value);
    }, [])

    const select = (cardIndex, playerId, type) => {
        type === 'clearAll' ? clearAllSelections(playerId) : type === 'one' ? selectOne(cardIndex, playerId) : type === 'selectAll' ? selectAll(cardIndex, playerId, false) : selectAll(cardIndex, playerId, true);;
    }

    const selectOne = (cardIndex, playerId) => {
        console.log('select one')
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let hand = [...hands[index]];
        let handsCopy = [...hands];
        hand[cardIndex].isSelected = !!hand[cardIndex].isSelected ? false : true;
        handsCopy[index] = hand;
        setHands(handsCopy);
        setSelectedAmount(hand[cardIndex].isSelected ? selectedAmount + 1 : selectedAmount - 1);
    }

    const selectAll = (cardIndex, playerId, deselectAll) => {
        console.log(deselectAll ? '=> deselect all' : 'select all')
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let hand = [...hands[index]];
        let handsCopy = [...hands];
        let cardValue = hand[cardIndex].value;
        let changedCardsAmount = 0;
        hand = hand.map(card => {
            //console.log(`card ${card.value} === card ${cardValue} ? ${card.value === cardValue}`)
            if (card.value === cardValue) {
                changedCardsAmount++;
                card.isSelected = deselectAll ? false : true;
            }
            return card;
        });
        //hand[cardIndex].isSelected = !!hand[cardIndex].isSelected ? false : true;
        handsCopy[index] = hand;
        setHands(handsCopy);
        setSelectedAmount(deselectAll ? selectedAmount - changedCardsAmount : selectedAmount + changedCardsAmount);
    }

    const clearAllSelections = (playerId) => {
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let hand = [...hands[index]];
        let handsCopy = [...hands];
        hand = hand.map((card) => {
            card.isSelected = false;
            return card;
        });
        //hand[cardIndex].isSelected = !!hand[cardIndex].isSelected ? false : true;
        handsCopy[index] = hand;
        setHands(handsCopy);
        setSelectedAmount(0);
    }

    const isEnoughCards = (numOfCardsPlayed) => {
        return numOfCardsNeeded === 0 || numOfCardsPlayed === numOfCardsNeeded;
    }

    const getValueToBeat = () => {
        let discardCopy = [...discardPile];
        for (let i = 0; i <= numOfCardsNeeded; i++) {
            let topCard = discardCopy.pop();
            if (topCard.value !== 2)
                return topCard.value;
        }
    }

    const isCardValueHigher = (nonJokerValue) => {
        return (nonJokerValue > valueToBeat)
    }

    const validateBeforePlay = (playedCards) => {
        console.log('Validate:playedCards:', playedCards)
        let isEnough = isEnoughCards(playedCards.length);
        console.log('isEnoughCards?', isEnough);
        let resp2 = checkIfPlayedCardsMatch(playedCards);
        console.log('do cards match each other?', resp2.isSet)
        console.log('isMaxed?', isMaxed)
        if (!isMaxed && resp2.isSet && isEnough) {
            let resp = checkIf2WasPlayed(playedCards);
            if (numOfCardsNeeded === 0) return { cardToBeat: resp.isJokerPlayed ? 2 : resp2.nonJokerValue, isValidated: true };
            setValueToBeat(getValueToBeat());
            console.log('isJokerPlayed?', resp.isJokerPlayed)
            console.log('onlyJokers?', resp.onlyJokers)
            if (resp.isJokerPlayed && resp.onlyJokers) {
                //if (resp.onlyJokers) {
                //console.log(`numOfCardsNeeded(${numOfCardsNeeded}) === 0 || !isMaxed(${!isMaxed}) ? `)
                // if (numOfCardsNeeded === 0 || !isMaxed) {
                setMaxed(true);
                console.log('maxing!')
                return { cardToBeat: 2, isValidated: true };
                //}// else { //not only jokers, a mix
                // return isCardValueHigher(resp2.nonJokerValue, valueToBeat)
                // }
            } else {
                console.log('else', resp2.nonJokerValue, valueToBeat)
                return { cardToBeat: resp2.nonJokerValue, isValidated: isCardValueHigher(resp2.nonJokerValue, valueToBeat) }
                // if (playedCards.length === 1) {
                //     let playedValue = playedCards[0].value;
                //     if (playedValue > valueToBeat) return true;
                //     else return false;
                // }
                // if (playedCards.length > 1) {
                //     if (resp2.nonJokerValue > valueToBeat)
                //         return true;
                // }
            }
        }
        return { isValidated: false };
    }

    const checkIfPlayedCardsMatch = (playedCards) => {
        let nonJokerValue;
        for (let card of playedCards) {
            //console.log('card.value-->', card.value)
            if (card.value !== 2) {
                nonJokerValue = card.value;
                //console.log('nonJokerValue:', nonJokerValue)
            }
            if (!!nonJokerValue && card.value !== 2 && nonJokerValue !== card.value)
                return { isSet: false, nonJokerValue };;
        }
        return { isSet: true, nonJokerValue };
    }

    const checkIf2WasPlayed = (playedCards) => {
        let nonJokers = playedCards.filter(card => card.value !== 2);
        if (nonJokers.length !== playedCards.length) {
            return { isJokerPlayed: true, nonJokers, onlyJokers: nonJokers == 0 };
        } else return { isJokerPlayed: false }
    }

    const validateAfterPlay = (cardsRemainingInHand, playerId) => {
        //if playerId's hand is empty => they win, game over
        if (cardsRemainingInHand.length === 0) {
            console.log(`player ${playerId} wins, hand is empty`)
        }
    }

    //todo - add playerId as arg
    const playSelected = (playerId) => {
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let selectedCards = hands[index].filter(card => card.isSelected);
        let cardsRemainingInHand = hands[index].filter(card => !card.isSelected);
        let play = validateBeforePlay(selectedCards);
        if (play.isValidated) {
            selectedCards.map(card => card.isSelected = false);
            let handsCopy = [...hands];
            handsCopy[index] = cardsRemainingInHand;
            setHands(handsCopy);
            setDiscardPile([...discardPile, ...selectedCards]);
            console.log('new discard pile ==> ', [...discardPile, ...selectedCards])
            setLastMove(selectedCards);
            setNumOfCardsNeeded(selectedCards.length);
            validateAfterPlay(cardsRemainingInHand, playerId);
            setValueToBeat(play.cardToBeat);
            setSelectedAmount(0);
            nextTurn();
            console.log('-----------------------------------');
        } else {
            console.log('cards dont match, cant play them together, or theyre too low', JSON.stringify(selectedCards))
        }
    }

    //todo - add playerId as arg
    const pickupCards = (playerId) => {
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        console.log('pickup cards playerId ==> ', playerId);
        if (discardPile.length === 0) return;
        let unselectedCards = hands[index].map(card => {
            card.isSelected = false;
            return card;
        });
        let handsCopy = [...hands];
        handsCopy[index] = [...unselectedCards, ...discardPile];
        setHands(handsCopy);
        setDiscardPile([]);
        setLastMove([]);
        setNumOfCardsNeeded(0);
        setValueToBeat(0);
        setMaxed(false);
        nextTurn();
    }

    const nextTurn = () => {
        let nextPlayer = currentPlayer + 1 <= numberOfPlayers ? currentPlayer + 1 : 1;
        setCurrentPlayer(nextPlayer);
    }

    return (
        <div className="board" >
            <div className="board-center" >
                <GameHost currentPlayer={currentPlayer}
                    numOfCardsNeeded={numOfCardsNeeded}
                    valueToBeat={valueToBeat}
                    isMaxed={isMaxed}
                />
                <DiscardPile cards={discardPile}
                    lastMove={lastMove} />
            </div>
            <div className="board-footer" > {
                hands && hands.map((hand, index) => (
                    <PlayerHand stackType="hand"
                        cards={hand}
                        playerId={index + 1}
                        select={select}
                        playSelected={playSelected}
                        pickupCards={pickupCards}
                        selectedAmount={currentPlayer === index + 1 ? selectedAmount : null}
                    />
                ))}
            </div>
        </div>
    )
}
export default Board;