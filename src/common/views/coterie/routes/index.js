import Main from "../blank-router-view";
import General from "./general";
import Question from "./question";
import Topic from "./topic";
import Activity from "./activity";
import Edit from "./edit";
import CoterieList from "../coterie-list";
import Vue from "vue";

const merge = function () {
	return Array.prototype.concat.apply([], arguments);
};
let children = merge(General, Question, Topic, Activity, Edit);
let routes = [
	{
		path: "/coterie/:coterieId",
		component: Main,
		children,
		beforeEnter: async (to, from, next) => {
			await Vue.coterie.init(to);
			next();
		}
	},
	{
		name: "coterieList",
		meta: { keepAlive: true },
		component: CoterieList,
		path: "/coterie-list"
	}
];
export default routes;
