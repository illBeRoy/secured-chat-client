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


export {object};
