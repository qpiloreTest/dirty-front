<template>
    <div>
        <v-app>
            <navigation></navigation>
            <v-card>
                <v-card-title>
                    <h2>Стоп листы
                        <span v-if="stop_objects_table.show_type_value_on_datatable_header">
                          <v-icon>arrow_right_alt</v-icon>
                          {{stop_objects_table.filter.select_list_of_type_value.find(element => {
                            return element.value === stop_objects_table.filter.type_value}).text}}
                        </span>
                    </h2>
                    <v-spacer></v-spacer>

                    <v-flex lg2 md3 sm4 xs6 class="pr-3">
                        <v-layout wrap>
                            <v-tooltip left :disabled="stop_objects_table.append_icon !== 'add'">
                                <v-text-field style="margin-top: -5px;"
                                              slot="activator"
                                              v-model="watcher_stop_objects_table.search"
                                              :append-outer-icon="stop_objects_table.append_icon"
                                              @click:append-outer="stop_objects_table_search_btn_click"
                                              @keyup.enter="stop_objects_table_search_btn_click"
                                              label="Поиск"
                                              single-line
                                              hide-details
                                              :disabled="treeselect.organizations.length < 1"
                                ></v-text-field>
                                <span><strong>Будет добавлено в</strong>:</span>
                                <ul>
                                    <li v-for="searched_for_adding in stop_objects_table.returend_list_where_search_not_exists">
                                        <v-icon small dark>location_city</v-icon>
                                        <span>
                                          {{ treeselect.cache_organizations_list.find(element => {
                                            return element.id === searched_for_adding.organization_id}).label }}
                                        </span>
                                    </li>
                                </ul>
                            </v-tooltip>
                        </v-layout>
                    </v-flex>

                    <v-menu offset-y :disabled="watcher_stop_objects_selected.selected.length === 0">
                        <v-btn
                                icon
                                slot="activator"
                                color="indigo lighten-2"
                                dark
                                :disabled="watcher_stop_objects_selected.selected.length === 0"
                        >
                            <v-icon>settings</v-icon>
                        </v-btn>

                        <v-list>

                            <v-list-tile v-if="stop_objects_table.selected_deactivated > 0" @click="activate_objects">
                                <v-list-tile-title>
                                    <v-icon color="success">toggle_on</v-icon>
                                    Активировать
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile v-if="stop_objects_table.selected_activated > 0" @click="deactivate_objects">
                                <v-list-tile-title>
                                    <v-icon color="error">toggle_off</v-icon>
                                    Деактивировать
                                </v-list-tile-title>
                            </v-list-tile>

                            <v-divider></v-divider>

                            <v-list-tile @click="stop_objects_table.dialog_delete_objects_show = true">
                                <v-list-tile-title>
                                    <v-icon color="red">close</v-icon>
                                    Удалить
                                </v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>


                    <!--<v-spacer></v-spacer>-->
                    <v-badge :color="treeselect.organizations.length < 1 ? 'red' : 'success'" overlap>
                        <span slot="badge" v-if="treeselect.organizations.length < 1">!</span>
                        <v-icon slot="badge" dark small v-else>done</v-icon>
                        <v-tooltip left>
                            <v-btn color="indigo lighten-2" fab small dark slot="activator" @click="openFilter">
                                <v-icon>filter_list</v-icon>
                            </v-btn>
                            <span><strong>Фильтр</strong></span>
                            <br>
                            <span><strong>Статус</strong>: </span>
                            <ul>
                                <li>
									<span v-if="stop_objects_table.filter.select_list_of_active_value.find(element => {
 											return element.value === stop_objects_table.filter.active_value})">
										{{ stop_objects_table.filter.select_list_of_active_value.find(element => {
 											return element.value === stop_objects_table.filter.active_value}).text }}
									</span>
                                    <span v-else>----</span>
                                </li>
                            </ul>
                            <span><strong>Тип</strong>: </span>
                            <ul>
                                <li>
									<span v-if="stop_objects_table.filter.select_list_of_type_value.find(element => {
										return element.value === stop_objects_table.filter.type_value})">
										{{ stop_objects_table.filter.select_list_of_type_value.find(element => {
											return element.value === stop_objects_table.filter.type_value}).text }}
									</span>
                                    <span v-else>----</span>
                                </li>
                            </ul>
                            <span v-if="treeselect.organizations.length > 0"><strong>Организации</strong>:</span>
                            <ul>
                                <li v-for="index in treeselect.organizations">
                                    {{ treeselect.cache_organizations_list.find(element => {return element.id ===
                                    index}).label }}
                                </li>
                            </ul>
                        </v-tooltip>
                    </v-badge>
                </v-card-title>

                <v-data-table
                        :headers="stop_objects_table.headers"
                        :items="stop_objects_table.list"
                        :loading="stop_objects_table.loading"
                        v-model="watcher_stop_objects_selected.selected"
                        item-key="row_id"
                        select-all
                        hide-actions
                >
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <tr @click="props.selected = !props.selected" :bgcolor="props.selected ? '#E0E0E0' : ''">
                            <td>
                                <v-checkbox
                                        v-model="props.selected"
                                        primary
                                        hide-details
                                ></v-checkbox>
                            </td>
                            <td>{{props.item.data_val}}</td>
                            <td v-if="props.item.organization">{{props.item.organization.name}}</td>
                            <td v-else>----</td>
                            <td>
                                <v-icon
                                        :color="props.item.active === true ? 'success'
                  : props.item.active === false ? 'error' : '' "
                                        v-html="props.item.active === true ? 'toggle_on'
                  : props.item.active === false ? 'toggle_off' : '' "
                                        large
                                ></v-icon>
                            </td>
                        </tr>
                    </template>
                </v-data-table>

                <!--paginator-->

                <v-divider/>
                <v-layout row wrap class="paginator-font">
                    <v-spacer/>
                    <p>Строк на странице: </p>
                    <div class="paginator-small-spacer-1r"/>
                    <v-select
                            class="paginator-select-small paginator-selector-font"
                            :items="stop_objects_table.pagination.rows_per_page_list"
                            v-model="stop_objects_table_rowsPerPage"
                    ></v-select>
                    <div class="paginator-small-spacer-2r"/>
                    <p v-if="stop_objects_table.pagination.totalItems !== 0">
                        {{stop_objects_table.pagination.left_num}}-{{stop_objects_table.pagination.right_num}} из
                        {{stop_objects_table.pagination.totalItems}}
                    </p>
                    <p v-else>&mdash;</p>
                    <div class="paginator-small-spacer-1r"/>
                    <v-btn icon small class="paginator-margin-03rem-top-reversed"
                           @click="previous_page_click_stop_objects_table"
                           :disabled="!stop_objects_table.pagination.previous">
                        <v-icon :color="!stop_objects_table.pagination.previous ? '' : 'grey darken-4'">
                            keyboard_arrow_left
                        </v-icon>
                    </v-btn>
                    <v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
                           @click="next_page_click_stop_objects_table" :disabled="!stop_objects_table.pagination.next">
                        <v-icon :color="!stop_objects_table.pagination.next ? '' : 'grey darken-4'">
                            keyboard_arrow_right
                        </v-icon>
                    </v-btn>
                </v-layout>

            </v-card>

            <v-dialog v-model="stop_objects_table.dialog_delete_objects_show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Удаление стоп объектов</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="stop_objects_table.dialog_delete_objects_show = false">close
                        </v-icon>
                    </v-card-title>
                    <v-card-text>Объекты, которые вы хотите удалить:
                        <ul>
                            <li v-for="item in watcher_stop_objects_selected.selected">
                <span>
                  {{ item.data_val }}
                  ({{stop_objects_table.filter.select_list_of_type_value.find(element => {return element.value === item.type}).text}})
                </span>
                                &mdash;
                                <v-icon small>location_city</v-icon>
                                <span>
                  {{ treeselect.cache_organizations_list.find(element => {return element.id === item.organization.id}).label }}
                </span></li>
                        </ul>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" flat @click="delete_objects">Удалить</v-btn>
                        <v-btn color="blue darken-1" flat
                               @click="stop_objects_table.dialog_delete_objects_show = false">Закрыть
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="stop_objects_table.filter.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Фильтр</span>
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-flex class="pr-4 pl-4">
                        <v-select
                                label="Состояние"
                                item-text="text"
                                item-value="value"
                                :items="stop_objects_table.filter.select_list_of_active_value"
                                v-model="stop_objects_table.filter.active_value"
                        ></v-select>
                    </v-flex>
                    <v-flex class="pr-4 pl-4">
                        <v-select
                                label="Тип"
                                item-text="text"
                                item-value="value"
                                :items="stop_objects_table.filter.select_list_of_type_value"
                                v-model="stop_objects_table.filter.type_value"
                        ></v-select>
                    </v-flex>
                    <v-flex class="pr-4 pl-4">
						<span style="color: grey; font-size: 12px; padding-left: 2px;">Оргазинации <span
                                style="color: red">*</span></span>
                        <v-progress-circular
                                v-if="treeselect.organizations_loading"
                                indeterminate
                                :size="12"
                                :width="2"
                                color="primary"
                        ></v-progress-circular>
                        <Treeselect
                                v-model="treeselect.organizations"
                                :multiple="true"
                                :options="treeselect.organizations_list"
                                :load-options="loadOrganizations"
                                :flat="true"
                                placeholder="Поиск..."
                        />
                    </v-flex>
                    <br>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="filter_clear">Очистить</v-btn>
                        <v-btn color="blue darken-1" flat @click="filter_save">Применить</v-btn>
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
        </v-app>
    </div>
