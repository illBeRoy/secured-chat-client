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


/**
 * Chains a bunch of functions by calling each with the former's return value.
 *
 * Supports async functions, and therefore returns a promise representing their eventual success or failure.
 *
 * @param funcs {[function]} the functions to chain
 * @returns {function(...*):Promise}
 */
let chain = (...funcs) => {

    return async (...args) => {

        let result = args;
        for (let func of funcs) {

            result = [await func(...result)];
        }

        return result;
    }
};


export {partial, chain};
