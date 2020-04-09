<template>
	<div>
		<div class="text-xs-right">
			<v-fade-transition>
				<v-btn small color="error"
					   v-if="modems_list_table.checked_table_obj.row_id !== 0"
					   @click="modems_list_table.dialog_delete_modem.show = true">
					Удалить
				</v-btn>
			</v-fade-transition>
			<v-btn small color="indigo lighten-2" @click="open_dialog_add_device" dark>Добавить</v-btn>
		</div>
		<v-data-table
			:headers="modems_list_table.headers"
			:items="modems_list_table.modems_list"
			:loading="modems_list_table.loading"
			hide-actions
		>
			<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
			<template slot="items" slot-scope="props">
				<tr @click="tableRowClicked(props.item)"
					:class="{'grey lighten-2': (props.item.row_id === modems_list_table.checked_table_obj.row_id)}"
				>
					<td>
						<v-icon :color="props.item.status === 'Offline' ? 'red'
                    : props.item.status === 'Online' ? 'success'
                    : props.item.status === 'Busy' ? 'warning' : '' "
								v-html="props.item.status === 'Offline' ? 'visibility_off'
                    : props.item.status === 'Online' ? 'visibility'
                    : props.item.status === 'Busy' ? 'rowing' : '' "
						></v-icon>
						{{ props.item.status }}
						<v-icon v-html="props.item.active ? '' : 'lock'"></v-icon>
						<v-icon :color="red" v-html="props.item.have_error ? 'error' : ''"></v-icon>
					</td>
					<td>{{ props.item.name }}</td>
					<td>{{ props.item.ip_and_port }}</td>
					<td>{{ props.item.description }}</td>
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
				:items="modems_list_table.pagination.rows_per_page_list"
				v-model="modems_list_table_rowsPerPage"
			></v-select>
			<div class="paginator-small-spacer-2r"/>
			<p v-if="modems_list_table.pagination.totalItems !== 0">
				{{modems_list_table.pagination.left_num}}-{{modems_list_table.pagination.right_num}} из
				{{modems_list_table.pagination.totalItems}}
			</p>
			<p v-else>&mdash;</p>
			<div class="paginator-small-spacer-2r"/>
			<v-btn icon small class="paginator-margin-03rem-top-reversed" @click="previous_page_click_modems_list_table"
				   :disabled="!modems_list_table.pagination.previous">
				<v-icon :color="!modems_list_table.pagination.previous ? '' : 'grey darken-4'">keyboard_arrow_left
				</v-icon>
			</v-btn>
			<v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
				   @click="next_page_click_modems_list_table" :disabled="!modems_list_table.pagination.next">
				<v-icon :color="!modems_list_table.pagination.next ? '' : 'grey darken-4'">keyboard_arrow_right</v-icon>
			</v-btn>
		</v-layout>

		<v-dialog v-model="modems_list_table.dialog_add_modem.show" persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Добавление устройства</span>
					<v-spacer></v-spacer>
					<v-icon color="black" @click="modems_list_table.dialog_add_modem.show = false">close</v-icon>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-select
						readonly
						:items="modems_list_table.dialog_add_modem.select_gateway_list"
						item-text="text"
						item-value="value"
						label="Шлюз"
						v-model="modems_list_table.dialog_add_modem.gateway_id"
					></v-select>
					<v-layout wrap>
						<v-fade-transition>
							<v-select
								:items="modems_list_table.dialog_add_modem.select_device_list"
								item-text="text"
								item-value="value"
								label="Устройство"
								v-model="modems_list_table.dialog_add_modem.device_id"
							></v-select>
						</v-fade-transition>
						<v-fade-transition>
							<v-progress-circular
								v-if="modems_list_table.dialog_add_modem.select_device_list_loading"
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
					<v-btn color="blue darken-1" flat @click="modems_list_table.dialog_add_modem.show = false">Закрыть
					</v-btn>
					<v-btn color="blue darken-1" flat @click="save_dialog_new_device">Добавить</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="modems_list_table.dialog_delete_modem.show" persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Удаление связи со шлюзом</span>
					<v-spacer></v-spacer>
					<v-icon color="black" @click="modems_list_table.dialog_delete_modem.show = false">close</v-icon>
				</v-card-title>
				<v-card-text>Устройства, которые вы хотите удалить:
					<ul>
						<li>
              <span>
                <v-icon small>router</v-icon>
                {{ modems_list_table.checked_table_obj.name }}
              </span>
						</li>
					</ul>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" flat @click="delete_objects">Удалить</v-btn>
					<v-btn color="blue darken-1" flat @click="modems_list_table.dialog_delete_modem.show = false">
						Закрыть
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

	var generate_null_modem_object = () => {
		return {row_id: 0, name: '', status: '', ip_and_port: '', active: false, description: '', imei: ''}
	};


	export default {
		name: 'GatewayDevices',
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

				modems_list_table_rowsPerPage: 10,
				modems_list_table: {
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
						{text: 'Статус', value: 'status', sortable: false},
						{text: 'Название', align: 'left', value: 'name', sortable: false},
						{text: 'IP Адрес', value: 'ip_and_port', sortable: false},
						{text: 'Описание', sortable: false},
					],
					modems_list: [],
					loading: true,
					checked_table_obj: generate_null_modem_object(),
					dialog_add_modem: {
						gateway_id: this.gateway_id,
						select_gateway_list: [{text: this.gateway_name, value: this.gateway_id}],
						device_id: 0,
						select_device_list: [],
						list_devices_id_exclude: [],
						select_device_list_loading: false,
						show: false,
					},
					dialog_delete_modem: {
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
				if (this.modems_list_table.checked_table_obj === element) {
					this.modems_list_table.checked_table_obj = generate_null_modem_object();
				} else {
					this.modems_list_table.checked_table_obj = element;
				}
			},

			open_dialog_add_device() {
				this.modems_list_table.dialog_add_modem.show = true;
				this.modems_list_table.dialog_add_modem.select_device_list_loading = true;
				this.modems_list_table.dialog_add_modem.select_device_list = [];
				axios.get('/rest_api/modems/list/?gateway_relation_free=True&status=Online' + '&exclude_id='
					+ this.modems_list_table.dialog_add_modem.list_devices_id_exclude)
					.then(resp => {
						if (resp.data.results.length > 0) {
							resp.data.results.forEach(element => {
								this.modems_list_table.dialog_add_modem.select_device_list.push({
									text: element.name,
									value: element.row_id
								})
							});
							if (this.modems_list_table.dialog_add_modem.select_device_list) {
								this.modems_list_table.dialog_add_modem.device_id = this.modems_list_table.dialog_add_modem.select_device_list[0].value;
							}
						}
						this.modems_list_table.dialog_add_modem.select_device_list_loading = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка получения списка устройств', 'error')
				})
			},

			delete_objects() {
				axios.delete('/rest_api/relation_gateway_devices/?device_id='
					+ this.modems_list_table.checked_table_obj.row_id
					+ '&gateway_id=' + this.gateway_id, {headers: default_headers})
					.then(resp => {
						this.getDataFromBackend();
						this.snackbar_show('Устройство успешно удалено');
						this.modems_list_table.dialog_delete_modem.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при удалении устройства', 'error')
				})
			},

			save_dialog_new_device() {
				let post_data = {
					device: this.modems_list_table.dialog_add_modem.device_id,
					gateway: this.modems_list_table.dialog_add_modem.gateway_id,
				};
				axios.post('/rest_api/relation_gateway_devices/', post_data, {headers: default_headers})
					.then(resp => {
						this.getDataFromBackend();
						this.snackbar_show('Устройство успешно добавлено');
						this.modems_list_table.dialog_add_modem.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при добавлении устройства', 'error')
				})
			},

			getDataFromBackend() {
				this.modems_list_table.loading = true;
				this.modems_list_table.pagination.page = 1;
				let url = ('/rest_api/modems/list/?page_size='
					+ this.modems_list_table_rowsPerPage
					+ '&page=' + this.modems_list_table.pagination.page
					+ '&gateways=' + this.gateway_id);

				axios.get(url)
					.then(resp => {
						this.modems_list_table.modems_list = [];
						this.modems_list_table.dialog_add_modem.list_devices_id_exclude = [];
						this.modems_list_table.checked_table_obj = generate_null_modem_object();
						this.save_pagination_data_modems_list_table(resp.data);
						resp.data.results.forEach(element => {
							element.ip_and_port = element.ip_addr + ":" + element.port;
							this.modems_list_table.modems_list.push(element);
							this.modems_list_table.dialog_add_modem.list_devices_id_exclude.push(element.row_id);
						});
						this.modems_list_table.loading = false;
					})
					.catch(err => {
						console.log(err.response);
					});
			},

			next_page_click_modems_list_table() {
				this.modems_list_table.pagination.page++;
				this.getDataFromBackend(this.modems_list_table.pagination.next);
			},

			previous_page_click_modems_list_table() {
				this.modems_list_table.pagination.page--;
				this.getDataFromBackend(this.modems_list_table.pagination.previous);
			},

			save_pagination_data_modems_list_table(data) {
				this.modems_list_table.pagination.totalItems = data.count;
				this.modems_list_table.pagination.next = data.next;
				this.modems_list_table.pagination.previous = data.previous;
				let pag_nums = calculate_paginator_rows(this.modems_list_table.pagination.page,
					this.modems_list_table_rowsPerPage,
					this.modems_list_table.pagination.totalItems);
				this.modems_list_table.pagination.left_num = pag_nums.left_num;
				this.modems_list_table.pagination.right_num = pag_nums.right_num;
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},
		},

		watch: {
			modems_list_table_rowsPerPage: {
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
