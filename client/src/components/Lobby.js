import React, { useState } from 'react';
import { connect, test } from '../Socket';

const Lobby = ({ players }) => {
    const [name, setName] = useState('');
    const onClickHandler = (name, e) => {
        e.preventDefault();
        console.log('onClick name:', name)
        connect(name);
    }
    return (
        <div>
            <>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <button disabled={name === ""} onClick={(e) => onClickHandler(name, e)}>connect</button>
                <button disabled={name === ""} onClick={() => test(name)}>test</button>
            </>
            {players && players.map((player, index) => <div key={index}>{player.name}</div>)}
        </div>
    )
}


export default Lobby;