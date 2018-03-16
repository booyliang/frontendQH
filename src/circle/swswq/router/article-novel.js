import ArticleNovel from '../views/article-novel'
import BookDetail from '../views/article-novel/detail'
import BookNew from '../views/article-novel/new'

export default [
	{ path: '/article-novel/:id', component: ArticleNovel, meta: {keepAlive: true}},
	{ path: '/book/detail/:id', component: BookDetail },
	{ path: '/book/new/:status', component: BookNew },
]