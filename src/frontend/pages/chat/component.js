import React, {Component} from 'react';
import {render} from 'react-dom';

import {Colors} from '../../theme';


class Page extends Component {

    constructor(props) {

        super(props);
        this.state = {};
        this.state.loading = false;
    }

    render() {

        return (<p>cool {window.params.user}, {window.params.password}</p>)
    }
}


render(<Page />, document.getElementById('root'));
