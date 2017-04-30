import {ApplicationStore} from './backend';
import user from './backend/resources/user';


let store = new ApplicationStore({}, [user]);

console.log(store.resources.User);

