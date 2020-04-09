<template>
    <div>
        <v-dialog v-model="action.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Редактирование пользователя</span>
                    <v-spacer></v-spacer>
                    <v-icon color="black" @click="close_dialog">close</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-text-field xs12 label="Логин" v-model="native_user_obj.username"></v-text-field>
                    <v-text-field xs12 label="Имя" v-model="native_user_obj.first_name"></v-text-field>
                    <v-text-field xs12 label="Фамилия" v-model="native_user_obj.last_name"></v-text-field>
                    <v-text-field xs12 label="Почта" v-model="native_user_obj.email"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close_dialog">Закрыть</v-btn>
                    <v-btn color="blue darken-1" flat @click="edit_user">Сохранить</v-btn>
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
        name: "OrganizationsUsersEditDialog",

        props: {
            action: {
                type: Object,
                default: {
                    show: false,
                    loading: false,
                    generate_copy_obj: false,
                }
            },
            checked_organization: {
                type: Object,
            },
            checked_user: {
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
                this.action.show = false;
            },

            edit_user() {
                let post_params = {
                    username: this.native_user_obj.username,
                    first_name: this.native_user_obj.first_name,
                    last_name: this.native_user_obj.last_name,
                    email: this.native_user_obj.email,
                    password: this.native_user_obj.password
                };
                if (this.native_user_obj.username) {
                    axios.put('/rest_api/users/list/?pk=' + this.checked_user.id, post_params, {headers: default_headers})
                        .then(resp => {
                            this.snackbar_show('Пользователь успешно измененен');
                            this.get_func();
                            this.close_dialog();
                        }).catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при изменении пользователя', 'error');
                    })
                } else {
                    this.snackbar_show("Поле 'Логин' не должно быть пустым", 'error');
                }
            },
        },

        watch: {
            'action.generate_copy_obj': {
                handler(data) {
                    if (data) {
                        for (let key in this.checked_user) {
                            this.native_user_obj[key] = this.checked_user[key];
                        }
                    }
                    this.action.generate_copy_obj = false;
                },
                deep: true,
            }
        }
    }
</script>

<style scoped>

</style>