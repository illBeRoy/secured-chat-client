import delay from 'delay';


/**
 * Creates a fixture constructor that, given a react component, feeds it with data according to the stream.
 * @param stream {[[string, *]]} the stream which dictates the data lifecycle
 * @returns {function(React.Component)} fixture constructor which receives a component.
 */
const createFixture = (stream) => {

    return (component) => {

        // data initial value
        let data = null;

        // forward declaration - as long as the component is not mounted, "broadcastDigestion" does nothing.
        let broadcastDigestion = () => {};

        // when the component does mount, replace "broadcastDigestion" with the actual handler
        let _componentDidMountProxy = component.componentDidMount;
        component.componentDidMount = function() {

            broadcastDigestion = () => {

                component.setState({__fixture_update_time: Date.now()});
            };

            if (typeof _componentDidMountProxy == 'function') {

                _componentDidMountProxy.apply(component);
            }
        };

        // when the component unmounts, replace "broadcastDigestion" with nop
        let _componentWillUnmountProxy = component.componentWillUnmount;
        component.componentWillUnmount = function() {

            broadcastDigestion = () => {};

            if (typeof _componentDidUnmountProxy == 'function') {

                _componentDidUnmountProxy.apply(component);
            }
        };

        // the digestion routine
        let digest = async () => {

            for (let [action, value] of stream) {

                switch (action) {

                    case 'set':
                        data = Object.assign({}, value);
                        broadcastDigestion();
                        break;

                    case 'add':
                        if (data instanceof Array) {

                            data = data.concat(value);
                        } else {

                            data = Object.assign(data, value);
                        }
                        broadcastDigestion();
                        break;

                    case 'wait':
                        delay(value * 1000);
                        break;
                }
            }
        };

        // start digestion routine
        digest();

        // return data getter
        return () => data;
    }

};


/**
 * Creates a stream to be used with fixture constructor.
 * @param args {[[string, *]]} stream point constructors
 * @returns {[[string, *]]} stream
 */
const createStream = (...args) => {

    return args;
};


/**
 * Stream point constructor: replace fixture's data with given value.
 * @param obj {*} the value
 * @returns {[string, *]} stream point
 */
const use = (obj) => {

    return ['set', obj];
};


/**
 * Stream point constructor: wait a given amount of seconds before performing the next stream point.
 * @param timeoutInSeconds {number} time to wait
 * @returns {[string, number]} stream point
 */
const wait = (timeoutInSeconds) => {

    return ['wait', timeoutInSeconds];
};


/**
 * Stream point constructor: extend data with given object.
 * @param obj {Object|Array} the object to assign
 * @returns {[string, Object|Array]} stream point
 */
const add = (obj) => {

    return ['add', obj]
};


export {createFixture, use, wait, add};
