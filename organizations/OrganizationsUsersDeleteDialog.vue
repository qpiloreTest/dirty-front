<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-dialog v-model="action.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Удаление пользователей</span>
                    <v-spacer></v-spacer>
                    <v-icon color="black" @click="close_dialog">close</v-icon>
                </v-card-title>
                <v-card-text>Пользозователи, которых вы хотите удалить:
                    <ul>
                        <li>
                            <span>
                              <v-icon small>person</v-icon>
                                <span>{{checked_user.username}}</span>
                            </span>
                        </li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="sendDeleteRequest()">Удалить</v-btn>
                    <v-btn color="blue darken-1" flat @click="close_dialog()">
                        Закрыть
                    </v-btn>
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


    export default {
        name: "OrganizationsUsersDeleteDialog",

        props: {
            action: {
                type: Object,
                default: {
                    show: false,
                    loading: false,
                    delete_from_list_id: null
                }
            },
            checked_user: {type: Object},
            snackbar_show: null,
        },

        data() {
            return {
                empty_user_obejct: {id: 0, username: '', first_name: '', last_name: ''},
            }
        },

        methods: {
            cs_log(item) {
                console.log(item);
            },

            close_dialog() {
                this.action.show = false;
            },

            sendDeleteRequest(url = '/rest_api/users/list/?pk=' + this.checked_user.id) {
                axios.delete(url, {headers: default_headers})
                    .then(resp => {
                        console.log(resp.data);
                        this.snackbar_show('Пользователь удален');
                        this.action.delete_from_list_id = this.checked_user.id;
                        for (let key in this.empty_user_obejct) {
                            this.checked_user[key] = this.empty_user_obejct[key]
                        }
                        this.close_dialog();
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка удаления пользователя', 'error')
                });
            },
        },

        watch: {

        }
    }
</script>

<style scoped>

</style>