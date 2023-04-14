import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:3002");
let intervalId;
const players = {};
const currentPlayerId = 0;

function sendPacket(message) {
    ws.send(JSON.stringify(message));
}

ws.on("open", () => {
    ws.send("game");
    sendPacket({
        id: currentPlayerId,
        positionTop: 50,
        positionLeft: 50,
        size: 100,
        alive: true
    });

    intervalId = setInterval(() => {
        const currentPlayer = players[currentPlayerId];
        
        if (currentPlayer === undefined) {
            console.log("Waiting for currentPlayer");
            return;
        }

        const {positionTop, positionLeft} = currentPlayer;
        const target = Object.values(players).filter(player => player.id !== currentPlayerId && player.size < currentPlayer.size && player.alive)[0];

        if (target === undefined) {
            console.log("No target");
            return;
        }
        
        const targetPositionTop = target.positionTop;
        const targetPositionLeft = target.positionLeft;

        console.log(`My pos: ${positionTop}:${positionLeft} target: ${targetPositionTop}:${targetPositionLeft}`);

        if (targetPositionTop > positionTop) {
            currentPlayer.positionTop += 1;
            sendPacket(currentPlayer);
        } else if (targetPositionTop < positionTop) {
            currentPlayer.positionTop -= 1;
            sendPacket(currentPlayer);
        } else if (targetPositionLeft > positionLeft) {
            currentPlayer.positionLeft += 1;
            sendPacket(currentPlayer);
        } else if (targetPositionLeft < positionLeft) {
            currentPlayer.positionLeft -= 1;
            sendPacket(currentPlayer);
        }

    }, 10);
});
ws.on("message", (message) => {
    let data = JSON.parse(message.toString("utf-8"));
    players[data.id] = data;
});
