import React, { useEffect, useState } from 'react';
import './board.css';
import GameHost from './GameHost';
import PlayerHand from './PlayerHand';
import DiscardPile from './DiscardPile';
import Deck from '../Deck';
import Opponent from './Opponent'
import { useRecoilState } from 'recoil';
import { handsState, discardState } from '../Atoms';

const Board = ({ config }) => {

    const numberOfPlayers = config.numberOfPlayers;

    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [numOfCardsNeeded, setNumOfCardsNeeded] = useState(0);
    const [isMaxed, setMaxed] = useState(false);
    const [valueToBeat, setValueToBeat] = useState(0);
    const [lastMove, setLastMove] = useState([]);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [gameMsgs, setGameMsgs] = useState();
    const [winners, setWinners] = useState([]);
    const [opponents, setOpponents] = useState([]);

    //const hands = useRecoilValue(handsState); //only reading the atom
    //const setHands = useSetRecoilState(handsState) //only writing to the atom
    const [hands, setHands] = useRecoilState(handsState);
    const [discardPile, setDiscardPile] = useRecoilState(discardState);
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
        let opps = [
            { name: "moshe", cards: [...hand2] },
            { name: "donald", cards: [...hand2] },
            { name: "robin", cards: [...hand2] }
        ];
        setOpponents(opps);
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
        if (playerId !== currentPlayer) return;
        let playerHandIndex = playerId - 1;
        let playerHand = [...hands[playerHandIndex]];
        const cardIndex = playerHand.findIndex(card => card.uniqueId === uniqueId);
        let card = { ...playerHand[cardIndex] };
        card.isSelected = !!card.isSelected ? false : true;
        let allHandsCopy = [...hands];
        playerHand[cardIndex] = card;
        allHandsCopy[playerHandIndex] = playerHand;
        setHands(allHandsCopy);
        setSelectedAmount(card.isSelected ? selectedAmount + 1 : selectedAmount - 1);
    }

    const selectAll = (uniqueId, playerId, deselectAll) => {
        if (playerId !== currentPlayer) return;
        let playerHandIndex = playerId - 1;
        let handCopy = [...hands[playerHandIndex]];
        const cardIndex = handCopy.findIndex(card => card.uniqueId === uniqueId);
        let selectedCard = { ...handCopy[cardIndex] };
        let changedCardsAmount = 0;
        handCopy = handCopy.map(card => {
            if (card.num === selectedCard.num) {
                changedCardsAmount++;
                return { ...card, isSelected: deselectAll ? false : true };
            }
            return card;
        });
        let allHandsCopy = [...hands];
        allHandsCopy[playerHandIndex] = handCopy;
        setHands(allHandsCopy);
        setSelectedAmount(deselectAll ? selectedAmount - changedCardsAmount : selectedAmount + changedCardsAmount);
    }

    const clearAllSelections = (playerId) => {
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
        let hand = [...hands[index]];
        let allHandsCopy = [...hands];
        hand = hand.map((card) => {
            return { ...card, isSelected: false };
        });
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
        let isEnough = isEnoughCards(playedCards.length);
        let resp2 = checkIfPlayedCardsMatch(playedCards);
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
                setMaxed(true);
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
            if (card.num !== 2) {
                nonJokerValue = card.num;
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
        if (cardsRemainingInHand.length === 0) {
            let winnersCopy = [...winners];
            let finishPlace = winnersCopy.length + 1;
            finishPlace = finishPlace === 1 ? '1st' : finishPlace === 2 ? '2nd' : finishPlace === 3 ? '3rd' : `${finishPlace}th`;
            winnersCopy.push(playerId);
            setWinners(winnersCopy);
            setGameMsgs({ ...gameMsgs, playerWon: { winner: playerId, place: finishPlace } });
        }
    }

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
        }
    }

    const pickupCards = (playerId) => {
        if (playerId !== currentPlayer) return;
        let index = playerId - 1;
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

                <div className="opponents-container">
                    {opponents && opponents.map((op, index) =>
                        (<Opponent
                            key={index}
                            position={index}
                            name={op.name}
                            cards={op.cards}
                            playerId={index + 1}
                            select={select}
                        />))}
                </div>
            </div>

            <div className="board-footer" > {
                hands && hands[0] && (
                    <PlayerHand stackType="hand"
                        cards={hands[0]}
                        playerId={1}
                        select={select}
                        playSelected={playSelected}
                        pickupCards={pickupCards}
                        sortHand={sortHand}
                        selectedAmount={currentPlayer === 1 ? selectedAmount : null}
                    />
                )}
            </div>
        </div>
    )
}
export default Board;