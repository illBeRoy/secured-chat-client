/**
 * Iterates over sets of [key, values] from a given object.
 *
 * The iterator eagerly loads and caches the object, therefore mutation of it will not do everything too awful, but
 * it is discouraged nonetheless.
 *
 * @param obj {object} the object to iterate over
 */
const object = function*(obj) {

    for (let key of Object.keys(obj)) {

        yield [key, obj[key]];
    }
};


/**
 * Iterates over an iterable and returns the minimal item, according to a given comparator.
 * @param iterable {Iterable} a javascript iterable, such as an array
 * @param comparisonFunction {function(*, *):number} standard comparison function. default is substraction.
 * @returns {*} a minimal item. in case of multiple minimals, no deterministic result is promised.
 */
const min = function(iterable, comparisonFunction=((a, b) => a - b)) {

    let minItem = null;
    for (let item of iterable) {

        if (minItem == null || comparisonFunction(item, minItem) < 0) {

            minItem = item;
        }
    }

    return minItem;
};


/**
 * Iterates over an iterable and returns the maximal item, according to a given comparator.
 * @param iterable {Iterable} a javascript iterable, such as an array
 * @param comparisonFunction {function(*, *):number} standard comparison function. default is substraction.
 * @returns {*} a maximal item. in case of multiple maximals, no deterministic result is promised.
 */
const max = function(iterable, comparisonFunction=((a, b) => a - b)) {

    let maxItem = null;
    for (let item of iterable) {

        if (maxItem == null || comparisonFunction(item, maxItem) > 0) {

            maxItem = item;
        }
    }

    return maxItem;
};


export {object, min, max};
