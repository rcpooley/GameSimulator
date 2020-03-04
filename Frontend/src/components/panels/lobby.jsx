import React from 'react';

class Lobby extends React.Component {
    render() {
        const { game } = this.props;
        return (
            <MainContainer>
                <P>
                    <h4>Waiting to start</h4>
                    <h5>Code: {game.code}</h5>
                </P>
                <P>
                    {game.players.map((p, idx) => (
                        <div key={idx}>{p.name}</div>
                    ))}
                </P>
            </MainContainer>
        );
    }
}
