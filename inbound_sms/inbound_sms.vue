<template>
	<div>
		<v-app>
			<navigation></navigation>
			<v-card>
				<v-card-title>
					<h2>История сообщений</h2>
					<v-spacer></v-spacer>

					<!--<v-tooltip bottom class="pr-4">-->
					<!--<img-->
					<!--@click="generate_xml_file"-->
					<!--src="/static/pictures/web_excel.png"-->
					<!--width="26"-->
					<!--height="26"-->
					<!--slot="activator"-->
					<!--style="cursor: pointer;">-->
					<!--<span>Выгрузить в Excel</span>-->
					<!--</v-tooltip>-->

					<v-tooltip top>
						<v-btn color="indigo lighten-2" fab small dark slot="activator"
							   @click="openFilterDialog_InboundSmsListTable">
							<v-icon>filter_list</v-icon>
						</v-btn>
						<span>Фильтр</span>
					</v-tooltip>
				</v-card-title>

				<v-data-table
					:headers="inbound_sms_list_table.headers"
					:items="inbound_sms_list_table.list"
					:loading="inbound_sms_list_table.loading"
					hide-actions
				>
					<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
					<template slot="items" slot-scope="props">

						<tr
							@dblclick="show_sms_history_by_number(props.item)" @click=""
							:bgcolor="props.item.status === 'Processed' ? '#CCFF90' : ''"
						>
							<td>{{props.item.date_sms | formatDate}}</td>
							<td>{{props.item.phonenumber}}</td>
							<td>{{props.item.message}}</td>
							<td>
								<span v-if="props.item.organization">{{props.item.organization.name}}</span>
								<span v-else>----</span>
							</td>
							<td>
								<span v-if="props.item.project">{{props.item.project.short_name}}</span>
								<span v-else>----</span>
							</td>
							<td>
								<span v-if="props.item.device.name">{{props.item.device.name}}</span>
								<span v-else>----</span>
							</td>
							<td class="justify-center layout px-0">
								<v-btn icon v-if="props.item.status != 'Processed'"
									   @click="mark_ask_read_sms(props.item, 'inbound_sms_list')">
									<v-tooltip bottom>
										<v-icon
											slot="activator"
											dark
										>visibility
										</v-icon>
										<span>Пометить как прочтенное</span>
									</v-tooltip>
								</v-btn>
							</td>
						</tr>
					</template>
				</v-data-table>

				<!--paginator-->

				<v-divider/>
				<v-layout row wrap class="paginator-font">
					<p class="red--text pl-2">*</p>
					<v-span>Произведите двойной щелчек по строке для просмотра истории SMS по номеру телефона</v-span>
					<v-spacer/>
					<p>Строк на странице: </p>
					<div class="paginator-small-spacer-1r"/>
					<v-select
						class="paginator-select-small paginator-selector-font"
						:items="inbound_sms_list_table.pagination.rows_per_page_list"
						v-model="inbound_sms_list_table_rowsPerPage"
					></v-select>
					<div class="paginator-small-spacer-2r"/>
					<p v-if="inbound_sms_list_table.pagination.totalItems !== 0">
						{{inbound_sms_list_table.pagination.left_num}}-{{inbound_sms_list_table.pagination.right_num}}
						из {{inbound_sms_list_table.pagination.totalItems}}
					</p>
					<p v-else>&mdash;</p>
					<div class="paginator-small-spacer-1r"/>
					<v-btn icon small class="paginator-margin-03rem-top-reversed"
						   @click="previous_page_click_inbound_sms_table"
						   :disabled="!inbound_sms_list_table.pagination.previous">
						<v-icon :color="!inbound_sms_list_table.pagination.previous ? '' : 'grey darken-4'">
							keyboard_arrow_left
						</v-icon>
					</v-btn>
					<v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
						   @click="next_page_click_inbound_sms_table"
						   :disabled="!inbound_sms_list_table.pagination.next">
						<v-icon :color="!inbound_sms_list_table.pagination.next ? '' : 'grey darken-4'">
							keyboard_arrow_right
						</v-icon>
					</v-btn>
				</v-layout>

				<!--<CustomTablePagination-->
				<!--class="pt-5"-->
				<!--:get-data-from-backend-func="getInboundSmsList"-->
				<!--/>-->

			</v-card>


			<v-dialog v-model="sms_history_by_number_table.show" fullscreen hide-overlay>
				<v-card style="background-color: #F5F5F5">
					<v-toolbar dark color="grey lighten-2">
						<v-btn icon dark @click="sms_history_by_number_table.show = false">
							<v-icon class="black--text">close</v-icon>
						</v-btn>
						<v-toolbar-title class="black--text">История SMS по номеру
							'{{inbound_sms_list_table.checked_table_obj.phonenumber}}'
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<!--<v-tooltip bottom class="pr-2">-->
						<!--<img-->
						<!--@click="generate_xml_file(by_number=true)"-->
						<!--src="/static/pictures/web_excel.png"-->
						<!--width="20"-->
						<!--height="20"-->
						<!--slot="activator"-->
						<!--style="cursor: pointer;">-->
						<!--<span>Выгрузить в Excel</span>-->
						<!--</v-tooltip>-->
						<v-toolbar-items>
							<v-btn dark flat @click="sms_history_by_number_table.show = false" class="black--text">
								Закрыть
							</v-btn>
						</v-toolbar-items>
					</v-toolbar>
					<v-card>
						<v-data-table
							:headers="sms_history_by_number_table.headers"
							:items="sms_history_by_number_table.list"
							:loading="sms_history_by_number_table.loading"
							hide-actions
						>
							<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
							<template slot="items" slot-scope="props">

								<tr @click="" :bgcolor="props.item.status === 'Processed' ? '#CCFF90' : ''">
									<td>{{props.item.date_sms | formatDate}}</td>
									<td>{{props.item.phonenumber}}</td>
									<td>{{props.item.message}}</td>
									<td>
										<span v-if="props.item.device.name">{{props.item.device.name}}</span>
										<span v-else>----</span>
									</td>
									<td class="justify-center layout px-0">
										<v-btn icon v-if="props.item.status != 'Processed'"
											   @click="mark_ask_read_sms(props.item, 'sms_history')">
											<v-tooltip bottom>
												<v-icon
													slot="activator"
													dark
												>visibility
												</v-icon>
												<span>Пометить как прочтенное</span>
											</v-tooltip>
										</v-btn>
									</td>
								</tr>
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
								:items="sms_history_by_number_table.pagination.rows_per_page_list"
								v-model="sms_history_by_number_table_rowsPerPage"
							></v-select>
							<div class="paginator-small-spacer-2r"/>
							<p v-if="sms_history_by_number_table.pagination.totalItems !== 0">
								{{sms_history_by_number_table.pagination.left_num}}-{{sms_history_by_number_table.pagination.right_num}}
								из {{sms_history_by_number_table.pagination.totalItems}}
							</p>
							<p v-else>&mdash;</p>
							<div class="paginator-small-spacer-2r"/>
							<v-icon
								@click="previous_page_click_sms_history_table"
								:disabled="!sms_history_by_number_table.pagination.previous"
								:color="!sms_history_by_number_table.pagination.previous ? '' : 'grey darken-4'"
							>keyboard_arrow_left
							</v-icon>
							<div class="paginator-small-spacer-1r"/>
							<v-icon
								@click="next_page_click_sms_history_table"
								:disabled="!sms_history_by_number_table.pagination.next"
								:color="!sms_history_by_number_table.pagination.next ? '' : 'grey darken-4'"
								class="paginator-last-action-btn"
							>keyboard_arrow_right
							</v-icon>
						</v-layout>
					</v-card>
				</v-card>
			</v-dialog>

			<v-dialog v-model="inbound_sms_list_table.filter.show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Фильтр</span>
						<v-spacer></v-spacer>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-layout wrap>
							<v-flex xs12 sm6 class="pr-2 pl-2">
								<span style="color: grey; font-size: 12px; padding-left: 2px;">Оргазинации</span>
								<v-progress-circular
									v-if="treeselect.organizations_loading"
									indeterminate
									:size="12"
									:width="2"
									color="primary"
								></v-progress-circular>
								<Treeselect
									v-model="treeselect.organizations"
									:multiple="true"
									:options="treeselect.organizations_list"
									:load-options="loadOrganizations"
									:flat="true"
									placeholder="Поиск..."
								/>
								<br>
							</v-flex>

							<v-flex xs12 sm6 class="pr-2 pl-2">
								<span style="color: lightgrey; font-size: 12px; padding-left: 2px;"
									  v-if="treeselect.organizations.length < 1">Проекты</span>
								<span style="color: grey; font-size: 12px; padding-left: 2px;" v-else>Проекты</span>
								<Treeselect
									v-model="treeselect.projects"
									:multiple="true"
									:options="treeselect.projects_list"
									placeholder="Поиск..."
									:load-options="loadProjectsUnderOrganizations"
									:auto-load-root-options="false"
									:disabled="treeselect.organizations.length < 1"
								/>
								<br>
							</v-flex>

							<v-flex md6 xs12 class="pr-2 pl-2">
								<v-select
									label="Статус"
									item-text="text"
									item-value="value"
									:items="inbound_sms_list_table.filter.obj.status_list"
									v-model="inbound_sms_list_table.filter.obj.status"
								></v-select>
							</v-flex>
							<v-flex md6 xs12 class="pr-2 pl-2">
								<v-select
									label="Устройство"
									item-text="text"
									item-value="value"
									:items="inbound_sms_list_table.filter.obj.device_list"
									v-model="inbound_sms_list_table.filter.obj.device"
								></v-select>
							</v-flex>
							<v-flex md6 xs12 class="pr-2 pl-2">
								<DatetimePicker
									label="Время с"
									v-model="inbound_sms_list_table.filter.obj.min_date"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex md6 xs12 class="pr-2 pl-2">
								<DatetimePicker
									label="Время по"
									v-model="inbound_sms_list_table.filter.obj.max_date"
									format="DD.MM.YYYY HH:mm"
									locale="ru-ru"
									clearText="Очистить"
									okText="Сохранить"
								></DatetimePicker>
							</v-flex>
							<v-flex xs12 class="pr-2 pl-2">
								<v-text-field
									label="Номер телефона"
									v-model="inbound_sms_list_table.filter.obj.phonenumber"
								></v-text-field>
							</v-flex>
						</v-layout>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="clearFilterDialog_InboundSmsListTable">Очистить
						</v-btn>
						<v-btn color="blue darken-1" flat @click="saveFilterDialog_InboundSmsListTable">Сохранить
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


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
	import CustomTablePagination from '../custom_components/CustomTablePagination.vue'

	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';
	const default_headers = {
		'Content-Type': 'application/json',
		'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
		// 'Authorization': 'bearer ' + document.getElementsByName('csrfmiddlewaretoken')[0].value
	};
	import DatetimePicker from '../custom_components/DatetimePicker.vue'
	import moment from 'moment'
	import Treeselect from '@riophae/vue-treeselect'
	import '../../../static/css/vue-treeselect.css'
	import {LOAD_CHILDREN_OPTIONS, LOAD_ROOT_OPTIONS} from '@riophae/vue-treeselect'

	var calculate_paginator_rows = (page, rowPerPage, total) => {
		let left_num = ((page - 1) * rowPerPage) + 1;
		let right_num = page * rowPerPage;
		if (right_num > total) {
			right_num = right_num - (right_num - total);
		}
		return ({left_num: left_num, right_num: right_num});
	};

	var get_index_of_array_by_element = (array, element) => {
		return array.indexOf(element);
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

	var generate_null_inbound_sms_list_filter_obj = () => {
		return {
			min_date: '',
			max_date: '',
			phonenumber: '',
			device: '',
			status: '',
			device_list: [{text: '----', value: ''}],
			status_list: [{text: '----', value: ''}]
		};
	};

	// var dynamicSort = property => {
	//   var sortOrder = 1;
	//   if (property[0] === "-") {
	//     sortOrder = -1;
	//     property = property.substr(1);
	//   }
	//   return function (a, b) {
	//     var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	//     return result * sortOrder;
	//   }
	// };

	export default {
		data() {
			return {
				inbound_sms_list_table_rowsPerPage: 10,
				inbound_sms_list_table: {
					headers: [
						{text: 'Дата', value: 'date_sms', sortable: false},
						{text: 'Номер телефона', value: 'phonenumber', sortable: false},
						{text: 'Текст', value: 'message', sortable: false},
						{text: 'Организация', value: 'organization.name', sortable: false},
						{text: 'Проект', value: 'project.short_name', sortable: false},
						{text: 'Устройство', value: 'device.name', sortable: false},
						{text: 'Управление', sortable: false},
					],
					list: [],
					loading: true,
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
					filter: {
						obj: generate_null_inbound_sms_list_filter_obj(),
						show: false,
					},
					checked_table_obj: {phonenumber: ''},
					filter_list: {},
				},

				sms_history_by_number_table_rowsPerPage: 10,
				sms_history_by_number_table: {
					show: false,
					headers: [
						{text: 'Дата', value: 'date_sms', sortable: false},
						{text: 'Номер телефона', value: 'phonenumber', sortable: false},
						{text: 'Текст', value: 'message', sortable: false},
						{text: 'Устройство', value: 'device.name', sortable: false},
					],
					list: [],
					loading: true,
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
					filter_list: {device_id: '', organization_id: '', phonenumber: ''},
				},

				treeselect: {
					organizations: [],
					organizations_for_compare: [],
					organizations_list: [],
					cache_organizations_list: [],
					organizations_loading: false,

					projects: [],
					projects_list: null,
					cache_projects_list: [],
				},

				snackbar: {
					show: false,
					text: '',
					color: '',
				},
			}
		},

		methods: {
			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},

			getInboundSmsList(url) {
				this.inbound_sms_list_table.loading = true;
				if (!url) {
					this.inbound_sms_list_table.pagination.page = 1;
					url = '/rest_api/inbound_sms/?page_size=' + this.inbound_sms_list_table_rowsPerPage + '&page=' + this.inbound_sms_list_table.pagination.page;
					this.inbound_sms_list_table.filter.obj.phonenumber ? url += ('&phonenumber=' + this.inbound_sms_list_table.filter.obj.phonenumber) : '';
					this.inbound_sms_list_table.filter.obj.status ? url += ('&status=' + this.inbound_sms_list_table.filter.obj.status) : '';
					this.inbound_sms_list_table.filter.obj.max_date ? url += ('&max_date=' + moment(String(this.inbound_sms_list_table.filter.obj.max_date)).format('YYYY-MM-DD hh:mm')) : '';
					this.inbound_sms_list_table.filter.obj.min_date ? url += ('&min_date=' + moment(String(this.inbound_sms_list_table.filter.obj.min_date)).format('YYYY-MM-DD hh:mm')) : '';
					this.inbound_sms_list_table.filter.obj.device ? url += ('&device_id=' + this.inbound_sms_list_table.filter.obj.device) : '';
					if (this.treeselect.projects.length > 0) {
						this.treeselect.projects ? url += ('&project_ides=' + this.treeselect.projects) : '';
					} else {
						this.treeselect.organizations.length > 0 ? url += ('&organization_ides=' + this.treeselect.organizations)
							: url += ('&organization=');
						// this.treeselect.organizations.length > 0 ? url += ('&organization=' + this.treeselect.organizations)
						// 	: url += ('&organization=' + '-1');
					}
				}
				axios.get(url)
					.then(resp => {
						this.inbound_sms_list_table.list = [];
						console.log(resp.data);
						this.save_pagination_data_inbound_sms_table(resp.data);
						resp.data.results.forEach(element => {
							this.inbound_sms_list_table.list.push(element);
						});
						this.inbound_sms_list_table.loading = false;
					})
					.catch(err => {
						console.log(err.response);
					});
			},

			generate_xml_file(by_number = false) {
				let post_params = {};
				if (!by_number) {
					post_params = {
						model_name: 'INBOUND_SMS',
						filter_list: this.inbound_sms_list_table.filter_list,
					};
				} else {
					post_params = {
						model_name: 'INBOUND_SMS',
						filter_list: this.sms_history_by_number_table.filter_list,
					};
				}
				axios.post('/rest_api/generate_xmlfile_with_params/', post_params, {headers: default_headers})
					.then(resp => {
						console.log(resp.data);
						window.location.href = "/media/xls/" + resp.data;
						this.snackbar_show('Генерация Excel прошла успешно');
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка генерации Excel файла', 'error');
				});
				console.log(post_params);
			},

			openFilterDialog_InboundSmsListTable() {
				this.inbound_sms_list_table.filter.obj.device_list = [{text: '----', value: ''}];
				this.inbound_sms_list_table.filter.obj.status_list = [{text: '----', value: ''}];
				axios.get('/rest_api/modems/list/?list_name_id=true&page_size=100', {headers: default_headers})
					.then(resp => {
						resp.data.results.forEach(element => {
							this.inbound_sms_list_table.filter.obj.device_list.push({
								text: element.name,
								value: element.value
							})
						})
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show("Ошибка при получении списка устройств", 'error');
				});
				axios.get('/rest_api/get_list_of_choises/INBOUND_SMS_STATUS_RECORD/', {headers: default_headers})
					.then(resp => {
						resp.data.forEach(element => {
							this.inbound_sms_list_table.filter.obj.status_list.push({
								text: element.text,
								value: element.value
							})
						})
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show("Ошибка при получении списка статусов", 'error');
				});
				axios.get('/rest_api/tree_view_orgs_and_projs/?type=1&children_exists=true', {headers: default_headers})
					.then(resp => {
						this.treeselect.organizations_list = [];
						resp.data.organizations.forEach(element => {
							if (element.children_exists) {
								this.treeselect.organizations_list.push({
									id: element.id,
									label: element.name,
									children: null
								});
							} else {
								this.treeselect.organizations_list.push({id: element.id, label: element.name});
							}
							if (!this.treeselect.cache_organizations_list.find(el => {
								return el.id === element.id
							})) {
								this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
							}
						});
						this.treeselect.organizations_loading = false;
					}).catch(err => {
					console.log(err.response)
				});
				this.inbound_sms_list_table.filter.show = true;
			},

			loadOrganizations({action, parentNode, callback}) {
				if (action === LOAD_CHILDREN_OPTIONS)
					axios.get('/rest_api/tree_view_orgs_and_projs/?type=5&children_exists=true'
							+ '&organization_id=' + parentNode.id, {headers: default_headers})
						.then(resp => {
							parentNode.children = [];
							resp.data.organizations.forEach(element => {
								if (element.children_exists) {
									parentNode.children.push({id: element.id, label: element.name, children: null});
								} else {
									parentNode.children.push({id: element.id, label: element.name});
								}
								if (!this.treeselect.cache_organizations_list.find(el => {
									return el.id === element.id
								})) {
									this.treeselect.cache_organizations_list.push({
										id: element.id,
										label: element.name
									});
								}
							});
							callback();
						})
						.catch(err => {
							console.log(err.response);
							callback(new Error('Failed to load options: network error.'));
						});
			},

			loadProjectsUnderOrganizations({action, callback}) {
				if (action === 'LOAD_ROOT_OPTIONS') {
					axios.get('/rest_api/projects/list/?organization_ides=' + this.treeselect.organizations
							+ '&page=1&page_size=100&show_organization_name=true', {headers: default_headers})
						.then(resp => {
							this.treeselect.projects_list = [];
							resp.data.results.forEach(element => {
								if (!this.treeselect.projects_list.find(el => {
									return el.id === element.row_id
								})) {
									this.treeselect.projects_list.push({id: element.row_id, label: element.short_name});
								}
								if (!this.treeselect.cache_projects_list.find(el => {
									return el.id === element.row_id
								})) {
									this.treeselect.cache_projects_list.push({
										id: element.row_id,
										label: element.short_name
									});
								}
							});
							callback();
						}).catch(err => {
						console.log(err.response);
						callback(new Error('Failed to load options: network error.'));
					})
				}
			},

			clearFilterDialog_InboundSmsListTable() {
				this.inbound_sms_list_table.filter.obj = generate_null_inbound_sms_list_filter_obj();
				this.getInboundSmsList();
				this.inbound_sms_list_table.filter.show = false;
			},

			saveFilterDialog_InboundSmsListTable() {
				this.getInboundSmsList();
				this.inbound_sms_list_table.filter.show = false;
			},

			mark_ask_read_sms(element, table = '') {
				axios.put('/rest_api/inbound_sms/?pk=' + element.row_id, {
					status: 'Processed',
				})
					.then(resp => {
						console.log(resp.data);
						if (table === 'inbound_sms_list') {
							this.inbound_sms_list_table.list
								.splice(get_index_of_array_by_id(this.inbound_sms_list_table.list, element.row_id), 1, resp.data);
						}
						if (table === 'sms_history') {
							if (get_index_of_array_by_id(this.inbound_sms_list_table.list, element.row_id) !== (-1)) {
								this.inbound_sms_list_table.list
									.splice(get_index_of_array_by_id(this.inbound_sms_list_table.list, element.row_id), 1, resp.data);
							}
							this.sms_history_by_number_table.list
								.splice(get_index_of_array_by_id(this.sms_history_by_number_table.list, element.row_id), 1, resp.data);
						}

					})
					.catch(err => {
						console.log(err.response);
					});
			},

			show_sms_history_by_number(element) {
				this.inbound_sms_list_table.checked_table_obj = element;
				this.get_history_of_sms_by_number();
				this.sms_history_by_number_table.list = [];
				this.sms_history_by_number_table.pagination = generate_null_pagination_obj();
				this.sms_history_by_number_table_rowsPerPage = 10;

				this.sms_history_by_number_table.filter_list = {device_id: '', organization_id: '', phonenumber: '',};
				this.sms_history_by_number_table.filter_list = {
					device_id: element.device.row_id,
					organization_id: element.organization ? element.organization.id : null,
					phonenumber: element.phonenumber,
				};

				this.sms_history_by_number_table.show = true;
			},

			get_history_of_sms_by_number(url = '') {
				this.sms_history_by_number_table.loading = true;
				if (!url) {
					this.sms_history_by_number_table.pagination.page = 1;
					url = '/rest_api/inbound_sms/?phonenumber=' + this.inbound_sms_list_table.checked_table_obj.phonenumber;
					//TODO Добавить в фильтр информацию по организациям и проектам
					// this.inbound_sms_list_table.checked_table_obj.project
					// 	? url += ('&project=' + this.inbound_sms_list_table.checked_table_obj.project.row_id) : '';
					// this.inbound_sms_list_table.checked_table_obj.organization
					// 	? url += ('&organization=' + this.inbound_sms_list_table.checked_table_obj.organization.id) : '';
				}
				console.log(url);
				axios.get(url)
					.then(resp => {
						console.log(resp.data);
						this.sms_history_by_number_table.list = [];
						this.save_pagination_data_sms_history_table(resp.data);
						resp.data.results.forEach(element => {
							this.sms_history_by_number_table.list.push(element);
						});
						this.sms_history_by_number_table.loading = false;
					})
					.catch(err => {
						console.log(err);
					});
			},

			// pagination inbound_sms_table--------

			next_page_click_inbound_sms_table() {
				this.inbound_sms_list_table.pagination.page++;
				this.getInboundSmsList(this.inbound_sms_list_table.pagination.next);
			},

			previous_page_click_inbound_sms_table() {
				this.inbound_sms_list_table.pagination.page--;
				this.getInboundSmsList(this.inbound_sms_list_table.pagination.previous);
			},

			save_pagination_data_inbound_sms_table(data) {
				this.inbound_sms_list_table.pagination.totalItems = data.count;
				this.inbound_sms_list_table.pagination.next = data.next;
				this.inbound_sms_list_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.inbound_sms_list_table.pagination.page, this.inbound_sms_list_table_rowsPerPage, this.inbound_sms_list_table.pagination.totalItems);
				this.inbound_sms_list_table.pagination.left_num = pag_nums.left_num;
				this.inbound_sms_list_table.pagination.right_num = pag_nums.right_num;
			},

			// pagination sms_history_table--------

			next_page_click_sms_history_table() {
				this.sms_history_by_number_table.pagination.page++;
				this.get_history_of_sms_by_number(this.sms_history_by_number_table.pagination.next);
			},

			previous_page_click_sms_history_table() {
				this.sms_history_by_number_table.pagination.page--;
				this.get_history_of_sms_by_number(this.sms_history_by_number_table.pagination.previous);
			},

			save_pagination_data_sms_history_table(data) {
				this.sms_history_by_number_table.pagination.totalItems = data.count;
				this.sms_history_by_number_table.pagination.next = data.next;
				this.sms_history_by_number_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.sms_history_by_number_table.pagination.page, this.sms_history_by_number_table_rowsPerPage, this.sms_history_by_number_table.pagination.totalItems);
				this.sms_history_by_number_table.pagination.left_num = pag_nums.left_num;
				this.sms_history_by_number_table.pagination.right_num = pag_nums.right_num;
			},
			// -------------------
		},

		components: {
			navigation,
			DatetimePicker,
			CustomTablePagination,
			Treeselect,
		},

		watch: {
			inbound_sms_list_table_rowsPerPage: {
				handler() {
					this.getInboundSmsList();
				},
				deep: true
			},

			sms_history_by_number_table_rowsPerPage: {
				handler() {
					this.sms_history_by_number_table.pagination.page = 1;
					let url = '/rest_api/inbound_sms/?page_size=' + this.inbound_sms_list_table_rowsPerPage
						+ '&page=' + this.inbound_sms_list_table.pagination.page
						+ '&phonenumber=' + this.inbound_sms_list_table.checked_table_obj.phonenumber;
					this.inbound_sms_list_table.checked_table_obj.project
						? url += ('?project_ides=' + this.inbound_sms_list_table.checked_table_obj.project.row_id) : '';
					this.inbound_sms_list_table.checked_table_obj.organization
						? url += ('&organization_ides=' + this.inbound_sms_list_table.checked_table_obj.organization.id) : '';
					this.get_history_of_sms_by_number(url);
				},
				deep: true
			},

			treeselect: {
				handler() {
					if (this.treeselect.organizations_for_compare !== this.treeselect.organizations) {
						this.treeselect.organizations_for_compare = this.treeselect.organizations;
						this.treeselect.projects_list = null;
						this.treeselect.projects = [];
					}
				},
				deep: true
			}
		},

		created() {
			axios.get('/rest_api/tree_view_orgs_and_projs/?type=1&children_exists=true', {headers: default_headers})
				.then(resp => {
					this.treeselect.organizations_list = [];
					resp.data.organizations.forEach(element => {
						if (element.children_exists) {
							this.treeselect.organizations_list.push({
								id: element.id,
								label: element.name,
								children: null
							});
						} else {
							this.treeselect.organizations_list.push({id: element.id, label: element.name});
						}
						if (!this.treeselect.cache_organizations_list.find(el => {
							return el.id === element.id
						})) {
							this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
						}
					});
					if (this.treeselect.organizations_list.length > 0) {
						this.treeselect.organizations.push(this.treeselect.organizations_list[0].id);
						this.getInboundSmsList();
					}
					this.treeselect.organizations_loading = false;
				}).catch(err => {
				console.log(err.response);
				this.snackbar_show('Ошибка получения данных', 'error')
			});
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
