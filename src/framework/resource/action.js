/**
 * The Action Class defines an interface of describing model methods.
 *
 * As Models define the blueprint of the data that's saved in the database, it is ill-advised to contain any logic in
 * them, for it may cause trouble such as cyclic dependencies within models.
 *
 * That is why business logic is defined using actions. Actions can reference any model, as they are at a higher
 * level than them in the hierarchy.
 *
 * The actions themselves are available from each model instance as methods. That is, action which has the name
 * `foo` and the parameters list (instance, bar, baz), will be accessible through `modelInstance.foo(bar, baz)`.
 *
 * Note: in order to prevent cyclic dependency between actions as well, they should reference one another by invoking
 * the corresponding action through the given instance.
 * e.g. : use `instance.actionB(...)` instead of `import {Action} from './actionb'; Action.onCall(instance, ...)`
 */
class Action {

    /**
     * The name of the action. The method will be attached to the instance with this name.
     * @type {string}
     */
    static __name__ = 'action';

    /**
     * Whether the action is a class method, that is, a static member of the class itself rather than one of its
     * instances.
     *
     * The default value is false, which means that this action is an instance method.
     *
     * @type {boolean}
     */
    static classMethod = false;

    /**
     * The requirements are expected builtins that should be supplied by the store.
     *
     * Without said requirements, the action class will not be utilized by the store.
     *
     * Inheriting classes should override that property with the .
     * @type {Array}
     */
    static requirements = [];

    /**
     * The onCall function represents a method that's mixed into the model instance or class.
     *
     * Despite the fact that it is being defined as a static method of the Action class, the context in which action
     * methods are invoked is this of the model class or instance, meaning that you can refer to them as `this`: in
     * instance methods `this` will refer to the model instance, and in class methods it will refer to the class.
     *
     */
    static onCall() {}

}


export {Action};
