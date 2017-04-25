/**
 * The RepeatingTask class takes care of carrying on tasks over repeating intervals.
 * It ensures that no more than a single instance of the task is being run at any given moment.
 * The tasks themselves are function handlers that will be invoked with no parameters at all.
 */
class RepeatingTask {

    /**
     * @param task {function()} the task to perform, can be async
     * @param robust {boolean} if true, will continue scheduling tasks even if an iteration fails with an exception
     */
    constructor(task, robust=true) {

        this._task = task;
        this._robust = robust;

        // interval between tasks
        this._interval = 0;

        // timeout object
        this._nextTaskTimeout = null;

        // whether or not the task is currently being run
        this._executionLock = false;

        // whether or not the routine has started
        this._started = false;
    }

    /**
     * Start performing the given task.
     * @param interval {number} interval between executions in ms
     * @param immediately {boolean} whether or not to execute the task right now
     * @return {boolean} whether or not the task was started. false will be returned if the task is already running.
     */
    start(interval, immediately=true) {

        if (!this._started) {

            this._started = true;
            this._interval = interval;

            if (immediately) {

                this.excecuteNow();
            } else {

                this._nextTaskTimeout = setTimeout(this._taskExecutionRoutine.bind(this), this._interval);
            }

            return true;
        } else {

            return false;
        }
    }

    /**
     * Stop executing the task.
     */
    stop() {

        if (!this._started) {

            throw new Error('RepeatingTask routine has not started, cannot stop!');
        }

        // clear the timeout
        clearTimeout(this._nextTaskTimeout);

        // denote as not started
        this._started = false;
    }

    /**
     * Execute an iteration of the task right now.
     * This will do nothing if it is currently running, or cancel the scheduled run if it's sleeping.
     */
    excecuteNow() {

        if (!this._started) {

            throw new Error('RepeatingTask routine has not started, cannot execute!');
        }

        this._taskExecutionRoutine();
    }

    /**
     * A single task execution routine.
     * @private
     */
    async _taskExecutionRoutine() {

        // make sure that the execution wasn't stopped prior to this
        if (!this._started) {

            return;
        }

        // attempt to acquire execution lock
        if (!this._acquireLock()) {

            return;
        }

        // clear the timeout anyways. it doesn't throw so even if there isn't a valid one, it's ok
        clearTimeout(this._nextTaskTimeout);

        // execute the task and catch if it had thrown
        try {

            await this._task();
        } catch (err) {

            // if the class was not instantiated as robust, let the exception propagate.
            if (!this._robust) {

                throw err;
            }
        }

        // release the lock
        this._releaseLock();

        // schedule next execution only if wasn't stopped
        if (this._started) {

            setTimeout(this._taskExecutionRoutine.bind(this), this._interval);
        }
    }

    /**
     * Acquire the execution lock.
     * @returns {boolean} whether the lock was acquired or not
     * @private
     */
    _acquireLock() {

        if (!this._executionLock) {

            this._executionLock = true;
            return true;
        } else {

            return false;
        }
    }

    /**
     * Releases the execution lock.
     * @private
     */
    _releaseLock() {

        this._executionLock = false;
    }

}


export {RepeatingTask};
