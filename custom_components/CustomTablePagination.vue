<template>
    <v-layout row wrap class="paginator-font">
        <p>Строк на странице: </p>
        <div class="paginator-small-spacer-1r"/>
        <v-select
                class="paginator-select-small paginator-selector-font"
                :items="pagination.rows_per_page_list"
                v-model="pagination.rowsPerPage"
        ></v-select>
        <div class="paginator-small-spacer-2r"/>
        <p v-if="pagination.totalItems !== 0">
            {{pagination.left_num}}-{{pagination.right_num}} из {{pagination.totalItems}}
        </p>
        <p v-else>&mdash;</p>
        <div class="paginator-small-spacer-1r"/>
        <v-btn icon small class="paginator-margin-03rem-top-reversed" @click="previous_page_click"
               :disabled="!pagination.previous">
            <v-icon :color="!pagination.previous ? '' : 'grey darken-4'">keyboard_arrow_left</v-icon>
        </v-btn>
        <v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn" @click="next_page_click"
               :disabled="!pagination.next">
            <v-icon :color="!pagination.next ? '' : 'grey darken-4'">keyboard_arrow_right</v-icon>
        </v-btn>
    </v-layout>
</template>

<script>

    var calculate_paginator_rows = (page, rowPerPage, total) => {
        let left_num = ((page - 1) * rowPerPage) + 1;
        let right_num = page * rowPerPage;
        if (right_num > total) {
            right_num = right_num - (right_num - total);
        }
        return ({left_num: left_num, right_num: right_num});
    };

    var generate_empy_pagination_obj = () => {
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

    export default {
        name: 'CustomTablePagination',
        props: {
            backend_answer: {
                type: Object,
                default: {}
            },
            data_from_backend_func: null,
        },
        data() {
            return {
                pagination: generate_empy_pagination_obj(),
                rowsPerPage_local_changes: false,
            }
        },

        methods: {
            previous_page_click() {
                this.pagination.page--;
                this.data_from_backend_func(this.pagination.previous)
            },

            next_page_click() {
                this.pagination.page++;
                this.data_from_backend_func(this.pagination.next)
            },

            save_pagination_data(data) {
                this.pagination.totalItems = data.count;
                this.pagination.next = data.next;
                this.pagination.previous = data.previous;
                let pag_nums = calculate_paginator_rows(this.pagination.page,
                    this.pagination.rowsPerPage,
                    this.pagination.totalItems);
                this.pagination.left_num = pag_nums.left_num;
                this.pagination.right_num = pag_nums.right_num;
            },
        },

        watch: {
            'pagination.rowsPerPage': {
                handler(data, old_data) {
                    if (this.rowsPerPage_local_changes) {
                        this.rowsPerPage_local_changes = false;
                    } else {
                        this.pagination.page = 1;
                        this.data_from_backend_func('', this.pagination.rowsPerPage, this.pagination.page);
                    }
                }
            },
            'backend_answer': {
                handler(data) {
                    if ('url' in data) {
                        let query_params = data.url.split('?');
                        if (1 in query_params) {
                            let url_elements = query_params[1].split('&');
                            for (let index in url_elements) {
                                let one_element = url_elements[index].split('=')
                                if (one_element[0] === 'page') {
                                    this.pagination.page = parseInt(one_element[1]);
                                } else if (one_element[0] === 'page_size' && parseInt(one_element[1]) !== this.pagination.rowsPerPage) {
                                    this.rowsPerPage_local_changes = true;
                                    this.pagination.rowsPerPage = parseInt(one_element[1]);
                                }
                            }
                        }
                    }
                    this.save_pagination_data(data);
                }
            },

        },
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
