import ArticleNovel from "./article-novel"; // 网文小说推荐
const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};

let routes = [];
routes = merge(routes, ArticleNovel);

export default routes;
