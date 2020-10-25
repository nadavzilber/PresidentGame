import React from 'react';
import logo from './logo.svg';
import Board from './components/Board'
import Game from './Game';
import Lobby from './components/Lobby'
//import './App.css';
import President from './components/President'
import { RecoilRoot } from 'recoil';

function App() {
  // const config = { numberOfPlayers: 2 };
  // connect();
  return (
    <RecoilRoot>
      <President />

      {/* <div className="App">
        <header className="App-header">
          <Board config={config} />
        </header>
      </div> */}
    </RecoilRoot>
  );
}

export default App;
