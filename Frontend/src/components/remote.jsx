import React from 'react';

function remote(Component, func, ...args) {
    class C extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loaded: false,
                resp: null,
                error: null
            };
        }

        componentDidMount() {
            this.props
                .call(func, ...args)
                .then(resp => this.setState({ resp, loaded: true }))
                .catch(error => {
                    console.error(error);
                    this.setState({ error });
                });
        }

        render() {
            const { loaded, error, resp } = this.state;

            if (error) {
                return (
                    <div>An error occurred, check the console for details</div>
                );
            } else if (loaded) {
                return <Component remote={resp} {...this.props} />;
            } else {
                return null;
            }
        }
    }

    return C;
}

export default remote;
