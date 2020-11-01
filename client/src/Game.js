import React, { useState, useEffect } from 'react';
import Opponent from './components/Opponent';
import PlayerHand from './components/PlayerHand';
import GameHost from './components/GameHost';
import DiscardPile from './components/DiscardPile';
import Deck from './Deck'
import './components/styles.css';
import { gameState, handsState, playersState, discardState, gameInfo, playerHandState, myState } from './Atoms';
import { useRecoilState } from 'recoil';

const Game = ({ actions }) => {
    const [state, setGameState] = useRecoilState(gameState);
    const [hands, setHands] = useRecoilState(handsState);
    const [playerHand, setPlayerHand] = useRecoilState(playerHandState);
    const [myself, setMyself] = useRecoilState(myState);
    const [players, setPlayers] = useRecoilState(playersState);
    const [discard, setDiscard] = useRecoilState(discardState);
    const [info, setInfo] = useRecoilState(gameInfo);
    const [opponents, setOpponents] = useState([]);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [gameMsgs, setGameMsgs] = useState();
    const [winners, setWinners] = useState([]);

    const setupOpponents = () => {
        let notMe = state.clients.filter(client => (client.playerId !== state.playerId && client.playerName !== state.playerName));
        console.log('setupOpponents ==> Me: ', state.playerName, state.playerId, 'notMe: ', notMe)
        setOpponents(notMe);
    }

    const getOpponent = (id) => {
        //console.log('opponents[id]:',opponents[id])
        return <Opponent
            key={id}
            position={id + 1}
            name={opponents[id].name}
            cards={state.hands[id + 1]}
            playerId={id + 1}
            playerName={opponents[id].name}
            select={select}
        />
    }


    const valueToBeatToNumber = (vtb) => {
        if (vtb === 'Joker') return 2;
        if (vtb === 'Ace') return 14;
        if (vtb === 'King') return 13;
        if (vtb === 'Queen') return 12;
        if (vtb === 'Jack') return 11;
        return vtb;
    }

    const valueToBeatToString = (vtb) => {
        //todo: it shouldnt be both here and in the client...
        //console.log('valueToBeatToString:', vtb)
        if (vtb === 2 || vtb === 15) return 'Joker';
        if (vtb === 14) return 'Ace';
        if (vtb === 13) return 'King';
        if (vtb === 12) return 'Queen';
        if (vtb === 11) return 'Jack';
        return vtb;
    }

    const select = (uniqueId, playerId, type) => {
        type === 'clearAll' ? clearAllSelections(playerId) : type === 'one' ? selectOne(uniqueId, playerId) : type === 'selectAll' ? selectAll(uniqueId, playerId, false) : selectAll(uniqueId, playerId, true);;
    }

    const selectOne = (uniqueId, playerId) => {
        if (playerId !== state.activePlayerId) return;
        //let playerHandIndex = playerId - 1;
        //let playerHand = [...state.hands[playerHandIndex]];
        let playerHand = [...myself.playerHand];
        const cardIndex = playerHand.findIndex(card => card.uniqueId === uniqueId);
        let card = { ...playerHand[cardIndex] };
        card.isSelected = !!card.isSelected ? false : true;
        //let allHandsCopy = [...hands];
        playerHand[cardIndex] = card;
        setMyself({ ...myself, playerHand });

        //allHandsCopy[playerHandIndex] = playerHand;
        //setGameState({ ...state, hands: allHandsCopy });
        //setHands(allHandsCopy);
        setSelectedAmount(card.isSelected ? selectedAmount + 1 : selectedAmount - 1);
    }

    const selectAll = (uniqueId, playerId, deselectAll) => {
        if (playerId !== state.activePlayerId) return;
        let playerHandIndex = playerId - 1;
        let handCopy = [...state.hands[playerHandIndex]];
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
        let allHandsCopy = [...state.hands];
        allHandsCopy[playerHandIndex] = handCopy;
        setGameState({ ...state, hands: allHandsCopy });
        setSelectedAmount(deselectAll ? selectedAmount - changedCardsAmount : selectedAmount + changedCardsAmount);
    }

    const clearAllSelections = (playerId) => {
        if (playerId !== state.activePlayerId) return;
        let index = playerId - 1;
        let hand = [...state.hands[index]];
        let allHandsCopy = [...state.hands];
        hand = hand.map((card) => {
            return { ...card, isSelected: false };
        });
        allHandsCopy[index] = hand;
        setGameState({ ...state, hands: allHandsCopy });
        setSelectedAmount(0);
    }

    const isEnoughCards = (numOfCardsPlayed) => {
        return info.numOfCardsNeeded === 0 || numOfCardsPlayed === info.numOfCardsNeeded;
    }

    const isCardValueHigher = (nonJokerValue) => {
        let playedValue = valueToBeatToNumber(nonJokerValue)
        let vtb = valueToBeatToNumber(info.vtb);
        return (playedValue > vtb);
    }

    const validateBeforePlay = (playedCards) => {
        let isEnough = isEnoughCards(playedCards.length);
        let resp2 = checkIfPlayedCardsMatch(playedCards);
        if (!info.isMaxed && resp2.isSet && isEnough) {
            let response = checkIfJokerWasPlayed(playedCards);
            let cardToBeatString = valueToBeatToString(resp2.nonJokerValue)
            if (info.numOfCardsNeeded === 0 && info.vtb === 0)
                return { cardToBeat: cardToBeatString, isValidated: true };
            if (response.isJokerPlayed && response.onlyJokers)
                return { cardToBeat: 2, isValidated: true };
            else
                return { cardToBeat: resp2.nonJokerValue, isValidated: isCardValueHigher(resp2.nonJokerValue) }
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

    const playSelected = (playerId) => {
        if (playerId !== state.activePlayerId) return;
        let index = playerId - 1;
        let selectedCards = state.hands[index].filter(card => card.isSelected);
        //let cardsRemainingInHand = state.hands[index].filter(card => !card.isSelected);
        let play = validateBeforePlay(selectedCards);
        if (play.isValidated) {
            console.log('play is validated')
            actions.makeMove({ type: 'playCards', played: selectedCards, playerId });
        }
    }

    const sortHand = (playerId) => {
        //let allHandsCopy = [...state.hands];
        //let playerHandIndex = playerId - 1;
        let playerHand = [...myself.playerHand];
        playerHand.sort(compareNumbers);
        //allHandsCopy[playerHandIndex] = playerHand;
        actions.saveSortedHand(playerHand, playerId)
        setMyself({ ...myself, playerHand });
    }

    const compareNumbers = (card1, card2) => {
        if (card1.num > card2.num) return 1;
        if (card2.num > card1.num) return -1;
        return 0;
    };

    // if (opponents.length === 0 && state.playerId && state.playerName)
    //     setupOpponents();

    return (
        <div className="app-container">
            {/* <div className="opponent-top horizontal">
                {opponents && opponents[1] && getOpponent(1)}</div>
            <div className="opponent-left">
                {opponents && opponents[0] && getOpponent(0)}
            </div> */}
            <div className="board">
                ActivePlayerId:{state.playerId}
                <GameHost currentPlayer={state.activePlayerId}
                    numOfCardsNeeded={info.numOfCardsNeeded}
                    valueToBeat={info.vtb}
                    isMaxed={info.isMaxed}
                    gameMsgs={gameMsgs}
                />
                <DiscardPile cards={discard.discardPile || []}
                    lastMove={discard.lastMove || []} /></div>
            {/* <div className="opponent-right">
                {opponents && opponents[2] && getOpponent(2)}</div> */}
            <span>myself:{JSON.stringify(myself)}</span>
            <div className="my-hand">
                {myself && (
                    <PlayerHand stackType="hand"
                        cards={myself.playerHand}
                        playerId={myself.playerId}
                        playerName={myself.playerName}
                        select={select}
                        playSelected={playSelected}
                        pickupCards={actions.makeMove}
                        sortHand={sortHand}
                        selectedAmount={state.activePlayerId === state.playerId ? selectedAmount : null}
                    />
                )}
            </div>
        </div>
    )
}

export default Game;