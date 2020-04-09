<!--suppress ALL -->
<template>
    <div>
        <v-app>
            <navigation></navigation>
            <v-card>
                <v-card-title>
                    <h2>Устройства</h2>
                    <v-spacer></v-spacer>

                    <v-spacer></v-spacer>
                    <v-menu offset-y :disabled="modems_list_table.checked_table_obj === null">
                        <v-btn
                                slot="activator"
                                color="indigo lighten-2"
                                :disabled="modems_list_table.checked_table_obj === null"
                                dark
                        >
                            <v-icon>settings</v-icon>
                            Действия
                            <v-icon>arrow_drop_down</v-icon>
                        </v-btn>

                        <v-list>
                            <v-list-tile @click="dialog_edit_modem_open_btn">
                                <v-list-tile-title>
                                    <v-icon>edit</v-icon>
                                    Редактировать
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="dialog_delete_selected_modem.show = true">
                                <v-list-tile-title>
                                    <v-icon color="red">close</v-icon>
                                    Удалить
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="modem_attach_money_dialog.show=true">
                                <v-list-tile-title>
                                    <v-icon>attach_money</v-icon>
                                    Пополнить баланс
                                </v-list-tile-title>
                            </v-list-tile>

                            <!--<v-list-tile @click="dialog_for_sending_manual_sms_open_btn">-->
                            <!--<v-list-tile-title>-->
                            <!--<v-icon>sms</v-icon>-->
                            <!--Отправить SMS-->
                            <!--</v-list-tile-title>-->
                            <!--</v-list-tile>-->

                            <v-list-tile
                                    @click="modem_statistics.show=true, modem_statistics.loading=true">
                                <v-list-tile-title>
                                    <v-icon>assignment</v-icon>
                                    Статистика
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

                    <v-tooltip top>
                        <v-btn color="indigo lighten-2" fab small dark slot="activator"
                               @click="dialog_add_new_modem_open_btn">
                            <v-icon>add</v-icon>
                        </v-btn>
                        <span>Создать</span>
                    </v-tooltip>
                </v-card-title>


                <v-data-table
                        :headers="modems_list_table.headers"
                        :items="modems_list_table.modems_list"
                        :loading="modems_list_table.loading"
                        hide-actions
                        item-key="row_id"
                >
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <tr @click="tableRowClicked(props.item), props.expanded = !props.expanded"
                            :class="{'grey lighten-2': (props.item === modems_list_table.checked_table_obj)}"
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
                    <template slot="expand" slot-scope="props">
                        <v-card flat color="grey lighten-2">
                            <v-card-text>
                                <v-flex>
                                    <v-layout wrap>
                                        <h2 class="pl-2">#{{props.item.row_id}}</h2>
                                        <v-tooltip top>
                                            <v-icon class="pl-2" color="red" slot="activator"
                                                    v-if="modems_list_table.statistics.nonavailability === true">
                                                block
                                            </v-icon>
                                            <span>Недоступен</span>
                                        </v-tooltip>

                                        <v-tooltip top>
                                            <v-icon class="pl-2" color="success" slot="activator"
                                                    v-if="modems_list_table.statistics.nonavailability === false">
                                                check_circle
                                            </v-icon>
                                            <span>Доступен</span>
                                        </v-tooltip>

                                    </v-layout>

                                    <v-layout wrap>
                                        <v-flex xs12 sm6 md6 lg6>
                                            <v-text-field label="Дата последней отправки" readonly
                                                          :class="{'pr-2': $vuetify.breakpoint.smAndUp}"
                                                          v-model="modems_list_table.statistics.last_send_date">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md6 lg6>
                                            <v-text-field label="Время простоя после отправки смс" readonly
                                                          :class="{'pl-2': $vuetify.breakpoint.smAndUp}"
                                                          v-model="dialog_edit_selected_modem.obj.time_sleep_sms">
                                            </v-text-field>
                                        </v-flex>

                                        <v-flex xs6 sm3>
                                            <div class="text-xs-center">
                                                <h3 class="pt-1">Час</h3>
                                                <h2 class="pt-1">{{modems_list_table.statistics.outcome.hour}} /
                                                    {{dialog_edit_selected_modem.obj.limits_sms_per_hour}}
                                                </h2>
                                            </div>
                                        </v-flex>
                                        <v-flex xs6 sm3>
                                            <div class="text-xs-center">
                                                <h3 class="pt-1">День</h3>
                                                <h2 class="pt-1">{{modems_list_table.statistics.outcome.day}} /
                                                    {{dialog_edit_selected_modem.obj.limits_sms_per_day}}
                                                </h2>
                                            </div>
                                        </v-flex>
                                        <v-flex xs6 sm3>
                                            <div class="text-xs-center">
                                                <h3 class="pt-1">Месяц</h3>
                                                <h2 class="pt-1">{{modems_list_table.statistics.outcome.month}}
                                                </h2>
                                            </div>
                                        </v-flex>
                                        <v-flex xs6 sm3>
                                            <div class="text-xs-center">
                                                <h3 class="pt-1">Доступно SMS</h3>
                                                <h2 class="pt-1">{{modems_list_table.statistics.available_sms}}</h2>
                                            </div>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-card-text>
                        </v-card>
                    </template>
                    <template v-slot:footer>
                        <td :colspan="modems_list_table.headers.length">
                            <CustomTablePagination
                                    class="right"
                                    :data_from_backend_func="getDataFromBackend"
                                    :backend_answer="modems_list_table.backend_answer">
                            </CustomTablePagination>
                        </td>
                    </template>
                </v-data-table>
            </v-card>

            <!--dialog for adding a new modem  - - - - - - - - - - - - - - - - - - - - - - - - - -->

            <v-dialog v-model="dialog_add_new_modem.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Создание устройства</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_add_new_modem_close_btn">close</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-tabs
                            dark
                            color="transparent"
                            show-arrows
                            color="grey lighten-3"
                            grow
                    >
                        <v-tabs-slider color="black"></v-tabs-slider>

                        <v-tab href="#device-information">
                            <span style="color: black">Информация</span>
                        </v-tab>

                        <v-tab href="#device-limits">
                            <span style="color: black">Ограничения</span>
                        </v-tab>

                        <v-tab-item id="device-information" key="device-information">
                            <v-card flat>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs6>
                                            <v-text-field label="Наименование*" required
                                                          v-model="dialog_add_new_modem.obj.name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs5 offset-xs1>
                                            <v-text-field
                                                    label="Статус проверки"
                                                    :placeholder="modem_check_status.result ? modem_check_status.result : 'Не проверен'"
                                                    outline
                                                    disabled
                                            >
                                                <v-tooltip slot="append" bottom>
                                                    <v-icon slot="activator"
                                                            :color="modem_check_status.icon === 'block' ? 'red' : modem_check_status.icon === 'check_circle_outline' ? 'success' : '' "
                                                            dark
                                                    >{{modem_check_status.icon}}
                                                    </v-icon>
                                                </v-tooltip>
                                            </v-text-field>
                                        </v-flex>

                                        <v-flex xs6>
                                            <v-text-field label="IP Адрес*" required
                                                          v-model="dialog_add_new_modem.obj.ip_and_port"></v-text-field>
                                        </v-flex>

                                        <v-flex xs3 offset-xs1>
                                            <v-switch
                                                    v-model="dialog_add_new_modem.obj.active"
                                                    :label="dialog_add_new_modem.obj.active === true ? 'Активно' : 'Неактивно'"
                                                    color="success"
                                            ></v-switch>
                                        </v-flex>

                                        <v-flex xs12>
                                            <v-textarea
                                                    label="Комментарий"
                                                    rows="3"
                                                    v-model="dialog_add_new_modem.obj.description"
                                            ></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <small><span class="red--text">*</span>обозначены обязательные поля</small>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item id="device-limits" key="device-limits">
                            <v-card flat>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs6 class="pr-2">
                                            <v-text-field type="number" label="Лимит SMS в час"
                                                          v-model="dialog_add_new_modem.obj.limits_sms_per_hour"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6 class="pl-2">
                                            <v-text-field type="number" label="Лимит SMS в день"
                                                          v-model="dialog_add_new_modem.obj.limits_sms_per_day"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field type="number" label="Время простоя после SMS"
                                                          v-model="dialog_add_new_modem.obj.time_sleep_sms"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-tooltip top>
                            <v-btn icon @click="validate_modem(dialog_add_new_modem.obj)" slot="activator"
                                   :loading="modem_check_status.loading" :disabled="modem_check_status.loading">
                                <v-icon color="black">cached</v-icon>
                            </v-btn>
                            <span>Проверить статус</span>
                        </v-tooltip>

                        <v-btn color="blue darken-1" flat @click="dialog_add_new_modem_close_btn">Закрыть</v-btn>
                        <v-btn color="blue darken-1" flat @click="dialog_new_modem_save_btn">Создать</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!--dialog for editing the selected modem  - - - - - - - - - - - - - - - - - - - - - - - - - -->

            <v-dialog v-model="dialog_edit_selected_modem.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Редактирование устройства</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_edit_modem_close_btn">close</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-tabs
                            dark
                            color="transparent"
                            show-arrows
                            color="grey lighten-3"
                            grow
                    >
                        <v-tabs-slider color="black"></v-tabs-slider>

                        <v-tab href="#device-information">
                            <span style="color: black">Информация</span>
                        </v-tab>

                        <v-tab href="#device-limits">
                            <span style="color: black">Ограничения</span>
                        </v-tab>

                        <v-tab-item id="device-information" key="device-information">
                            <v-card flat>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs6>
                                            <v-text-field label="Наименование*" required
                                                          v-model="dialog_edit_selected_modem.obj.name"></v-text-field>
                                        </v-flex>
                                        <v-flex xs5 offset-xs1>
                                            <v-text-field
                                                    label="Статус проверки"
                                                    :placeholder="modem_check_status.result ? modem_check_status.result : 'Не проверен'"
                                                    outline
                                                    disabled
                                            >
                                                <v-tooltip slot="append" bottom>
                                                    <v-icon slot="activator" :color="modem_check_status.icon === 'block' ? 'red'
                               : modem_check_status.icon === 'check_circle_outline' ? 'success' : '' " dark
                                                    >{{modem_check_status.icon}}
                                                    </v-icon>
                                                </v-tooltip>
                                            </v-text-field>
                                        </v-flex>

                                        <v-flex xs6>
                                            <v-text-field label="IP Адрес*" required
                                                          v-model="dialog_edit_selected_modem.obj.ip_and_port"></v-text-field>
                                        </v-flex>

                                        <v-flex xs3 offset-xs1>
                                            <v-switch
                                                    v-model="dialog_edit_selected_modem.obj.active"
                                                    :label="dialog_edit_selected_modem.obj.active === true ? 'Активно' : 'Неактивно'"
                                                    color="success"
                                            ></v-switch>
                                        </v-flex>

                                        <v-flex xs12>
                                            <v-textarea
                                                    label="Комментарий"
                                                    rows="3"
                                                    v-model="dialog_edit_selected_modem.obj.description"
                                            ></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <small><span class="red--text">*</span>обозначены обязательные поля</small>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <v-tab-item id="device-limits" key="device-limits">
                            <v-card flat>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs6 class="pr-2">
                                            <v-text-field type="number" label="Лимит SMS в час"
                                                          v-model="dialog_edit_selected_modem.obj.limits_sms_per_hour"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6 class="pl-2">
                                            <v-text-field type="number" label="Лимит SMS в день"
                                                          v-model="dialog_edit_selected_modem.obj.limits_sms_per_day"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field type="number" label="Время простоя после SMS"
                                                          v-model="dialog_edit_selected_modem.obj.time_sleep_sms"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-tooltip top>
                            <v-btn icon @click="validate_modem(dialog_edit_selected_modem.obj)" slot="activator"
                                   :loading="modem_check_status.loading" :disabled="modem_check_status.loading">
                                <v-icon color="black">cached</v-icon>
                            </v-btn>
                            <span>Проверить статус</span>
                        </v-tooltip>

                        <v-btn color="blue darken-1" flat @click="dialog_edit_modem_close_btn">Закрыть</v-btn>
                        <v-btn color="blue darken-1" flat @click="dialog_edit_modem_save_btn">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!--dialog for deletting the selected modem  - - - - - - - - - - - - - - - - - - - - - - - - - -->

            <v-dialog v-model="dialog_delete_selected_modem.show" persistent max-width="500px">

                <v-card>
                    <v-card-title>
                        <span class="headline">Удаление устройства</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_delete_selected_modem.show = false">close</v-icon>
                    </v-card-title>
                    <v-card-text>Вы действительно хотите удалить устройство
                        <strong>{{dialog_edit_selected_modem.obj.name}}</strong>?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" flat @click="dialog_delete_modem_btn(dialog_edit_selected_modem.obj)">
                            Удалить
                        </v-btn>
                        <v-btn color="blue darken-1" flat @click="dialog_delete_selected_modem.show = false">Закрыть
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>


            <!--dialog for sending sms by selected modem  - - - - - - - - - - - - - - - - - - - - - - - - - -->


            <v-snackbar
                    v-model="snackbar.show"
                    :color="snackbar.color"
                    timeout="3000"
                    bottom
                    right
            >
                {{ snackbar.text }}
            </v-snackbar>


            <ModemAttachMoneyDialog
                    :obj="modem_attach_money_dialog"
                    :modem_obj="dialog_edit_selected_modem.obj">
            </ModemAttachMoneyDialog>

            <ModemStatistics
                    :obj="modem_statistics"
                    :modem_obj="dialog_edit_selected_modem.obj">
            </ModemStatistics>

        </v-app>
    </div>
