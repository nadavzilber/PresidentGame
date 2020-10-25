import React, { useEffect, useState } from 'react';
import { gameState } from '../Atoms';
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
    useEffect(() => {
        console.log('useEffects createRoom:lobby')
        createRoom("lobby");
    }, [])

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
        console.log('makeMove')
        socket.emit('make-move', data)
    }

    const lobbyActions = { connect, test, startGame };
    const gameActions = { makeMove };

    //INCOMING
    socket.on("on-join", (response) => {
        if (response.error) {
            console.log('Error:', response.error);
        } else {
            console.log('on-join clients:', response.clients)
            let stateCopy = Object.assign({}, game);
            stateCopy.players = response.clients;
            setGame(stateCopy);
        }
    });

    socket.on('connection', (response) => {
        console.log('on connection : response:', response)
    });

    socket.on('get-state', state => {
        console.log('get-state:', state)
    });

    socket.on('update', newState => {
        console.log('update received', newState)
        let stateCopy = Object.assign({}, game);
        stateCopy = { ...stateCopy, ...newState }
        setGame(stateCopy);
    })

    socket.on("play-cards", data => {
        console.log('play-cards', data);
        let stateCopy = Object.assign({}, game);
        stateCopy.cards = data.hands;
        setGame(stateCopy);
    });


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