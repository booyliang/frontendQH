export default [
	{ path: '/question/celebrity-list', component: require('./celebrity-list')},
	{ path: '/question/index', name: 'questionIndex', component: require('./index')},
    { path: '/question/list/:type', name: 'questionList', component: require('./question-list') },
    { path: '/question/new/:targetId', name: 'questionNew', component: require('./question-new') },
    { path: '/question/detail/:id', name: 'questionDetail', component: require('./question-detail') },
	{ path: '/question-single/detail/:type/:id', name: 'questionSingleDetail', component: require('./question-single-detail')},
    { path: '/answer/detail/:id', name: 'answerDetail', component: require('./answer-detail') },
    { path: '/answer/new/:type/:questionId', name: 'answerCreate', component: require('./answer-new') },
]