import React, { useEffect, useState } from 'react';
import { gameState, handsState, discardState, gameInfo, playerHandState, playersState, myState, clientState, msgState } from '../Atoms';
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
let me = {};
const President = () => {
    const [clients, setClients] = useRecoilState(clientState);
    const [game, setGame] = useRecoilState(gameState);
    const [msgs, setMsgs] = useRecoilState(msgState);
    const [hands, setHands] = useRecoilState(handsState);
    //const [playerHand, setPlayerHand] = useRecoilState(playerHandState);
    const [myself, setMyself] = useRecoilState(myState);
    //const [players, setPlayers] = useRecoilState(playersState);
    const [discard, setDiscard] = useRecoilState(discardState);
    const [info, setInfo] = useRecoilState(gameInfo);

    useEffect(() => {
        console.log('useEffects createRoom:lobby')
        createRoom("lobby");

        socket.on("on-join", (data) => {
            if (data.error) {
                console.log('Error:', data.error);
            } else {
                console.log('on-join clients:', data.clients)
                setClients(data.clients);
            }
        });

        socket.on('connection', (response) => {
            console.log('New connection!', response)
        });

        socket.on('start-game-update', data => {
            console.log('start game update:', data)
            //console.log('myself before:',myself)
            initializeGameData(data)
        });

        socket.on('msg-update', data => {
            console.log('msg-update', data)
            setMsgs({
                lobby: {
                    msg: data.msg
                }
            });
        })

        socket.on('update', newState => {
            console.log('update!!!! received, newState ==>', newState)
            let stateCopy = Object.assign({}, game);
            stateCopy = { ...stateCopy, ...newState }
            setGame(stateCopy);
        });

        socket.on('player-info-update', async data => {
            console.log('player-info-update', data)
            await setMyself({ playerName: data.playerName, playerId: data.playerId });
            me = { playerName: data.playerName, playerId: data.playerId };
            let clientsCopy = [...clients];
            clientsCopy.push({ playerName: data.playerName, playerId: data.playerId });
            //setClients(clientsCopy);
        });

        socket.on('made-move', data => {
            console.log('made move', data);
            setMyself({ ...me, playerHand: data.playerHand });
            //me = { ...me, playerHand: data.playerHand };
        });

        socket.on('update-after-play', data => {
            console.log('update-after-play data:', data)
            setDiscard({ discard: data.discard, lastMove: data.lastMove });
            setInfo({ activePlayerId: data.activePlayerId, numOfCardsNeeded: data.numOfCardsNeeded, isMaxed: data.isMaxed, vtb: data.vtb });
        });

        socket.on("play-cards", data => {
            console.log('play-cards', data);
            let stateCopy = Object.assign({}, game);
            stateCopy.cards = data.hands;
            setGame(stateCopy);
        });
    }, [])


    const checkPermission = (playerId) => {
        return info.activePlayerId === playerId;
    }

    const createRoom = (room) => {
        socket.emit('create-room', room);
    }

    const joinGame = (playerName) => {
        console.log('join-game, playerName:', playerName)
        socket.emit('join-game', playerName);
    }

    const startGame = () => {
        socket.emit('start-game');
    }

    const makeMove = (data) => {
        if (checkPermission(data.playerId)) {
            console.log('emitting makeMove ==>', data)
            socket.emit('make-move', data)
        } else {
            console.log('no permission')
        }
    }

    const saveSortedHand = (sortedHand, playerId) => {
        console.log('saveSortedHand', sortedHand, playerId)
        socket.emit('save-sorted-hand', { sortedHand, playerId })
    }

    const lobbyActions = { joinGame, startGame };
    const gameActions = { makeMove, saveSortedHand };

    const initializeGameData = (data) => {
        setClients(data.clients);
        setHands(data.hands);
        setInfo({ activePlayerId: data.activePlayerId, numOfCardsNeeded: data.numOfCardsNeeded, isMaxed: data.isMaxed, vtb: data.vtb });
        setDiscard({ discard: data.discard, lastMove: data.lastMove });
        setGame({ ...game, stage: data.stage, activePlayerId: data.activePlayerId });
        const myHand = data.hands[me.playerId - 1];
        setMyself({ ...me, playerHand: myHand });
        setMsgs({ lobby: {}, game: {} });
        me = { ...me, playerHand: data.playerHand };
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