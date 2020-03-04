import React from 'react';
import Panels from './panels/index';
import remote from './remote';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            remote: props.remote
        };

        this.listener = this.listener.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('gameUpdate', this.listener);
    }

    componentWillUnmount() {
        this.props.socket.off('gameUpdate', this.listener);
    }

    listener(remote) {
        this.setState({ remote });
    }

    call(gameFunc, ...args) {
        return this.props.call('gameCall', gameFunc, args);
    }

    render() {
        const { socket } = this.props;
        const { remote } = this.state;
        const { game, player } = remote;

        if (!(player.panel in Panels)) {
            return <div>Panel not found</div>;
        }

        const C = Panels[player.panel];

        return (
            <C
                game={game}
                player={player}
                socket={socket}
                call={(...args) => this.call(...args)}
            />
        );
    }
}

export default remote(Game, 'gameRender');
