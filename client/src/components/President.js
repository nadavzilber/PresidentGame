import React, { useState } from 'react';
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

    const lobbyActions = { connect: connect, test: test };


    //INCOMING
    socket.on("on-join", (clients) => {
        console.log('on-join clients:', clients)
        let stateCopy = Object.assign({}, game);
        stateCopy.players = clients;
        setGame(stateCopy);
    })

    socket.on('connection', (response) => {
        console.log('on connection : response:', response)
    });

    socket.on('getState', state => {
        console.log('getState:', state)
    });


    return (
        <div>
            {game && game.stage === "lobby" &&
                <Lobby players={game.players} actions={lobbyActions} />}
            {game && game.stage === "game" &&
                <Game />}
        </div>
    )
}


export default President