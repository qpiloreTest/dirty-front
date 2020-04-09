<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-dialog v-model="action.show" fullscreen hide-overlay>

            <v-card style="background-color: #F5F5F5">
                <v-toolbar dark color="grey lighten-2">
                    <v-btn icon dark @click="close_dialog()">
                        <v-icon class="black--text">close</v-icon>
                    </v-btn>
                    <v-toolbar-title class="black--text">Логирование по пользователю '{{checked_user.username}}'</v-toolbar-title>
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
                            <tr :bgcolor="props.item.status === 'SUCCESS' ? '#AED581'
                                      : props.item.status === 'FAILURE' ? '#E57373' : '' ">
                                <td>{{props.item.key}}</td>
                                <td>{{props.item.status}}</td>
                                <td>
                                    <span v-if="props.item.created_dt">{{props.item.created_dt | formatDateTime}}</span>
                                </td>
                                <td>{{props.item.ip_addr}}</td>
                                <td>{{props.item.data}}</td>
                            </tr>
                        </template>
                        <template v-slot:footer>
                            <td :colspan="table.headers.length">
                                <CustomTablePagination
                                        class="right"
                                        :data_from_backend_func="getDataFromBackend"
                                        :backend_answer="table.backend_answer">
                                </CustomTablePagination>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const default_headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
    };

    var generate_null_backend_answer = () => {
        return {count: 0, next: null, previous: null, results: []}
    };

    var generate_null_user_obj = () => {
        return {
            id: 0,
            username: '',
            first_name: '',
            last_name: '',
            password: '',
            repeat_password: '',
            email: '',
        };
    };

    export default {
        name: "OrganizationsUsersLogs",

        props: {
            action: {
                type: Object,
                default: {
                    show: false,
                    loading: false
                }
            },
            checked_user: {type: Object},
            snackbar_show: null,
        },

        data() {
            return {

                table: {
                    rowsPerPage: 10,
                    page: 1,
                    list: [],
                    loading: false,
                    headers: [
                        {text: 'Тип', value: 'key', sortable: false},
                        {text: 'Статус', value: 'status', sortable: false},
                        {text: 'Дата', value: 'created_dt', sortable: false},
                        {text: 'IP', value: 'ip_addr', sortable: false},
                        {text: 'Инфо', value: 'data', sortable: false},
                    ],
                    backend_answer: generate_null_backend_answer()
                }
            }
        },

        methods: {
            cs_log(item) {
                console.log(item);
            },

            close_dialog() {
                this.table.list = [];
                this.action.show = false;
            },

            getDataFromBackend(url = '', rowsPerPage = null, page = null, by_search = false) {
                if (this.checked_user.id !== 0) {
                    this.table.loading = true;
                    rowsPerPage ? this.table.rowsPerPage = rowsPerPage : '';
                    page ? this.table.page = page : '';
                    if (!url) {
                        url = "/rest_api/logging/?user_id=" + this.checked_user.id;
                        url += ('&page_size=' + this.table.rowsPerPage);
                        url += ('&page=' + this.table.page);
                    }
                    axios.get(url, {headers: default_headers})
                        .then(resp => {
                            resp.data.url = url;
                            this.table.backend_answer = resp.data;
                            this.table.list = [];
                            resp.data.results.forEach(element => {
                                this.table.list.push(element);
                            });
                            this.table.loading = false;
                        })
                        .catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка при получении логов', 'error');
                            this.table.loading = false;
                        });
                } else {
                    this.table.list = [];
                    this.table.backend_answer = generate_null_backend_answer();
                }
            },
        },

        watch: {
            'action.loading': {
                handler(data) {
                    if (data) {
                        this.getDataFromBackend();
                        this.action.loading = false;
                    }
                },
            }
        }
    }
</script>

<style scoped>

</style>