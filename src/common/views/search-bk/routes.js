export default [
    { path: '/search', component: require('./index') }, // 搜索主页
    { path: '/search/category', component: require('./category') }, // 分类搜索
    { path: '/search/result', component: require('./result'), meta: {keepAlive: true} } // 搜索结果
]
