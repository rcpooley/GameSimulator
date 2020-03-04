import React from 'react';

class MainContainer extends React.Component {
    render() {
        const { id } = this.props;
        return (
            <div id={id} className="mainContainer">
                {this.props.children}
            </div>
        );
    }
}

export default MainContainer;
