/**
 * Creates a function that's always instantiated with the given params, and accepts whatever params it did not
 * initially get.
 * @param func {function}
 * @param args {[*]}
 */
let partial = (func, ...args) => {

    return (...restOfArgs) => {

        return func(...args.concat(restOfArgs));
    }
};


export {partial};