</template>


<script>
    import axios from 'axios'
    import navigation from '../navigation_panel.vue'
    import DatetimePicker from '../custom_components/DatetimePicker.vue'
    import moment from 'moment'
    import ModemStatistics from './modem_statistics.vue'
    import CustomTablePagination from '../custom_components/CustomTablePagination.vue'

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const default_headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
        // 'Authorization': 'bearer ' + document.getElementsByName('csrfmiddlewaretoken')[0].value
    };
    import ModemAttachMoneyDialog from './modem_attach_money_dialog.vue'

    var generate_null_modem_object = () => {
        return {
            row_id: 0, name: '', status: '', ip_and_port: '', active: false, description: '', imei: '',
            limits_sms_per_hour: '', limits_sms_per_day: '', time_sleep_sms: ''
        }
    };

    var get_index_of_array_by_element = (array, element) => {
        return array.indexOf(element);
    };

    var calculate_paginator_rows = (page, rowPerPage, total) => {
        let left_num = ((page - 1) * rowPerPage) + 1;
        let right_num = page * rowPerPage;
        if (right_num > total) {
            right_num = right_num - (right_num - total);
        }
        return ({left_num: left_num, right_num: right_num});
    };


    var generate_null_modem_statsitics_obj = () => {
        return {
            income: 0, outcome: {hour: 0, day: 0, month: 0}, available_sms: 0, loading: false,
            last_send_date: null, nonavailability: null
        };
    };

    export default {
        components: {
            navigation,
            DatetimePicker,
            ModemAttachMoneyDialog,
            ModemStatistics,
            CustomTablePagination,
        },
        data() {
            return {
                modem_attach_money_dialog: {
                    show: false,
                },
                modem_statistics: {
                    show: false,
                    loading: false,
                },
                user: {
                    obj: {},
                    permissions: [],
                },
                modems_list_table_rowsPerPage: 10,
                modems_list_table: {
                    headers: [
                        {text: 'Статус', value: 'status', sortable: false},
                        {text: 'Название', align: 'left', value: 'name', sortable: false},
                        {text: 'IP Адрес', value: 'ip_and_port', sortable: false},
                        {text: 'Описание', sortable: false},
                    ],
                    modems_list: [],
                    loading: true,
                    checked_table_obj: null,
                    statistics: generate_null_modem_statsitics_obj(),
                    backend_answer: {},
                },
                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },
                modem_check_status: {
                    loading: false,
                    result: '',
                    icon: '',
                },
                dialog_add_new_modem: {
                    show: false,
                    obj: generate_null_modem_object(),
                },
                dialog_edit_selected_modem: {
                    show: false,
                    obj: generate_null_modem_object(),
                },
                dialog_delete_selected_modem: {
                    show: false,
                },
            }
        },

        methods: {

            cs_log(item) {
                console.log(item);
            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            tableRowClicked(element) {
                if (this.modems_list_table.checked_table_obj === element) {
                    this.dialog_edit_selected_modem.obj = generate_null_modem_object();
                    this.modems_list_table.checked_table_obj = null;
                    this.modems_list_table.statistics = generate_null_modem_statsitics_obj()
                } else {
                    this.modems_list_table.statistics = generate_null_modem_statsitics_obj();
                    this.modems_list_table.statistics.loading = true;
                    this.dialog_edit_selected_modem.obj = Object.assign({}, element);   // Object.assign({}, el) create a copy or aa = [...inventory]
                    this.modems_list_table.checked_table_obj = element;
                    axios.get('/rest_api/get_data_from_redis_keys/?type=INFO_BY_MODEM&pk=' + element.row_id)
                        .then(resp => {
                            if (resp.data) {
                                this.modems_list_table.statistics.income = resp.data.result.statistics.income;
                                this.modems_list_table.statistics.available_sms = resp.data.result.available_sms;
                                this.modems_list_table.statistics.outcome.hour = resp.data.result.statistics.outcome.hour;
                                this.modems_list_table.statistics.outcome.day = resp.data.result.statistics.outcome.day;
                                this.modems_list_table.statistics.outcome.month = resp.data.result.statistics.outcome.month;
                                this.modems_list_table.statistics.nonavailability = resp.data.result.nonavailability ? true : false
                                if (resp.data.result.last_send_date) {
                                    this.modems_list_table.statistics.last_send_date = moment(String(resp.data.result.last_send_date)).format('DD.MM.YYYY HH:mm');
                                } else {
                                    this.modems_list_table.statistics.last_send_date = null;
                                }
                            }
                        }).catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка получения статистики по модему', 'error')
                    }).finally(fin => {
                        this.modems_list_table.statistics.loading = false;
                    })

                }
            },


            dialog_add_new_modem_open_btn() {
                this.dialog_add_new_modem.obj = generate_null_modem_object();
                this.modem_check_status.loading = false;
                this.modem_check_status.result = '';
                this.modem_check_status.icon = '';
                this.dialog_add_new_modem.show = true;
            },

            dialog_add_new_modem_close_btn() {
                this.modem_check_status.loading = false;
                this.dialog_add_new_modem.show = false;
            },

            dialog_edit_modem_open_btn() {                 // open button in a dialog for editting modem
                if (this.modems_list_table.checked_table_obj != null) {
                    this.dialog_edit_selected_modem.obj = Object.assign({}, this.modems_list_table.checked_table_obj);
                } else {
                    this.dialog_edit_selected_modem.obj = generate_null_modem_object();
                }
                this.modem_check_status.loading = false;
                this.modem_check_status.result = '';
                this.modem_check_status.icon = '';
                this.dialog_edit_selected_modem.show = true;
            },

            dialog_edit_modem_close_btn() {                 // Close button in a dialog for editting modem
                if (this.modems_list_table.checked_table_obj != null) {
                    this.dialog_edit_selected_modem.obj = Object.assign({}, this.modems_list_table.checked_table_obj);
                } else {
                    this.dialog_edit_selected_modem.obj = generate_null_modem_object();
                }
                this.modem_check_status.loading = false;
                this.dialog_edit_selected_modem.show = false;
            },

            validate_modem(element) {
                this.modem_check_status.loading = true;
                axios.get('/rest_api/modems/validate_modem/?ip_and_port=' + element.ip_and_port)
                    .then(resp => {
                        console.log(resp);
                        if (resp.data.modem_info.modem_imei) {
                            element.status = 'Online';
                            this.modem_check_status.icon = 'check_circle_outline';
                            this.modem_check_status.result = resp.data.modem_info.modem_imei;
                        } else {
                            element.status = 'Offline';
                            this.modem_check_status.icon = 'block';
                            this.modem_check_status.result = resp.data.modem_info.data_res
                        }
                        element.imei = resp.data.modem_info.modem_imei;
                        this.modem_check_status.loading = false;
                    }).catch(err => {
                    console.log(err);
                    this.modem_check_status.loading = false;
                });
            },

            dialog_new_modem_save_btn() {
                let post_params = Object.assign({}, this.dialog_add_new_modem.obj);
                ;
                post_params.limits_sms_per_hour ? '' : post_params.limits_sms_per_hour = 0
                post_params.limits_sms_per_day ? '' : post_params.limits_sms_per_day = 0
                post_params.time_sleep_sms ? '' : post_params.time_sleep_sms = 0
                axios.post('/rest_api/modems/list/', post_params, {headers: default_headers})
                    .then(resp => {
                        console.log(resp);
                        resp.data.ip_and_port = resp.data.ip_addr + ':' + resp.data.port;
                        this.getDataFromBackend();
                        this.snackbar_show('Устройство добавлено');
                        this.modem_check_status.loading = false;
                        this.modem_check_status.result = '';
                        this.dialog_add_new_modem.obj = generate_null_modem_object();
                        this.dialog_add_new_modem.show = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка добавления устройства', 'error');
                    this.modem_check_status.loading = false;
                    this.modem_check_status.result = '';
                });
            },

            dialog_edit_modem_save_btn() {
                let post_params = Object.assign({}, this.dialog_edit_selected_modem.obj);
                ;
                post_params.limits_sms_per_hour ? '' : post_params.limits_sms_per_hour = 0
                post_params.limits_sms_per_day ? '' : post_params.limits_sms_per_day = 0
                post_params.time_sleep_sms ? '' : post_params.time_sleep_sms = 0
                axios.put('/rest_api/modems/list/?pk=' + this.dialog_edit_selected_modem.obj.row_id, post_params)
                    .then(resp => {
                        console.log(resp);
                        resp.data.ip_and_port = resp.data.ip_addr + ':' + resp.data.port;
                        this.dialog_edit_selected_modem.obj = Object.assign({}, resp.data);
                        this.modems_list_table.modems_list
                            .splice(get_index_of_array_by_element(this.modems_list_table.modems_list, this.modems_list_table.checked_table_obj), 1, this.dialog_edit_selected_modem.obj);  //change old row data to new
                        this.snackbar_show('Устройство изменено');
                        this.modems_list_table.checked_table_obj = this.dialog_edit_selected_modem.obj;
                        this.dialog_edit_selected_modem.show = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка при изменении устройства');
                    this.modem_check_status.loading = false;
                    this.modem_check_status.result = '';
                });


            },

            dialog_delete_modem_btn(element) {
                axios.delete('/rest_api/modems/list/?pk=' + element.row_id, {headers: default_headers})
                    .then(resp => {
                        let index = get_index_of_array_by_element(this.modems_list_table.modems_list, this.modems_list_table.checked_table_obj);
                        this.modems_list_table.modems_list.splice(index, 1);
                        this.snackbar_show('Устройство ' + element.name + ' удалено');
                        this.dialog_edit_selected_modem.obj = generate_null_modem_object();
                        this.modems_list_table.checked_table_obj = null;
                        this.dialog_delete_selected_modem.show = false;
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
            },

            getDataFromBackend(url = '', rowsPerPage = null, page = null) {
                if (!url) {
                    url = '/rest_api/modems/list/';
                    url += rowsPerPage ? ('?page_size=' + rowsPerPage) : '';
                    url += page ? ('&page=' + page) : '';
                }
                this.modems_list_table.loading = true;
                axios.get(url)
                    .then(resp => {
                        this.modems_list_table.modems_list = [];
                        this.modems_list_table.backend_answer = resp.data;
                        this.modems_list_table.checked_table_obj = null;
                        this.dialog_edit_selected_modem.obj = generate_null_modem_object();
                        resp.data.results.forEach(element => {
                            element.ip_and_port = element.ip_addr + ":" + element.port;
                            this.modems_list_table.modems_list.push(element);
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
            this.user.obj = JSON.parse(this.$root.$el.attributes.user_obj.value);
            this.user.permissions = JSON.parse(this.$root.$el.attributes.user_perms.value);
        }
    }
</script>

<style scoped>

    .label-info {
        background-color: #5bc0de;
    }

    .label {
        display: inline;
        padding: .2em .6em .3em;
        font-size: 75%;
        font-weight: bold;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25em;
    }

    .add-shadow:hover,
    .add-shadow:focus {
        box-shadow: 0 0.5em 0.5em -0.4em;
        transform: translateY(-0.03em);
    }


</style>