</template>


<script>
    import axios from 'axios'
    import navigation from '../navigation_panel.vue'
    import regeneratorRuntime from "regenerator-runtime";
    import Treeselect from '@riophae/vue-treeselect'
    import '../../../static/css/vue-treeselect.css'
    import {LOAD_CHILDREN_OPTIONS, LOAD_ROOT_OPTIONS} from '@riophae/vue-treeselect'

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
        components: {
            Treeselect,
            navigation
        },

        data() {
            return {
                stop_objects_table_rowsPerPage: 10,
                watcher_stop_objects_table: {
                    search: '',
                    expected_search: '',
                },
                watcher_stop_objects_selected: {
                    selected: [],
                },
                stop_objects_table: {
                    show_type_value_on_datatable_header: false,
                    append_icon: 'search',
                    returend_list_where_search_not_exists: [],
                    headers: [
                        {text: 'Значение', value: 'data_val', sortable: false},
                        {text: 'Организация', value: 'organization', sortable: false, width: 50},
                        {text: 'Состояние', value: 'active', sortable: false, width: 15, align: 'center'},
                    ],
                    list: [],
                    selected_deactivated: 0,
                    selected_activated: 0,
                    pagination: generate_null_pagination_obj(),
                    loading: false,
                    filter: {
                        select_list_of_active_value: [
                            {text: '----', value: ''},
                            {text: 'Активно', value: 'True'},
                            {text: 'Неактивно', value: 'False'},
                        ],
                        active_value: '',

                        select_list_of_type_value: [
                            {text: 'Слова', value: 'WORD'},
                            {text: 'Телефоны', value: 'PHONE'},
                            {text: 'Email', value: 'EMAIL'},
                        ],
                        type_value: 'WORD',
                        show: false,
                    },
                    show_add_tooltip: false,
                    dialog_delete_objects_show: false,
                },
                treeselect: {
                    organizations: [],
                    organizations_for_compare: [],
                    organizations_list: [],
                    cache_organizations_list: [],
                    organizations_loading: false,
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
                console.log(item);
            },

            openFilter() {
                this.treeselect.organizations_loading = true;
                axios.get('/rest_api/tree_view_orgs_and_projs/?type=1&children_exists=true', {headers: default_headers})
                    .then(resp => {
                        this.treeselect.organizations_list = [];
                        resp.data.organizations.forEach(element => {
                            console.log(element)
                            if (element.children_exists) {
                                this.treeselect.organizations_list.push({
                                    id: element.id,
                                    label: element.name,
                                    children: null
                                });
                            } else {
                                this.treeselect.organizations_list.push({id: element.id, label: element.name});
                            }
                            if (!this.treeselect.cache_organizations_list.find(el => {
                                return el.id === element.id
                            })) {
                                this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
                            }
                        });
                        this.treeselect.organizations_loading = false;
                    }).catch(err => {
                    console.log(err.response)
                });
                this.stop_objects_table.filter.show = true
            },

            loadOrganizations({action, parentNode, callback}) {
                if (action === LOAD_CHILDREN_OPTIONS)
                    console.log(action);
                axios.get('/rest_api/tree_view_orgs_and_projs/?type=5&children_exists=true' +
                    '&organization_id=' + parentNode.id, {headers: default_headers})
                    .then(resp => {
                        parentNode.children = [];
                        resp.data.organizations.forEach(element => {
                            if (element.children_exists) {
                                parentNode.children.push({id: element.id, label: element.name, children: null});
                            } else {
                                parentNode.children.push({id: element.id, label: element.name});
                            }
                            if (!this.treeselect.cache_organizations_list.find(el => {
                                return el.id === element.id
                            })) {
                                this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
                            }
                        });
                        callback();
                    })
                    .catch(err => {
                        console.log(err.response);
                        callback(new Error('Failed to load options: network error.'));
                    });
            },

            getListOfStopObjectsWithSearch() {
                axios.get('/rest_api/restrictions/stop_lists/?check_exists=true' +
                    '&key_data_value=' + this.watcher_stop_objects_table.search +
                    '&organization_ides=' + this.treeselect.organizations +
                    '&key_type=' + this.stop_objects_table.filter.type_value, {headers: default_headers})
                    .then(resp => {
                        console.log(resp);
                        if (resp.data.status === 204) {
                            this.stop_objects_table.returend_list_where_search_not_exists = [];
                            this.stop_objects_table.append_icon = 'add';
                            if (resp.data.result) {
                                resp.data.result.forEach(element => {
                                    let obj = {
                                        organization_id: element.organization_id,
                                        user_id: element.user_id
                                    };
                                    this.stop_objects_table.returend_list_where_search_not_exists.push(obj);
                                });
                            } else if (resp.data.status === 200) {
                                this.stop_objects_table.returend_list_where_search_not_exists = [];
                                this.stop_objects_table.append_icon = 'search';
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err.response);
                    });
            },

            stop_objects_table_search_btn_click() {
                this.watcher_stop_objects_table.expected_search = this.watcher_stop_objects_table.search;
                if (this.stop_objects_table.append_icon === 'search') {
                    this.stop_objects_table.pagination.page = 1;
                    this.getStopObjectsList();

                    if (this.watcher_stop_objects_table.searchsearch !== '') {
                        this.getListOfStopObjectsWithSearch();
                    }
                } else if (this.stop_objects_table.append_icon === 'add') {
                    let post_params = {
                        data_val: this.watcher_stop_objects_table.search,
                        type: this.stop_objects_table.filter.type_value,
                        organization: this.treeselect.organizations,
                    };
                    axios.post('/rest_api/restrictions/stop_lists/', post_params, {headers: default_headers})
                        .then(resp => {
                            this.stop_objects_table.append_icon = 'search';
                            this.stop_objects_table.pagination.page = 1;
                            this.getStopObjectsList();
                            this.snackbar_show("Объект '" + this.watcher_stop_objects_table.search + "' добавлен")
                        })
                        .catch(err => {
                            console.log(err.response);
                        });
                }
            },

            filter_clear() {
                this.stop_objects_table.filter.active_value = '';
                this.stop_objects_table.filter.type_value = 'WORD';
                this.treeselect.organizations = [];
                // users cleared with watcher
            },

            filter_save() {
                this.stop_objects_table.pagination.page = 1;
                if (this.treeselect.organizations.length > 0) {
                    if (this.watcher_stop_objects_table.search !== '') {
                        this.getListOfStopObjectsWithSearch();
                    }
                    this.getStopObjectsList();
                    this.stop_objects_table.show_type_value_on_datatable_header = true;
                } else {
                    this.stop_objects_table.pagination = generate_null_pagination_obj();
                    this.stop_objects_table.list = [];
                    this.watcher_stop_objects_selected.selected = [];
                    this.stop_objects_table.show_type_value_on_datatable_header = false;
                }
                this.stop_objects_table.filter.show = false;
            },

            activate_objects() {
                let counter = 0;
                this.watcher_stop_objects_selected.selected.forEach(element => {
                    counter++;
                    let post_params = {active: true};
                    if (element.active === false) {
                        post_params.data_val = element.data_val;
                        post_params.type = element.type;
                        axios.put('/rest_api/restrictions/stop_lists/?pk=' + element.row_id, post_params, {headers: default_headers})
                            .then(resp => {
                                let stop_objects_table_index = get_index_of_array_by_id(this.stop_objects_table.list, element.row_id);
                                let watcher_stop_objects_selected_selected_index = get_index_of_array_by_id(this.watcher_stop_objects_selected.selected, element.row_id);
                                resp.data.organization = this.stop_objects_table.list[stop_objects_table_index].organization;
                                resp.data.user = this.stop_objects_table.list[stop_objects_table_index].user;
                                this.stop_objects_table.list.splice(stop_objects_table_index, 1, resp.data);
                                this.watcher_stop_objects_selected.selected.splice(watcher_stop_objects_selected_selected_index, 1, resp.data);
                                if (counter === this.watcher_stop_objects_selected.selected.length) {
                                    this.snackbar_show('Объекты активированы');
                                }
                            })
                            .catch(err => {
                                console.log(err.response);
                                this.snackbar_show('Ошибка при активации объектов', 'error');
                            })
                    }
                })
            },

            deactivate_objects() {
                let counter = 0;
                this.watcher_stop_objects_selected.selected.forEach(element => {
                    counter++;
                    let post_params = {active: false};
                    if (element.active === true) {
                        post_params.data_val = element.data_val;
                        post_params.type = element.type;
                        axios.put('/rest_api/restrictions/stop_lists/?pk=' + element.row_id, post_params, {headers: default_headers})
                            .then(resp => {
                                let stop_objects_table_index = get_index_of_array_by_id(this.stop_objects_table.list, element.row_id);
                                let watcher_stop_objects_selected_selected_index = get_index_of_array_by_id(this.watcher_stop_objects_selected.selected, element.row_id);
                                resp.data.organization = this.stop_objects_table.list[stop_objects_table_index].organization;
                                resp.data.user = this.stop_objects_table.list[stop_objects_table_index].user;
                                this.stop_objects_table.list.splice(stop_objects_table_index, 1, resp.data);
                                this.watcher_stop_objects_selected.selected.splice(watcher_stop_objects_selected_selected_index, 1, resp.data);
                                if (counter === this.watcher_stop_objects_selected.selected.length) {
                                    this.snackbar_show('Объекты деактивированы');
                                }
                            })
                            .catch(err => {
                                console.log(err.response);
                                this.snackbar_show('Ошибка при деактивации объектов', 'error');
                            })
                    }
                })
            },

            delete_objects() {
                let counter = 0;
                this.watcher_stop_objects_selected.selected.forEach(element => {
                    counter++;
                    axios.delete('/rest_api/restrictions/stop_lists/?pk=' + element.row_id, {headers: default_headers})
                        .then(resp => {
                            if (counter === this.watcher_stop_objects_selected.selected.length) {
                                this.stop_objects_table.pagination.page = 1;
                                this.getStopObjectsList();
                                if (this.watcher_stop_objects_selected.selected.length > 1) {
                                    this.snackbar_show('Объекты были удалены')
                                } else {
                                    this.snackbar_show('Объект был удален')
                                }
                                this.watcher_stop_objects_selected.selected = [];
                                this.stop_objects_table.dialog_delete_objects_show = false;
                            }
                        })
                        .catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка при удалении объектов', 'error');
                        })
                });
            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            getStopObjectsList(url = '') {
                if (!url) {
                    this.stop_objects_table.pagination.page = 1;
                    url = ('/rest_api/restrictions/stop_lists/?page_size='
                        + this.stop_objects_table_rowsPerPage
                        + '&key_type=' + this.stop_objects_table.filter.type_value
                        + '&page=' + this.stop_objects_table.pagination.page
                        + '&active=' + this.stop_objects_table.filter.active_value
                        + '&key_data_value=' + this.watcher_stop_objects_table.search
                        + '&organization_ides=' + this.treeselect.organizations);
                }
                this.stop_objects_table.loading = true;
                axios.get(url)
                    .then(resp => {
                        this.stop_objects_table.list = [];
                        this.watcher_stop_objects_selected.selected = [];
                        this.save_pagination_data_stop_objects_table(resp.data);
                        resp.data.results.forEach(element => {
                            this.stop_objects_table.list.push(element);
                        });
                        this.stop_objects_table.loading = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                    });
            },

            next_page_click_stop_objects_table() {
                this.stop_objects_table.pagination.page++;
                this.getStopObjectsList(this.stop_objects_table.pagination.next);
                this.watcher_stop_objects_selected.selected = [];
            },

            previous_page_click_stop_objects_table() {
                this.stop_objects_table.pagination.page--;
                this.getStopObjectsList(this.stop_objects_table.pagination.previous);
                this.watcher_stop_objects_selected.selected = [];
            },

            save_pagination_data_stop_objects_table(data) {
                this.stop_objects_table.pagination.totalItems = data.count;
                this.stop_objects_table.pagination.next = data.next;
                this.stop_objects_table.pagination.previous = data.previous;
                let pag_nums = calculate_paginator_rows(this.stop_objects_table.pagination.page, this.stop_objects_table_rowsPerPage, this.stop_objects_table.pagination.totalItems);
                this.stop_objects_table.pagination.left_num = pag_nums.left_num;
                this.stop_objects_table.pagination.right_num = pag_nums.right_num;
            },
        },

        watch: {
            treeselect: {
                handler() {
                    if (this.treeselect.organizations_for_compare !== this.treeselect.organizations) {
                        this.treeselect.organizations_for_compare = this.treeselect.organizations;
                    }
                },
                deep: true
            },
            watcher_stop_objects_table: {
                handler() {
                    if ((this.watcher_stop_objects_table.search !== this.watcher_stop_objects_table.expected_search) || (this.watcher_stop_objects_table.search === '')) {
                        this.stop_objects_table.append_icon = 'search';
                    }
                },
                deep: true
            },

            watcher_stop_objects_selected: {
                handler() {
                    if (this.watcher_stop_objects_selected.selected.length !== 0) {
                        this.stop_objects_table.selected_activated = 0;
                        this.stop_objects_table.selected_deactivated = 0;
                        this.watcher_stop_objects_selected.selected.forEach(element => {
                            if (element.active === true) {
                                this.stop_objects_table.selected_activated++;
                            } else {
                                this.stop_objects_table.selected_deactivated++;
                            }
                        })
                    }
                },
                deep: true
            },

            stop_objects_table_rowsPerPage: {
                handler() {
                    this.filter_save();
                },
                deep: true
            },
        },

        created() {

            axios.get('/rest_api/tree_view_orgs_and_projs/?type=1&children_exists=true', {headers: default_headers})
                .then(resp => {
                    this.treeselect.organizations_list = [];
                    resp.data.organizations.forEach(element => {
                        if (element.children_exists) {
                            this.treeselect.organizations_list.push({
                                id: element.id,
                                label: element.name,
                                children: null
                            });
                        } else {
                            this.treeselect.organizations_list.push({id: element.id, label: element.name});
                        }
                        if (!this.treeselect.cache_organizations_list.find(el => {
                            return el.id === element.id
                        })) {
                            this.treeselect.cache_organizations_list.push({id: element.id, label: element.name});
                        }
                    });
                    if (this.treeselect.organizations_list.length > 0) {
                        this.treeselect.organizations.push(this.treeselect.organizations_list[0].id);
                        this.getStopObjectsList();
                    }
                    this.treeselect.organizations_loading = false;
                }).catch(err => {
                console.log(err.response)
            });

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
