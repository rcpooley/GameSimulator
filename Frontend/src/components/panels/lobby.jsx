import React from 'react';
import MainContainer from '../mainContainer';
import P from '../paragraph';

class Lobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: [
                { name: 'Merlin', enabled: true },
                { name: 'Percival', enabled: true },
                { name: 'Mordred', enabled: true },
                { name: 'Morgana', enabled: true },
                { name: 'Assassin', enabled: true },
                { name: 'Oberon', enabled: false }
            ]
        };
    }

    start() {
        this.props.call('start', this.state.roles);
    }

    render() {
        const { game, player } = this.props;
        const { roles } = this.state;
        return (
            <MainContainer>
                <P>
                    <h4>Waiting to start</h4>
                    <div>
                        Code: <strong>{game.code}</strong>
                    </div>
                </P>
                <P>
                    <div>
                        <strong>Players</strong>
                    </div>
                    <ol className="d-inline-block">
                        {game.players.map((p, idx) => (
                            <li key={idx}>{p.name}</li>
                        ))}
                    </ol>
                </P>
                {player.creator && (
                    <P>
                        <div className="text-left d-inline-block">
                            {roles.map((r, idx) => (
                                <div key={idx}>
                                    <input
                                        type="checkbox"
                                        checked={r.enabled}
                                        onChange={e => {
                                            const newRoles = roles.slice();
                                            newRoles[idx].enabled =
                                                e.target.checked;
                                            this.setState({ roles: newRoles });
                                        }}
                                    />
                                    {r.name}
                                </div>
                            ))}
                        </div>
                        <P>
                            <button
                                className="btn btn-primary"
                                onClick={() => this.start()}
                                disabled={
                                    game.players.length < 5 ||
                                    game.players.length > 10
                                }
                            >
                                Start
                            </button>
                        </P>
                    </P>
                )}
            </MainContainer>
        );
    }
}

export default Lobby;
