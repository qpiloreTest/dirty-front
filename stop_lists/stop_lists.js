import Vue from 'vue'
import StopLists from './stop_lists.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../../../static/css/material-icons.css'
import vue_ru from "vuetify/src/locale/ru.ts";


Vue.use(Vuetify, {
	lang: {
		locales: {vue_ru},
		current: 'vue_ru'
	}
});
Vue.config.devtools = true;

new Vue({
	el: '#app',
	render: h => h(StopLists)
});
