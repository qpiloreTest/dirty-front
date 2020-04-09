<template>
	<div>
		<v-app>
			<navigation></navigation>
			<v-card>
				<v-card-title>
					<h2>Шлюзы</h2>
					<v-spacer></v-spacer>
					<v-menu offset-y :disabled="gateways_table.checked_table_obj.row_id === 0">
						<v-btn
							slot="activator"
							color="indigo lighten-2"
							dark
							:disabled="gateways_table.checked_table_obj.row_id === 0"
						>
							<v-icon>settings</v-icon>
							Действия
							<v-icon>arrow_drop_down</v-icon>
						</v-btn>

						<v-list>
							<v-list-tile @click="gateways_table.dialog_edit_object.show = true">
								<v-list-tile-title>
									<v-icon>edit</v-icon>
									Редактировать
								</v-list-tile-title>
							</v-list-tile>

							<v-list-tile @click="gateways_table.dialog_delete_object.show = true">
								<v-list-tile-title>
									<v-icon color="red">close</v-icon>
									Удалить
								</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>

					<v-tooltip top>
						<v-btn color="indigo lighten-2" fab small dark slot="activator" @click="open_dialog_new_object">
							<v-icon>add</v-icon>
						</v-btn>
						<span>Создать</span>
					</v-tooltip>
				</v-card-title>

				<v-data-table
					:headers="gateways_table.headers"
					:items="gateways_table.list"
					:loading="gateways_table.loading"
					hide-actions
					item-key="row_id"
					ref="gateways_table"
				>
					<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
					<template slot="items" slot-scope="props">
						<tr @click="tableRowClicked(props.item), props.expanded = !props.expanded"
							:class="{'grey lighten-2': (props.item.row_id === gateways_table.checked_table_obj.row_id)}"
						>
							<td>
								<h2 v-if="props.expanded">{{props.item.name}}</h2>
								<span v-else>{{props.item.name}}</span>
							</td>
							<td>
								<v-icon
									:color="props.item.active === true ? 'success'
                  : props.item.active === false ? 'error' : '' "
									v-html="props.item.active === true ? 'toggle_on'
                  : props.item.active === false ? 'toggle_off' : '' "
									large
								></v-icon>
							</td>
						</tr>
					</template>
					<template slot="expand" slot-scope="props">
						<v-card flat color="grey lighten-2">
							<v-card-text>
								<v-flex>
									<v-layout wrap>
										<v-flex xs12 sm6 md4 lg2 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
											<DatetimePicker
												:disabled="true"
												label="Дата окончания"
												v-model="gateways_table.checked_table_obj.date_from"
												format="DD.MM.YYYY HH:mm"
												locale="ru-ru"
												clearText="Очистить"
												okText="Сохранить"
											></DatetimePicker>
										</v-flex>

										<v-flex xs12 sm6 md4 lg2
												:class="{'pl-2': $vuetify.breakpoint.smAndUp, 'pr-2': $vuetify.breakpoint.lgAndUp}">
											<DatetimePicker
												:disabled="true"
												label="Дата окончания"
												v-model="gateways_table.checked_table_obj.date_to"
												format="DD.MM.YYYY HH:mm"
												locale="ru-ru"
												clearText="Очистить"
												okText="Сохранить"
											></DatetimePicker>
										</v-flex>

										<v-flex xs12 sm12 md4 lg2
												:class="{'pl-2': $vuetify.breakpoint.mdAndUp, 'pr-2': $vuetify.breakpoint.lgAndUp}">
											<v-select
												readonly
												label="Режим распределения"
												item-text="text"
												item-value="value"
												:items="gateways_table.devices_work_mode_list"
												v-model="gateways_table.dialog_edit_object.obj.devices_work_mode"
											></v-select>
										</v-flex>

										<v-flex xs12 sm12 md12 lg6>
											<v-tooltip top>
												<v-text-field
													slot="activator"
													readonly
													:class="{'pl-2': $vuetify.breakpoint.lgAndUp}"
													label="Комментарий"
													v-model="gateways_table.dialog_edit_object.obj.description"
												></v-text-field>
												<span>{{gateways_table.dialog_edit_object.obj.description}}</span>
											</v-tooltip>
										</v-flex>
									</v-layout>
								</v-flex>
								<v-flex style="border: 1px solid black; border-radius: 2px">
									<v-tabs
										dark
										color="transparent"
										show-arrows
										color="grey lighten-3"
										grow
									>
										<v-tabs-slider color="black"></v-tabs-slider>

										<v-tab v-for="tab in gateways_table.tabs_list" :key="tab.value">
											<span style="color: black">{{ tab.text }}</span>
										</v-tab>

										<v-tabs-items>
											<v-tab-item v-for="tab in gateways_table.tabs_list" :key="tab.value">
												<v-card flat>
													<v-card-text>
														<GatewayDevices
															:gateway_id="gateways_table.checked_table_obj.row_id"
															:gateway_name="gateways_table.checked_table_obj.name"
															v-if="tab.value === 'devices'"
															ref="GatewayDevices"
														></GatewayDevices>
														<!-- with refs I can use method of custom components -->

														<GatewayLimits
															:gateway_id="gateways_table.checked_table_obj.row_id"
															:gateway_name="gateways_table.checked_table_obj.name"
															v-if="tab.value === 'limits'"
															ref="GatewayLimits"
														></GatewayLimits>

														<GatewayOrganizations
															:gateway_id="gateways_table.checked_table_obj.row_id"
															:gateway_name="gateways_table.checked_table_obj.name"
															v-if="tab.value === 'organizations'"
															ref="GatewayOrganizations"
														></GatewayOrganizations>

														<GatewayStatistics
															:gateway_obj="gateways_table.checked_table_obj"
															v-if="tab.value === 'statistics'"
															ref="GatewayStatistics"
														></GatewayStatistics>

														<GatewayQueue
															:gateway_id="gateways_table.checked_table_obj.row_id"
															:gateway_name="gateways_table.checked_table_obj.name"
															v-if="tab.value === 'queue'"
															ref="GatewayQueue"
														></GatewayQueue>
													</v-card-text>
												</v-card>
											</v-tab-item>
										</v-tabs-items>
									</v-tabs>
								</v-flex>

							</v-card-text>
						</v-card>
					</template>
				</v-data-table>
				<!--paginator-->

				<v-divider/>
				<v-layout row wrap class="paginator-font">
					<v-spacer/>
					<p>Строк на странице: </p>
					<div class="paginator-small-spacer-1r"/>
					<v-select
						class="paginator-select-small paginator-selector-font"
						:items="gateways_table.pagination.rows_per_page_list"
						v-model="gateways_table_rowsPerPage"
					></v-select>
					<div class="paginator-small-spacer-2r"/>
					<p v-if="gateways_table.pagination.totalItems !== 0">
						{{gateways_table.pagination.left_num}}-{{gateways_table.pagination.right_num}} из
						{{gateways_table.pagination.totalItems}}
					</p>
					<p v-else>&mdash;</p>
					<div class="paginator-small-spacer-2r"/>
					<v-icon
						@click="previous_page_click_pagination"
						:disabled="!gateways_table.pagination.previous"
						:color="!gateways_table.pagination.previous ? '' : 'grey darken-4'"
					>keyboard_arrow_left
					</v-icon>
					<div class="paginator-small-spacer-1r"/>
					<v-icon
						@click="next_page_click_pagination"
						:disabled="!gateways_table.pagination.next"
						:color="!gateways_table.pagination.next ? '' : 'grey darken-4'"
						class="paginator-last-action-btn"
					>keyboard_arrow_right
					</v-icon>
				</v-layout>
			</v-card>

			<v-dialog v-model="gateways_table.dialog_new_object.show" persistent max-width="650px">
				<v-card>
					<v-card-title>
						<span class="headline">Создание шлюза</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="close_dialog_new_object">close</v-icon>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-layout wrap>
							<v-flex xs8 sm8 md8 lg8>
								<v-text-field
									class="pr-2"
									label="Наименование*"
									required
									v-model="gateways_table.dialog_new_object.obj.name"
								></v-text-field>
							</v-flex>
							<v-flex xs3 sm3 md3 lg3 offset-xs1>
								<v-switch
									class="pl-2"
									v-model="gateways_table.dialog_new_object.obj.active"
									:label="gateways_table.dialog_new_object.obj.active === true ? 'Активно' : 'Неактивно'"
									color="success"
									hide-details
								></v-switch>
							</v-flex>
							<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
								<DatetimePicker
									label="Дата начала"
									v-model="gateways_table.dialog_new_object.obj.date_from"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
								<DatetimePicker
									label="Дата окончания"
									v-model="gateways_table.dialog_new_object.obj.date_to"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex xs12>
								<v-select
									label="Режим распределения"
									item-text="text"
									item-value="value"
									:items="gateways_table.devices_work_mode_list"
									v-model="gateways_table.dialog_new_object.obj.devices_work_mode"
								></v-select>
							</v-flex>
							<v-flex xs12>
								<v-textarea
									label="Комментарий"
									rows="3"
									v-model="gateways_table.dialog_new_object.obj.description"
								></v-textarea>
							</v-flex>
						</v-layout>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="close_dialog_new_object">Закрыть</v-btn>
						<v-btn color="blue darken-1" flat @click="create_gateway">Создать</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


			<v-dialog v-model="gateways_table.dialog_edit_object.show" persistent max-width="600px">
				<v-card>
					<v-card-title>
						<span class="headline">Редактирование шлюза</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="close_dialog_edit_object">close</v-icon>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-layout wrap>
							<v-flex xs8 sm8 md8 lg8>
								<v-text-field
									class="pr-2"
									label="Наименование*"
									required
									v-model="gateways_table.dialog_edit_object.obj.name"
								></v-text-field>
							</v-flex>
							<v-flex xs3 sm3 md3 lg3 offset-xs1>
								<v-switch
									class="pl-2"
									v-model="gateways_table.dialog_edit_object.obj.active"
									:label="gateways_table.dialog_edit_object.obj.active === true ? 'Активно' : 'Неактивно'"
									color="success"
									hide-details
								></v-switch>
							</v-flex>
							<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
								<DatetimePicker
									label="Дата начала"
									v-model="gateways_table.dialog_edit_object.obj.date_from"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
								<DatetimePicker
									label="Дата окончания"
									v-model="gateways_table.dialog_edit_object.obj.date_to"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex xs12>
								<v-select
									label="Режим распределения"
									item-text="text"
									item-value="value"
									:items="gateways_table.devices_work_mode_list"
									v-model="gateways_table.dialog_edit_object.obj.devices_work_mode"
								></v-select>
							</v-flex>
							<v-flex xs12>
								<v-textarea
									label="Комментарий"
									rows="3"
									v-model="gateways_table.dialog_edit_object.obj.description"
								></v-textarea>
							</v-flex>
						</v-layout>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="close_dialog_edit_object">Закрыть</v-btn>
						<v-btn color="blue darken-1" flat @click="save_dialog_edit_object">Сохранить</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="gateways_table.dialog_delete_object.show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Удаление шлюзов</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="gateways_table.dialog_delete_object.show = false">close</v-icon>
					</v-card-title>
					<v-card-text>Шлюз, который вы хотите удалить:
						<ul>
							<li>
                <span>
                  <v-icon small>group_work</v-icon>
                  {{ gateways_table.checked_table_obj.name }}
                </span>
							</li>
						</ul>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red" flat @click="delete_gateway_object">Удалить</v-btn>
						<v-btn color="blue darken-1" flat @click="gateways_table.dialog_delete_object.show = false">
							Закрыть
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-app>

		<v-snackbar
			v-model="snackbar.show"
			:color="snackbar.color"
			timeout="3000"
			bottom
			right
		>
			{{ snackbar.text }}
		</v-snackbar>
	</div>
