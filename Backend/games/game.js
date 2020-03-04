class Game {
    constructor(id, creator) {
        this.id = id;
        this.creator = creator;
        this.nextPlayerID = 0;
        this.players = {};
    }

    addPlayer(id, name) {
        this.players[id] = { name, idx: this.nextPlayerID++ };
    }

    removePlayer(id) {
        delete this.players[id];
    }

    info() {
        return {
            code: this.id,
            players: Object.values(this.players)
        };
    }
}

module.exports = Game;
