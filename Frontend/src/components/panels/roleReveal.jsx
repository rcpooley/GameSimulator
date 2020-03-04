import React from 'react';
import MainContainer from '../mainContainer';
import P from '../paragraph';

class RoleReveal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showRole: false
        };
    }

    render() {
        const { player } = this.props;
        const { showRole } = this.state;
        const { name, visible } = player.role;
        return (
            <MainContainer>
                <P>
                    <h4>Your secret role</h4>
                </P>
                {showRole ? (
                    <div>
                        <div>{name}</div>
                        {visible.length > 0 && (
                            <P>You see {visible.join(', ')}</P>
                        )}
                    </div>
                ) : (
                    <button
                        className="btn btn-danger"
                        onClick={() => this.setState({ showRole: true })}
                    >
                        Click to reveal
                    </button>
                )}
            </MainContainer>
        );
    }
}

export default RoleReveal;
