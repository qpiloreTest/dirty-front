<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-fade-transition>
        <v-card v-show="checked_organization.id !== 0">
            <v-card-title>
                <h2>
                    Пользователи
                </h2>
                <v-spacer></v-spacer>
                <v-flex xs6 sm5 md4 lg3 :class="{'pr-4': $vuetify.breakpoint.smAndUp}">
                    <v-text-field @keyup.enter="$event.target.blur()"
                                  @blur="getUsersUnderOrganizationsFromServer('',null,null,true)"
                                  v-model="table.search">
                        <template v-slot:label>
                            <v-icon style="vertical-align: middle">search</v-icon>
                            Поиск
                        </template>
                    </v-text-field>
                </v-flex>
                <v-fade-transition>
                    <v-menu offset-y :disabled="checked_user.id === 0">
                        <v-btn
                                slot="activator"
                                color="indigo lighten-2"
                                :disabled="checked_user.id === 0"
                                dark
                        >
                            <v-icon>settings</v-icon>
                            Действия
                            <v-icon>arrow_drop_down</v-icon>
                        </v-btn>

                        <v-list>
                            <v-list-tile @click="open_dialog_edit">
                                <v-list-tile-title>
                                    <v-icon>edit</v-icon>
                                    Редактировать
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="dialog_delete_user.show=true">
                                <v-list-tile-title>
                                    <v-icon color="red">close</v-icon>
                                    Удалить
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="open_dialog_user_logs">
                                <v-list-tile-title>
                                    <v-icon>description</v-icon>
                                    Логи
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-fade-transition>
                <v-tooltip top>
                    <v-btn color="indigo lighten-2" fab small dark slot="activator"
                           @click="dialog_new_user.show = true">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <span>Создать</span>
                </v-tooltip>
            </v-card-title>
            <v-data-table
                    :headers="table.headers"
                    :items="table.list"
                    :loading="table.loading"
                    hide-actions
                    ref="organizations_users_table"
            >
                <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                    <tr @click="tableRowClicked(props.item), props.expanded = !props.expanded"
                        :class="{'grey lighten-2': (props.item.id === checked_user.id)}"
                    >
                        <td>
                            <v-icon
                                    :color="props.item.is_active === true ? 'success'
                                      : props.item.is_active === false ? 'error' : '' "
                                    v-html="props.item.is_active === true ? 'toggle_on'
                                      : props.item.is_active === false ? 'toggle_off' : '' "
                                    large
                            ></v-icon>
                        </td>
                        <td>
                            <span v-if="props.item.username">{{props.item.username}}</span>
                            <span v-else>----</span>
                        </td>
                        <td>
                            <span v-if="props.item.first_name">{{props.item.first_name}}</span>
                            <span v-else>----</span>
                        </td>
                        <td>
                            <span v-if="props.item.last_name">{{props.item.last_name}}</span>
                            <span v-else>----</span>
                        </td>
                        <td>
                            <span v-if="props.item.email">{{props.item.email}}</span>
                            <span v-else>----</span>
                        </td>
                    </tr>
                </template>
                <template v-slot:footer>
                    <td :colspan="table.headers.length">
                        <CustomTablePagination
                                class="right"
                                :data_from_backend_func="getUsersUnderOrganizationsFromServer"
                                :backend_answer="table.backend_answer">
                        </CustomTablePagination>
                    </td>
                </template>
            </v-data-table>

            <OrganizationsUsersNewDialog
                    :action="dialog_new_user"
                    :checked_organization="checked_organization"
                    :get_func="getUsersUnderOrganizationsFromServer"
                    :snackbar_show="snackbar_show"
            ></OrganizationsUsersNewDialog>

            <OrganizationsUsersEditDialog
                    :action="dialog_edit_user"
                    :checked_organization="checked_organization"
                    :checked_user="checked_user"
                    :get_func="getUsersUnderOrganizationsFromServer"
                    :snackbar_show="snackbar_show"
            >
            </OrganizationsUsersEditDialog>

            <OrganizationsUsersLogs
                    :action="dialog_user_logs"
                    :checked_user="checked_user"
                    :snackbar_show="snackbar_show"
            ></OrganizationsUsersLogs>


            <OrganizationsUsersDeleteDialog
                    :action="dialog_delete_user"
                    :checked_user="checked_user"
                    :snackbar_show="snackbar_show"
            ></OrganizationsUsersDeleteDialog>


            <v-snackbar
                    v-model="snackbar.show"
                    :color="snackbar.color"
                    timeout="3000"
                    bottom
                    right
            >
                {{ snackbar.text }}
            </v-snackbar>
        </v-card>
    </v-fade-transition>
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
        return {id: 0, username: '', first_name: '', last_name: ''}
    };
    export default {
        name: "OrganizationsUsers",

        props: {
            checked_organization: {
                type: Object,
                default: {
                    id: 0,
                    name: '',
                    active_flg: false,
                    created: '',
                    is_active: '',
                    modified: '',
                    parent: null,
                    slug: '',
                    subdivision_flg: ''
                },
            },
            default_org_object: {
                type: Object,
                default: {
                    id: 0,
                    name: '',
                    active_flg: false,
                    created: '',
                    is_active: '',
                    modified: '',
                    parent: null,
                    slug: '',
                    subdivision_flg: ''
                }
            }
        },

        data() {
            return {

                table: {
                    backend_answer: {},
                    list: [],
                    headers: [
                        {text: 'Активный', value: 'is_active', sortable: false},
                        {text: 'Логин', value: 'name', sortable: false},
                        {text: 'Имя', value: 'first_name', sortable: false},
                        {text: 'Фамилия', value: 'last_name', sortable: false},
                        {text: 'Почта', value: 'email', sortable: false},
                    ],
                    loading: false,
                    search: '',
                    rowsPerPage: 10,
                    page: 1,
                },
                default_user_obj: generate_null_user_obj(),
                checked_user: generate_null_user_obj(),

                dialog_new_user: {
                    show: false,
                    loading: false,
                },

                dialog_edit_user: {
                    show: false,
                    loading: false,
                    generate_copy_obj: false,
                },

                dialog_user_logs: {
                    show: false,
                    loading: false,
                },

                dialog_delete_user: {
                    show: false,
                    loading: false,
                    delete_from_list_id: null,
                },

                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },
            }
        },

        methods: {
            cs_log(item) {
                console.log(item)
            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            tableRowClicked(element) {
                if (this.checked_user.id === element.id) {
                    for (let key in this.default_user_obj) {
                        this.checked_user[key] = this.default_user_obj[key]
                    }
                } else {
                    for (let key in element) {
                        this.checked_user[key] = element[key]
                    }
                }
            },

            getUsersUnderOrganizationsFromServer(url = '', rowsPerPage = null, page = null, by_search = false) {
                if (this.checked_organization.id !== 0) {
                    this.table.loading = true;
                    rowsPerPage ? this.table.rowsPerPage = rowsPerPage : '';
                    page ? this.table.page = page : '';
                    if (!url) {
                        url = "/rest_api/users/list/?organization_ides=" + this.checked_organization.id;
                        url += ('&page_size=' + this.table.rowsPerPage);
                        url += ('&page=' + this.table.page);
                        url += ('&search=' + this.table.search);
                    }
                    axios.get(url, {headers: default_headers})
                        .then(resp => {
                            resp.data.url = url;
                            this.table.backend_answer = resp.data;
                            this.table.list = [];
                            if (by_search) {
                                for (let key in this.default_user_obj) {
                                    this.checked_user[key] = this.default_user_obj[key];
                                }
                            }
                            resp.data.results.forEach(element => {
                                this.table.list.push(element);
                                if (!by_search) {
                                    if (element.id === this.checked_user.id) {
                                        for (let key in element) {
                                            this.checked_user[key] = element[key];
                                        }
                                    }
                                }
                            });
                            this.table.loading = false;
                        })
                        .catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка при получении пользователей', 'error');
                            this.table.loading = false;
                        });
                } else {
                    this.table.list = [];
                    this.table.backend_answer = generate_null_backend_answer();
                }
            },

            open_dialog_edit() {
                this.dialog_edit_user.generate_copy_obj = true;
                this.dialog_edit_user.show = true;
            },

            open_dialog_user_logs() {
                this.dialog_user_logs.loading = true;
                this.dialog_user_logs.show = true;
            },
        },
        created() {
            this.getUsersUnderOrganizationsFromServer();
        },

        watch: {
            'checked_organization.id': {
                handler(data, old_data) {
                    if (data !== old_data) {
                        this.$refs.organizations_users_table.expanded[this.checked_user.id] = false;
                        this.checked_user = generate_null_user_obj();
                    }
                    console.log(data);
                    if (data !== 0) {
                        this.getUsersUnderOrganizationsFromServer()
                    } else {
                        this.table.list = [];
                    }
                },
            },

            'dialog_delete_user.delete_from_list_id': {
                handler(data) {
                    if (data) {
                        for (let [index, el] of this.table.list.entries()) {
                            if (el.id === data) {
                                this.table.list.splice(index, 1);
                                break;
                            }
                        }
                        this.dialog_delete_user.delete_from_list_id = null;
                    }

                },
            }
        },
    }
</script>

<style scoped>

</style>