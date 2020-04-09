<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-dialog v-model="action.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Удаление организации</span>
                    <v-spacer></v-spacer>
                    <v-icon color="black" @click="close_dialog">close</v-icon>
                </v-card-title>
                <v-card-text>Организации, которые вы хотите удалить:
                    <ul>
                        <li>
                            <span>
                              <v-icon small>location_city</v-icon>
                                <span>{{checked_organization.name}}</span>
                            </span>
                        </li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="deleteRequest()">Удалить</v-btn>
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
        name: "OrganizationsOrgsDeleteDialog",

        props: {
            action: {
                type: Object,
                default: {
                    show: false,
                    loading: false,
                    confirm: false
                }
            },
            checked_organization: {
                type: Object,
            },
            snackbar_show: null,
        },

        data() {
            return {}
        },

        methods: {
            cs_log(item) {
                console.log(item);
            },

            close_dialog() {
                this.action.show = false;
            },

            deleteRequest() {
                axios.delete('/rest_api/organizations/?pk=' + this.checked_organization.id)
                    .then(resp => {
                        this.action.confirm = true;
                        this.snackbar_show('Организация успешно удалена');
                        this.action.show = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка удаления организации', 'error')
                });
            },
        },

        watch: {}
    }
</script>

<style scoped>

</style>