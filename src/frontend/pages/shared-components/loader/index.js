import React, {Component} from 'react';


class Loader extends Component {

    static propTypes = {
        color: React.PropTypes.string
    };

    static defaultProps = {
        color: '#009688'
    };

    render() {

        return (
            <div style={Object.assign({width: 40, height: 40}, this.props.style)}>
                <style>
                    {`
                    @keyframes dash {
                        0% {
                            stroke-dasharray: 1,95;
                            stroke-dashoffset: 0;
                        }
                        50% {
                            stroke-dasharray: 85,95;
                            stroke-dashoffset: -25;
                        }
                        100% {
                            stroke-dasharray: 85,95;
                            stroke-dashoffset: -93;
                        }
                    }

                    @keyframes rotate {
                        0% {transform: rotate(0deg); }
                        100% {transform: rotate(360deg); }
                    }
                   `}
                </style>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width={40}
                    height={40}
                    style={{
                        fill: 'transparent',
                        stroke: this.props.color,
                        strokeWidth: 3,
                        animation: 'dash 2s ease infinite, rotate 2s linear infinite'
                    }}
                >
                    <circle cx={20} cy={20} r={15} />
                </svg>

            </div>
        );
    }

}


export {Loader};
