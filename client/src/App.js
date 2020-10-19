import React from 'react';
import logo from './logo.svg';
import Board from './components/Board'
import './App.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  const config = { numberOfPlayers: 2 };
  return (
    <RecoilRoot>
      <div className="App">
        <header className="App-header">
          <Board config={config} />
        </header>
      </div>
    </RecoilRoot>
  );
}

export default App;
