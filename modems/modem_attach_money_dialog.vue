<template>
    <div>
        <v-dialog v-model="obj.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Измнение баланса</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field label="Количество SMS" type="number" v-model="amount_sms"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <DatetimePicker
                                    :class="{'pr-2': $vuetify.breakpoint.mdAndUp}"
                                    label="Начало действия"
                                    v-model="date_from"
                                    format="DD.MM.YYYY HH:mm"
                                    locale="ru-ru"
                                    clearText="Очистить"
                                    okText="Сохранить"
                            ></DatetimePicker>
                        </v-flex>
                        <v-flex xs12 md6>
                            <DatetimePicker
                                    :class="{'pl-2': $vuetify.breakpoint.mdAndUp}"
                                    label="Окончание действия"
                                    v-model="date_to"
                                    format="DD.MM.YYYY HH:mm"
                                    locale="ru-ru"
                                    clearText="Очистить"
                                    okText="Сохранить"
                            ></DatetimePicker>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="close_dialog()">Закрыть</v-btn>

                    <v-btn color="blue darken-1" flat @click="send_to_db()">Добавить</v-btn>

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
    import axios from 'axios';
    import DatetimePicker from '../custom_components/DatetimePicker.vue';
    import moment from 'moment';

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
        name: "ModemAttachMoneyDialog",
        components: {
            DatetimePicker,
        },
        props: {
            modem_obj: {
                default: generate_null_modem_object()
            },
            obj: {
                default: {
                    show: false
                }
            }
        },
        data() {
            return {
                amount_sms: 0,
                date_to: null,
                date_from: null,

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
                this.amount_sms = 0;
                this.date_to = null;
                this.date_from = null;
            },

            send_to_db() {
                if (this.amount_sms !== 0) {
                    if (this.date_from !== null && this.date_to !== null) {
                        let post_params = {
                            income: this.amount_sms,
                            date_to: this.date_to,
                            date_from: this.date_from,
                            modem: this.modem_obj.row_id
                        };
                        axios.post('/rest_api/wallet_list/', post_params, {headers: default_headers})
                            .then(resp => {
                                console.log(resp.data);
                                this.snackbar_show("Баланс модема успешно пополнен на '" + this.amount_sms +"' смс");
                                this.close_dialog();
                            }).catch(err => {
                            console.log(err.response);
                            this.snackbar_show("Ошибка добавления средств", 'error')
                        });
                    } else {
                        this.snackbar_show("Запрос отклонен. Поля 'Начало действия' и 'Окончание действия' не должны быть пустыми", 'error')
                    }

                } else {
                    this.snackbar_show('Запрос отклонен. Количество SMS не должно равняться 0', 'error')
                }


            }
        }
    }
</script>

<style scoped>

</style>