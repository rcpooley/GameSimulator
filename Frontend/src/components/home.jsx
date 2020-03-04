import React from 'react';
import { Link } from 'react-router-dom';
import MainContainer from './mainContainer';
import P from './paragraph';

class Home extends React.Component {
    start() {}

    join() {}

    render() {
        return (
            <MainContainer>
                <P>
                    <Link to="/selectgame">
                        <button
                            onClick={() => this.start()}
                            className="btn btn-primary"
                        >
                            Create a Game
                        </button>
                    </Link>
                </P>
                <P>
                    <Link to="/joingame">
                        <button
                            onClick={() => this.join()}
                            className="btn btn-primary"
                        >
                            Join a Game
                        </button>
                    </Link>
                </P>
            </MainContainer>
        );
    }
}

export default Home;
