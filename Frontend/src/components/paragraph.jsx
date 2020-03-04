import React from 'react';

class Paragraph extends React.Component {
    render() {
        return <div className="myParagraph">{this.props.children}</div>;
    }
}

export default Paragraph;
