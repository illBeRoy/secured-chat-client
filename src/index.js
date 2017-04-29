import {User} from './models/user';


let roy = new User();
roy.id = 0;
roy.username = 'roysom';
roy.save();


console.log(User.get(0));
