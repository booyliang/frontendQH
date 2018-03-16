import Vue from 'vue'
import Circle from '@/js/circle'
import Router from '@/js/router'
import routes from '#/router'
import utils from '@/js/utils'
async function install(Vue) {
	Circle.install(Vue);
}
install(Vue)
