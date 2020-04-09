<template>
	<div>
		<v-app>
			<navigation></navigation>
			<v-card>
				<v-card-title>
					<h2>Общие настройки системы</h2><span class="red--text"> (перезагрузите брокер для применения изменений)</span>
					<v-spacer></v-spacer>
					<v-menu offset-y :disabled="system_settings_list_table.checked_table_obj.row_id === 0">
						<v-btn
							slot="activator"
							color="indigo lighten-2"
							dark
							:disabled="system_settings_list_table.checked_table_obj.row_id === 0"
						>
							<v-icon>settings</v-icon>
							Действия
							<v-icon>arrow_drop_down</v-icon>
						</v-btn>

						<v-list>
							<v-list-tile @click="dialog_edit_programm_setting_open_btn">
								<v-list-tile-title>
									<v-icon>edit</v-icon>
									Редактировать
								</v-list-tile-title>
							</v-list-tile>

							<v-list-tile @click="dialog_delete_programm_setting.show = true">
								<v-list-tile-title>
									<v-icon color="red">close</v-icon>
									Удалить
								</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>

					<v-tooltip top>
						<v-btn color="indigo lighten-2" fab small dark slot="activator"
							   @click="dialog_new_programm_setting_open_btn">
							<v-icon>add</v-icon>
						</v-btn>
						<span>Создать</span>
					</v-tooltip>
				</v-card-title>

				<v-data-table
					:headers="system_settings_list_table.headers"
					:items="system_settings_list_table.list"
					:loading="system_settings_list_table.loading"
					hide-actions
				>
					<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
					<template slot="items" slot-scope="props">
						<tr @click="tableRowClicked(props.item)"
							:class="{'grey lighten-2': (props.item.row_id === system_settings_list_table.checked_table_obj.row_id)}"
						>
							<td>
								<v-icon
									:color="props.item.active === true ? 'success'
                  : props.item.active === false ? 'error' : '' "
									v-html="props.item.active === true ? 'toggle_on'
                  : props.item.active === false ? 'toggle_off' : '' "
									large
								></v-icon>
							</td>
							<td>{{props.item.type_name}}</td>
							<td>{{props.item.value}}</td>
							<td>{{props.item.description}}</td>
						</tr>
					</template>

				</v-data-table>

				<v-dialog v-model="dialog_new_programm_setting.show" persistent max-width="500px">
					<v-card>
						<v-card-title>
							<span class="headline">Добавление настройки</span>
							<v-spacer></v-spacer>
							<v-icon color="black" @click="dialog_new_programm_setting_close_btn">close</v-icon>
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-layout wrap>
								<v-flex xs12>
									<v-select
										:items="system_settings_list_table.settings_select_name_value"
										item-text="text"
										item-value="value"
										label="Тип"
										v-model="dialog_new_programm_setting.obj.name"
									></v-select>
								</v-flex>

								<v-flex xs6>
									<v-text-field label="Значение" required
												  v-model="dialog_new_programm_setting.obj.value"></v-text-field>
								</v-flex>

								<v-flex xs3 offset-xs1>
									<v-switch
										v-model="dialog_new_programm_setting.obj.active"
										:label="dialog_new_programm_setting.obj.active === true ? 'Активно' : 'Неактивно'"
										color="success"
									></v-switch>
								</v-flex>

								<v-flex xs12>
									<v-textarea
										label="Комментарий"
										rows="3"
										v-model="dialog_new_programm_setting.obj.description"
									></v-textarea>
								</v-flex>
							</v-layout>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" flat @click="dialog_new_programm_setting_close_btn">Закрыть
							</v-btn>
							<v-btn color="blue darken-1" flat
								   @click="dialog_new_programm_setting_save_btn(dialog_new_programm_setting.obj)">
								Сохранить
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>


				<v-dialog v-model="dialog_edit_programm_setting.show" persistent max-width="500px">
					<v-card>
						<v-card-title>
							<span class="headline">Редактирование настройки</span>
							<v-spacer></v-spacer>
							<v-icon color="black" @click="dialog_edit_programm_setting_close_btn">close</v-icon>
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-layout wrap>
								<v-flex xs12>
									<v-select
										readonly
										color="grey"
										:items="system_settings_list_table.settings_select_name_value_all"
										item-text="text"
										item-value="value"
										label="Тип"
										v-model="dialog_edit_programm_setting.obj.name"
									></v-select>
								</v-flex>

								<v-flex xs6>
									<v-text-field label="Значение" required
												  v-model="dialog_edit_programm_setting.obj.value"></v-text-field>
								</v-flex>

								<v-flex xs3 offset-xs1>
									<v-switch
										v-model="dialog_edit_programm_setting.obj.active"
										:label="dialog_edit_programm_setting.obj.active === true ? 'Активно' : 'Неактивно'"
										color="success"
									></v-switch>
								</v-flex>

								<v-flex xs12>
									<v-textarea
										label="Комментарий"
										rows="3"
										v-model="dialog_edit_programm_setting.obj.description"
									></v-textarea>
								</v-flex>
							</v-layout>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" flat @click="dialog_edit_programm_setting_close_btn">Закрыть
							</v-btn>
							<v-btn color="blue darken-1" flat
								   @click="dialog_edit_programm_setting_save_btn(dialog_edit_programm_setting.obj)">
								Сохранить
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>

				<v-dialog v-model="dialog_delete_programm_setting.show" persistent max-width="500px">

					<v-card>
						<v-card-title>
							<span class="headline">Удаление настройки</span>
							<v-spacer></v-spacer>
							<v-icon color="black" @click="dialog_delete_programm_setting.show = false">close</v-icon>
						</v-card-title>
						<v-card-text>Вы действительно хотите удалить настройку
							<strong>{{dialog_edit_programm_setting.obj.type_name}}</strong>?
							<br><br>
							<v-text-field readonly label="Значение"
										  v-model="dialog_edit_programm_setting.obj.value"></v-text-field>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="red" flat @click="delete_SystemSetting(dialog_edit_programm_setting.obj)">
								Удалить
							</v-btn>
							<v-btn color="blue darken-1" flat @click="dialog_delete_programm_setting.show = false">
								Закрыть
							</v-btn>
						</v-card-actions>
					</v-card>

				</v-dialog>

			</v-card>

			<v-snackbar
				v-model="snackbar.show"
				:color="snackbar.color"
				timeout="3000"
				bottom
				right
			>
				{{ snackbar.text }}
			</v-snackbar>
		</v-app>
	</div>
