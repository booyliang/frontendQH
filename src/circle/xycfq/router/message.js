import Message from '../views/message';

export default [
	{
		name: 'message',
		path: '/message/:messageId/:id?',
		component: Message
	}
];