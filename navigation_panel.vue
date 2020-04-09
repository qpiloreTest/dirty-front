<template>
	<div>
		<!--toolbar on the top of webpage-->
		<v-toolbar dark color="grey lighten-2">
			<v-toolbar-title>
				<a class="black--text" href="/" style="text-decoration: none">
					<v-icon class="black--text">message</v-icon>
					Message Server
				</a>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn flat class="black--text" href="/projects/"
					   v-if="user.permissions.includes('users.can_view_projects_module')">
					Проекты
				</v-btn>
			</v-toolbar-items>
			<v-toolbar-items>
				<v-btn flat class="black--text" href="/inbound_sms/"
					   v-if="user.permissions.includes('users.can_view_inbound_sms_module')">
					Сообщения
				</v-btn>
			</v-toolbar-items>
			<!--dropdown services-->
			<v-toolbar-items
				v-if="one_of_list_includes_in_array(user.permissions,
					['users.can_view_all_modems_module',
					 'users.can_view_general_settings_module',
					 'users.can_view_queue_outbound_module',
					 'users.can_view_gateways_module',
					 'users.can_view_stop_lists_module',
					 'users.can_view_black_white_lists_module',
					 'users.can_view_list_of_organizations',
					 'users.can_work_with_logs',
					])"
			>
				<v-menu offset-y>
					<v-btn
						slot="activator"
						flat
						class="black--text"
					>
						Сервис
					</v-btn>
					<v-list>

						<v-list-tile href="/gateways/"
									 v-if="user.permissions.includes('users.can_view_gateways_module')">
							<v-list-tile-title>
								<v-icon>group_work</v-icon>
								Шлюзы
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/modems_list/"
									 v-if="user.permissions.includes('users.can_view_all_modems_module')">
							<v-list-tile-title>
								<v-icon>router</v-icon>
								Устройства
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/system_settings/"
									 v-if="user.permissions.includes('users.can_view_general_settings_module')">
							<v-list-tile-title>
								<v-icon>build</v-icon>
								Общие настройки
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/queue_outbound/"
									 v-if="user.permissions.includes('users.can_view_queue_outbound_module')">
							<v-list-tile-title>
								<v-icon>send</v-icon>
								Очередь отправки
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/organizations_list/"
									 v-if="user.permissions.includes('users.can_view_list_of_organizations')">
							<v-list-tile-title>
								<v-icon>location_city</v-icon>
								Организации
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/stop_lists/"
									 v-if="user.permissions.includes('users.can_view_stop_lists_module')">
							<v-list-tile-title>
								<v-icon>block</v-icon>
								Стоп листы
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/blackwhite_lists/"
									 v-if="user.permissions.includes('users.can_view_black_white_lists_module')">
							<v-list-tile-title>
								<v-icon>import_contacts</v-icon>
								Черные/белые списки
							</v-list-tile-title>
						</v-list-tile>

						<v-list-tile href="/logs/"
									 v-if="user.permissions.includes('users.can_work_with_logs')">
							<v-list-tile-title>
								<v-icon>description</v-icon>
								Логи
							</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>
			</v-toolbar-items>

			<v-menu offset-y>
				<v-btn icon slot="activator">
					<v-icon class="black--text">more_vert</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile>
						<v-list-tile-title>
							<v-icon>person</v-icon>
							<span v-if="user.obj.first_name">
                  {{user.obj.first_name}} {{user.obj.last_name}} ({{user.obj.username}})
                </span>
							<span v-else>{{user.obj.username}}</span>
						</v-list-tile-title>
					</v-list-tile>
					<v-list-tile href="/admin/" v-if="user.obj.is_staff">
						<v-list-tile-title>
							<v-icon left>assignment_ind</v-icon>
							Админ панель
						</v-list-tile-title>
					</v-list-tile>
					<v-list-tile href="/rest_api/swagger/" v-if="user.obj.is_staff">
						<v-list-tile-title>
							<v-icon left>assignment</v-icon>
							REST API документация
						</v-list-tile-title>
					</v-list-tile>
					<v-divider/>
					<v-list-tile href="/logout/">
						<v-list-tile-title>
							<v-icon left>power_off</v-icon>
							Выйти
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>

		</v-toolbar>
	</div>
</template>

<script>

	export default {
		data() {
			return {
				user: {
					obj: {},
					permissions: [],
				},
				left_navigation: false,
				// items: [
				//   { title: 'Home', icon: 'dashboard', link: "/"},
				//   { title: 'About', icon: 'question_answer', link: '/about' }
				// ],
				right: null
			}
		},

		methods: {
			one_of_list_includes_in_array(array, list) {
				let counter = 0;
				list.forEach(el => {
					if (array.includes(el)) {
						counter += 1;
					}
				});
				return counter > 0
			},
		},

		created() {
			console.log(this)
			this.user.obj = JSON.parse(this.$root.$el.attributes.user_obj.value);
			this.user.permissions = JSON.parse(this.$root.$el.attributes.user_perms.value);
			// console.log(this.user.obj);
			// console.log(this.user.permissions);
		},
	}
</script>

<style scoped>

</style>
