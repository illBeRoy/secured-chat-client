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
     * The onCall function represents a method that's mixed into the model instance.
     *
     * Unlike methods of an actual class, this function does not have an implicit `this`. Instead, the model instance
     * is being referenced in the function as `instance` and is always passed as the first parameter.
     *
     * @param instance {Model} a model instance
     * @param args {array}
     */
    static onCall(instance, ...args) {}

}


export {Action};
