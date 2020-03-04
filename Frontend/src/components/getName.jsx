import React from 'react';
import { Link } from 'react-router-dom';
import MainContainer from './mainContainer';
import P from './paragraph';

class GetName extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        };
    }

    onSubmit(e) {
        const { call, match, redirect } = this.props;
        const { name } = this.state;
        e.preventDefault();

        const success = call('joinGame', match.params.gameCode, name);
        if (success) {
            redirect('/game');
        }

        return false;
    }

    render() {
        const { name } = this.state;

        return (
            <MainContainer>
                <P>
                    <h4>What is your name?</h4>
                </P>
                <form onSubmit={e => this.onSubmit(e)}>
                    <P>
                        <input
                            type="text"
                            value={name}
                            onChange={e =>
                                this.setState({
                                    name: e.target.value
                                })
                            }
                        />
                    </P>
                    <P>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={name.length === 0}
                        >
                            Submit
                        </button>
                    </P>
                </form>
                <P>
                    <Link to="/">
                        <button className="btn btn-secondary">Cancel</button>
                    </Link>
                </P>
            </MainContainer>
        );
    }
}

export default GetName;
