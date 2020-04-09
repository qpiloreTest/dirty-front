<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-dialog v-model="obj.show" fullscreen hide-overlay>
            <v-card style="background-color: #F5F5F5">
                <v-toolbar dark color="grey lighten-2">
                    <v-btn icon dark @click="close_dialog()">
                        <v-icon class="black--text">close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="black--text">Статистика по устройству '{{modem_obj.name}}'</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click="close_dialog()" class="black--text">Закрыть</v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-card>
                    <v-data-table
                            :headers="table.headers"
                            :items="table.list"
                            :loading="table.loading"
                            hide-actions
                    >
                        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>
                                    <span v-if="props.item.income">{{props.item.income}}</span>
                                </td>
                                <td>
                                    <span v-if="props.item.outcome">{{props.item.outcome}}</span>
                                </td>
                                <td>
                                    <span v-if="props.item.date_operation">{{props.item.date_operation | formatDateTime}}</span>
                                    <span v-else>----</span>
                                </td>
                                <td>
                                    <span v-if="props.item.date_from">{{props.item.date_from | formatDateTime}}</span>
                                    <span v-else>----</span>
                                </td>
                                <td>
                                    <span v-if="props.item.date_to">{{props.item.date_to | formatDateTime}}</span>
                                    <span v-else>----</span>
                                </td>
                            </tr>
                        </template>
                        <template v-slot:footer>
                            <td :colspan="table.headers.length">
                                <CustomTablePagination
                                        class="right"
                                        :data_from_backend_func="getWalletRows"
                                        :backend_answer="table.backend_answer">
                                </CustomTablePagination>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card>
        </v-dialog>

        <!--<v-dialog v-model="dialog_statistics_for_selected_modem.filter.show" persistent max-width="500px">-->
        <!--<v-card>-->
        <!--<v-card-title>-->
        <!--<span class="headline">Фильтр</span>-->
        <!--<v-spacer></v-spacer>-->
        <!--</v-card-title>-->
        <!--<v-divider></v-divider>-->
        <!--<v-card-text>-->
        <!--<v-layout wrap>-->
        <!--<v-flex xs12 class="pr-2 pl-2">-->
        <!--<v-select-->
        <!--label="Статус"-->
        <!--item-text="text"-->
        <!--item-value="value"-->
        <!--:items="dialog_statistics_for_selected_modem.filter.obj.status_list"-->
        <!--v-model="dialog_statistics_for_selected_modem.filter.obj.status"-->
        <!--&gt;</v-select>-->
        <!--</v-flex>-->
        <!--<v-flex md6 xs12 class="pr-2 pl-2">-->
        <!--<DatetimePicker-->
        <!--label="Время с"-->
        <!--v-model="dialog_statistics_for_selected_modem.filter.obj.min_date"-->
        <!--format="DD.MM.YYYY HH:mm"-->
        <!--locale="ru-ru"-->
        <!--clearText="Очистить"-->
        <!--okText="Сохранить"-->
        <!--&gt;</DatetimePicker>-->
        <!--</v-flex>-->
        <!--<v-flex md6 xs12 class="pr-2 pl-2">-->
        <!--<DatetimePicker-->
        <!--label="Время по"-->
        <!--v-model="dialog_statistics_for_selected_modem.filter.obj.max_date"-->
        <!--format="DD.MM.YYYY HH:mm"-->
        <!--locale="ru-ru"-->
        <!--clearText="Очистить"-->
        <!--okText="Сохранить"-->
        <!--&gt;</DatetimePicker>-->
        <!--</v-flex>-->
        <!--<v-flex xs12 class="pr-2 pl-2">-->
        <!--<v-text-field-->
        <!--label="Номер телефона"-->
        <!--v-model="dialog_statistics_for_selected_modem.filter.obj.phonenumber"-->
        <!--&gt;</v-text-field>-->
        <!--</v-flex>-->
        <!--</v-layout>-->
        <!--</v-card-text>-->
        <!--<v-card-actions>-->
        <!--<v-spacer></v-spacer>-->
        <!--<v-btn color="blue darken-1" flat @click="clearFilterDialog_ModemsStatisticsTable">Очистить-->
        <!--</v-btn>-->
        <!--<v-btn color="blue darken-1" flat @click="saveFilterDialog_ModemsStatisticsTable">Сохранить-->
        <!--</v-btn>-->
        <!--</v-card-actions>-->
        <!--</v-card>-->
        <!--</v-dialog>-->


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

    var generate_null_pagination_object = () => {
        return {
            page: 1,
            totalItems: 0,
            rows_per_page_list: [10, 15, 25, 50],
            next: null,
            previous: null,
            filter: '',
            left_num: 0,
            right_num: 0,
            rowsPerPage: 10,
        }
    };


    import axios from 'axios';
    import DatetimePicker from '../custom_components/DatetimePicker.vue';
    import moment from 'moment';
    import CustomTablePagination from '../custom_components/CustomTablePagination.vue'

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const default_headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
    };

    var generate_null_modem_object = () => {
        return {
            row_id: 0, name: '', status: '', ip_and_port: '', active: false, description: '', imei: '',
            limits_sms_per_hour: '', limits_sms_per_day: '', time_sleep_sms: ''
        }
    };

    export default {
        name: "ModemStatistics",
        components: {
            DatetimePicker,
            CustomTablePagination,
        },
        props: {
            modem_obj: {
                default: generate_null_modem_object()
            },
            obj: {
                default: {
                    show: false,
                    loading: false,
                }
            }
        },
        data() {
            return {
                table_rowsPerPage: 10,
                table: {
                    headers: [
                        {text: 'Приход', value: 'income', sortable: false},
                        {text: 'Расход', value: 'outcome', sortable: false},
                        {text: 'Дата', value: 'date_operation', sortable: false},
                        {text: 'Начало действия', value: 'date_from', sortable: false},
                        {text: 'Окончание действия', value: 'date_to', sortable: false},
                    ],
                    list: [],
                    loading: false,
                    filter: {},
                    backend_answer: {},
                },

                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },
            }
        },
        methods: {
            cs_log() {

            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            close_dialog() {
                this.obj.show = false;
                this.table.pagination = generate_null_pagination_object();
                this.table_rowsPerPage = 10;
            },

            getWalletRows(url = '', rowsPerPage = null, page = null) {
                this.table.loading = true;
                if (!url) {
                    url = "/rest_api/wallet_list/?modem_id=" + this.modem_obj.row_id;
                    url += rowsPerPage ? ('&page_size=' + rowsPerPage) : '';
                    url += page ? ('&page=' + page) : '';
                }
                axios.get(url, {headers: default_headers})
                    .then(resp => {
                        this.table.list = [];
                        this.table.backend_answer = resp.data;
                        // this.save_pagination_data(resp.data);
                        resp.data.results.forEach(element => {
                            this.table.list.push(element)
                        });
                        this.table.loading = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка получения статистики', 'error');
                    this.table.loading = false;
                })
            },

        },

        watch: {
            obj: {
                handler() {
                    if (this.obj.loading) {
                        this.getWalletRows();
                        this.obj.loading = false;
                    }
                },
                deep: true
            }
        },
    }
</script>

<style scoped>

</style>