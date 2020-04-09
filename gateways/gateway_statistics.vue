<template>
    <div>
        <v-layout wrap>
            <v-flex xs3>
                <div class="text-xs-center">
                    <h3 class="pt-1">Час</h3>
                    <h1 class="pt-1">{{gateway_limits.used_per_hour}} / {{gateway_limits.per_hour}}</h1>
                </div>
            </v-flex>
            <v-flex xs3>
                <div class="text-xs-center">
                    <h3 class="pt-1">День</h3>
                    <h1 class="pt-1">{{gateway_limits.used_per_day}} / {{gateway_limits.per_day}}</h1>
                </div>
            </v-flex>
            <v-flex xs3>
                <div class="text-xs-center">
                    <h3 class="pt-1">Месяц</h3>
                    <h1 class="pt-1">{{gateway_limits.used_per_month}}</h1>
                </div>
            </v-flex>
            <v-flex xs3>
                <div class="text-xs-center">
                    <h3 class="pt-1">Доступно SMS</h3>
                    <h1 class="pt-1">{{gateway_limits.available_sms}}</h1>
                </div>
            </v-flex>
        </v-layout>
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
        name: 'GatewayStatistics',
        props: {
            gateway_obj: {
                type: Object,
                default: {}
            }
        },

        data() {
            return {
                gateway_limits: {
                    per_hour: 0,
                    used_per_hour: 0,

                    per_day: 0,
                    used_per_day: 0,

                    per_month: 0,
                    used_per_month: 0,

                    available_sms: 0,
                },
                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },
            }
        },

        methods: {

            // tableRowClicked(element) {
            //   if (this.queue_outbound_table.checked_table_obj === element) {
            //     this.queue_outbound_table.checked_table_obj = null;
            //   } else {
            //     this.queue_outbound_table.checked_table_obj = element;
            //   }
            // },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },
        },

        created() {
            axios.get('/rest_api/gateways/limits/?gateway_id=' + this.gateway_obj.row_id)
                .then(resp => {
                    if (resp.data) {
                        let gateway_limits_obj = resp.data;
                        this.gateway_limits.per_hour = gateway_limits_obj.sum_devices_limits_sms_per_hour;
                        this.gateway_limits.per_day = gateway_limits_obj.sum_devices_limits_sms_per_day;
                        this.gateway_limits.per_month = gateway_limits_obj.sum_devices_limits_sms_per_month;
                    }
                })
                .catch(err => {
                    console.log(err.response)
                });
            axios.get('/rest_api/get_data_from_redis_keys/?type=GATEWAY_STATISTICS&pk=' + this.gateway_obj.row_id)
                .then(resp => {
                    if (resp.data) {
                        this.gateway_limits.per_month = resp.data.result.statistics.income;
                        this.gateway_limits.available_sms = resp.data.result.available_sms;
                        this.gateway_limits.used_per_hour = resp.data.result.statistics.outcome.hour;
                        this.gateway_limits.used_per_day = resp.data.result.statistics.outcome.day;
                        this.gateway_limits.used_per_month = resp.data.result.statistics.outcome.month;
                        console.log(resp.data.result)
                    }
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
