class Player {
    constructor(name, id, game) {
        this.name = name;
        this.id = id;
        this.game = game;
        this.idx = game.nextPlayerID++;
        this.panel = 'lobby';
        this.role = null;
    }

    public() {
        return {
            name: this.name
        };
    }

    private() {
        return {
            panel: this.panel,
            creator: this.game.creator === this.id,
            role: this.role
        };
    }
}

class Game {
    constructor(io, id, creator) {
        this.io = io;
        this.id = id;
        this.creator = creator;
        this.nextPlayerID = 0;
        this.players = {};

        this.funcs = {};
        Object.getOwnPropertyNames(Game.prototype)
            .filter(f => f.startsWith('handle'))
            .forEach(f => {
                const name = f.substring('handle'.length).toLowerCase();
                this.funcs[name] = f;
            });
    }

    addPlayer(id, name) {
        this.players[id] = new Player(name, id, this);
        this.broadcastUpdate();
    }

    removePlayer(id) {
        delete this.players[id];
        this.broadcastUpdate();
    }

    info(playerID) {
        return {
            game: {
                code: this.id,
                players: Object.values(this.players).map(p => p.public())
            },
            player: this.players[playerID].private()
        };
    }

    broadcastUpdate() {
        Object.keys(this.players).forEach(id => {
            this.io.to(id).emit('gameUpdate', this.info(id));
        });
    }

    call(obj, func, args) {
        const name = this.funcs[func.toLowerCase()];
        if (!name) {
            throw new Error('Function not found');
        } else {
            return this[name](obj, ...args);
        }
    }

    handleStart(_, roles) {
        const playerIDs = Object.keys(this.players);
        const num = playerIDs.length;

        if (num < 5 || num > 10) {
            throw new Error('Invalid number of players');
        }

        let numEvil;
        if (num <= 6) {
            numEvil = 2;
        } else if (num <= 9) {
            numEvil = 3;
        } else {
            numEvil = 4;
        }
        const numGood = num - numEvil;

        // Pick good and bad
        const badIDs = playerIDs.slice();
        const goodIDs = [];
        while (goodIDs.length < numGood) {
            goodIDs.push(
                badIDs.splice(Math.floor(Math.random() * badIDs.length), 1)[0]
            );
        }

        // Assign roles
        const goodAvailable = goodIDs.slice();
        const badAvailable = badIDs.slice();
        const goodRoles = ['Merlin', 'Percival'];
        const roleMap = {};
        const revMap = {};
        roles
            .filter(r => r.enabled)
            .forEach(({ name }) => {
                const ids = goodRoles.includes(name)
                    ? goodAvailable
                    : badAvailable;
                const id = ids.splice(
                    Math.floor(Math.random() * ids.length),
                    1
                )[0];
                roleMap[id] = name;
                revMap[name] = id;
            });

        // Update player roles and visible people
        playerIDs.forEach(id => {
            const role = roleMap[id];
            let name = role;
            let visible = [];
            if (goodIDs.includes(id)) {
                if (role === 'Merlin') {
                    visible = badIDs.filter(id => roleMap[id] !== 'Mordred');
                } else if (role === 'Percival') {
                    if (Math.random() < 0.5) {
                        visible = [revMap.Merlin, revMap.Morgana];
                    } else {
                        visible = [revMap.Morgana, revMap.Merlin];
                    }
                    visible = visible.filter(n => n != null);
                } else {
                    name = 'Loyal Servant of Arthur';
                }
            } else {
                if (role) {
                    if (role !== 'Oberon') {
                        visible = badIDs.filter(
                            bid => bid !== id && roleMap[bid] !== 'Oberon'
                        );
                    }
                } else {
                    name = 'Minion of Mordred';
                }
            }
            this.players[id].role = {
                name,
                visible: visible.map(id => this.players[id].name)
            };
            this.players[id].panel = 'roleReveal';
        });

        this.broadcastUpdate();
    }
}

module.exports = Game;
