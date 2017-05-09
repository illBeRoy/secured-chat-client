/**
 * The Store Class represents a stateful storage maintaining entity.
 */
class _ModelStore {

    static get updateHandlers() {

        if (!this._updateHandlers) {

            this._updateHandlers = [];
        }

        return this._updateHandlers;
    }

    static get creationHandlers() {

        if (!this._creationHandlers) {

            this._creationHandlers = [];
        }

        return this._creationHandlers;
    }

    /**
     * A getter that either creates or returns an already created store.
     */
    static get store() {

        if (!this._store) {

            this._store = {};
        }

        return this._store;
    }

    /**
     * Exports the store to be used
     */
    static export() {

        return JSON.stringify(this.store);
    }

    static onCreate(callback) {

        this.creationHandlers.push(callback);
    }

    /**
     * Attach a handler that will be called with a serialization of the database every time it is updated.
     * @param callback {function(string)}
     */
    static onUpdate(callback) {

        this.updateHandlers.push(callback);
    }

    /**
     * Completely alter the state of the database into the given serialization.
     * @param serialization {string} a serialization of the database.
     */
    static setStore(serialization) {

        this._store = JSON.parse(serialization);
    }

    /**
     * Updates the store by merging a given object into it.
     * @param obj {object}
     * @private
     */
    static updateStore(obj) {

        for (let key of Object.keys(obj)) {

            this.store[key] = obj[key];
        }

        this.updateHandlers.forEach((fn) => fn(this.export()));
    }

}


/**
 * This is a meta class of Model that implements core functionality. It is not included in the actual Model class
 * itself in order to keep it clean.
 */
class _Model extends _ModelStore {

    /**
     * @param obj {object} if given, will construct the instance from it (optional)
     */
    constructor(obj) {

        super();

        if (obj) {

            this._import(obj);
        }

        this.constructor.creationHandlers.forEach((fn) => fn(this));
    }

    /**
     * Saves the instance into the store.
     */
    save() {

        let clone = new this.constructor(this);
        clone.onSave();

        this.constructor.updateStore({[clone.id]: clone._export()});
    }

    /**
     * Deletes the instance from the store.
     */
    delete() {

        this.constructor.updateStore({[this.id]: null});
    }

    /**
     * Exports a json-ready object.
     * @returns {object}
     */
    json() {

        return this._export();
    }

    /**
     * Exports the instance as an immutable object.
     * @private
     */
    _export() {

        let exportedObject = {id: this.id};
        for (let field of this.constructor.fields) {

            exportedObject[field] = this[field];
        }

        return exportedObject;
    }

    /**
     * Imports an immutable object into the instance's fields.
     * @param obj {object}
     * @private
     */
    _import(obj) {

        for (let field of this.constructor.fields) {

            this[field] = obj[field];
        }

        this.id = obj.id || null;
    }

    /**
     * Get an instance from the store by id.
     * @param id {number|string}
     * @returns {Model}
     */
    static get(id) {

        let result = this.store[id];

        if (result) {

            let instance = new this(result);
            instance.onLoad();
        } else{

            throw new Error(`Record not found (id: ${id})`);
        }
    }

    /**
     * Get an array of instances which match a given reducer.
     * @param reducer {function(Model)} a reducer that decides whether or not it an instance matches a given criteria.
     * @returns {[Model]}
     */
    static query(reducer) {

        let instances = Object.keys(this.store)
                              .map((key) => new this(this.store[key]))
                              .filter(reducer);

        for (let instance of instances) {

            instance.onLoad();
        }

        return instances;
    }

}


/**
 * The Model Class represents a blueprint for models that are stored in the database.
 */
class Model extends _Model {

    /**
     * The fields array has a list of strings which represent the expected fields of an instance.
     * Aside of them, the <id> field is expected as well.
     * @type {[string]}
     */
    static fields = [];

    /**
     * Actions to perform when saving a model to store.
     *
     * May be implemented by subclass.
     *
     * May be mutating, but said mutation will not persist post save.
     */
    onSave() {}

    /**
     * Actions to perform when loading a model from store.
     *
     * May be implemented by subclass.
     *
     * May be mutating.
     */
    onLoad() {}

}


export {Model};
