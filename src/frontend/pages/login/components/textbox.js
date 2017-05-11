import React, {Component} from 'react';


class Textbox extends Component {

    static propTypes = {
        placeholder: React.PropTypes.string,
        defaultValue: React.PropTypes.string,
        type: React.PropTypes.oneOf(['text', 'password']),
        color: React.PropTypes.string,
        inactiveColor: React.PropTypes.string,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        placeholder: '',
        defaultValue: '',
        type: 'text',
        color: '#000000',
        inactiveColor: '#999999',
        onChange: (t) => {}
    };

    constructor(props) {

        super(props);
        this.state = {};
        this.state.value = props.defaultValue;
    }

    get textColor() {

        return this.state.value? this.props.color: this.props.inactiveColor;
    }

    onChange(e) {

        this.setState({value: e.target.value});
        this.props.onChange(this.state.value);
    }

    renderPlaceholder() {

        if (this.state.value || !this.props.placeholder) {

            return;
        }

        return (
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    color: this.textColor,
                    textAlign: 'left'
                }}
            >
                {this.props.placeholder}
            </div>
        );
    }

    render() {

        return (
            <div
                style={
                    {
                        position: 'relative',
                        minWidth: 30,
                        height: 26,
                        overflow: 'hidden',
                        borderBottomStyle: 'solid',
                        borderBottomWidth: 1,
                        borderBottomColor: this.textColor
                    }}
            >
                {this.renderPlaceholder()}
                <input
                    type={this.props.type}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        fontSize: 13,
                        color: this.textColor,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent'
                    }}
                    onInput={this.onChange.bind(this)}
                />
            </div>
        );
    }


}


export {Textbox};
