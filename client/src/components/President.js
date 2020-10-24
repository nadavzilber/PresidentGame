import React, { useState } from 'react';
import { gameState } from '../Atoms';
import Lobby from './Lobby';
import Game from '../Game';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

const President = () => {
    const [game, setGame] = useRecoilState(gameState);

    return (
        <div>
            {game && game.stage === "lobby" &&
                <Lobby players={game.players} />}
            {game && game.stage === "game" &&
                <Game />}
        </div>
    )
}


export default President