<template>
    <div>
        <v-dialog v-model="action.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Создание пользователя</span>
                    <v-spacer></v-spacer>
                    <v-icon color="black" @click="close_dialog">close</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>

                    <v-text-field xs12 label="Логин" v-model="native_user_obj.username"></v-text-field>
                    <v-text-field xs12 label="Имя" v-model="native_user_obj.first_name"></v-text-field>
                    <v-text-field xs12 label="Фамилия" v-model="native_user_obj.last_name"></v-text-field>
                    <v-text-field xs12 label="Почта" v-model="native_user_obj.email"></v-text-field>
                    <v-text-field type="password" xs12 label="Пароль" v-model="native_user_obj.password"></v-text-field>
                    <v-text-field type="password" xs12 label="Повторите пароль"
                                  v-model="native_user_obj.repeat_password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close_dialog">Закрыть</v-btn>
                    <v-btn color="blue darken-1" flat @click="create_user">Создать</v-btn>
                </v-card-actions>
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
        name: "OrganizationsUsersNewDialog",

        props: {
            action: {
                type: Object,
                default: {
                    show: false,
                    loading: false
                }
            },
            checked_organization: {
                type: Object,
            },
            get_func: null,
            snackbar_show: null,
        },

        data() {
            return {
                native_user_obj: generate_null_user_obj(),
            }
        },

        methods: {
            cs_log(item) {
                console.log(item);
            },

            close_dialog() {
                this.native_user_obj = generate_null_user_obj();
                this.action.show = false;
            },

            create_user() {
                if (!this.native_user_obj.username) {
                    this.snackbar_show("Поле 'Логин' не должно быть пустым", 'error')
                } else if (this.native_user_obj.password !== this.native_user_obj.repeat_password) {
                    this.snackbar_show('Пароли не совпадают', 'error')
                } else {
                    let post_params = Object.assign(this.native_user_obj);
                    post_params.organization_id = this.checked_organization.id;
                    post_params.id === 0 ? delete post_params.id : '';
                    axios.post('/rest_api/users/list/', post_params, {headers: default_headers})
                        .then(resp => {
                            console.log(resp.data);
                            this.snackbar_show('Пользователь успешно создан');
                            this.get_func();
                            this.close_dialog();
                        }).catch(err => {
                            console.log(err.response);
                            let errors_list = [];
                            for (let key in err.response.data) {
                                errors_list.push(err.response.data[key][0])
                            }
                            if (errors_list.length > 0) {
                                this.snackbar_show(errors_list, 'error');
                            } else {
                                this.snackbar_show('Ошибка создания пользователя', 'error');
                            }
                    })
                }
            },
        },

        watch: {}
    }
</script>

<style scoped>

</style>