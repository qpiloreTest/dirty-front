<template>
	<div>
		<v-app>
			<navigation></navigation>
			<v-card>
				<v-card-title>
					<h2>Черные/белые списки
						<span v-if="blackwhite_objects_table.show_data_key_value_on_datatable_header">
              <v-icon>arrow_right_alt</v-icon>
              {{blackwhite_objects_table.filter.select_list_of_data_key_value.find(element => {return element.value === blackwhite_objects_table.filter.data_key_value}).text}}
            </span>
					</h2>
					<v-spacer></v-spacer>
					<v-flex lg2 md3 sm4 xs6 class="pr-3">
						<v-layout wrap>
							<v-tooltip left :disabled="blackwhite_objects_table.append_icon !== 'add'">
								<v-text-field style="margin-top: -5px;"
											  slot="activator"
											  v-model="watcher_blackwhite_objects_table.search"
											  :append-outer-icon="blackwhite_objects_table.append_icon"
											  @click:append-outer="blackwhite_objects_table_search_btn_click"
											  @keyup.enter="blackwhite_objects_table_search_btn_click"
											  label="Поиск"
											  single-line
											  hide-details
											  :disabled="treeselect.organizations.length < 1"
								></v-text-field>
								<span><strong>Будет добавлено в</strong>:</span>
								<ul>
									<li v-for="searched_for_adding in blackwhite_objects_table.returend_list_where_search_not_exists">
										<v-icon small dark>location_city</v-icon>
										<span>
                      {{ treeselect.cache_organizations_list.find(element => {return element.id === searched_for_adding.organization_id}).label }}
                    </span>
										&mdash;
										<v-icon small dark>person</v-icon>
										<span v-if="searched_for_adding.user_id">
                      {{ treeselect.cache_users_list.find(element => {return element.id === searched_for_adding.user_id}).label }}
                    </span>
										<span v-else> ---- </span>
									</li>
								</ul>
							</v-tooltip>
						</v-layout>
					</v-flex>

					<v-menu offset-y :disabled="blackwhite_objects_table.checked_table_obj.row_id === 0">
						<v-btn
							icon
							slot="activator"
							color="indigo lighten-2"
							dark
							:disabled="blackwhite_objects_table.checked_table_obj.row_id === 0"
						>
							<v-icon>settings</v-icon>
						</v-btn>

						<v-list>

							<v-list-tile @click="blackwhite_objects_table.dialog_edit_object.show = true">
								<v-list-tile-title>
									<v-icon>edit</v-icon>
									Редактировать
								</v-list-tile-title>
							</v-list-tile>

							<v-list-tile @click="blackwhite_objects_table.dialog_delete_objects_show = true">
								<v-list-tile-title>
									<v-icon color="red">close</v-icon>
									Удалить
								</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>


					<!--<v-spacer></v-spacer>-->
					<v-badge :color="treeselect.organizations.length < 1 ? 'red' : 'success'" overlap>
						<span slot="badge" v-if="treeselect.organizations.length < 1">!</span>
						<v-icon slot="badge" dark small v-else>done</v-icon>
						<v-tooltip left>
							<v-btn color="indigo lighten-2" fab small dark slot="activator" @click="openFilter">
								<v-icon>filter_list</v-icon>
							</v-btn>
							<span><strong>Фильтр</strong></span>
							<br>
							<span><strong>Ключ</strong>: </span>
							<ul>
								<li>
									<span v-if="blackwhite_objects_table.filter.select_list_of_data_key_value.find(element => {
									return element.value === blackwhite_objects_table.filter.data_key_value})">
										{{
											blackwhite_objects_table.filter.select_list_of_data_key_value.find(element => {
											return element.value === blackwhite_objects_table.filter.data_key_value}).text
										}}
									</span>
									<span v-else>----</span>
								</li>
							</ul>
							<span><strong>Тип</strong>: </span>
							<ul>
								<li>
									<span v-if="blackwhite_objects_table.filter.select_list_of_type_value.find(element => {
									return element.value === blackwhite_objects_table.filter.type_value})">
										{{
											blackwhite_objects_table.filter.select_list_of_type_value.find(element => {
 											return element.value === blackwhite_objects_table.filter.type_value}).text
										}}
									</span>
									<span v-else>----</span>
								</li>
							</ul>
							<span v-if="treeselect.organizations.length > 0"><strong>Организации</strong>:</span>
							<ul>
								<li v-for="index in treeselect.organizations">
									{{ treeselect.cache_organizations_list.find(element => {return element.id ===
									index}).label }}
								</li>
							</ul>
							<span v-if="treeselect.users.length > 0"><strong>Пользователи</strong>:</span>
							<ul>
								<li v-for="index in treeselect.users">
									{{ treeselect.cache_users_list.find(element => {return element.id === index}).label
									}}
								</li>
							</ul>
						</v-tooltip>
					</v-badge>
				</v-card-title>

				<v-data-table
					:headers="blackwhite_objects_table.headers"
					:items="blackwhite_objects_table.list"
					:loading="blackwhite_objects_table.loading"
					item-key="row_id"
					hide-actions
				>
					<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
					<template slot="items" slot-scope="props">
						<tr @click="tableRowClicked(props.item)"
							:class="{'grey lighten-2': (props.item.row_id === blackwhite_objects_table.checked_table_obj.row_id)}"
						>
							<td>
								<v-chip color="grey" text-color="black" v-if="props.item.type === 'BLACK'">
									<v-avatar class="black"></v-avatar>
									Черный
								</v-chip>
								<v-chip color="grey" text-color="white" v-if="props.item.type === 'WHITE'">
									<v-avatar class="white"></v-avatar>
									Белый
								</v-chip>
							</td>
							<td>{{props.item.data_val}}</td>
							<td v-if="props.item.organization">{{props.item.organization.name}}</td>
							<td v-else>----</td>
							<td v-if="props.item.user">{{props.item.user.username}}</td>
							<td v-else>----</td>
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
						:items="blackwhite_objects_table.pagination.rows_per_page_list"
						v-model="blackwhite_objects_table_rowsPerPage"
					></v-select>
					<div class="paginator-small-spacer-2r"/>
					<p v-if="blackwhite_objects_table.pagination.totalItems !== 0">
						{{blackwhite_objects_table.pagination.left_num}}-{{blackwhite_objects_table.pagination.right_num}}
						из {{blackwhite_objects_table.pagination.totalItems}}
					</p>
					<p v-else>&mdash;</p>
					<div class="paginator-small-spacer-1r"/>
					<v-btn icon small class="paginator-margin-03rem-top-reversed"
						   @click="previous_page_click_blackwhite_objects_table"
						   :disabled="!blackwhite_objects_table.pagination.previous">
						<v-icon :color="!blackwhite_objects_table.pagination.previous ? '' : 'grey darken-4'">
							keyboard_arrow_left
						</v-icon>
					</v-btn>
					<v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
						   @click="next_page_click_blackwhite_objects_table"
						   :disabled="!blackwhite_objects_table.pagination.next">
						<v-icon :color="!blackwhite_objects_table.pagination.next ? '' : 'grey darken-4'">
							keyboard_arrow_right
						</v-icon>
					</v-btn>
				</v-layout>

			</v-card>

			<v-dialog v-model="blackwhite_objects_table.dialog_delete_objects_show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Удаление объектов</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="blackwhite_objects_table.dialog_delete_objects_show = false">
							close
						</v-icon>
					</v-card-title>
					<v-card-text>Объекты, которые вы хотите удалить:
						<ul>
							<li>
                <span>
                  {{ blackwhite_objects_table.checked_table_obj.data_val }}
                  ({{ blackwhite_objects_table.checked_table_obj.data_key }})
                  &mdash;
                  <v-icon small>location_city</v-icon>
                  {{ blackwhite_objects_table.checked_table_obj.organization.name }}
                  &mdash;
                  <v-icon small>person</v-icon>
                  <span v-if="blackwhite_objects_table.checked_table_obj.user">
                    {{ blackwhite_objects_table.checked_table_obj.user.username }}
                  </span>
                  <span v-else>----</span>
                </span>
							</li>
						</ul>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red" flat @click="delete_objects">Удалить</v-btn>
						<v-btn color="blue darken-1" flat
							   @click="blackwhite_objects_table.dialog_delete_objects_show = false">Закрыть
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="blackwhite_objects_table.filter.show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Фильтр</span>
						<v-spacer></v-spacer>
					</v-card-title>
					<v-flex class="pr-4 pl-4">
						<v-select
							label="Ключ"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_data_key_value"
							v-model="blackwhite_objects_table.filter.data_key_value"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-select
							label="Тип"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_type_value"
							v-model="blackwhite_objects_table.filter.type_value"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<span style="color: grey; font-size: 12px; padding-left: 2px;">Оргазинации <span
							style="color: red">*</span></span>
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
					</v-flex>
					<br>
					<v-flex class="pr-4 pl-4">
						<span style="color: lightgrey; font-size: 12px; padding-left: 2px;"
							  v-if="treeselect.organizations.length < 1">Пользователи</span>
						<span style="color: grey; font-size: 12px; padding-left: 2px;" v-else>Пользователи</span>
						<Treeselect
							v-model="treeselect.users"
							:multiple="true"
							:options="treeselect.users_list"
							placeholder="Поиск..."
							:load-options="loadUsersUnderOrganizations"
							:auto-load-root-options="false"
							:disabled="treeselect.organizations.length < 1"
						/>
					</v-flex>
					<br>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="filter_clear">Очистить</v-btn>
						<v-btn color="blue darken-1" flat @click="filter_save">Применить</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


			<v-dialog v-model="blackwhite_objects_table.dialog_edit_object.show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Редактирование объекта</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="on_close_dialog_edit_object">close</v-icon>
					</v-card-title>
					<v-flex class="pr-4 pl-4">
						<v-flex xs12>
							<v-text-field label="Значение*"
										  required
										  v-model="blackwhite_objects_table.dialog_edit_object.obj.data_val"
										  disabled
							></v-text-field>
						</v-flex>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-select
							disabled
							label="Ключ"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_data_key_value"
							v-model="blackwhite_objects_table.dialog_edit_object.obj.data_key"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-select
							label="Тип"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_type_value_not_empty"
							v-model="blackwhite_objects_table.dialog_edit_object.obj.type"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-flex xs12>
							<v-textarea
								label="Комментарий"
								rows="3"
								v-model="blackwhite_objects_table.dialog_edit_object.obj.description"
							></v-textarea>
						</v-flex>
					</v-flex>
					<br>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="on_close_dialog_edit_object">Закрыть</v-btn>
						<v-btn color="blue darken-1" flat @click="on_post_edit_project">Сохранить</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


			<v-dialog v-model="blackwhite_objects_table.dialog_new_object.show" persistent max-width="500px">
				<v-card>
					<v-card-title>
						<span class="headline">Создание объекта</span>
						<v-spacer></v-spacer>
						<v-icon color="black" @click="on_close_dialog_new_object">close</v-icon>
					</v-card-title>
					<v-flex class="pr-4 pl-4">
						<v-flex xs12>
							<v-text-field label="Значение*"
										  required
										  v-model="blackwhite_objects_table.dialog_new_object.obj.data_val"
										  disabled
							></v-text-field>
						</v-flex>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-select
							disabled
							label="Ключ"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_data_key_value"
							v-model="blackwhite_objects_table.dialog_new_object.obj.data_key"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-select
							label="Тип"
							item-text="text"
							item-value="value"
							:items="blackwhite_objects_table.filter.select_list_of_type_value_not_empty"
							v-model="blackwhite_objects_table.dialog_new_object.obj.type"
						></v-select>
					</v-flex>
					<v-flex class="pr-4 pl-4">
						<v-flex xs12>
							<v-textarea
								label="Комментарий"
								rows="3"
								v-model="blackwhite_objects_table.dialog_new_object.obj.description"
							></v-textarea>
						</v-flex>
					</v-flex>
					<br>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="on_close_dialog_new_object">Закрыть</v-btn>
						<v-btn color="blue darken-1" flat @click="on_create_new_object">Создать</v-btn>
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
	import regeneratorRuntime from "regenerator-runtime";
	import Treeselect from '@riophae/vue-treeselect'
	import '../../../static/css/vue-treeselect.css'
	import {LOAD_CHILDREN_OPTIONS, LOAD_ROOT_OPTIONS} from '@riophae/vue-treeselect'

	axios.defaults.xsrfCookieName = 'csrftoken';
	axios.defaults.xsrfHeaderName = 'X-CSRFToken';

	const default_headers = {
		'Content-Type': 'application/json',
		'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
		// 'Authorization': 'bearer ' + document.getElementsByName('csrfmiddlewaretoken')[0].value
	};

	var generate_null_blackwhite_object = () => {
		return {
			row_id: 0,
			data_val: '',
			data_key: '',
			type: '',
			organization: {},
			user: {},
			description: '',
			created_by: null
		}
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


	export default {
		components: {
			Treeselect,
			navigation
		},

		data() {
			return {
				blackwhite_objects_table_rowsPerPage: 10,
				watcher_blackwhite_objects_table: {
					search: '',
					expected_search: '',
				},
				watcher_blackwhite_objects_selected: {
					selected: [],
				},
				blackwhite_objects_table: {
					checked_table_obj: generate_null_blackwhite_object(),
					dialog_new_object: {
						obj: generate_null_blackwhite_object(),
						show: false,
					},
					dialog_edit_object: {
						obj: generate_null_blackwhite_object(),
						show: false,
					},
					show_data_key_value_on_datatable_header: false,
					append_icon: 'search',
					returend_list_where_search_not_exists: [],
					headers: [
						{text: 'Тип', value: 'type', sortable: false},
						{text: 'Значение', value: 'data_val', sortable: false},
						{text: 'Организация', value: 'organization', sortable: false, width: 50},
						{text: 'Пользователь', value: 'user', sortable: false, width: 50},
					],
					list: [],
					pagination: generate_null_pagination_obj(),
					loading: false,
					filter: {
						select_list_of_data_key_value: [
							{text: 'IP', value: 'IP'},
						],
						data_key_value: 'IP',
						select_list_of_type_value: [
							{text: '----', value: ''},
							{text: 'Черный', value: 'BLACK'},
							{text: 'Белый', value: 'WHITE'},
						],
						select_list_of_type_value_not_empty: [
							{text: 'Черный', value: 'BLACK'},
							{text: 'Белый', value: 'WHITE'},
						],
						type_value: '',
						show: false,
					},
					show_add_tooltip: false,
					dialog_delete_objects_show: false,
				},
				treeselect: {
					organizations: [],
					organizations_for_compare: [],
					organizations_list: [],
					cache_organizations_list: [],
					organizations_loading: false,
					users: [],
					users_for_compare: [],
					users_list: null,
					cache_users_list: [],
				},

				snackbar: {
					show: false,
					text: '',
					color: '',
				},
			}
		},

		methods: {
			cs_log(item) {
				console.log(item);
			},

			tableRowClicked(element) {
				if (this.blackwhite_objects_table.checked_table_obj === element) {
					this.blackwhite_objects_table.dialog_edit_object.obj = generate_null_blackwhite_object();
					this.blackwhite_objects_table.checked_table_obj = generate_null_blackwhite_object();
				} else {
					this.blackwhite_objects_table.dialog_edit_object.obj = Object.assign({}, element);   // Object.assign({}, el) create a copy or aa = [...inventory]
					this.blackwhite_objects_table.checked_table_obj = element;
				}
			},

			openFilter() {
				this.treeselect.organizations_loading = true;
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
				this.blackwhite_objects_table.filter.show = true
			},

			loadOrganizations({action, parentNode, callback}) {
				if (action === LOAD_CHILDREN_OPTIONS)
					console.log(action);
				axios.get('/rest_api/tree_view_orgs_and_projs/?type=5&children_exists=true' +
						'&organization_id=' + parentNode.id, {headers: default_headers})
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
								this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
							}
						});
						callback();
					})
					.catch(err => {
						console.log(err.response);
						callback(new Error('Failed to load options: network error.'));
					});
			},

			loadUsersUnderOrganizations({action, callback}) {
				if (action === 'LOAD_ROOT_OPTIONS') {
					axios.get('/rest_api/organizations/users/?show_organization_name=true&organizations_list=' + this.treeselect.organizations, {headers: default_headers})
						.then(resp => {
							this.treeselect.users_list = [];
							resp.data.forEach(element => {
								if (!this.treeselect.users_list.find(el => {
									return el.id === element.id
								})) {
									this.treeselect.users_list.push({id: element.id, label: element.label});
								}
								if (!this.treeselect.cache_users_list.find(el => {
									return el.id === element.id
								})) {
									this.treeselect.cache_users_list.push({id: element.id, label: element.label});
								}
							});
							callback();
						}).catch(err => {
						console.log(err.response);
						callback(new Error('Failed to load options: network error.'));
					})
				}
			},

			getListOfBlackWhiteObjectsWithSearch() {   //check if object exist in db with params, If no it propose to create one
				axios.get('/rest_api/restrictions/black_white_lists/?check_exists=true' +
						'&key_data_value=' + this.watcher_blackwhite_objects_table.search +
						'&key_type=' + this.blackwhite_objects_table.filter.data_key_value+
						'&organization_ides=' +this.treeselect.organizations +
						'&user_ides=' + this.treeselect.users, {headers: default_headers})
					.then(resp => {
						console.log(resp.data);
						if (resp.data.status === 204) {
							this.blackwhite_objects_table.returend_list_where_search_not_exists = [];
							this.blackwhite_objects_table.append_icon = 'add';
							if (resp.data.result) {
								resp.data.result.forEach(element => {
									let obj = {
										organization_id: element.organization_id,
										user_id: element.user_id
									};
									this.blackwhite_objects_table.returend_list_where_search_not_exists.push(obj);
								});
							}
						} else if (resp.data.status === 200) {
							this.blackwhite_objects_table.returend_list_where_search_not_exists = [];
							this.blackwhite_objects_table.append_icon = 'search';
						}
					})
					.catch(err => {
						console.log(err.response);
					});
			},

			blackwhite_objects_table_search_btn_click() {
				this.watcher_blackwhite_objects_table.expected_search = this.watcher_blackwhite_objects_table.search;
				this.blackwhite_objects_table.dialog_edit_object.obj = generate_null_blackwhite_object();
				this.blackwhite_objects_table.checked_table_obj = generate_null_blackwhite_object();
				if (this.blackwhite_objects_table.append_icon === 'search') {
					this.blackwhite_objects_table.pagination.page = 1;
					this.getBlackWhiteObjectsList();

					if (this.watcher_blackwhite_objects_table.search !== '') {
						this.getListOfBlackWhiteObjectsWithSearch();
					}
				}

				else if (this.blackwhite_objects_table.append_icon === 'add') {
					let post_params = {
						action: 'CREATE',
						organization: this.treeselect.organizations,
						user: this.treeselect.users,
					};

					this.blackwhite_objects_table.dialog_new_object.obj.data_val = this.watcher_blackwhite_objects_table.search;
					this.blackwhite_objects_table.dialog_new_object.obj.data_key = this.blackwhite_objects_table.filter.data_key_value;
					if (this.blackwhite_objects_table.filter.type_value === '') {
						this.blackwhite_objects_table.dialog_new_object.obj.type = 'BLACK';
					} else {
						this.blackwhite_objects_table.dialog_new_object.obj.type = this.blackwhite_objects_table.filter.type_value;
					}
					this.blackwhite_objects_table.dialog_new_object.show = true;
				}
			},

			on_create_new_object() {
				let post_params = {
					organization: this.treeselect.organizations,
					user: this.treeselect.users,
					data_val: this.blackwhite_objects_table.dialog_new_object.obj.data_val,
					data_key: this.blackwhite_objects_table.dialog_new_object.obj.data_key,
					type: this.blackwhite_objects_table.dialog_new_object.obj.type,
					description: this.blackwhite_objects_table.dialog_new_object.obj.description,
				};

				axios.post('/rest_api/restrictions/black_white_lists/', post_params, {headers: default_headers})
					.then(resp => {
						this.snackbar_show('Объект успешно создан');
						this.filter_save();
						this.on_close_dialog_new_object();
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка при создании объекта', 'error');
					});
				console.log(post_params);
			},

			on_close_dialog_new_object() {
				this.blackwhite_objects_table.dialog_new_object.obj = generate_null_blackwhite_object();
				this.blackwhite_objects_table.dialog_new_object.show = false;
			},

			on_post_edit_project() {
				let post_params = {
					row_id: this.blackwhite_objects_table.dialog_edit_object.obj.row_id,
					data_val: this.blackwhite_objects_table.dialog_edit_object.obj.data_val,
					data_key: this.blackwhite_objects_table.dialog_edit_object.obj.data_key,
					type: this.blackwhite_objects_table.dialog_edit_object.obj.type,
					description: this.blackwhite_objects_table.dialog_edit_object.obj.description,
				};
				axios.put('/rest_api/restrictions/black_white_lists/?pk=' + post_params.row_id, post_params, {headers: default_headers})
					.then(resp => {
						console.log(resp.data);
						this.snackbar_show('Объект успешно изменен');
						let index = get_index_of_array_by_id(this.blackwhite_objects_table.list, resp.data.row_id);
						this.blackwhite_objects_table.list.splice(index, 1, resp.data);
						this.blackwhite_objects_table.dialog_edit_object.obj = Object.assign({}, resp.data);
						this.blackwhite_objects_table.checked_table_obj = Object.assign({}, resp.data);
						this.blackwhite_objects_table.dialog_edit_object.show = false;
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка при создании объекта', 'error');
					});
			},

			on_close_dialog_edit_object() {
				this.blackwhite_objects_table.dialog_edit_object.obj = Object.assign({}, this.blackwhite_objects_table.checked_table_obj);
				this.blackwhite_objects_table.dialog_edit_object.show = false;
			},

			filter_clear() {
				this.blackwhite_objects_table.filter.data_key_value = 'IP';
				this.treeselect.organizations = [];
				// users cleared with watcher
			},

			filter_save() {
				this.blackwhite_objects_table.pagination.page = 1;
				this.blackwhite_objects_table.dialog_edit_object.obj = generate_null_blackwhite_object();
				this.blackwhite_objects_table.checked_table_obj = generate_null_blackwhite_object();
				if (this.treeselect.organizations.length > 0) {
					if (this.watcher_blackwhite_objects_table.search !== '') {
						this.getListOfBlackWhiteObjectsWithSearch();
					}
					this.getBlackWhiteObjectsList();
					this.blackwhite_objects_table.show_data_key_value_on_datatable_header = true;
				} else {
					this.blackwhite_objects_table.pagination = generate_null_pagination_obj();
					this.blackwhite_objects_table.list = [];
					this.watcher_blackwhite_objects_selected.selected = [];
					this.blackwhite_objects_table.show_data_key_value_on_datatable_header = false;
				}
				this.blackwhite_objects_table.filter.show = false;
			},


			delete_objects() {
				axios.delete('/rest_api/restrictions/black_white_lists/?pk=' + this.blackwhite_objects_table.checked_table_obj.row_id, {headers: default_headers})
					.then(resp => {
						let index = get_index_of_array_by_id(this.blackwhite_objects_table.list, this.blackwhite_objects_table.checked_table_obj.row_id);
						this.blackwhite_objects_table.list.splice(index, 1);
						this.blackwhite_objects_table.dialog_edit_object.obj = generate_null_blackwhite_object();
						this.blackwhite_objects_table.checked_table_obj = generate_null_blackwhite_object();
						this.snackbar_show('Объект успешно удален');
						this.blackwhite_objects_table.dialog_delete_objects_show = false;
					})
					.catch(err => {
						console.log(err.response);
						this.snackbar_show('Ошибка при удалении объекта', 'error');
					})
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},

			getBlackWhiteObjectsList(url = '') {
				if (!url) {
					this.blackwhite_objects_table.pagination.page = 1;
					url = ('/rest_api/restrictions/black_white_lists/?page_size='
						+ this.stop_objects_table_rowsPerPage
						+ '&key_type=' + this.blackwhite_objects_table.filter.data_key_value
						+ '&type=' + this.blackwhite_objects_table.filter.type_value
						+ '&page=' + this.blackwhite_objects_table.pagination.page
						+ '&key_data_value=' + this.watcher_blackwhite_objects_table.search
						+ '&organization_ides=' + this.treeselect.organizations
						+ '&user_ides=' + this.treeselect.users);
				}
				this.blackwhite_objects_table.loading = true;
				axios.get(url)
					.then(resp => {
						this.blackwhite_objects_table.list = [];
						this.watcher_blackwhite_objects_selected.selected = [];
						this.save_pagination_data_blackwhite_objects_table(resp.data);
						resp.data.results.forEach(element => {
							this.blackwhite_objects_table.list.push(element);
						});
						this.blackwhite_objects_table.loading = false;
					})
					.catch(err => {
						console.log(err.response);
					});
			},

			next_page_click_blackwhite_objects_table() {
				this.blackwhite_objects_table.pagination.page++;
				this.getBlackWhiteObjectsList(this.blackwhite_objects_table.pagination.next);
				this.watcher_blackwhite_objects_selected.selected = [];
			},

			previous_page_click_blackwhite_objects_table() {
				this.blackwhite_objects_table.pagination.page--;
				this.getBlackWhiteObjectsList(this.blackwhite_objects_table.pagination.previous);
				this.watcher_blackwhite_objects_selected.selected = [];
			},

			save_pagination_data_blackwhite_objects_table(data) {
				this.blackwhite_objects_table.pagination.totalItems = data.count;
				this.blackwhite_objects_table.pagination.next = data.next;
				this.blackwhite_objects_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.blackwhite_objects_table.pagination.page, this.blackwhite_objects_table_rowsPerPage, this.blackwhite_objects_table.pagination.totalItems);
				this.blackwhite_objects_table.pagination.left_num = pag_nums.left_num;
				this.blackwhite_objects_table.pagination.right_num = pag_nums.right_num;
			},
		},

		watch: {
			treeselect: {
				handler() {
					if (this.treeselect.organizations_for_compare !== this.treeselect.organizations) {
						this.treeselect.organizations_for_compare = this.treeselect.organizations;
						this.treeselect.users_list = null;
						this.treeselect.users = [];
					}
				},
				deep: true
			},
			watcher_blackwhite_objects_table: {
				handler() {
					if ((this.watcher_blackwhite_objects_table.search !== this.watcher_blackwhite_objects_table.expected_search) || (this.watcher_blackwhite_objects_table.search === '')) {
						this.blackwhite_objects_table.append_icon = 'search';
					}
				},
				deep: true
			},

			blackwhite_objects_table_rowsPerPage: {
				handler() {
					this.filter_save();
				},
				deep: true
			},
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
						this.getBlackWhiteObjectsList();
					}
					this.treeselect.organizations_loading = false;
				}).catch(err => {
				console.log(err.response)
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
