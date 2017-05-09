import childProcess from 'child_process';


/**
 * Kills a process and every process that was spawned by it or any of its descendants.
 * @param pid {number}
 */
const killTree = (pid) => {

    try {

        let childrenProcesses = childProcess.execSync(`pgrep -P ${pid}`).toString().split('\n').map((x) => parseInt(x));

        for (let childPid of childrenProcesses) {

            if (!isNaN(childPid)) {

                killTree(childPid);
            }
        }
    } catch (err) {}

    process.kill(pid);
};


export {killTree};
