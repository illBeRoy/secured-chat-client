import functools from '../../utils/functools';


/**
 * Provides resource persistency and method mixin.
 */
class Store {

    /**
     * @param resources {[module]} the resources to use with the store. Must contain two properties: `models` and `actions`
     * @param localStorage {localStorage} a module that's providing localStorage functionality
     */
    constructor(resources, localStorage=null) {

        this._models = {};
        this._localStorage = localStorage;
        this._onUpdateCallbacks = [];

        this._attachResources(resources);
    }

    /**
     * Returns the resources list that's used by the store.
     * @returns {{string: Model}}
     */
    get resources() {

        return this._models;
    }

    /**
     * Augmentations: methods and properties that are attached to Model classes in runtime.
     *
     * Builtins are augmentations that are attached to the model as its own properties, giving it access to multiple
     * functionalities that are supplied by the store, such as utilities, sessions, etc.
     *
     * A good example would be to take a look at the defined getter: its value, `store` will be available as
     * `
     *
     * The builtinAugmentations getter allows inheritors of Store to define that list programmatically, making them
     * accessible to all model instances and classes implicitly in runtime.
     * @returns {object}
     */
    get builtinAugmentations() {

        return {resources: this.resources};
    }

    /**
     * Attaches a callback to the store which is called whenever the store was updated.
     * @param callback {function()}
     */
    onUpdate(callback) {

        this._onUpdateCallbacks.push(callback);
    }

    /**
     * Assign base state and actions to resources and attaches them to store.
     * @param resources {[module]} the models to attach
     * @private
     */
    _attachResources(resources) {

        // first enumerate all resources
        for (let resource of resources) {

            for (let modelRef of Object.keys(resource.models)) {

                // get model from ref
                let model = resource.models[modelRef];

                // bind model to store with a bidirectional acknowledgement
                this._models[model.name] = model;
            }
        }

        //attach everything
        for (let resource of resources) {

            for (let modelRef of Object.keys(resource.models)) {

                // get model from ref
                let model = resource.models[modelRef];

                // if localStorage exists, attempt to load state from
                if (this._localStorage) {

                    let state = this._localStorage.getItem(model.name) || '{}';
                    model.setStore(state);
                }

                // attach handlers to model
                model.onCreate(functools.partial(this._augmentModelInstance.bind(this), resource));
                model.onUpdate(functools.partial(this._modelsWereUpdated.bind(this), model.name));

                // attach class methods to model
                this._augmentModel(resource, model);
            }
        }
    }

    /**
     * Attaches actions to be used with model classes.
     * @param resource {module} the relevant resource module, from which actions are extracted
     * @param modelClass {Class} a the class of the relevant model\
     * @private
     */
    _augmentModel(resource, modelClass) {

        this._augmentObject(resource, modelClass, true);
    }

    /**
     * Attaches actions to be used with model instances.
     * @param resource {module} the relevant resource module, from which actions are extracted
     * @param instance {Model} an instance of the relevant model that is currently being created
     * @private
     */
    _augmentModelInstance(resource, instance) {

        this._augmentObject(resource, instance, false);
    }

    /**
     * Attaches builtin augmentations and actions to be used with model classes or instances.
     * @param resource {module} the relevant resource module, from which actions are extracted
     * @param target {Class|Model} the target object to augment
     * @param isClass {boolean} if true, will assign class methods, otherwise assigns instance methods
     * @private
     */
    _augmentObject(resource, target, isClass) {

        // attach builtin augmentations
        for (let augmentation of Object.keys(this.builtinAugmentations)) {

            assign(target, augmentation, this.builtinAugmentations[augmentation]);
        }

        // attach actions - iterate over action modules
        for (let actionRef of Object.keys(resource.actions)) {

            // iterate over action classes
            for (let actionClass of Object.keys(resource.actions[actionRef])) {

                // get actual action class
                let action = resource.actions[actionRef][actionClass];

                // extract name, method and class method information
                let actionName = action.__name__;
                let actionMethod = action.onCall;
                let isActionClassMethod = action.classMethod;

                // only assign action if it matches this being a class or an instance
                if (isActionClassMethod == isClass) {

                    assign(target, actionName, functools.partial(actionMethod, target));
                }
            }
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

        if (this._localStorage) {

            this._localStorage.setItem(modelName, state);
        }

        for (let callback of this._onUpdateCallbacks) {

            callback();
        }
    }

}


/**
 * Assigns a new member to a given object if not present, otherwise throws.
 * @param obj {object} the object to mutate
 * @param field {string} name of the member to alter
 * @param value {*} the value to assign as that member
 */
let assign = (obj, field, value) => {

    if (Object.keys(obj).includes(field)) {

        throw new Error(`Multiple declarations: attribute ${field} already exists in ${obj.name || 'object'}.`);
    }

    obj[field] = value;
};


export {Store};
