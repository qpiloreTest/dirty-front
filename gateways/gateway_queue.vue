<template>
    <div>

        <v-data-table
                :headers="queue_outbound_table.headers"
                :items="queue_outbound_table.list"
                :loading="queue_outbound_table.loading"
                hide-actions
        >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
                <tr>
                    <td>
                        <v-icon
                                :color="props.item.status === 'PENDING' ? 'primary'
                                                          : props.item.status === 'SUCCESS' ? 'success'
                                                          : props.item.status === 'STOPED' ? '#E64A19'
                                                          : props.item.status === 'FAILURE' ? 'error' : '' "
                                v-html="props.item.status === 'PENDING' ? 'schedule'
                                                          : props.item.status === 'SUCCESS' ? 'done'
                                                          : props.item.status === 'STOPED' ? 'pause_circle_outline'
                                                          : props.item.status === 'FAILURE' ? 'error' : '' "
                        ></v-icon>
                    </td>
                    <td>{{ props.item.phone }}</td>
                    <td>{{ props.item.text }}</td>
                    <td>{{ props.item.sms_parts }}</td>
                    <td>{{ props.item.character_amount }}</td>
                    <td>{{ props.item.language }}</td>
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
                    :items="queue_outbound_table.pagination.rows_per_page_list"
                    v-model="queue_outbound_table_rowsPerPage"
            ></v-select>
            <div class="paginator-small-spacer-2r"/>
            <p v-if="queue_outbound_table.pagination.totalItems !== 0">
                {{queue_outbound_table.pagination.left_num}}-{{queue_outbound_table.pagination.right_num}} из
                {{queue_outbound_table.pagination.totalItems}}
            </p>
            <p v-else>&mdash;</p>
            <div class="paginator-small-spacer-2r"/>
            <v-icon
                    @click="previous_page_click_queue_outbound_table"
                    :disabled="!queue_outbound_table.pagination.previous"
                    :color="!queue_outbound_table.pagination.previous ? '' : 'grey darken-4'"
            >keyboard_arrow_left
            </v-icon>
            <div class="paginator-small-spacer-1r"/>
            <v-icon
                    @click="next_page_click_queue_outbound_table"
                    :disabled="!queue_outbound_table.pagination.next"
                    :color="!queue_outbound_table.pagination.next ? '' : 'grey darken-4'"
                    class="paginator-last-action-btn"
            >keyboard_arrow_right
            </v-icon>
        </v-layout>


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
        name: 'GatewayQueue',
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
                queue_outbound_table_rowsPerPage: 10,
                queue_outbound_table: {
                    list: [],
                    headers: [
                        {text: 'Статус', value: 'status', sortable: false},
                        {text: 'Телефон', value: 'phone', sortable: false},
                        {text: 'Текст', value: 'text', sortable: false},
                        {text: 'Частей SMS', value: 'sms_parts', sortable: false},
                        {text: 'Символов', value: 'character_amount', sortable: false},
                        {text: 'Язык', value: 'language', sortable: false},
                    ],
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

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            getSmsQueueList(url = '') {
                console.log(this.gateway_id);
                if (!url) {
                    this.queue_outbound_table.pagination.page = 1;
                    url = ('/rest_api/distributions/records/list/?gateway_ides=' + this.gateway_id
                        + '&status=PENDING'
                        + '&page_size=' + this.queue_outbound_table_rowsPerPage
                        + '&page=' + this.queue_outbound_table.pagination.page)
                }
                this.queue_outbound_table.loading = true;
                axios.get(url)
                    .then(resp => {
                        this.queue_outbound_table.list = [];
                        resp.data.results.forEach(element => {
                            this.queue_outbound_table.list.push(element);
                        });
                        this.save_pagination_data(resp.data);
                        this.queue_outbound_table.loading = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка получения очереди', 'error');
                    });
            },

            next_page_click_queue_outbound_table() {
                this.queue_outbound_table.pagination.page++;
                this.getSmsQueueList(this.queue_outbound_table.pagination.next);
            },

            previous_page_click_queue_outbound_table() {
                this.queue_outbound_table.pagination.page--;
                this.getSmsQueueList(this.queue_outbound_table.pagination.previous);
            },

            save_pagination_data(data) {
                this.queue_outbound_table.pagination.totalItems = data.count;
                this.queue_outbound_table.pagination.next = data.next;
                this.queue_outbound_table.pagination.previous = data.previous;
                let pag_nums = calculate_paginator_rows(this.queue_outbound_table.pagination.page,
                    this.queue_outbound_table_rowsPerPage,
                    this.queue_outbound_table.pagination.totalItems);
                this.queue_outbound_table.pagination.left_num = pag_nums.left_num;
                this.queue_outbound_table.pagination.right_num = pag_nums.right_num;
            },

        },

        watch: {
            queue_outbound_table_rowsPerPage: {
                handler() {
                    this.queue_outbound_table.pagination.page = 1;
                    this.getSmsQueueList();
                },
                deep: true
            },
        },

        created() {
            this.getSmsQueueList();
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
