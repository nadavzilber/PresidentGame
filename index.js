const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const port = process.env.PORT || 5000;

const router = require("./router");
const { emit } = require("process");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("We have a new connection!");

  socket.on("disconnect", () => {
    console.log("User has left");
  });

  const state = {
    clients: [],
    activePlayerId: 1,
    discardPile: [],
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
    io.in('lobby').emit('start-game', { clients: state.clients });
  })
  socket.on("test", (name) => {
    console.log('TEST name:', name);
    //socket.emit("getState", state)
    io.in('lobby').emit('get-state', { state });
  });
  socket.on("play-cards", (playedCards) => {
    console.log('play-cards:', playedCards);
    let cardIDs = playedCards.map(card => card.id);
    state.cards[activePlayerId] = state.cards[activePlayerId - 1].filter(card => cardIDs.includes(card.id))
    //socket.emit("on-play", state)
    io.in('lobby').emit('play-cards', { state });
  })

});

app.use(router);

server.listen(port, () => console.log(`Server has started on port ${port}`));