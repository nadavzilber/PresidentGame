const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const port = process.env.PORT || 5000;

const router = require("./router");
const { emit } = require("process");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const initGame = require('./cards');

io.on("connection", (socket) => {
  console.log("We have a new connection!");

  socket.on("disconnect", () => {
    console.log("User has left");
  });

  const state = {
    clients: [],
    activePlayerId: 1,
    discard: [],
    lastMove: [],
    vtb: 0,
    hands: [],
    playerData: {}
  };

  //todo - need to socket.broadcast or figure out the right method to send to the right clients

  socket.on('create-room', (room) => {
    console.log('create room:', room)
    socket.join(room);
  });

  socket.on("join-game", (name) => {
    console.log(name, 'has joined the game')
    const sessionID = socket.id;
    console.log('sessionID:', sessionID);
    let clientIDs = state.clients.map(client => client.sessionID);
    console.log('clientIDs.includes(sessionID)?', clientIDs.includes(sessionID))
    if (clientIDs.includes(sessionID))
      // sending to all clients in 'game' room, including sender
      io.in('lobby').emit('on-join', { error: "This sessionID already joined" });
    //socket.emit("on-join", { error: "This sessionID already joined" });
    else {
      state.clients.push({ name, sessionID });
      //socket.emit("on-join", { clients: state.clients });
      io.in('lobby').emit('on-join', { clients: state.clients });
    }

    //socket.emit("on-join", state.clients);
  });
  socket.on("start-game", () => {
    console.log('start-game');
    let newState = initGame(state.clients);
    Object.assign(state, newState);
    console.log('new full state:', state)
    io.in('lobby').emit('start-game', { state });
    state.clients.forEach((client) => {
      // sending to individual socketid (private message)
      io.to(client.sessionID).emit('update', state);
    })
  })


  socket.on("test", (name) => {
    console.log('TEST name:', name);
    //socket.emit("getState", state)
    io.in('lobby').emit('get-state', { state });
  });
  socket.on("make-move", (move) => {
    console.log('makeMove:', move);
    if (move.type === "playCards") {
      let playedCardIDs = move.played.map(card => card.id);
      console.log('state.hands:', state.hands);
      state.hands[state.activePlayerId] = state.hands[state.activePlayerId - 1].filter(card => playedCardIDs.includes(card.id))
      state.discard.push(...move.played)
      //socket.emit("on-play", state)
      //TODO: check if maxedOut (if played only 2 or 2s) then ==> state.isMaxed=true;

    } else if (move.type === "pickupCards") {
      state.hands[state.activePlayerId].push(...discard);
      state.discard = [];
    }
    nextTurn();
    console.log('emitting an update')
    io.in('lobby').emit('update', { state });
  });

});

const nextTurn = () => {
  state.activePlayerId = state.activePlayerId + 1 > state.clients.length ? 1 : state.activePlayerId;
}

app.use(router);

server.listen(port, () => console.log(`Server has started on port ${port}`));