<template>
	<div>
		<div class="text-xs-right">
			<v-fade-transition>
				<v-btn small color="error"
					   v-if="organizations_list_table.checked_table_obj.id !== 0"
					   @click="organizations_list_table.dialog_delete_organization.show = true">
					Удалить
				</v-btn>
			</v-fade-transition>
			<v-btn small color="indigo lighten-2" @click="open_dialog_add_organization" dark>Добавить</v-btn>
		</div>
		<v-data-table
			:headers="organizations_list_table.headers"
			:items="organizations_list_table.list"
			:loading="organizations_list_table.loading"
			hide-actions
		>
			<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
			<template slot="items" slot-scope="props">
				<tr @click="tableRowClicked(props.item)"
					:class="{'grey lighten-2': (props.item.id === organizations_list_table.checked_table_obj.id)}"
				>
					<td>{{ props.item.name }}</td>
					<td>
						<v-icon
							:color="props.item.is_active === true ? 'success'
              : props.item.is_active === false ? 'error' : '' "
							v-html="props.item.is_active === true ? 'toggle_on'
              : props.item.is_active === false ? 'toggle_off' : '' "
							large
						></v-icon>
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
				:items="organizations_list_table.pagination.rows_per_page_list"
				v-model="organizations_list_table_rowsPerPage"
			></v-select>
			<div class="paginator-small-spacer-2r"/>
			<p v-if="organizations_list_table.pagination.totalItems !== 0">
				{{organizations_list_table.pagination.left_num}}-{{organizations_list_table.pagination.right_num}} из
				{{organizations_list_table.pagination.totalItems}}
			</p>
			<p v-else>&mdash;</p>
			<div class="paginator-small-spacer-2r"/>
			<v-btn icon small class="paginator-margin-03rem-top-reversed"
				   @click="previous_page_click_organizations_list_table"
				   :disabled="!organizations_list_table.pagination.previous">
				<v-icon :color="!organizations_list_table.pagination.previous ? '' : 'grey darken-4'">
					keyboard_arrow_left
				</v-icon>
			</v-btn>
			<v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
				   @click="next_page_click_organizations_list_table"
				   :disabled="!organizations_list_table.pagination.next">
				<v-icon :color="!organizations_list_table.pagination.next ? '' : 'grey darken-4'">keyboard_arrow_right
				</v-icon>
			</v-btn>
		</v-layout>

		<v-dialog v-model="organizations_list_table.dialog_add_organization.show" persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Добавление организации</span>
					<v-spacer></v-spacer>
					<v-icon color="black" @click="organizations_list_table.dialog_add_organization.show = false">close
					</v-icon>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-select
						readonly
						:items="organizations_list_table.dialog_add_organization.select_gateway_list"
						item-text="text"
						item-value="value"
						label="Шлюз"
						v-model="organizations_list_table.dialog_add_organization.gateway_id"
					></v-select>
					<v-layout wrap>
						<v-fade-transition>
							<v-select
								:items="organizations_list_table.dialog_add_organization.select_organization_list"
								item-text="text"
								item-value="value"
								label="Организация"
								v-model="organizations_list_table.dialog_add_organization.organization_id"
							></v-select>
						</v-fade-transition>
						<v-fade-transition>
							<v-progress-circular
								v-if="organizations_list_table.dialog_add_organization.select_organization_list_loading"
								class="mt-3"
								indeterminate
								:size="24"
								:width="3"
								color="primary"
							></v-progress-circular>
						</v-fade-transition>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat
						   @click="organizations_list_table.dialog_add_organization.show = false">Закрыть
					</v-btn>
					<v-btn color="blue darken-1" flat @click="save_dialog_new_organization">Добавить</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="organizations_list_table.dialog_delete_organization.show" persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Удаление связи со шлюзом</span>
					<v-spacer></v-spacer>
					<v-icon color="black" @click="organizations_list_table.dialog_delete_organization.show = false">
						close
					</v-icon>
				</v-card-title>
				<v-card-text>Организации, которые вы хотите удалить:
					<ul>
						<li>
              <span>
                <v-icon small>location_city</v-icon>
                {{ organizations_list_table.checked_table_obj.name }}
              </span>
						</li>
					</ul>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" flat @click="delete_objects">Удалить</v-btn>
					<v-btn color="blue darken-1" flat
						   @click="organizations_list_table.dialog_delete_organization.show = false">Закрыть
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
			if (arr_el.id === element_id) {
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

	var generate_null_organization_object = () => {
		return {id: 0, name: '', is_active: false}
	};


	export default {
		name: 'GatewayOrganizations',
		props: {
			gateway_id: {
				type: String,
				default: ''
			},
			gateway_name: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				counter: 1,

				organizations_list_table_rowsPerPage: 10,
				organizations_list_table: {
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
					headers: [
						{text: 'Название', align: 'left', value: 'name', sortable: false},
						{text: 'Активно', value: 'active', sortable: false, width: 15},
					],
					list: [],
					loading: true,
					checked_table_obj: generate_null_organization_object(),
					dialog_add_organization: {
						gateway_id: this.gateway_id,
						select_gateway_list: [{text: this.gateway_name, value: this.gateway_id}],
						organization_id: 0,
						select_organization_list: [],
						list_organization_id_exclude: [],
						select_organization_list_loading: false,
						show: false,
					},
					dialog_delete_organization: {
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

			tableRowClicked(element) {
				if (this.organizations_list_table.checked_table_obj === element) {
					this.organizations_list_table.checked_table_obj = generate_null_organization_object();
				} else {
					this.organizations_list_table.checked_table_obj = element;
				}
			},

			open_dialog_add_organization() {
				this.organizations_list_table.dialog_add_organization.show = true;
				this.organizations_list_table.dialog_add_organization.select_organization_list_loading = true;
				this.organizations_list_table.dialog_add_organization.select_organization_list = [];
				axios.get('/rest_api/organizations/?children_recursive=True&exclude_ides='
					+ this.organizations_list_table.dialog_add_organization.list_organization_id_exclude)
					.then(resp => {
						if (resp.data.results.length > 0) {
							resp.data.results.forEach(element => {
								this.organizations_list_table.dialog_add_organization.select_organization_list.push({
									text: element.name,
									value: element.id
								})
							});
							if (this.organizations_list_table.dialog_add_organization.select_organization_list) {
								this.organizations_list_table.dialog_add_organization.organization_id = this.organizations_list_table.dialog_add_organization.select_organization_list[0].value;
							}
						}
						this.organizations_list_table.dialog_add_organization.select_organization_list_loading = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка получения списка организаций', 'error')
				})
			},

			delete_objects() {
				axios.delete('/rest_api/relation_gateway_organization/?organization_id='
					+ this.organizations_list_table.checked_table_obj.id
					+ '&gateway_id=' + this.gateway_id, {headers: default_headers})
					.then(resp => {
						this.getDataFromBackend();
						this.snackbar_show('Организация успешно удалена');
						this.organizations_list_table.dialog_delete_organization.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при удалении организации', 'error')
				})
			},

			save_dialog_new_organization() {
				let post_data = {
					organization: this.organizations_list_table.dialog_add_organization.organization_id,
					gateway: this.organizations_list_table.dialog_add_organization.gateway_id,
				};
				axios.post('/rest_api/relation_gateway_organization/', post_data, {headers: default_headers})
					.then(resp => {
						this.getDataFromBackend();
						this.snackbar_show('Организация успешно добавлена');
						this.organizations_list_table.dialog_add_organization.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при добавлении организации', 'error')
				})
			},

			getDataFromBackend() {
				this.organizations_list_table.loading = true;
				this.organizations_list_table.pagination.page = 1;
				let url = ('/rest_api/organizations/?children_recursive=True&page_size='
					+ this.organizations_list_table_rowsPerPage
					+ '&page=' + this.organizations_list_table.pagination.page
					+ '&gateway_ides=' + this.gateway_id);

				axios.get(url)
					.then(resp => {
						this.organizations_list_table.list = [];
						this.organizations_list_table.dialog_add_organization.list_organization_id_exclude = [];
						this.organizations_list_table.checked_table_obj = generate_null_organization_object();
						this.save_pagination_data_organizations_list_table(resp.data);
						resp.data.results.forEach(element => {
							this.organizations_list_table.list.push(element);
							this.organizations_list_table.dialog_add_organization.list_organization_id_exclude.push(element.id);
						});
						this.organizations_list_table.loading = false;
					})
					.catch(err => {
						console.log(err.response);
					});
			},

			next_page_click_organizations_list_table() {
				this.organizations_list_table.pagination.page++;
				this.getDataFromBackend(this.organizations_list_table.pagination.next);
			},

			previous_page_click_organizations_list_table() {
				this.organizations_list_table.pagination.page--;
				this.getDataFromBackend(this.organizations_list_table.pagination.previous);
			},

			save_pagination_data_organizations_list_table(data) {
				this.organizations_list_table.pagination.totalItems = data.count;
				this.organizations_list_table.pagination.next = data.next;
				this.organizations_list_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.organizations_list_table.pagination.page,
					this.organizations_list_table_rowsPerPage,
					this.organizations_list_table.pagination.totalItems);
				this.organizations_list_table.pagination.left_num = pag_nums.left_num;
				this.organizations_list_table.pagination.right_num = pag_nums.right_num;
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},
		},

		watch: {
			organizations_list_table_rowsPerPage: {
				handler() {
					this.getDataFromBackend();
				},
				deep: true
			},
		},

		created() {
			this.getDataFromBackend();
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
