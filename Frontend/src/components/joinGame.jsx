import React from 'react';
import { Link } from 'react-router-dom';
import MainContainer from './mainContainer';
import P from './paragraph';

class JoinGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: ''
        };
    }

    async onSubmit(e) {
        const { code } = this.state;
        const { socket, redirect } = this.props;
        e.preventDefault();

        const valid = await socket('findGame', code);
        if (valid) {
            redirect(`/getname/${code}`);
        }

        return false;
    }

    render() {
        const { code } = this.state;
        return (
            <MainContainer>
                <P>
                    <h4>Game Code</h4>
                </P>
                <form onSubmit={e => this.onSubmit(e)}>
                    <P>
                        <input
                            type="text"
                            value={code}
                            onChange={e =>
                                this.setState({
                                    code: e.target.value
                                        .substring(0, 4)
                                        .toUpperCase()
                                })
                            }
                        />
                    </P>
                    <P>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={code.length !== 4}
                        >
                            Join
                        </button>
                    </P>
                </form>
                <P>
                    <Link to="/">
                        <button className="btn btn-secondary">Back</button>
                    </Link>
                </P>
            </MainContainer>
        );
    }
}

export default JoinGame;
