import React, { useEffect, useState } from 'react';
import { gameState, handsState, discardState, gameInfo, playerHandState, playersState, myState } from '../Atoms';
import Lobby from './Lobby';
import Game from '../Game';
import openSocket from 'socket.io-client';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
const socket = openSocket('http://localhost:5000');

const President = () => {
    const [game, setGame] = useRecoilState(gameState);
    const [hands, setHands] = useRecoilState(handsState);
    const [playerHand, setPlayerHand] = useRecoilState(playerHandState);
    const [myself, setMyself] = useRecoilState(myState);
    const [players, setPlayers] = useRecoilState(playersState);
    const [discard, setDiscard] = useRecoilState(discardState);
    const [info, setInfo] = useRecoilState(gameInfo);
    useEffect(() => {
        console.log('useEffects createRoom:lobby')
        createRoom("lobby");
    }, [])

    const checkPermission = (playerId) => {
        return game.activePlayerId === playerId;
    }

    const createRoom = (room) => {
        socket.emit('create-room', room);
    }

    const connect = (name) => {
        console.log('join-game, name:', name)
        socket.emit('join-game', name);
        console.log('join-game emitted')
    }

    const test = (name) => {
        console.log('test name:', name)
        socket.emit('test', name);
        console.log('test emitted')
    }

    const startGame = () => {
        console.log('startGame')
        socket.emit('start-game');
    }

    const makeMove = (data) => {
        if (checkPermission(data.playerId)) {
            console.log('emitting makeMove ==>', data.type)
            socket.emit('make-move', data)
        }
    }

    const saveSortedHand = (sortedHand, playerId) => {
        console.log('saveSortedHand', sortedHand, playerId)
        socket.emit('save-sorted-hand', { sortedHand, playerId })
    }

    const lobbyActions = { connect, test, startGame };
    const gameActions = { makeMove, saveSortedHand };

    //INCOMING
    socket.on("on-join", (data) => {
        if (data.error) {
            console.log('Error:', data.error);
        } else {
            console.log('on-join clients:', data.clients)
            setPlayers(data.clients)
            //let stateCopy = Object.assign({}, game);
            //stateCopy.players = response.clients;
            //setGame(stateCopy);
        }
    });

    socket.on('connection', (response) => {
        console.log('on connection : response:', response)
    });

    socket.on('get-state', state => {
        console.log('get-state:', state)
    });

    socket.on('start-game-update', data => {
        console.log('start game update:', data)
        initializeGameData(data)
        //setPlayers(data.clients);
        //setHands
    });

    const initializeGameData = (data) => {
        //data.playerName, data.stage
        setPlayers(data.clients);
        setHands(data.hands);
        setPlayerHand(data.hands[game.playerId - 1]);
        setMyself({ playerHand: data.hands[game.playerId - 1], playerId: game.playerId, playerName: game.playerName })
        setInfo({ numOfCardsNeeded: data.numOfCardsNeeded, vtb: data.vtb, isMaxed: data.isMaxed });
        setDiscard({ discard: data.discard, lastMove: data.lastMove });
        setGame({ ...game, stage: data.stage, activePlayerId: data.activePlayerId });
    }

    socket.on('update', newState => {
        console.log('update received, newState ==>', newState)
        let stateCopy = Object.assign({}, game);
        stateCopy = { ...stateCopy, ...newState }
        console.log('stateCopy:>>', stateCopy)
        setGame(stateCopy);
    });

    socket.on('made-move', data => {
        //const discardCopy = {...discard};
        //discardCopy.discardPile = [...discardCopy.discardPile, data.discardPile];
        //discardCopy.lastMove = []
        setPlayerHand(data.playerHand);
        //setDiscard(data.discard);
        //setLastMove(data.lastMove);
        //todo: make discard an object with discardPile: [] and lastMove: []
    });

    socket.on('update-after-play', data => {
        //console.log('update received, newState ==>', newState)
        //let stateCopy = Object.assign({}, game);
        //stateCopy = { ...stateCopy, ...newState }
        //setGame(stateCopy);
        setDiscard({ discard: data.discard, lastMove: data.lastMove });
        setInfo({ numOfCardsNeeded: data.numOfCardsNeeded, isMaxed: data.isMaxed, vtb: data.vtb });
        //numOfCardsNeeded isMaxed vtb
    });

    socket.on("play-cards", data => {
        console.log('play-cards', data);
        let stateCopy = Object.assign({}, game);
        stateCopy.cards = data.hands;
        setGame(stateCopy);
    });

    const handleStateChange = (updates) => {
        //todo - call this after receiving an update and use it to save an individual atom instead of the entire state
        updates.forEach(update => {
            switch (update.key) {
                case "playerName":
                    //do somthing
                    break;
                case "playerId":
                    //do something
                    break;
                default: break;
            }
        })
    }


    return (
        <div>
            {game && game.stage === "lobby" &&
                <Lobby players={game.players} actions={lobbyActions} />}
            {game && game.stage === "game" &&
                <Game actions={gameActions} />}
        </div>
    )
}


export default President