<template>
    <div>
        <v-dialog v-model="action.show" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Создание организации</span>
                    <v-spacer></v-spacer>
                    <v-icon color="black" @click="close_dialog">close</v-icon>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>

                    <v-text-field xs12 label="Наименование" v-model="native_org_obj.name"></v-text-field>
                    <v-select
                            xs12
                            readonly
                            label="Организация-родитель"
                            item-text="text"
                            item-value="value"
                            :items="parent_organization_list"
                            v-model="native_org_obj.parent"
                    ></v-select>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md6 lg6>
                            <v-switch
                                    v-model="native_org_obj.is_active"
                                    :label="native_org_obj.is_active === true ? 'Активно' : 'Неактивно'"
                                    color="success"
                            ></v-switch>
                        </v-flex>
                        <v-flex xs12 sm12 md6 lg6>
                            <v-switch
                                    v-model="native_org_obj.subdivision_flg"
                                    :label="native_org_obj.subdivision_flg === true ? 'Является подразделением' : 'Не является подразделением'"
                                    color="success"
                            ></v-switch>
                        </v-flex>

                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close_dialog">Закрыть</v-btn>
                    <v-btn color="blue darken-1" flat @click="create_organization">Создать</v-btn>
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
        name: "OrganizationsOrgsNewDialog",

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
                native_org_obj: generate_null_organization_obj(),
                parent_organization_list: [],
            }
        },

        methods: {
            cs_log(item) {
                console.log(item);
            },

            close_dialog() {
                this.native_org_obj = generate_null_organization_obj();
                this.native_org_obj.parent = this.parent_organization_list[0].value;
                this.action.show = false;
            },

            create_organization() {
                if (this.native_org_obj.name) {
                    let post_params = Object.assign(this.native_org_obj);
                    axios.post('/rest_api/organizations/', post_params, {headers: default_headers})
                        .then(resp => {
                            console.log(resp.data);
                            this.snackbar_show('Организация успешно создана');
                            this.get_func();
                            this.close_dialog();
                        }).catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при создании организации', 'error');
                    })
                } else {
                    this.snackbar_show("Поле 'Наименование' не должно быть пустым", 'error');
                }
            },
        },

        watch: {
            'checked_organization.id': {
                handler(data, old_data) {
                    this.parent_organization_list = [];
                    if (data > 0) {
                        this.parent_organization_list.push({
                            text: this.checked_organization.name,
                            value: this.checked_organization.id
                        });
                        this.native_org_obj.parent = this.parent_organization_list[0].value;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>