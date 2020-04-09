<template>
    <div>
        <v-app>
            <navigation></navigation>
            <v-card>
                <v-card-title>
                    <h2>Логи</h2>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-data-table
                        :headers="logs_table.headers"
                        :items="logs_table.list"
                        :loading="logs_table.loading"
                        hide-actions
                >
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <tr @dblclick="getLogs(props.item)">
                            <td>{{props.item}}
                                <v-icon class="right" @click="getLogs(props.item)" color="primary">save</v-icon>
                            </td>

                        </tr>
                    </template>

                </v-data-table>

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

    export default {
        data() {
            return {
                logs_table: {
                    headers: [
                        {text: 'Наименование', sortable: false},
                    ],
                    list: [],
                    loading: true,
                    checked_table_obj: null
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
                if (this.logs_table.checked_table_obj === element) {
                    this.logs_table.checked_table_obj = null;
                } else {
                    this.logs_table.checked_table_obj = element;
                }
            },

            getLogs(filename = '') {
                let url = '/rest_api/log_files/';
                if (filename) {
                    url += '?filename=' + filename;
                } else {
                    this.logs_table.loading = true;
                }
                console.log(url);
                axios.get(url)
                    .then(resp => {
                        console.log(resp.data);
                        if (resp.data.error_msg) {
                            this.snackbar_show(resp.data.error_msg, 'error')
                        } else if (resp.data.media_file_path) {
                            this.snackbar_show('Скачивается файл');
                            window.location.href = resp.data.media_file_path;
                        } else if (resp.data.files_list) {
                            this.logs_table.list = [];
                            resp.data.files_list.forEach(element => {
                                this.logs_table.list.push(element);
                            })
                        }
                        this.logs_table.loading = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка получения файлов', 'error');
                        this.logs_table.loading = false;
                    });
            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

        },

        components: {
            navigation
        },

        created() {
            this.getLogs()
        }
    }
</script>

<style scoped>


</style>
