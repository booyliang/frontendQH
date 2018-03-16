import yryz from './yryz'
import Toast from "../components/toast";
import http from './http'
import eventBus from './event-bus'
let env = eventBus.env;
let validateCircle = true;
let user = {
	get isLogin() {
		return env.custId;
	},
	async login() { 
		if (env.custId)
			return;
	
		let data = await yryz.login();	
		for (let key in data) { 
			env[key] = data[key]
		}
		if (!env.userId && validateCircle !== false) {
			let res = await http.get('/services/app/v1/circle/info');
			eventBus.$set(eventBus.env, 'userId', res.data.data.userId);
		}
	
		eventBus.$emit('global-message', { type: 'refresh' })
		throw '用户登录'
	},
	install(vue, options) { 
		validateCircle = options.validateCircle
		yryz.on('nativeLogin', async () => {
			eventBus.$emit('global-message', { type: 'refresh' })
		});
		vue.prototype.$user =  user;
	
		yryz.on('nativeLogout', async (data) => { 
			env.userId = '';
			env.custId = '';
			return env;
		})
		
		yryz.on('nativeActivated', async (data) => {
			let custId = env.custId;
			for (let key in data) { 
				env[key] = data[key]
			}
			if (custId === env.custId)
				return env;	
			if (env.custId && validateCircle !== false) { 
				let res = await http.get('/services/app/v1/circle/info');
				env.userId = res.data.data.userId;				
			}
			eventBus.$emit('global-message', { type: 'refresh' })
			return env;
		})
	},
};

export default user