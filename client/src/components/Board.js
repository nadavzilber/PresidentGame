import React, { useEffect, useState } from 'react';
import './board.css';
import Button from './Button';
import GameHost from './GameHost';
import PlayerHand from './PlayerHand';
import DiscardPile from './DiscardPile';
import Deck from '../Deck';
import { useRecoilState } from 'recoil';
import { handsState } from '../Atoms';

const Board = ({ config }) => {

    //todos:
    //group the same numbers in your hand - that would require a refactor for how i pull them => i would have to switch to an id based query instead of index
    const numberOfPlayers = config.numberOfPlayers;

    const [discardPile, setDiscardPile] = useState([{ name: '5', value: 5 }, { name: '4', value: 4 }, { name: '3', value: 3 }, { name: '2', value: 2 }, { name: 'A', value: 14 }, { name: '6', value: 6 }, { name: '4', value: 4 }]);
    //const [hands, setHands] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [numOfCardsNeeded, setNumOfCardsNeeded] = useState(0);
    const [isMaxed, setMaxed] = useState(false);
    const [valueToBeat, setValueToBeat] = useState(0);
    const [lastMove, setLastMove] = useState([]);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [gameMsgs, setGameMsgs] = useState();
    const [winners, setWinners] = useState([]);

    //const hands = useRecoilValue(handsState); //only reading the atom
    //const setHands = useSetRecoilState(handsState) //only writing to the atom
    const [hands, setHands] = useRecoilState(handsState);
    //useRecoilState() ==> both reading and writing
    //useResetRecoilState(): Use this hook to reset an atom to its default value.

    useEffect(() => {
        //TODO- im getting a console log of 1 type of card for lastMove but a different 1 is rendering
        //its rendering the last element of the discard pile instead of the separate array
        //maybe i need to check what im sending to setLastMove in the startup flow

        //todo: remove duplicates from players hands and discard pile- otherwise uniqueId wont work well
        console.log('Board useEffect')
        let deck = Deck.createDeck();
        let numOfCardsInHand = 8;
        let numOfPlayedCardsInDiscard = 5;
        let hand1 = [];
        //TODO solve bug - 
        //Uncaught TypeError: Cannot add property isSelected, object is not extensible
        //maybe because i switched from random index value copy to random index splice
        //but this way theyre unique cards each time
        for (let i = 0; i < numOfCardsInHand; i++) {
            let randomIndex = Math.floor(Math.random() * deck.length);
            let card = deck.splice(randomIndex, 1)[0];
            //let cardCopy = { ...card };
            hand1.push(card);
        }

        let hand2 = [];
        for (let i = 0; i < numOfCardsInHand; i++) {
            let randomIndex = Math.floor(Math.random() * deck.length);
            let card = deck.splice(randomIndex, 1)[0];
            // let cardCopy = { ...card };
            hand2.push(card);
        }
        let discard = [];
        for (let i = 0; i < numOfPlayedCardsInDiscard; i++) {
            let randomIndex = Math.floor(Math.random() * deck.length);
            let card = deck.splice(randomIndex, 1)[0];
            //let cardCopy = { ...card };
            discard.push(card);
        }
        let randomIndex = Math.floor(Math.random() * deck.length);
        let lastMoveCard = deck.splice(randomIndex, 1)[0];
        //let lastMoveCard = { ...card };
        //let lastMoveCard = [Object.assign({}, deck[randomIndex])];
        console.log('Initial randomly generated hands:', [hand1, hand2]);
        console.log('Initial randomly generated discard pile:', discard);
        console.log('Initial randomly generated lastMoveCard: ', lastMoveCard);
        let newValueToBeat = valueToBeatToString(lastMoveCard.num);
        console.log('Initial newValueToBeat:', newValueToBeat)
        setValueToBeat(newValueToBeat);
        if (newValueToBeat === 'Joker') setMaxed(true);
        setLastMove([lastMoveCard]);
        setHands([hand1, hand2]);
        console.log('Initial DiscardPile ==>', discard)
        setDiscardPile(discard);
        setNumOfCardsNeeded(1);
    }, []);

    const valueToBeatToString = (vtb) => {
        console.log('valueToBeatToString:', vtb)
        if (vtb === 2 || vtb === 15) return 'Joker';
        if (vtb === 14) return 'Ace';
        if (vtb === 13) return 'King';
        if (vtb === 12) return 'Queen';
        if (vtb === 11) return 'Jack';
        return vtb;
    }

    const valueToBeatToNumber = (vtb) => {
        console.log('valueToBeatToNumber:', vtb)
        if (vtb === 'Joker') return 2;
        if (vtb === 'Ace') return 14;
        if (vtb === 'King') return 13;
        if (vtb === 'Queen') return 12;
        if (vtb === 'Jack') return 11;
        return vtb;
    }

    const select = (uniqueId, playerId, type) => {
        type === 'clearAll' ? clearAllSelections(playerId) : type === 'one' ? selectOne(uniqueId, playerId) : type === 'selectAll' ? selectAll(uniqueId, playerId, false) : selectAll(uniqueId, playerId, true);;
    }

    const selectOne = (uniqueId, playerId) => {
        console.log('select one', uniqueId, playerId)
        if (playerId !== currentPlayer) return;
        let playerHandIndex = playerId - 1;
        let hand = [...hands[playerHandIndex]];
        const cardIndex = hand.findIndex(card => card.uniqueId === uniqueId);
        let card = { ...hand[cardIndex] };
        console.log('1 card ?!?!', card)
        card.isSelected = !!card.isSelected ? false : true;
        let allHandsCopy = [...hands];
        hand[cardIndex] = card;
        allHandsCopy[playerHandIndex] = hand;
        setHands(allHandsCopy);
        setSelectedAmount(card.isSelected ? selectedAmount + 1 : selectedAmount - 1);
    }

    const selectAll = (uniqueId, playerId, deselectAll) => {
        console.log(deselectAll ? '=> deselect all' : 'select all', uniqueId);
        if (playerId !== currentPlayer) return;
        let playerHandIndex = playerId - 1;
        let handCopy = [...hands[playerHandIndex]];
        const cardIndex = handCopy.findIndex(card => card.uniqueId === uniqueId);
        let selectedCard = { ...handCopy[cardIndex] };
        let changedCardsAmount = 0;
        handCopy = handCopy.map(card => {
            //console.log(`card ${card.value} === card ${cardValue} ? ${card.value === cardValue}`)
            if (card.num === selectedCard.num) {
                changedCardsAmount++;
                console.log('card ???!?', card)
                return { ...card, isSelected: deselectAll ? false : true };
            }
            return card;
        });
        let allHandsCopy = [...hands];
        //hand[cardIndex] = card;
        allHandsCopy[playerHandIndex] = handCopy;
        setHands(allHandsCopy);
        setSelectedAmount(deselectAll ? selectedAmount - changedCardsAmount : selectedAmount + changedCardsAmount);
        // console.log(deselectAll ? '=> deselect all' : 'select all')
        // if (playerId !== currentPlayer) return;
        // let index = playerId - 1;
        // let hand = [...hands[index]];
        // let handsCopy = [...hands];
        // let cardValue = hand[cardIndex].num;
        // console.log('clicked card value:', cardValue)
        // let changedCardsAmount = 0;
        // hand = hand.map(card => {
        //     //console.log(`card ${card.value} === card ${cardValue} ? ${card.value === cardValue}`)
        //     if (card.num === cardValue) {
        //         changedCardsAmount++;
        //         card.isSelected = deselectAll ? false : true;
        //     }
        //     return card;
        // });
        // //hand[cardIndex].isSelected = !!hand[cardIndex].isSelected ? false : true;
        // handsCopy[index] = hand;
        // setHands(handsCopy);
        // setSelectedAmount(deselectAll ? selectedAmount - changedCardsAmount : selectedAmount + changedCardsAmount);
    }

    const clearAllSelections = (playerId) => {
        console.log('clear all selections')
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let hand = [...hands[index]];
        let allHandsCopy = [...hands];
        hand = hand.map((card) => {
            return { ...card, isSelected: false };
        });
        //hand[cardIndex].isSelected = !!hand[cardIndex].isSelected ? false : true;
        allHandsCopy[index] = hand;
        setHands(allHandsCopy);
        setSelectedAmount(0);
    }

    const isEnoughCards = (numOfCardsPlayed) => {
        return numOfCardsNeeded === 0 || numOfCardsPlayed === numOfCardsNeeded;
    }

    const isCardValueHigher = (nonJokerValue) => {
        let playedValue = valueToBeatToNumber(nonJokerValue)
        let vtb = valueToBeatToNumber(valueToBeat);
        return (playedValue > vtb);
    }

    const validateBeforePlay = (playedCards) => {
        console.log('Validate:playedCards:', playedCards)
        let isEnough = isEnoughCards(playedCards.length);
        console.log('isEnoughCards?', isEnough);
        let resp2 = checkIfPlayedCardsMatch(playedCards);
        console.log('do cards match each other?', resp2.isSet)
        console.log('isMaxed?', isMaxed)
        if (!isMaxed && resp2.isSet && isEnough) {
            let resp = checkIfJokerWasPlayed(playedCards);
            let cardToBeatString = valueToBeatToString(resp2.nonJokerValue)
            console.log('resp2.nonJokerValue:', resp2.nonJokerValue)
            if (numOfCardsNeeded === 0 && valueToBeat === 0) return { cardToBeat: cardToBeatString, isValidated: true };
            // console.log('1 setting vtb', cardToBeatString)
            // setValueToBeat(cardToBeatString);
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
                return { cardToBeat: resp2.nonJokerValue, isValidated: isCardValueHigher(resp2.nonJokerValue) }
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
            if (card.num !== 2) {
                nonJokerValue = card.num;
                //console.log('nonJokerValue:', nonJokerValue)
            }
            if (!!nonJokerValue && card.num !== 2 && nonJokerValue !== card.num)
                return { isSet: false, nonJokerValue };;
        }
        return { isSet: true, nonJokerValue };
    }

    const checkIfJokerWasPlayed = (playedCards) => {
        let nonJokers = playedCards.filter(card => card.num !== 2);
        if (nonJokers.length !== playedCards.length) {
            return { isJokerPlayed: true, nonJokers, onlyJokers: nonJokers == 0 };
        } else return { isJokerPlayed: false }
    }

    const validateAfterPlay = (cardsRemainingInHand, playerId) => {
        //if playerId's hand is empty => they win, game over
        if (cardsRemainingInHand.length === 0) {
            console.log(`player ${playerId} wins, hand is empty`);
            let winnersCopy = [...winners];
            let finishPlace = winnersCopy.length + 1;
            finishPlace = finishPlace === 1 ? '1st' : finishPlace === 2 ? '2nd' : finishPlace === 3 ? '3rd' : `${finishPlace}th`;
            winnersCopy.push(playerId);
            setWinners(winnersCopy);
            setGameMsgs({ ...gameMsgs, playerWon: { winner: playerId, place: finishPlace } });
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
            selectedCards = selectedCards.map(card => ({ ...card, isSelected: false }));
            console.log('selectedCards:::::::::', selectedCards)
            let handsCopy = [...hands];
            handsCopy[index] = cardsRemainingInHand;
            setHands(handsCopy);
            setDiscardPile([...discardPile, ...selectedCards]);
            setLastMove(selectedCards);
            setNumOfCardsNeeded(selectedCards.length);
            validateAfterPlay(cardsRemainingInHand, playerId);
            console.log('2 setting vtb', play.cardToBeat);
            let vtb = valueToBeatToString(play.cardToBeat);
            setValueToBeat(vtb);
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
            return { ...card, isSelected: false };
        });
        let handsCopy = [...hands];
        handsCopy[index] = [...unselectedCards, ...discardPile];
        setHands(handsCopy);
        setDiscardPile([]);
        setLastMove([]);
        setNumOfCardsNeeded(0);
        console.log('4 setting vtb 0')
        setValueToBeat(0);
        setMaxed(false);
        nextTurn();
    }

    const nextTurn = () => {
        let nextPlayer = currentPlayer + 1 <= numberOfPlayers ? currentPlayer + 1 : 1;
        setCurrentPlayer(nextPlayer);
    }

    const sortHand = (playerId) => {
        console.log('sortHand playerId:', playerId)
        //if (playerId !== currentPlayer) return;
        let allHandsCopy = [...hands];
        let playerHandIndex = playerId - 1;
        let playerHand = [...hands[playerHandIndex]];
        playerHand.sort(compareNumbers);
        allHandsCopy[playerHandIndex] = playerHand;
        setHands(allHandsCopy);
    }

    const compareNumbers = (card1, card2) => {
        if (card1.num > card2.num) return 1;
        if (card2.num > card1.num) return -1;
        return 0;
    };

    return (
        <div className="board" >
            
            <div className="board-center" >
                <GameHost currentPlayer={currentPlayer}
                    numOfCardsNeeded={numOfCardsNeeded}
                    valueToBeat={valueToBeat}
                    isMaxed={isMaxed}
                    gameMsgs={gameMsgs}
                />
                <DiscardPile cards={discardPile}
                    lastMove={lastMove} />
            </div>

            <div className="board-footer" > {
                hands && hands.map((hand, index) => (
                    <PlayerHand stackType="hand"
                        key={index}
                        cards={hand}
                        playerId={index + 1}
                        select={select}
                        playSelected={playSelected}
                        pickupCards={pickupCards}
                        sortHand={sortHand}
                        selectedAmount={currentPlayer === index + 1 ? selectedAmount : null}
                    />
                ))}
            </div>
        </div>
    )
}
export default Board;