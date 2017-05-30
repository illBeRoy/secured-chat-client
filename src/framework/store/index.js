import * as functools from '../../utils/functools';
import * as itertools from '../../utils/itertools';


/**
 * Serves as a localStorage mock.
 * @type {object}
 */
const localStorageMock = {
    getItem: () => '',
    setItem: () => null,
    removeItem: () => null,
    clear: () => null
};


/**
 * Provides resource persistency and method mixin.
 * This is the implementation class. For instructions regarding how to derive and use it, see the Store class.
 * @see Store
 */
class _Store {

    constructor() {

        this._models = {};
        this._onUpdateCallbacks = [];

        this._localStorage = this.constructor.localStorage;

        this._augmentations = Object.assign({}, this.builtinAugmentations, this.constructor.augmentations);

        this._attachResources(this.constructor.resources);
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
     * Returns all augmentations supplied by this store.
     * @returns {object}
     */
    get augmentations() {

        return this._augmentations;
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

            for (let [_, model] of itertools.object(resource.models)) {

                // bind model to store with a bidirectional acknowledgement
                this._models[model.name] = model;
            }
        }

        //attach everything
        for (let resource of resources) {

            for (let [_, model] of itertools.object(resource.models)) {

                // load state from persistent memory
                let state = this._localStorage.getItem(model.name) || '{}';
                model.setStore(state);

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

        // attach augmentations
        for (let [augmentationName, augmentation] of itertools.object(this._augmentations)) {

            assign(target, augmentationName, augmentation);
        }

        // iterate over action classes
        for (let [_, action] of itertools.object(resource.actions)) {

            // extract name, method and class method information
            let actionName = action.__name__;
            let actionMethod = action.onCall;
            let isActionClassMethod = action.classMethod;
            let actionRequirements = action.requirements;

            // ensure all builtin requirements exist
            for (let req of actionRequirements) {

                if (!Object.keys(this._augmentations).includes(req)) {

                    throw new Error(`Action "${actionName}" requires augmentation "${req}", which does not exist.`);
                }
            }

            // only assign action if it matches this being a class or an instance
            if (isActionClassMethod == isClass) {

                assign(target, actionName, actionMethod.bind(target));
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

        this._localStorage.setItem(modelName, state);

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
const assign = (obj, field, value) => {

    if (Object.keys(obj).includes(field)) {

        throw new Error(`Multiple declarations: attribute ${field} already exists in ${obj.name || 'object'}.`);
    }

    obj[field] = value;
};


/**
 * Provides resource persistency and method mixin.
 *
 * In order to use, one should derive this class and populate the relevant static fields.
 */
class Store extends _Store {

    /**
     * The resources static property defines the resources which the store should be using.
     *
     * A resource is a module which exports two properties: models and actions, where models exports classes deriving
     * from the Resource.Model class, and actions exports classes deriving from the Resource.Action class.
     * @type {[{models: module, actions: module}]}
     */
    static resources = [];

    /**
     * The augmentation static property defines the custom properties that will be attached to the models classes
     * and instances, such as session and utilities.
     * @type {object}
     */
    static augmentations = {};

    /**
     * The localStorage static property defines which persistent storage to use.
     *
     * The default value is actually a mock - data will not persistent over multiple sessions.
     *
     * An inheriting class should replace that property with its own means of storage.
     *
     * @type {object}
     */
    static localStorage = localStorageMock;

}


export {Store};
