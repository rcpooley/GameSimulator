const Game = require('./games/game');

const GameClasses = {
    avalon: Game
};

class GameHandler {
    constructor(io) {
        this.io = io;
        this.funcs = {};
        this.games = {};

        Object.getOwnPropertyNames(GameHandler.prototype)
            .filter(f => f.startsWith('handle'))
            .forEach(f => {
                const name = f.substring('handle'.length).toLowerCase();
                this.funcs[name] = f;
            });
    }

    onSocket(socket) {
        console.log('Socket connected', socket.id);

        socket.on('callFunc', (id, func, args, cb) => {
            const name = this.funcs[func.toLowerCase()];
            if (!name) {
                cb({ error: 'Function not found' });
            } else {
                try {
                    const resp = this[name]({ id, socket }, ...args);
                    cb({ resp });
                } catch (e) {
                    console.error(
                        `Error occurred while invoking ${func}(${args}):`,
                        e
                    );
                    cb({ error: e.message });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected', socket.id);
        });
    }

    getNewGameID() {
        const validLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

        const ids = Object.keys(this.games);
        let id = null;
        while (id === null || ids.includes(id)) {
            id = Array(4)
                .fill(null)
                .map(
                    () =>
                        validLetters[
                            Math.floor(Math.random() * validLetters.length)
                        ]
                )
                .join('');
        }
        return id;
    }

    getGame(playerID) {
        const gameID = Object.keys(this.games).filter(
            gid => playerID in this.games[gid].players
        )[0];
        if (!gameID) {
            throw new Error('No game found');
        }
        return this.games[gameID];
    }

    handleInit({ socket, id }) {
        socket.join(id);
    }

    handleFetchGames() {
        return [{ id: 'avalon', name: 'Avalon' }];
    }

    handleCreateGame({ id }, gameType) {
        const GameClass = GameClasses[gameType];
        if (!GameClass) {
            throw new Error(`${gameType} is an unrecognized game type`);
        }

        const gameID = this.getNewGameID();
        this.games[gameID] = new GameClass(this.io, gameID, id);
        return gameID;
    }

    handleFindGame(_, gameCode) {
        if (gameCode in this.games) {
            return true;
        } else {
            return false;
        }
    }

    handleJoinGame({ id }, gameCode, name) {
        // Remove them from current game
        try {
            const oldGame = this.getGame(id);
            oldGame.removePlayer(id);
        } catch (e) {}

        const game = this.games[gameCode];
        if (!game) {
            throw new Error(`Game not found with code ${gameCode}`);
        }
        game.addPlayer(id, name);

        return true;
    }

    handleGameRender({ id }) {
        return this.getGame(id).info(id);
    }

    handleGameCall({ id }, gameFunc, args) {
        return this.getGame(id).call({ id }, gameFunc, args);
    }
}

module.exports = GameHandler;