</template>


<script>
	import axios from 'axios'
	import navigation from '../navigation_panel.vue'
	import regeneratorRuntime from "regenerator-runtime";
	import Treeselect from '@riophae/vue-treeselect'
	import '../../../static/css/vue-treeselect.css'
	import {LOAD_CHILDREN_OPTIONS, LOAD_ROOT_OPTIONS} from '@riophae/vue-treeselect'
	import GatewayDevices from './gateway_devices.vue'
	import GatewayLimits from './gateway_limits.vue'
	import GatewayOrganizations from './gateway_organizations.vue'
	import GatewayStatistics from './gateway_statistics.vue'
	import GatewayQueue from './gateway_queue.vue'
	import DatetimePicker from '../custom_components/DatetimePicker.vue'

	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';

	const default_headers = {
		'Content-Type': 'application/json',
		'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
		// 'Authorization': 'bearer ' + document.getElementsByName('csrfmiddlewaretoken')[0].value
	};


	var calculate_paginator_rows = (page, rowPerPage, total) => {
		let left_num = ((page - 1) * rowPerPage) + 1;
		let right_num = page * rowPerPage;
		if (right_num > total) {
			right_num = right_num - (right_num - total);
		}
		return ({left_num: left_num, right_num: right_num});
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

	var generate_null_pagination_obj = () => {
		return {
			page: 1,
			totalItems: 0,
			rows_per_page_list: [10, 15, 25, 50],
			next: null,
			previous: null,
			filter: '',
			left_num: 0,
			right_num: 0
		};
	};

	var generate_null_gateway_object = () => {
		return {row_id: 0, name: '', active: false, date_from: '', date_to: '', description: '', devices_work_mode: ''}
	};


	export default {
		components: {
			navigation,
			GatewayDevices,
			GatewayLimits,
			GatewayOrganizations,
			GatewayStatistics,
			GatewayQueue,
			DatetimePicker
		},

		data() {
			return {

				gateways_table_rowsPerPage: 10,
				gateways_table: {
					loading: false,
					devices_work_mode_list: [],
					list: [],
					headers: [
						{text: 'Наименование', value: 'name', sortable: false},
						{text: 'Активно', value: 'active', sortable: false, width: 15},
					],
					current_tab: null,
					tabs_list: [
						{text: 'Устройства', value: 'devices'},
						{text: 'Ограничения', value: 'limits'},
						{text: 'Организации', value: 'organizations'},
						{text: 'Статистика', value: 'statistics'},
						{text: 'Очередь', value: 'queue'},
					],
					pagination: {
						page: 1,
						totalItems: 0,
						rows_per_page_list: [10, 15, 25, 50],
						next: null,
						previous: null,
						filter: '',
						left_num: 0,
						right_num: 0
					},
					checked_table_obj: generate_null_gateway_object(),
					dialog_new_object: {
						obj: generate_null_gateway_object(),
						show: false,
						date_from_dialog_show: false,
						date_to_dialog_show: false,
					},
					dialog_edit_object: {
						obj: generate_null_gateway_object(),
						show: false,
						date_from_dialog_show: false,
						date_to_dialog_show: false,
					},
					dialog_delete_object: {
						show: false
					}
				},

				snackbar: {
					show: false,
					text: '',
					color: '',
				},
			}
		},

		methods: {

			formatDate(date) {
				return moment(date).format('DD.MM.YYYY');
			},

			tableRowClicked(element) {
				if (this.gateways_table.checked_table_obj === element) {
					this.gateways_table.checked_table_obj = generate_null_gateway_object();
					this.gateways_table.dialog_edit_object.obj = generate_null_gateway_object();
				} else {
					this.gateways_table.checked_table_obj = element;
					this.gateways_table.dialog_edit_object.obj = Object.assign({}, element);
				}
			},

			open_dialog_new_object() {
				this.gateways_table.dialog_new_object.obj = generate_null_gateway_object();
				if (this.gateways_table.devices_work_mode_list.length > 0) {
					this.gateways_table.dialog_new_object.obj.devices_work_mode = this.gateways_table.devices_work_mode_list[0];
				}
				this.gateways_table.dialog_new_object.show = true;
			},

			close_dialog_new_object() {
				this.gateways_table.dialog_new_object.obj = generate_null_gateway_object();
				this.gateways_table.dialog_new_object.show = false;
			},

			create_gateway() {
				console.log('this.gateways_table.dialog_new_object.obj');
				console.log(this.gateways_table.dialog_new_object.obj);
				let post_params = {
					name: this.gateways_table.dialog_new_object.obj.name,
					active: this.gateways_table.dialog_new_object.obj.active,
					description: this.gateways_table.dialog_new_object.obj.description,
					devices_work_mode: this.gateways_table.dialog_new_object.obj.devices_work_mode,
				};
				this.gateways_table.dialog_new_object.obj.date_to ? post_params.date_to = this.gateways_table.dialog_new_object.obj.date_to : '';
				this.gateways_table.dialog_new_object.obj.date_from ? post_params.date_from = this.gateways_table.dialog_new_object.obj.date_from : '';
				if (typeof this.gateways_table.dialog_new_object.obj.devices_work_mode === 'object') {
					post_params.devices_work_mode = this.gateways_table.dialog_new_object.obj.devices_work_mode.value
				}
				axios.post('/rest_api/gateways/', post_params, {headers: default_headers})
					.then(resp => {
						this.getGatewayObjectsFromServer();
						this.snackbar_show('Шлюз успешно создан');
						this.gateways_table.dialog_new_object.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при создании шлюза', 'error');
				})
			},

			close_dialog_edit_object() {
				if (this.gateways_table.checked_table_obj !== generate_null_gateway_object()) {
					this.gateways_table.dialog_edit_object.obj = Object.assign({}, this.gateways_table.checked_table_obj);
				} else {
					this.gateways_table.dialog_edit_object.obj = generate_null_gateway_object();
				}
				this.gateways_table.dialog_edit_object.show = false;
			},

			save_dialog_edit_object() {
				let post_params = {
					name: this.gateways_table.dialog_edit_object.obj.name,
					date_from: this.gateways_table.dialog_edit_object.obj.date_from,
					description: this.gateways_table.dialog_edit_object.obj.description,
					active: this.gateways_table.dialog_edit_object.obj.active,
					date_to: this.gateways_table.dialog_edit_object.obj.date_to,
					devices_work_mode: this.gateways_table.dialog_edit_object.obj.devices_work_mode,
				};
				console.log(post_params);

				axios.put('/rest_api/gateways/?pk=' + this.gateways_table.checked_table_obj.row_id, post_params, {headers: default_headers})
					.then(resp => {
						console.log(resp.data);
						this.gateways_table.list
							.splice(get_index_of_array_by_id(this.gateways_table.list, resp.data.row_id), 1, resp.data);  //change old row data to new
						this.gateways_table.checked_table_obj = Object.assign({}, resp.data);
						this.gateways_table.dialog_edit_object.obj = Object.assign({}, resp.data);
						this.snackbar_show('Шлюз успешно изменен');
						this.gateways_table.dialog_edit_object.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при изменении шлюза');
				})
			},

			delete_gateway_object() {
				axios.delete('/rest_api/gateways/?pk=' + this.gateways_table.checked_table_obj.row_id)
					.then(resp => {
						this.getGatewayObjectsFromServer();
						this.snackbar_show('Шлюз успешно удален');
						this.gateways_table.dialog_delete_object.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при удалении шлюза', 'error')
				})
			},

			getGatewayObjectsFromServer(url = '') {
				if (!url) {
					this.gateways_table.pagination.page = 1;
					url = ('/rest_api/gateways/?page_size='
						+ this.gateways_table_rowsPerPage
						+ '&page=' + this.gateways_table.pagination.page);
				}
				this.gateways_table.dialog_edit_object.obj = generate_null_gateway_object();
				this.gateways_table.checked_table_obj = generate_null_gateway_object();
				this.gateways_table.loading = true;
				axios.get(url)
					.then(resp => {
						this.gateways_table.list = [];
						console.log(resp.data);
						if (resp.data.results.length > 0) {
							resp.data.results.forEach(element => {
								this.gateways_table.list.push(element);
							});
						}

						this.save_pagination_data(resp.data);
						this.gateways_table.loading = false;
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка получения шлюзов', 'error');
					});
			},

			next_page_click_pagination() {
				this.gateways_table.pagination.page++;
				this.getGatewayObjectsFromServer(this.queue_outbound_table.pagination.next);
			},

			previous_page_click_pagination() {
				this.gateways_table.pagination.page--;
				this.getGatewayObjectsFromServer(this.queue_outbound_table.pagination.previous);
			},

			save_pagination_data(data) {
				this.gateways_table.pagination.totalItems = data.count;
				this.gateways_table.pagination.next = data.next;
				this.gateways_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.gateways_table.pagination.page,
					this.gateways_table_rowsPerPage,
					this.gateways_table.pagination.totalItems);
				this.gateways_table.pagination.left_num = pag_nums.left_num;
				this.gateways_table.pagination.right_num = pag_nums.right_num;
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},
		},

		watch: {
			gateways_table_rowsPerPage: {
				handler() {
					this.getGatewayObjectsFromServer();
				},
				deep: true
			},
		},

		created() {
			this.getGatewayObjectsFromServer();

			axios.get('/rest_api/get_list_of_choises/GATEWAY_DEVICES_WORK_MODE_CHOISE/')
				.then(resp => {
					resp.data.forEach(element => {
						this.gateways_table.devices_work_mode_list.push(element)
					});
					console.log(this.gateways_table.devices_work_mode_list);
				}).catch(err => {
				console.log(err.response);
				this.snackbar_show('Ошибка получения списка режимов работы шлюза', 'error');
			})
		}
	}
</script>

<style scoped>

	.paginator-select-small {
		max-width: 3rem;
		margin-top: -20px;
	}

	.paginator-small-spacer-1r {
		width: 1.0rem;
		margin-right: 0.5rem;
	}

	.paginator-small-spacer-2r {
		width: 2.0rem;
		margin-right: 0.5rem;
	}

	.paginator-last-action-btn {
		margin-right: 1rem;
	}

	.paginator-font {
		margin-top: 1rem;
		color: grey;
		font-size: 12px;
	}

	.paginator-selector-font {
		font-size: 11px;
	}

	.paginator-margin-03rem-top-reversed {
		margin-top: -0.3rem;
	}

</style>
