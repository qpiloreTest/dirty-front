import Vue from 'vue'
import Gateways from './gateways.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../../../static/css/material-icons.css'
import vue_ru from "vuetify/src/locale/ru.ts";
import GatewayDevices from "./gateway_devices.vue"


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
	render: h => h(Gateways)
});
