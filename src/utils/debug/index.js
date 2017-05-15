/**
 * @returns {boolean} whether the process is running in debug mode
 */
const debug = () => {

    return process.env.DEBUG == 'true';
};


export {debug};
