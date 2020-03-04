import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/home';
import SelectGame from './components/selectGame';
import JoinGame from './components/joinGame';
import GetName from './components/getName';
import Game from './components/game';

class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: [
                { path: '/', exact: true, component: Home },
                { path: '/selectgame', component: SelectGame },
                { path: '/joingame', component: JoinGame },
                { path: '/getname/:gameCode', component: GetName },
                { path: '/game', component: Game }
            ]
        };
    }

    render() {
        const { socket, call } = this.props;
        const { routes } = this.state;
        return (
            <div id="router">
                <Switch>
                    {routes.map(r => {
                        const C = r.component;
                        return (
                            <Route
                                key={r.path}
                                path={r.path}
                                exact={r.exact}
                                render={props => {
                                    return (
                                        <C
                                            {...props}
                                            socket={socket}
                                            call={call}
                                            redirect={path =>
                                                props.history.push(path)
                                            }
                                        />
                                    );
                                }}
                            />
                        );
                    })}
                    <Redirect to="/" />
                </Switch>
            </div>
        );
    }
}

export default Router;
