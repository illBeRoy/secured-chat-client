import functools from '../../utils/functools';


class Store {

    /**
     * @param models {[Class]} the models to use with the store. Must be subclasses of Model
     */
    constructor(models) {

        this._models = models;
        this._onUpdateCallbacks = [];

        this._attachModels();
    }

    /**
     * Attaches a callback to the store which is called whenever the store was updated.
     * @param callback {function()}
     */
    onUpdate(callback) {

        this._onUpdateCallbacks.push(callback);
    }

    /**
     * Assign base state to models and attaches them to store.
     * @private
     */
    _attachModels() {

        for (let model of this._models) {

            if (localStorage) {

                let state = localStorage.getItem(model.name) || '{}';
                model.setStore(state);
            }

            model.onUpdate(functools.partial(this._modelsWereUpdated.bind(this), model.name));
        }
    }

    /**
     * Called whenever a model was updated.
     *
     * Updates persistent storage and invokes attached callbacks.
     *
     * @param modelName {string} name of model
     * @param state {string} state serialization of the model
     * @private
     */
    _modelsWereUpdated(modelName, state) {

        if (localStorage) {

            localStorage.setItem(modelName, state);
        }

        for (let callback of this._onUpdateCallbacks) {

            callback();
        }
    }



}
