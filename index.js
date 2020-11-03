const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const port = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { initGame, valueToBeatToString } = require('./cards');
const state = {
  clients: [],
  activePlayerId: 1,
  discard: [],
  lastMove: [],
  vtb: 0,
  hands: [],
};
io.on("connection", (socket) => {
  playerIdCounter = 1;
  console.log("We have a new connection!");

  socket.on("disconnect", () => {
    console.log("User has left");
  });

  //todo - need to socket.broadcast or figure out the right method to send to the right clients

  // socket.on('create-room', (room) => {
  //   console.log('create room:', room)
  //   socket.join(room);
  // });
  // let checkConnection = () => {
  //   return socket.connected;
  // }

  // let inter = setInterval(()=> {
  //   console.log('connected?',checkConnection());
  // }, 5000)


  socket.on("join-game", (playerName) => {
    console.log(playerName, 'has joined the game')
    const sessionID = socket.id;
    console.log(playerName, 'sessionID:', sessionID);
    let clientIDs = state.clients.map(client => client.sessionID);
    if (clientIDs.includes(sessionID)) {
      // sending to all clients in 'game' room, including sender
      io.emit('on-join', { error: "This sessionID already joined" }); //.in('lobby')
    } else {
      state.clients.push({ playerName, sessionID, playerId: playerIdCounter });
      playerIdCounter++;
      //socket.emit("on-join", { clients: state.clients });
      io.emit('on-join', { clients: state.clients }); //in('lobby')
      //todo: this isnt right
      //state.clients.forEach(client => socket.emit("player-info-update", { playerName: client.playerName, playerId: client.playerId }));
      //io.emit('player-info-update', state.clients)
      const lastIndex = state.clients.length - 1;
      socket.emit("player-info-update", { playerName: state.clients[lastIndex].playerName, playerId: state.clients[lastIndex].playerId });
    }

    //socket.emit("on-join", state.clients);
  });

  socket.on("start-game", () => {
    console.log('start-game');
    if (state.clients.length > 1) {
      let newState = initGame(state.clients);
      Object.assign(state, newState);
      //console.log('new full state:', state)
      console.log('state.clients:', state.clients)
      //io.in('lobby').emit('start-game', { state });
      state.clients.forEach((client) => {
        // sending to individual socketid (private message)
        io.to(client.sessionID).emit('start-game-update', state);
      })
    } else {
      console.log('not enough players connected')
      socket.emit('msg-update', { msg: "Need at least 2 players in order to start the game" });
    }
  });

  socket.on("make-move", (move) => {
    console.log('makeMove:', move);
    if (move.type === "playCards") {
      playCards(move);
    } else if (move.type === "pickupCards") {
      state.discard.forEach((card) => state.hands[state.activePlayerId - 1].push(card));
      state.lastMove.forEach((card) => state.hands[state.activePlayerId - 1].push(card))
      state.discard = [];
      state.lastMove = [];
      state.numOfCardsNeeded = 0;
      state.vtb = 0;
      state.isMaxed = false;
    }
    isPlayerHandEmpty();
    //io.in('lobby').emit('update', state);
    socket.emit('made-move', { playerHand: state.hands[state.activePlayerId - 1] });
    nextTurn();
    const data = { activePlayerId: state.activePlayerId, hands: state.hands, discard: state.discard, lastMove: state.lastMove, vtb: state.vtb, numOfCardsNeeded: state.numOfCardsNeeded, isMaxed: state.isMaxed };
    io.emit('update-after-play', data); //in('lobby').
  });

  socket.on("save-sorted-hand", (data) => {
    state.hands[data.playerId - 1] = data.sortedHand;
    //socket.emit('update', state.hands[data.playerId - 1]);
  })

});

const nextTurn = () => {
  console.log('state.clients.length?', state.clients.length, 'current state.activePlayerId:', state.activePlayerId)
  state.activePlayerId = state.activePlayerId + 1 > state.clients.length ? 1 : state.activePlayerId + 1;
}
const playCards = (data) => {
  console.log('PLAYCARDS data:::', data)
  let playedCards = data.played.map(card => ({ ...card, isSelected: false }));
  const uniqueIdPlayedCards = playedCards.map(card => card.uniqueId);
  let vtb = valueToBeatToString(data.cardToBeat);
  const newHand = state.hands[state.activePlayerId - 1].filter(card => !uniqueIdPlayedCards.includes(card.uniqueId));
  state.hands[state.activePlayerId - 1] = newHand;

  newState = {
    discard: [...state.discard, ...playedCards],
    lastMove: playedCards,
    numOfCardsNeeded: playedCards.length,
    vtb,
    isMaxed: vtb === 'Joker'
  }
  Object.assign(state, newState);
}

const isPlayerHandEmpty = () => {
  //todo: check if player's hand is empty
  //if so ==> they won, add winner data (pres,vice...) => check if game can still go on (if more players are left), if so => nextTurn
  //if not => nextTurn
}

app.use(router);

server.listen(port, () => console.log(`Server has started on port ${port}`));