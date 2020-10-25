import openSocket from 'socket.io-client';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { gameState } from './Atoms'

const socket = openSocket('http://localhost:5000');

const Socket = () => {

    //OUTGOING
    function connect(name) {
        console.log('join-game, name:', name)
        socket.emit('join-game', name);
        console.log('join-game emitted')
    }

    function test(name) {
        console.log('test name:', name)
        socket.emit('test', name);
        console.log('test emitted')
    }


    //INCOMING
    socket.on("on-join", (clients) => {
        console.log('on-join clients:', clients)
        // let stateCopy = Object.assign({}, game);
        // stateCopy.players = clients;
        // setGame(stateCopy);
    })

    socket.on('connection', (response) => {
        console.log('on connection : response:', response)
    })

    socket.on('getState', state => {
        console.log('getState:', state)
    })

}
export default Socket;