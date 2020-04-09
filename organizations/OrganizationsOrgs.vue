<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card>
        <v-card-title>
            <h2>
                Организации
            </h2>
            <v-spacer></v-spacer>
            <v-flex xs6 sm5 md4 lg3 :class="{'pr-4': $vuetify.breakpoint.smAndUp}">
                <v-text-field @keyup.enter="$event.target.blur()" @blur="getOrganizationsFromServer('',null,null,true)"
                              v-model="table.search">
                    <template v-slot:label>
                        <v-icon style="vertical-align: middle">search</v-icon>
                        Поиск
                    </template>
                </v-text-field>
            </v-flex>
            <v-fade-transition>
                <v-menu offset-y :disabled="checked_organization.id === 0">
                    <v-btn
                            slot="activator"
                            color="indigo lighten-2"
                            :disabled="checked_organization.id === 0"
                            dark
                    >
                        <v-icon>settings</v-icon>
                        Действия
                        <v-icon>arrow_drop_down</v-icon>
                    </v-btn>

                    <v-list>
                        <v-list-tile
                                @click="dialog_new_organization.show = true">
                            <v-list-tile-title>
                                <v-icon>add</v-icon>
                                Создать
                            </v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile @click="open_dialog_edit">
                            <v-list-tile-title>
                                <v-icon>edit</v-icon>
                                Редактировать
                            </v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile @click="dialog_delete_organization.show=true">
                            <v-list-tile-title>
                                <v-icon color="red">close</v-icon>
                                Удалить
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>

            </v-fade-transition>
        </v-card-title>
        <v-data-table
                :headers="table.headers"
                :items="table.list"
                :loading="table.loading"
                hide-actions
        >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
                <tr @click="tableRowClicked(props.item), props.expanded = !props.expanded"
                    :class="{'grey lighten-2': (props.item.id === checked_organization.id)}"
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
                    <td>{{props.item.name}}</td>
                    <td><span>{{find_organization_in_list(props.item.parent)}}</span></td>
                </tr>
            </template>
            <template v-slot:footer>
                <td :colspan="table.headers.length">
                    <CustomTablePagination
                            class="right"
                            :data_from_backend_func="getOrganizationsFromServer"
                            :backend_answer="table.backend_answer">
                    </CustomTablePagination>
                </td>
            </template>
        </v-data-table>

        <OrganizationsOrgsNewDialog
                :action="dialog_new_organization"
                :checked_organization="checked_organization"
                :get_func="getOrganizationsFromServer"
                :snackbar_show="snackbar_show"
        >
        </OrganizationsOrgsNewDialog>

        <OrganizationsOrgsEditDialog
                :action="dialog_edit_organization"
                :checked_organization="checked_organization"
                :get_func="getOrganizationsFromServer"
                :snackbar_show="snackbar_show"
                :organizations_list="organizations_list"
        >
        </OrganizationsOrgsEditDialog>

        <OrganizationsOrgsDeleteDialog
            :action="dialog_delete_organization"
            :checked_organization="checked_organization"
            :snackbar_show="snackbar_show"
        ></OrganizationsOrgsDeleteDialog>

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

</template>

<script>
    import axios from 'axios';

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const default_headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
    };

    var generate_null_organization_obj = () => {
        return {
            id: 0,
            name: '',
            created: '',
            is_active: true,
            modified: '',
            parent: 0,
            slug: '',
            subdivision_flg: false
        };
    };

    export default {
        name: "OrganizationsOrgs",

        props: {
            checked_organization: {
                type: Object,
                default: this.default_org_object
            },

        },

        data() {
            return {
                table: {
                    search: '',
                    backend_answer: {},
                    list: [],
                    headers: [
                        {text: 'Активно', value: 'is_active', sortable: false},
                        {text: 'Наименование', value: 'name', sortable: false},
                        {text: 'Родитель', value: 'parent', sortable: false},
                    ],
                    loading: false,
                    rowsPerPage: 10,
                    page: 1,
                },

                default_org_object: generate_null_organization_obj(),
                organizations_list: [{text: '----', value: 0}],

                dialog_new_organization: {
                    show: false,
                    loading: false
                },

                dialog_edit_organization: {
                    show: false,
                    loading: false,
                    generate_copy_obj: false
                },

                dialog_delete_organization: {
                    show: false,
                    loading: false,
                    confirm: false
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

            find_organization_in_list(id) {
                let res = '';
                for (let i = 0; i < this.organizations_list.length; i++) {
                    if (id === this.organizations_list[i].value) {
                        res = this.organizations_list[i].text;
                    }
                }
                return res
            },

            tableRowClicked(element) {
                if (this.checked_organization.id === element.id) {
                    for (let key in this.default_org_object) {
                        this.checked_organization[key] = this.default_org_object[key];
                    }
                } else {
                    for (let key in element) {
                        this.checked_organization[key] = element[key]
                    }
                }
            },

            getOrganizationsFromServer(url = '', rowsPerPage = null, page = null, by_search = false) {
                this.table.loading = true;
                rowsPerPage ? this.table.rowsPerPage = rowsPerPage : '';
                page ? this.table.page = page : '';
                if (!url) {
                    url = "/rest_api/organizations/?children_recursive=True";
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
                            for (let key in this.default_org_object) {
                                this.checked_organization[key] = this.default_org_object[key];
                            }
                        }
                        resp.data.results.forEach(element => {
                            this.table.list.push(element);
                            if (!by_search) {
                                if (element.id === this.checked_organization.id) {
                                    for (let key in element) {
                                        this.checked_organization[key] = element[key];
                                    }
                                }
                            }
                            this.organizations_list.push({text: element.name, value: element.id})
                        });
                        this.table.loading = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при получении организаций, в которых вы состоите', 'error');
                        this.table.loading = false;
                    });
            },

            open_dialog_edit() {
                this.dialog_edit_organization.generate_copy_obj = true;
                this.dialog_edit_organization.show = true;
            },
        },
        created() {
            this.getOrganizationsFromServer();
        },
        watch: {
            'dialog_delete_organization.confirm': {
                handler(data) {
                    if (data) {
                        for (let [index, el] of this.table.list.entries()) {
                            if (el.id === this.checked_organization.id) {
                                this.table.list.splice(index, 1);
                                break;
                            }
                        }
                        this.checked_organization = generate_null_organization_obj();
                        this.dialog_delete_organization.confirm=false;
                    }
                }
            },
            // checked_organization: {
            //     handler(data) {
            //         console.log(3);
            //     },
            // },
        },
    }
</script>

<style scoped>

</style>