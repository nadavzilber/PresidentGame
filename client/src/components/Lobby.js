import React, { useState } from 'react';
import {
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { clientState, gameState, msgState } from '../Atoms';

const Lobby = ({ players, actions }) => {
    const [name, setName] = useState('');
    const [game, setGame] = useRecoilState(gameState);
    const [clients, setClients] = useRecoilState(clientState);
    const [msgs, setMsgs] = useRecoilState(msgState);
    // console.log('Lobby actions:', actions);
    // console.log('Lobby game state:', game)

    const onClickHandler = (name, e) => {
        e.preventDefault();
        actions.joinGame(name);
    }

    return (
        <div>
            <>
                CLIENTS {JSON.stringify(clients)}
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <button disabled={name === ""} onClick={(e) => onClickHandler(name, e)}>Join Game</button>
                {/* <button disabled={!game.players ? true : false} onClick={() => actions.startGame()}>start</button> */}
                <button onClick={() => actions.startGame()}>Start Game ({clients.length === 0 ? 'no players' : clients.length === 1 ? '1 player' : `${clients.length} players`})</button>
            </>
            {clients && <ul> {clients.map((client, index) =>
                <li key={index}>{client.playerName} id: {client.playerId}</li>
            )}</ul>}
            {msgs && msgs.lobby && msgs.lobby.msg && <h1>{msgs.lobby.msg}</h1>}
        </div>
    )
}


export default Lobby;