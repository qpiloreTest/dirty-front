import Vue from 'vue'
import organizations from './Organizations.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../../../static/css/material-icons.css'
import vue_ru from "vuetify/src/locale/ru.ts";
import '../../../static/css/sl-vue-tree-minimal.css'
import CustomTablePagination from '../custom_components/CustomTablePagination.vue'
import OrganizationsOrgs from './OrganizationsOrgs.vue'
import OrganizationsUsers from './OrganizationsUsers.vue'
import OrganizationsOrgsNewDialog from './OrganizationsOrgsNewDialog.vue'
import OrganizationsOrgsEditDialog from './OrganizationsOrgsEditDialog.vue'
import OrganizationsUsersNewDialog from './OrganizationsUsersNewDialog.vue'
import OrganizationsUsersEditDialog from './OrganizationsUsersEditDialog.vue'
import OrganizationsUsersLogs from './OrganizationsUsersLogs.vue'
import OrganizationsUsersDeleteDialog from './OrganizationsUsersDeleteDialog.vue'
import OrganizationsOrgsDeleteDialog from './OrganizationsOrgsDeleteDialog.vue'
import moment from 'moment';


Vue.component('CustomTablePagination', CustomTablePagination);
Vue.component('OrganizationsOrgs', OrganizationsOrgs);
Vue.component('OrganizationsOrgsNewDialog', OrganizationsOrgsNewDialog);
Vue.component('OrganizationsOrgsDeleteDialog', OrganizationsOrgsDeleteDialog);
Vue.component('OrganizationsOrgsEditDialog', OrganizationsOrgsEditDialog);
Vue.component('OrganizationsUsers', OrganizationsUsers);
Vue.component('OrganizationsUsersNewDialog', OrganizationsUsersNewDialog);
Vue.component('OrganizationsUsersEditDialog', OrganizationsUsersEditDialog);
Vue.component('OrganizationsUsersLogs', OrganizationsUsersLogs);
Vue.component('OrganizationsUsersDeleteDialog', OrganizationsUsersDeleteDialog);


Vue.use(Vuetify, {
	lang: {
		locales: {vue_ru},
		current: 'vue_ru'
	}
});
Vue.config.devtools = true;

Vue.filter('formatDateTime', function (value) {
	if (value) {
		return moment(String(value)).format('DD.MM.YYYY HH:mm')
	}
});

new Vue({
	el: '#app',
	render: h => h(organizations)
});
