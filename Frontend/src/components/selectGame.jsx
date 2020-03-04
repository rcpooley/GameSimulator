import React from 'react';
import { Link } from 'react-router-dom';
import remote from './remote';
import MainContainer from './mainContainer';
import P from './paragraph';

class SelectGame extends React.Component {
    async select(gameID) {
        const code = await this.props.socket('createGame', gameID);
        this.props.redirect(`/getname/${code}`);
    }

    render() {
        const { remote } = this.props;
        return (
            <MainContainer>
                <P>
                    <h4>Select a game</h4>
                </P>
                <P>
                    {remote.map(({ id, name }) => (
                        <button
                            className="btn btn-primary"
                            key={id}
                            onClick={() => this.select(id)}
                        >
                            {name}
                        </button>
                    ))}
                </P>
                <P>
                    <Link to="/">
                        <button className="btn btn-secondary">Back</button>
                    </Link>
                </P>
            </MainContainer>
        );
    }
}

export default remote(SelectGame, 'fetchGames');
