import React from 'react';
import logo from './logo.svg';
import Board from './components/Board'
import './App.css';

function App() {
  const config = { numberOfPlayers: 2 };
  return (
    <div className="App">
      <header className="App-header">
        <Board config={config} />
      </header>
    </div>
  );
}

export default App;
