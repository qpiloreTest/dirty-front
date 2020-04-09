<template>
	<div>
		<v-flex>
			<div class="text-xs-right">
				<v-btn small color="indigo lighten-2" dark @click="open_gateway_edit_limits">
					Редактировать
				</v-btn>
			</div>
			<v-flex>
				<v-layout wrap>
					<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
						<v-select
							readonly
							:items="mode_sms_list"
							item-text="text"
							item-value="value"
							label="Режим SMS"
							v-model="gateway_limits.obj.mode_sms"
						></v-select>
					</v-flex>
					<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
						<v-text-field type="number" label="Ограничение SMS человеку в день"
									  v-model="gateway_limits.obj.sms_to_person_per_day" readonly></v-text-field>
					</v-flex>

					<v-flex xs12>
						<v-layout wrap row>
							<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
								<v-dialog
									ref="limits_time_from"
									v-model="gateway_limits.dialog_time_from_show"
									:return-value.sync="gateway_limits.obj.limits_time_from"
									persistent
									lazy
									full-width
									width="290px"
									disabled
								>
									<v-text-field
										slot="activator"
										v-model="gateway_limits.obj.limits_time_from"
										label="Отправка с"
										prepend-icon="access_time"
										readonly
									></v-text-field>
									<v-time-picker format="24hr"
												   v-if="gateway_limits.dialog_time_from_show"
												   v-model="gateway_limits.obj.limits_time_from"
												   full-width
												   disabled
									>
										<v-spacer></v-spacer>
										<v-btn flat color="primary"
											   @click="gateway_limits.dialog_time_from_show = false">Отмена
										</v-btn>
										<v-btn flat color="primary"
											   @click="$refs.limits_time_from.save(gateway_limits.obj.limits_time_from)">
											Применить
										</v-btn>
									</v-time-picker>
								</v-dialog>
							</v-flex>

							<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
								<v-dialog
									ref="limits_time_to"
									v-model="gateway_limits.dialog_time_to_show"
									:return-value.sync="gateway_limits.obj.limits_time_to"
									persistent
									lazy
									full-width
									width="290px"
									disabled
								>
									<v-text-field
										slot="activator"
										v-model="gateway_limits.obj.limits_time_to"
										label="Отправка по"
										prepend-icon="access_time"
										readonly
									></v-text-field>
									<v-time-picker format="24hr"
												   v-if="gateway_limits.dialog_time_to_show"
												   v-model="gateway_limits.obj.limits_time_to"
												   full-width
												   disabled
									>
										<v-spacer></v-spacer>
										<v-btn flat color="primary" @click="gateway_limits.dialog_time_to_show = false">
											Отмена
										</v-btn>
										<v-btn flat color="primary"
											   @click="$refs.limits_time_to.save(gateway_limits.obj.limits_time_to)">
											Применить
										</v-btn>
									</v-time-picker>
								</v-dialog>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-flex>

		</v-flex>

		<v-dialog v-model="gateway_edit_limits.show" persistent max-width="650px">
			<v-card>
				<v-card-title>
					<span class="headline">Редактирование лимитов</span>
					<v-spacer></v-spacer>
					<v-icon color="black" @click="close_gateway_edit_limits">close</v-icon>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
							<v-select
								:items="mode_sms_list"
								item-text="text"
								item-value="value"
								label="Режим SMS"
								v-model="gateway_edit_limits.obj.mode_sms"
							></v-select>
						</v-flex>
						<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
							<v-text-field type="number" label="Ограничение SMS человеку в день"
										  v-model="gateway_edit_limits.obj.sms_to_person_per_day"></v-text-field>
						</v-flex>

						<v-flex xs12>
							<v-layout wrap row>
								<v-flex xs12 sm6 md6 lg6 :class="{'pr-2': $vuetify.breakpoint.smAndUp}">
									<v-dialog
										ref="limits_time_from"
										v-model="gateway_edit_limits.dialog_time_from_show"
										:return-value.sync="gateway_edit_limits.obj.limits_time_from"
										persistent
										lazy
										full-width
										width="290px"

									>
										<v-text-field
											slot="activator"
											v-model="gateway_edit_limits.obj.limits_time_from"
											label="Отправка с"
											prepend-icon="access_time"
											readonly
										></v-text-field>
										<v-time-picker format="24hr"
													   v-if="gateway_edit_limits.dialog_time_from_show"
													   v-model="gateway_edit_limits.obj.limits_time_from"
													   full-width

										>
											<v-spacer></v-spacer>
											<v-btn flat color="primary"
												   @click="gateway_edit_limits.dialog_time_from_show = false">Отмена
											</v-btn>
											<v-btn flat color="primary"
												   @click="$refs.limits_time_from.save(gateway_edit_limits.obj.limits_time_from)">
												Применить
											</v-btn>
										</v-time-picker>
									</v-dialog>
								</v-flex>

								<v-flex xs12 sm6 md6 lg6 :class="{'pl-2': $vuetify.breakpoint.smAndUp}">
									<v-dialog
										ref="limits_time_to"
										v-model="gateway_edit_limits.dialog_time_to_show"
										:return-value.sync="gateway_edit_limits.obj.limits_time_to"
										persistent
										lazy
										full-width
										width="290px"

									>
										<v-text-field
											slot="activator"
											v-model="gateway_edit_limits.obj.limits_time_to"
											label="Отправка по"
											prepend-icon="access_time"
											readonly
										></v-text-field>
										<v-time-picker format="24hr"
													   v-if="gateway_edit_limits.dialog_time_to_show"
													   v-model="gateway_edit_limits.obj.limits_time_to"
													   full-width

										>
											<v-spacer></v-spacer>
											<v-btn flat color="primary"
												   @click="gateway_edit_limits.dialog_time_to_show = false">Отмена
											</v-btn>
											<v-btn flat color="primary"
												   @click="$refs.limits_time_to.save(gateway_edit_limits.obj.limits_time_to)">
												Применить
											</v-btn>
										</v-time-picker>
									</v-dialog>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click="close_gateway_edit_limits">Закрыть</v-btn>
					<v-btn color="blue darken-1" flat @click="save_gateway_edit_limits">Сохранить</v-btn>
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
			page: 1, totalItems: 0, rows_per_page_list: [10, 15, 25, 50], next: null,
			previous: null, filter: '', left_num: 0, right_num: 0
		};
	};

	var generate_null_gateway_limits_obj = () => {
		return {
			row_id: 0,
			// sum_devices_limits_sms_per_day: '',
			// sum_devices_limits_sms_per_hour: '',
			// sum_devices_limits_sms_per_month: '',
			limits_time_from: '',
			limits_time_to: '',
			mode_sms: '',
			char_limits: '',
			time_sleep_sms: '',
			char_limits_RUS: '',
			char_limits_ENG: '',
			sms_to_person_per_day: ''
		};
	};


	export default {
		name: 'GatewayLimits',
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
				gateway_limits: {
					obj: generate_null_gateway_limits_obj(),
					dialog_time_from_show: false,
					dialog_time_to_show: false,
				},

				gateway_edit_limits: {
					obj: generate_null_gateway_limits_obj(),
					dialog_time_from_show: false,
					dialog_time_to_show: false,
					show: false,
				},

				mode_sms_list: [],
				snackbar: {
					show: false,
					text: '',
					color: '',
				},
			}
		},

		methods: {

			open_gateway_edit_limits() {
				this.gateway_edit_limits.obj = Object.assign({}, this.gateway_limits.obj);
				this.gateway_edit_limits.show = true;
			},

			close_gateway_edit_limits() {
				this.gateway_edit_limits.obj = Object.assign({}, this.gateway_limits.obj);
				this.gateway_edit_limits.show = false;
			},

			save_gateway_edit_limits() {
				let post_params = Object.assign({}, this.gateway_edit_limits.obj);
				axios.put('/rest_api/gateways/limits/?gateway_id=' + this.gateway_id, post_params, {headers: default_headers})
					.then(resp => {
						console.log(resp);
						this.gateway_limits.obj = Object.assign({}, resp.data);
						this.gateway_edit_limits.obj = Object.assign({}, resp.data);
						this.snackbar_show('Лимиты успешно измененены');
						this.gateway_edit_limits.show = false;
					}).catch(err => {
					console.log(err.response);
					this.snackbar_show('Ошибка при изменении лимитов', 'error');
				})
			},

			snackbar_show(text, color) {
				this.snackbar.show = true;
				this.snackbar.text = text;
				this.snackbar.color = color;
			},
		},

		watch: {},

		created() {
			axios.get('/rest_api/get_list_of_choises/MODEMS_MODE_SMS/')
				.then(resp => {
					resp.data.forEach(element => {
						this.mode_sms_list.push(element);
					});
				})
				.catch(err => {
					console.log(err.response);
					this.snackbar_show('шибка получения режимов смс', 'error');
				});
			axios.get('/rest_api/gateways/limits/?gateway_id=' + this.gateway_id, {headers: default_headers})
				.then(resp => {
					if (resp.data) {
						this.gateway_limits.obj = resp.data;
					}
				}).catch(err => {
				console.log(err.response);
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
