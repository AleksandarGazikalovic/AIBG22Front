export class WebsocketHandler {
    constructor(url, game) {
        this.game = game;
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onConnect.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }
    onConnect(data) {
        console.info("Websocket connected")
    }
    onMessage(message) {
        console.log(message);
        const data = JSON.parse(message.data);
        this.game.update(data, data.player1, data.player2);
        if (data.winner !== null) {
            this.game.showWinner(data.winner);
        }
    }
}
