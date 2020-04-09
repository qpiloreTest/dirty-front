import Vue from 'vue'
import InboundSMS from './inbound_sms.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../../../static/css/material-icons.css'
import vue_ru from "vuetify/src/locale/ru.ts";
import moment from 'moment'

Vue.use(Vuetify, {
	lang: {
		locales: {vue_ru},
		current: 'vue_ru'
	}
});
Vue.config.devtools = true;

Vue.filter('formatDate', function (value) {
	if (value) {
		return moment(String(value)).format('DD.MM.YYYY hh:mm')
	}
});

new Vue({
	el: '#app',
	render: h => h(InboundSMS)
});


