import Vue from 'vue'
import Projects from './Projects.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../../../static/css/material-icons.css'
import vue_ru from 'vuetify/src/locale/ru.ts'
import slVueTree from 'sl-vue-tree'
import '../../../static/css/sl-vue-tree-minimal.css'
import moment from 'moment'


Vue.use(slVueTree);
Vue.component('sl-vue-tree', slVueTree);
Vue.use(Vuetify, {
	lang: {
		locales: {vue_ru},
		current: 'vue_ru'
	}
});
Vue.config.devtools = true;

Vue.filter('formatDateTime', function (value) {
	if (value) {
		return moment(String(value)).format('DD.MM.YYYY hh:mm')
	}
});

new Vue({
	el: '#app',
	render: h => h(Projects),
});
