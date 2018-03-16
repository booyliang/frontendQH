export default [
    { path: '/topic/index', component: require('./index'), meta: { keepAlive: true } },
    { path: '/topic/home/:id', component: require('./home') },
    { path: '/topic/detail/:id', component: require('./detail') },
    { path: '/topic/join/:id', component: require('./join') },
    { path: '/topic/new', component: require('./new') }
]
