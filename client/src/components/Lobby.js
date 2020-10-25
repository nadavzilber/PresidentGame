import React, { useState } from 'react';
import { connect, test } from '../Socket';
import {
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { gameState } from '../Atoms';

const Lobby = ({ players, actions }) => {
    const [name, setName] = useState('');
    const [game, setGame] = useRecoilState(gameState);
    console.log('Lobby actions:', actions);
    console.log('Lobby game state:', game)

    const onClickHandler = (name, e) => {
        e.preventDefault();
        console.log('onClick name:', name)
        let resp = actions.connect(name);
        console.log('resp:', resp)
    }

    return (
        <div>
            <>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <button disabled={name === ""} onClick={(e) => onClickHandler(name, e)}>connect</button>
                <button disabled={name === ""} onClick={() => actions.test(name)}>test</button>
            </>
            {players && players.map((player, index) => <div key={index}>{player.name}</div>)}
        </div>
    )
}


export default Lobby;