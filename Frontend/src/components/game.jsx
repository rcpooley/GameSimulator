import React from 'react';
import MainContainer from './mainContainer';
import P from './paragraph';
import remote from './remote';

class Game extends React.Component {
    render() {
        const { remote } = this.props;
        return (
            <MainContainer>
                <P>
                    <h4>Waiting to start</h4>
                    <h5>Code: {remote.code}</h5>
                </P>
                <P>
                    {remote.players.map((p, idx) => (
                        <div key={idx}>{p.name}</div>
                    ))}
                </P>
            </MainContainer>
        );
    }
}

export default remote(Game, 'gameInfo');