</template>


<script>
	import axios from 'axios'
	import navigation from '../navigation_panel.vue'

	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';

	var get_type_name_by_value_field = (array, element_value) => {
		let needed_el = {};
		array.forEach(arr_el => {
			if (arr_el.value === element_value) {
				needed_el = arr_el;
			}
		});
		return needed_el.text;
	};

	var get_index_of_array_by_id = (array, element_id) => {
		let needed_el = {};
		array.forEach(arr_el => {
			if (arr_el.row_id === element_id) {
				needed_el = arr_el;
			}
		});
		return array.indexOf(needed_el);
	};

	var get_index_of_array_of_choises_by_value = (array, value) => {
		let needed_el = {};
		array.forEach(array_el => {
			if (array_el.value === value) {
				needed_el = array_el;
			}
		});
		return array.indexOf(needed_el);
	};

	var generate_null_programm_setting_obj = () => {
		return {
			row_id: 0,
			name: '',
			description: '',
			active: true,
			value: ''
		}
	};

	export default {
		data() {
			return {
				system_settings_list_table: {
					headers: [
						{text: 'Активно', sortable: false},
						{text: 'Тип', sortable: false},
						{text: 'Значение', sortable: false},
						{text: 'Комментарий', sortable: false},
					],
					list: [],
					loading: true,
					settings_select_name_value: [],
					settings_select_name_value_all: [],
					checked_table_obj: generate_null_programm_setting_obj()
				},

				dialog_edit_programm_setting: {
					show: false,
					obj: generate_null_programm_setting_obj()
				},

				dialog_new_programm_setting: {
					show: false,
					obj: generate_null_programm_setting_obj()
				},

				dialog_delete_programm_setting: {
					show: false,
				},

				snackbar: {
					show: false,
					text: '',
					color: '',
				},
			}
		},

		methods: {

			tableRowClicked(element) {
				if (this.system_settings_list_table.checked_table_obj === element) {
					this.dialog_edit_programm_setting.obj = generate_null_programm_setting_obj();
					this.system_settings_list_table.checked_table_obj = generate_null_programm_setting_obj();
				} else {
					this.dialog_edit_programm_setting.obj = Object.assign({}, element);   // Object.assign({}, el) create a copy or aa = [...inventory]
					this.system_settings_list_table.checked_table_obj = element;
				}
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},

			getSystemSettingsListFromBackend() {
				this.system_settings_list_table.loading = true;
				axios.get('/rest_api/system_settings/')
					.then(resp => {
						this.system_settings_list_table.list = [];
						this.system_settings_list_table.settings_select_name_value = [];
						this.system_settings_list_table.settings_select_name_value_all.forEach(choise_el => {
							this.system_settings_list_table.settings_select_name_value.push(choise_el);
						});
						resp.data.forEach(element => {
							element.type_name = get_type_name_by_value_field(this.system_settings_list_table.settings_select_name_value_all, element.name);
							this.system_settings_list_table.list.push(element);
							let index = get_index_of_array_of_choises_by_value(this.system_settings_list_table.settings_select_name_value, element.name);
							if (index !== -1) {
								this.system_settings_list_table.settings_select_name_value.splice(index, 1)
							}
						});
						this.system_settings_list_table.loading = false;
					})
					.catch(err => {
						console.log(err.response)
					});
			},

			edit_SystemSetting(element) {
				axios.put('/rest_api/system_settings/?pk=' + element.row_id, element)
					.then(resp => {
						resp.data.type_name = get_type_name_by_value_field(this.system_settings_list_table.settings_select_name_value_all, resp.data.name);
						this.system_settings_list_table.list
							.splice(get_index_of_array_by_id(this.system_settings_list_table.list, element.row_id), 1, resp.data);
						this.dialog_edit_programm_setting.obj = Object.assign({}, resp.data);
						this.system_settings_list_table.checked_table_obj = Object.assign({}, this.dialog_edit_programm_setting.obj);
						this.snackbar_show('Настройка успешно изменена');
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка при изменении настройки', 'error');
					});
			},

			delete_SystemSetting(element) {
				axios.delete('/rest_api/system_settings/?pk=' + element.row_id)
					.then(resp => {
						this.getSystemSettingsListFromBackend();
						this.snackbar_show('Настройка успешно удалена');
						this.dialog_delete_programm_setting.show = false;
						this.dialog_edit_programm_setting.obj = generate_null_programm_setting_obj();
						this.system_settings_list_table.checked_table_obj = generate_null_programm_setting_obj();
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка при удалении настройки', 'error');
					})
			},


			dialog_new_programm_setting_open_btn() {
				this.dialog_new_programm_setting.obj = generate_null_programm_setting_obj();
				if (this.system_settings_list_table.settings_select_name_value.length > 0) {
					this.dialog_new_programm_setting.obj.name = this.system_settings_list_table.settings_select_name_value[0].value
				}
				this.dialog_new_programm_setting.show = true;
			},

			dialog_new_programm_setting_close_btn() {
				this.dialog_new_programm_setting.show = false;
				this.dialog_new_programm_setting.obj = generate_null_programm_setting_obj();
			},

			dialog_new_programm_setting_save_btn(element) {
				if (!element.name) {
					this.snackbar_show('Укажите тип настройки', 'error');
				} else {
					axios.post('/rest_api/system_settings/', element)
						.then(resp => {
							this.getSystemSettingsListFromBackend();
							this.snackbar_show('Настройка успешно создана');
							this.dialog_new_programm_setting.show = false;
						})
						.catch(err => {
							console.log(err.response);
							this.snackbar_show('Ошибка при создании настройки', 'error');
						});
				}
			},

			dialog_edit_programm_setting_open_btn() {
				this.dialog_edit_programm_setting.show = true;
			},

			dialog_edit_programm_setting_close_btn() {
				if (this.system_settings_list_table.checked_table_obj.row_id !== 0) {
					this.dialog_edit_programm_setting.obj = Object.assign({}, this.system_settings_list_table.checked_table_obj);
				} else {
					this.dialog_edit_programm_setting.obj = generate_null_programm_setting_obj();
				}
				this.dialog_edit_programm_setting.show = false;
			},

			dialog_edit_programm_setting_save_btn(element) {
				this.edit_SystemSetting(element);
				this.dialog_edit_programm_setting.show = false;
			},
		},

		components: {
			navigation
		},

		created() {
			axios.get('/rest_api/get_list_of_choises/PROGRAMM_SETTINGS_TYPE_SETTINGS/')
				.then(resp => {
					resp.data.forEach(element => {
						this.system_settings_list_table.settings_select_name_value_all.push(element);
					});
				})
				.catch(err => {
					console.log(err.response)
				});

			this.getSystemSettingsListFromBackend();
		}
	}
</script>

<style scoped>


</style>
