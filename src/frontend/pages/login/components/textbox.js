import React, {Component} from 'react';


class Textbox extends Component {

    static propTypes = {
        placeholder: React.PropTypes.string,
        defaultValue: React.PropTypes.string,
        type: React.PropTypes.oneOf(['text', 'password']),
        color: React.PropTypes.string,
        enabled: React.PropTypes.bool,
        inactiveColor: React.PropTypes.string,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        placeholder: '',
        defaultValue: '',
        type: 'text',
        color: '#000000',
        enabled: true,
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
                    textAlign: 'left',
                    fontSize: 13,
                    lineHeight: '26px'
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
                    Object.assign({
                        position: 'relative',
                        minWidth: 30,
                        height: 26,
                        overflow: 'hidden',
                        borderBottomStyle: 'solid',
                        borderBottomWidth: 1,
                        borderBottomColor: this.textColor,
                        transition: '.4s ease border-bottom-color'
                    }, this.props.style)}
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
                    disabled={!this.props.enabled}
                    onInput={this.onChange.bind(this)}
                />
            </div>
        );
    }


}


export {Textbox};
