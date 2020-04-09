<template>
    <div>
        <v-app>
            <navigation></navigation>
            <v-layout row>
                <v-flex md3>
                    <v-card class="add-shadow">
                        <v-layout wrap>
                            <v-flex xs12>
                                <sl-vue-tree
                                        v-model="tree_list"
                                        ref="slVueTree"
                                        @toggle="getChildrenProjectsAndOrganizationsFromServer"
                                        :allowMultiselect="false"
                                        @select="onSelectTreeNode"
                                >
                                    <template slot="toggle" slot-scope="{ node }">
                                          <span v-if="node.children">
                                            <v-icon small v-if="!node.isExpanded">arrow_right</v-icon>
                                            <v-icon small v-if="node.isExpanded">arrow_drop_down</v-icon>
                                          </span>
                                    </template>

                                    <template slot="title" slot-scope="{ node }">
                                        <v-icon small v-if="node.data.tree_type === 'organization'">location_city
                                        </v-icon>
                                        {{ node.title }}

                                        <v-tooltip right>
                                            <v-icon small slot="activator" v-if="node.data.tree_type === 'project'"
                                                    :color="node.data.active ? 'success' : ''">access_time
                                            </v-icon>
                                            <span>{{node.data.startfrom | formatDateTime}}</span>
                                        </v-tooltip>
                                    </template>
                                    <template slot="sidebar" slot-scope="{ node }">
                                        <v-menu offset-y v-if="node.isSelected">
                                            <v-icon
                                                    class="pr-1"
                                                    slot="activator"
                                                    color="white"
                                                    dark
                                                    v-if="node.isSelected"
                                            >
                                                settings
                                            </v-icon>
                                            <v-list>
                                                <v-list-tile @click="open_dialog_new_project()">
                                                    <v-list-tile-title>
                                                        <v-icon small slot="activator" color="success"
                                                                class="cursor-pointer">add
                                                        </v-icon>
                                                    </v-list-tile-title>
                                                </v-list-tile>
                                                <v-list-tile @click="open_dialog_edit_project()"
                                                             v-if="node.data.tree_type !== 'organization'">
                                                    <v-list-tile-title>
                                                        <v-icon small color="primary" class="cursor-pointer">edit
                                                        </v-icon>
                                                    </v-list-tile-title>
                                                </v-list-tile>
                                                <v-list-tile @click="dialog_delete_project.show = true"
                                                             v-if="node.data.tree_type !== 'organization'">
                                                    <v-list-tile-title>
                                                        <v-icon small color="error" class="cursor-pointer">clear
                                                        </v-icon>
                                                    </v-list-tile-title>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </template>
                                </sl-vue-tree>
                            </v-flex>
                            <!--<v-flex xs1>-->

                            <!--</v-flex>-->
                        </v-layout>
                    </v-card>
                </v-flex>
                <v-flex md9>
                    <v-card class="table-card">
                        <v-card-title>
                            <h2>
                                <v-icon color="black">list_alt</v-icon>
                                Списки рассылки
                            </h2>
                            <v-spacer></v-spacer>
                            <v-menu offset-y :disabled="outbound_table.checked_table_obj.row_id === null">
                                <v-btn
                                        slot="activator"
                                        color="indigo lighten-2"
                                        dark
                                        :disabled="outbound_table.checked_table_obj.row_id === null"
                                >
                                    <v-icon>settings</v-icon>
                                    Действия
                                    <v-icon>arrow_drop_down</v-icon>
                                </v-btn>

                                <v-list>

                                    <v-list-tile
                                            @click="SaveBtnEditProjectDataUpload('STOPED')"
                                            v-if="outbound_table.checked_table_obj.status === 'PENDING'
                                                || outbound_table.checked_table_obj.status === 'PROGRESS'"
                                    >
                                        <v-list-tile-title>
                                            <v-icon color="#E64A19">pause_circle_outline</v-icon>
                                            Остановить
                                        </v-list-tile-title>
                                    </v-list-tile>

                                    <v-list-tile
                                            @click="SaveBtnEditProjectDataUpload('PENDING')"
                                            v-if="outbound_table.checked_table_obj.status === 'STOPED'">
                                        <v-list-tile-title>
                                            <v-icon color="primary">schedule</v-icon>
                                            Возобновить
                                        </v-list-tile-title>
                                    </v-list-tile>

                                    <v-list-tile @click="OpenBtnEditProjectDataUpload()">
                                        <v-list-tile-title>
                                            <v-icon>edit</v-icon>
                                            Редактировать
                                        </v-list-tile-title>
                                    </v-list-tile>

                                    <v-list-tile @click="outbound_table.dialog_delete.show = true">
                                        <v-list-tile-title>
                                            <v-icon color="red">close</v-icon>
                                            Удалить
                                        </v-list-tile-title>
                                    </v-list-tile>

                                    <v-divider></v-divider>

                                    <v-list-tile @click="OpenDialogRecordsByDPU()">
                                        <v-list-tile-title>
                                            <v-icon>list_alt</v-icon>
                                            Просмотр записей
                                        </v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <v-fade-transition>
                                <v-tooltip top>
                                    <v-btn
                                            color="indigo lighten-2"
                                            fab small dark
                                            slot="activator"
                                            @click="OpenBtnCreateProjectDataUpload()"
                                            v-show="outbound_table.show_add_btn"
                                    >
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                    <span>Создать</span>
                                </v-tooltip>
                            </v-fade-transition>
                        </v-card-title>

                        <v-data-table
                                :headers="outbound_table.headers"
                                :items="outbound_table.list"
                                :loading="outbound_table.loading"
                                hide-actions
                                item-key="row_id"
                        >
                            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                            <template slot="items" slot-scope="props">
                                <!--props.item.row_id === outbound_table.checked_table_obj.row_id ? props.expanded = true : props.expanded = false-->
                                <tr
                                        @click="tableRowClicked(props.item),
                                           props.item.row_id === outbound_table.checked_table_obj.row_id
                                           ? props.expanded = true : props.expanded = false"
                                        :class="{'grey lighten-2': (props.item.row_id === outbound_table.checked_table_obj.row_id)}"
                                >
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.create_dt | formatDateTime}}</td>
                                    <td>{{props.item.sms_amount}}</td>
                                    <td>{{props.item.sms_parts_amount}}</td>
                                    <td>
                                        <span v-if="props.item.project">{{props.item.project.short_name}}</span>
                                        <span v-else>----</span>
                                    </td>
                                    <td>
                                        <v-tooltip top>
                                            <v-icon
                                                    slot="activator"
                                                    :color="props.item.status === 'PENDING' ? 'primary'
                                                    : props.item.status === 'SUCCESS' ? 'success'
                                                    : props.item.status === 'STOPED' ? '#E64A19'
                                                    : props.item.status === 'PROGRESS' ? '#43A047'
                                                    : props.item.status === 'FAILURE' ? 'error' : '' "
                                                    v-html="props.item.status === 'PENDING' ? 'schedule'
                                                    : props.item.status === 'SUCCESS' ? 'done'
                                                    : props.item.status === 'STOPED' ? 'pause_circle_outline'
                                                    : props.item.status === 'PROGRESS' ? 'play_circle_outline'
                                                    : props.item.status === 'FAILURE' ? 'error' : '' "
                                            ></v-icon>
                                            <span>{{props.item.status_changed_date | formatDateTime}}</span>
                                        </v-tooltip>
                                    </td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-slide-y-transition>
                                    <v-card flat color="grey lighten-2"
                                            v-if="props.item.row_id === outbound_table.checked_table_obj.row_id">
                                        <v-card-text>
                                            <span> <strong>Сообщение:</strong> {{props.item.text_all}}</span>
                                            <div v-if="props.item.description">
                                                <p></p>
                                                <span class="pt-4"> <strong>Описание:</strong> {{props.item.description}}</span>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-slide-y-transition>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>


            <v-dialog v-model="dialog_new_project.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Создание проекта</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_new_project.show = false">close</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex md6 xs12 class="pr-2 pl-2">
                                <v-select
                                        label="Организация"
                                        item-text="text"
                                        item-value="value"
                                        :items="dialog_new_project.select_orgs_list"
                                        v-model="dialog_new_project.obj.organization"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 xs12 class="pr-2 pl-2">
                                <v-select
                                        label="Родительский проект"
                                        item-text="text"
                                        item-value="value"
                                        :disabled="dialog_new_project.obj.organization === null"
                                        :items="dialog_new_project.select_projects_list"
                                        v-model="dialog_new_project.obj.parent_project"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 xs8 class="pr-2 pl-2">
                                <DatetimePicker
                                        label="Дата начала"
                                        v-model="dialog_new_project.obj.startfrom"
                                        format="DD.MM.YYYY HH:mm"
                                        locale="ru-ru"
                                        clearText="Очистить"
                                        okText="Сохранить"
                                >
                                </DatetimePicker>
                            </v-flex>
                            <v-flex md3 offset-md1 xs4 class="pr-2 pl-2">
                                <v-switch
                                        v-model="dialog_new_project.obj.active"
                                        :label="dialog_new_project.obj.active === true ? 'Активно' : 'Неактивно'"
                                        color="success"
                                ></v-switch>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-text-field
                                        label="Наименование"
                                        v-model="dialog_new_project.obj.short_name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-select
                                        label="Шлюз"
                                        item-text="text"
                                        item-value="value"
                                        :items="dialog_new_project.select_gateway_list"
                                        v-model="dialog_new_project.obj.gateway"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-textarea
                                        label="Комментарий"
                                        rows="3"
                                        v-model="dialog_new_project.obj.description"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="dialog_new_project.show = false">Закрыть</v-btn>
                        <v-btn color="blue darken-1" flat @click="save_dialog_new_project()">Создать</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog v-model="dialog_edit_project.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Редактирование проекта</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_edit_project.show = false">close</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex md6 xs12 class="pr-2 pl-2">
                                <v-select
                                        label="Организация"
                                        item-text="text"
                                        item-value="value"
                                        :items="dialog_edit_project.select_orgs_list"
                                        v-model="dialog_edit_project.obj.organization"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 xs12 class="pr-2 pl-2">
                                <v-select
                                        label="Родительский проект"
                                        item-text="text"
                                        item-value="value"
                                        :disabled="dialog_edit_project.obj.organization === null"
                                        :items="dialog_edit_project.select_projects_list"
                                        v-model="dialog_edit_project.obj.parent_project"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 xs8 class="pr-2 pl-2">
                                <DatetimePicker
                                        label="Дата начала"
                                        v-model="dialog_edit_project.obj.startfrom"
                                        format="DD.MM.YYYY HH:mm"
                                        locale="ru-ru"
                                        clearText="Очистить"
                                        okText="Сохранить"
                                >
                                </DatetimePicker>
                            </v-flex>
                            <v-flex md3 offset-md1 xs4 class="pr-2 pl-2">
                                <v-switch
                                        v-model="dialog_edit_project.obj.active"
                                        :label="dialog_edit_project.obj.active === true ? 'Активно' : 'Неактивно'"
                                        color="success"
                                ></v-switch>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-text-field
                                        label="Наименование"
                                        v-model="dialog_edit_project.obj.short_name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-select
                                        label="Шлюз"
                                        item-text="text"
                                        item-value="value"
                                        :items="dialog_edit_project.select_gateway_list"
                                        v-model="dialog_edit_project.obj.gateway"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-textarea
                                        label="Комментарий"
                                        rows="3"
                                        v-model="dialog_edit_project.obj.description"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="dialog_edit_project.show = false">Закрыть</v-btn>
                        <v-btn color="blue darken-1" flat @click="save_dialog_edit_project()">Сохранить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog v-model="dialog_delete_project.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Удаление проекта</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="dialog_delete_project.show = false">close</v-icon>
                    </v-card-title>
                    <v-card-text>Вы действительно хотите удалить проект
                        <strong>{{dialog_edit_project.obj.short_name}}</strong>?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" flat @click="deleteProjectAccept()">Удалить</v-btn>
                        <v-btn color="blue darken-1" flat @click="dialog_delete_project.show = false">Закрыть</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="outbound_table.dialog_delete.show" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Удаление рассылки</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="outbound_table.dialog_delete.show = false">close</v-icon>
                    </v-card-title>
                    <v-card-text>Вы действительно хотите удалить рассылку
                        <strong>{{outbound_table.dialog_edit.obj.name}}</strong>?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" flat @click="deleteOutboundProjectDataUpload()">Удалить</v-btn>
                        <v-btn color="blue darken-1" flat @click="outbound_table.dialog_delete.show = false">Закрыть
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="outbound_table.dialog_new.show" persistent max-width="650px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Создание рассылки</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" @click="CloseBtnCreateProjectDataUpload()"
                                :disabled="outbound_table.dialog_new.loading">close
                        </v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-text-field
                                        :disabled="outbound_table.dialog_new.loading"
                                        label="Наименование"
                                        v-model="outbound_table.dialog_new.obj.name"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 class="pl-2 pr-2">
                                <v-flex xs12 style="border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; border: 1px solid darkgray;
                                    border-top-left-radius: 5px; border-top-right-radius: 5px;">
                                    <v-flex xs12 class="pl-2 pr-2"
                                            style="background-color: #EEEEEE; border-top-left-radius: 5px; border-top-right-radius: 5px;"
                                    >
                                        <v-layout wrap>
                                            <h3 class="pt-2">Сообщение</h3>
                                            <v-spacer></v-spacer>
                                            <v-tooltip top style="margin-right: -10px" slot="activator">
                                                <v-btn flat icon small slot="activator"
                                                       v-show="outbound_table.dialog_new.uploaded_file.csv_fieldnames.length > 0">
                                                    <v-icon small color="info">info</v-icon>
                                                </v-btn>
                                                <span>Выберите из появившегося поля снизу, где хранятся телефон и сообщение.<br>
                          Если сообщение не выбрано, будет использовано сообщение из поля 'Сообщение'</span>
                                            </v-tooltip>
                                            <v-chip v-model="outbound_table.dialog_new.uploaded_file.file_active"
                                                    :close="!outbound_table.dialog_new.loading"
                                                    @input="remove_uploaded_file('NEW')">
                                                {{outbound_table.dialog_new.uploaded_file.filename}}
                                            </v-chip>
                                            <v-menu offset-y :disabled="outbound_table.dialog_new.loading">
                                                <v-tooltip top style="margin-right: -10px" slot="activator"
                                                           :disabled="outbound_table.dialog_new.loading">
                                                    <v-btn flat icon small slot="activator"
                                                           v-show="outbound_table.dialog_new.uploaded_file.csv_fieldnames.length > 0"
                                                           :disabled="outbound_table.dialog_new.loading">
                                                        <v-icon small color="black">input</v-icon>
                                                    </v-btn>
                                                    <span>Вставить поле из файла</span>
                                                </v-tooltip>
                                                <v-list>
                                                    <v-list-tile
                                                            v-for="(item, index) in outbound_table.dialog_new.uploaded_file.csv_fieldnames"
                                                            :key="index"
                                                            @click="add_param_to_text(item.value, 'NEW')">
                                                        <v-list-tile-title>{{item.text}}</v-list-tile-title>
                                                    </v-list-tile>
                                                </v-list>
                                            </v-menu>

                                            <v-tooltip top style="margin-right: -10px">
                                                <UploadButton icon small color="#EEEEEE" slot="activator"
                                                              :fileChangedCallback="uploadedFileChanged"
                                                              :disabled="outbound_table.dialog_new.loading">
                                                    <template slot="icon">
                                                        <v-icon small
                                                                :color="outbound_table.dialog_new.uploaded_file.upload_icon_color">
                                                            cloud_upload
                                                        </v-icon>
                                                    </template>
                                                </UploadButton>
                                                <span>Загрузить файл (*.csv)</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                                <v-btn flat icon small slot="activator" @click="translit_text('NEW')"
                                                       :disabled="outbound_table.dialog_new.loading">
                                                    <v-icon small color="#03A9F4">g_translate</v-icon>
                                                </v-btn>
                                                <span>Транслит</span>
                                            </v-tooltip>
                                        </v-layout>
                                    </v-flex>
                                    <v-divider></v-divider>
                                    <v-textarea
                                            :disabled="outbound_table.dialog_new.loading"
                                            style="margin-bottom: -28px"
                                            color="black"
                                            solo
                                            rows="5"
                                            v-model="outbound_table.dialog_new.obj.text_all"
                                    ></v-textarea>
                                    <v-slide-y-transition>
                                        <v-layout wrap
                                                  v-if="outbound_table.dialog_new.uploaded_file.csv_fieldnames.length > 0"
                                                  style="background-color: #F5F5F5">
                                            <v-flex md6 xs12 class="pr-2 pl-2 pt-2">
                                                <v-select
                                                        :disabled="outbound_table.dialog_new.loading"
                                                        label="Номер телефона"
                                                        item-text="text"
                                                        item-value="value"
                                                        :items="outbound_table.dialog_new.uploaded_file.csv_fieldnames_select"
                                                        v-model="outbound_table.dialog_new.obj.field_number"
                                                ></v-select>
                                            </v-flex>

                                            <v-flex md6 xs12 class="pr-2 pl-2 pt-2">
                                                <v-select
                                                        :disabled="outbound_table.dialog_new.loading"
                                                        label="Текст сообщения"
                                                        item-text="text"
                                                        item-value="value"
                                                        :items="outbound_table.dialog_new.uploaded_file.csv_fieldnames_select"
                                                        v-model="outbound_table.dialog_new.obj.field_sms_text"
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-slide-y-transition>

                                </v-flex>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2 pt-2">
                                <v-textarea
                                        :disabled="outbound_table.dialog_new.loading"
                                        label="Комментарий"
                                        rows="3"
                                        v-model="outbound_table.dialog_new.obj.description"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2 pt-2">
                                <v-layout wrap>
                                    <v-flex xs11>
                                        <v-progress-linear
                                                color="primary"
                                                height="5"
                                                v-if="outbound_table.dialog_new.loading"
                                                :value="outbound_table.dialog_new.percentage"
                                        ></v-progress-linear>
                                    </v-flex>
                                    <v-flex xs1>
                                        <span v-if="outbound_table.dialog_new.loading" class="pl-3">{{outbound_table.dialog_new.percentage}}%</span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="CloseBtnCreateProjectDataUpload()"
                               :disabled="outbound_table.dialog_new.loading">Закрыть
                        </v-btn>
                        <v-btn color="blue darken-1" flat @click="SaveBtnCreateProjectDataUpload()"
                               :disabled="outbound_table.dialog_new.loading">Создать
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog v-model="outbound_table.dialog_edit.show" persistent max-width="650px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Редактирование рассылки</span>
                        <v-spacer></v-spacer>
                        <v-icon color="black" :disabled="outbound_table.dialog_edit.loading"
                                @click="CloseBtnEditProjectDataUpload()">close
                        </v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout wrap>
                            <v-flex xs12 class="pl-2 pr-2">
                                <v-text-field
                                        :disabled="outbound_table.dialog_edit.loading"
                                        label="Наименование"
                                        v-model="outbound_table.dialog_edit.obj.name"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs12 class="pl-2 pr-2">
                                <v-flex xs12 style="border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; border: 1px solid darkgray;
                                    border-top-left-radius: 5px; border-top-right-radius: 5px;">
                                    <v-flex xs12 class="pl-2 pr-2"
                                            style="background-color: #EEEEEE; border-top-left-radius: 5px; border-top-right-radius: 5px;"
                                    >
                                        <v-layout wrap>
                                            <h3 class="pt-2">Сообщение</h3>
                                            <v-spacer></v-spacer>
                                            <v-tooltip top style="margin-right: -10px" slot="activator">
                                                <v-btn flat icon small slot="activator"
                                                       v-show="outbound_table.dialog_edit.uploaded_file.csv_fieldnames.length > 0">
                                                    <v-icon small color="info">info</v-icon>
                                                </v-btn>
                                                <span>Выберите из появившегося поля снизу, где хранятся телефон и сообщение.<br>
                          Если сообщение не выбрано, то будет использовано сообщение из поля 'Сообщение'</span>
                                            </v-tooltip>
                                            <v-chip v-model="outbound_table.dialog_edit.uploaded_file.file_active">
                                                {{outbound_table.dialog_edit.uploaded_file.filename}}
                                            </v-chip>
                                            <v-menu offset-y :disabled="outbound_table.dialog_edit.loading">
                                                <v-tooltip top style="margin-right: -10px" slot="activator"
                                                           :disabled="outbound_table.dialog_edit.loading">
                                                    <v-btn flat icon small slot="activator"
                                                           :disabled="outbound_table.dialog_edit.loading"
                                                           v-show="outbound_table.dialog_edit.uploaded_file.csv_fieldnames.length > 0">
                                                        <v-icon small color="black">input</v-icon>
                                                    </v-btn>
                                                    <span>Вставить поле из файла</span>
                                                </v-tooltip>
                                                <v-list>
                                                    <v-list-tile
                                                            v-for="(item, index) in outbound_table.dialog_edit.uploaded_file.csv_fieldnames"
                                                            :key="index"
                                                            @click="add_param_to_text(item.value, 'EDIT')">
                                                        <v-list-tile-title>{{item.text}}</v-list-tile-title>
                                                    </v-list-tile>
                                                </v-list>
                                            </v-menu>

                                            <v-tooltip top>
                                                <v-btn flat icon small slot="activator" @click="translit_text('EDIT')"
                                                       :disabled="outbound_table.dialog_edit.loading"
                                                >
                                                    <v-icon small color="#03A9F4">g_translate</v-icon>
                                                </v-btn>
                                                <span>Транслит</span>
                                            </v-tooltip>
                                        </v-layout>
                                    </v-flex>
                                    <v-divider></v-divider>
                                    <v-textarea
                                            :disabled="outbound_table.dialog_edit.loading"
                                            style="margin-bottom: -28px"
                                            solo
                                            color="black"
                                            rows="5"
                                            v-model="outbound_table.dialog_edit.obj.text_all"
                                    ></v-textarea>
                                    <v-slide-y-transition>
                                        <v-layout wrap
                                                  v-if="outbound_table.dialog_edit.uploaded_file.csv_fieldnames.length > 0"
                                                  style="background-color: #F5F5F5">
                                            <v-flex md6 xs12 class="pr-2 pl-2 pt-2">
                                                <v-select
                                                        disabled
                                                        label="Номер телефона"
                                                        item-text="text"
                                                        item-value="value"
                                                        :items="outbound_table.dialog_edit.uploaded_file.csv_fieldnames_select"
                                                        v-model="outbound_table.dialog_edit.obj.field_number"
                                                ></v-select>
                                            </v-flex>

                                            <v-flex md6 xs12 class="pr-2 pl-2 pt-2">
                                                <v-select
                                                        :disabled="outbound_table.dialog_edit.loading"
                                                        label="Текст сообщения"
                                                        item-text="text"
                                                        item-value="value"
                                                        :items="outbound_table.dialog_edit.uploaded_file.csv_fieldnames_select"
                                                        v-model="outbound_table.dialog_edit.obj.field_sms_text"
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-slide-y-transition>

                                </v-flex>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2 pt-2">
                                <v-textarea
                                        :disabled="outbound_table.dialog_edit.loading"
                                        label="Комментарий"
                                        rows="3"
                                        v-model="outbound_table.dialog_edit.obj.description"
                                ></v-textarea>
                            </v-flex>
                            <v-flex xs12 class="pl-2 pr-2 pt-2">
                                <v-layout wrap>
                                    <v-flex xs11>
                                        <v-progress-linear
                                                color="primary"
                                                height="5"
                                                v-if="outbound_table.dialog_edit.loading"
                                                :value="outbound_table.dialog_edit.percentage"
                                        ></v-progress-linear>
                                    </v-flex>
                                    <v-flex xs1>
                    <span v-if="outbound_table.dialog_edit.loading" class="pl-3">
                      {{outbound_table.dialog_edit.percentage}}%
                    </span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="CloseBtnEditProjectDataUpload()"
                               :disabled="outbound_table.dialog_edit.loading">Закрыть
                        </v-btn>
                        <v-btn color="blue darken-1" flat @click="SaveBtnEditProjectDataUpload()"
                               :disabled="outbound_table.dialog_edit.loading">Сохранить
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog v-model="outbound_table.view_records.show_dialog" fullscreen hide-overlay>
                <v-card style="background-color: #F5F5F5">
                    <v-toolbar dark color="grey lighten-2">
                        <v-btn icon dark @click="CloseDialogRecordsByDPU()">
                            <v-icon class="black--text">close</v-icon>
                        </v-btn>
                        <v-toolbar-title class="black--text">Список отправки по рассылке
                            '{{outbound_table.dialog_edit.obj.name}}'
                        </v-toolbar-title>
                        <v-spacer></v-spacer>

                        <span class="black--text">
                          <strong style="color: black; cursor: pointer;"
                                  @click="getDataProjectUploadRecordsList('', '')">
                            Всего:
                          </strong>
                          {{outbound_table.view_records.table.statistics_numbers.ALL}}
                        </span>

                        <span class="pl-3 black--text">
              <strong style="color: cornflowerblue; cursor: pointer;"
                      @click="getDataProjectUploadRecordsList('', 'PENDING')">
                Ожидают:</strong>
              {{outbound_table.view_records.table.statistics_numbers.PENDING}}
            </span>
                        <span class="pl-3 black--text">
              <strong style="color: green; cursor: pointer;" @click="getDataProjectUploadRecordsList('', 'SUCCESS')">
                Успешно:
              </strong>
              {{outbound_table.view_records.table.statistics_numbers.SUCCESS}}
            </span>
                        <span class="pl-3 black--text">
              <strong style="color: red; cursor: pointer;" @click="getDataProjectUploadRecordsList('', 'REJECTED')">
                Отклонено:
              </strong>
              {{outbound_table.view_records.table.statistics_numbers.REJECTED}}
            </span>

                        <v-spacer></v-spacer>
                        <v-tooltip bottom class="pr-2">
                            <img
                                    @click="generate_xml_file()"
                                    src="/static/pictures/web_excel.png"
                                    width="20"
                                    height="20"
                                    slot="activator"
                                    style="cursor: pointer;">
                            <span>Выгрузить в Excel</span>
                        </v-tooltip>

                        <v-toolbar-items>
                            <v-btn dark flat @click="CloseDialogRecordsByDPU()" class="black--text">
                                Закрыть
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card>
                        <v-data-table
                                :headers="outbound_table.view_records.table.headers"
                                :items="outbound_table.view_records.table.list"
                                :loading="outbound_table.view_records.table.loading"
                                hide-actions
                        >
                            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>
                                        <v-tooltip bottom class="pr-2">
                                            <v-icon slot="activator"
                                                    :color="props.item.status === 'PENDING' ? 'primary'
                                                          : props.item.status === 'SUCCESS' ? 'success'
                                                          : props.item.status === 'STOPED' ? '#E64A19'
                                                          : props.item.status === 'SENT_TO_MODEM' ? 'primary'
                                                          : props.item.status === 'MODEM_REJECTED' ? 'error'
                                                          : props.item.status === 'REJECTED' ? 'error' : '' "
                                                    v-html="props.item.status === 'PENDING' ? 'schedule'
                                                          : props.item.status === 'SUCCESS' ? 'done'
                                                          : props.item.status === 'STOPED' ? 'pause_circle_outline'
                                                          : props.item.status === 'SENT_TO_MODEM' ? 'router'
                                                          : props.item.status === 'MODEM_REJECTED' ? 'router'
                                                          : props.item.status === 'REJECTED' ? 'error' : '' "
                                            ></v-icon>
                                            <span v-if="props.item.status === 'REJECTED'">{{props.item.error_msg}}</span>
                                            <span v-else-if="props.item.status === 'SUCCESS'">Отправлено</span>
                                            <span v-else-if="props.item.status === 'PENDING'">Ожидает</span>
                                            <span v-else-if="props.item.status === 'STOPED'">Остановлено</span>
                                            <span v-else-if="props.item.status === 'SENT_TO_MODEM'">Отправлено модему</span>
                                            <span v-else-if="props.item.status === 'MODEM_REJECTED'">Отклонено модемом</span>
                                        </v-tooltip>
                                    </td>
                                    <td>{{ props.item.phone }}</td>
                                    <td>{{ props.item.text }}</td>
                                    <td>{{ props.item.sms_parts }}</td>
                                    <td>{{ props.item.character_amount }}</td>
                                    <td>{{ props.item.language }}</td>
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
                                    :items="outbound_table.view_records.table.pagination.rows_per_page_list"
                                    v-model="outbound_table_view_records_table_pagination_rowPerPage"
                            ></v-select>
                            <div class="paginator-small-spacer-2r"/>
                            <p v-if="outbound_table.view_records.table.pagination.totalItems !== 0">
                                {{outbound_table.view_records.table.pagination.left_num}}-{{outbound_table.view_records.table.pagination.right_num}}
                                из {{outbound_table.view_records.table.pagination.totalItems}}
                            </p>
                            <p v-else>&mdash;</p>
                            <div class="paginator-small-spacer-1r"/>
                            <v-btn icon small class="paginator-margin-03rem-top-reversed"
                                   @click="previous_page_click_DialogRecordsByDPU_table()"
                                   :disabled="!outbound_table.view_records.table.pagination.previous">
                                <v-icon
                                        :color="!outbound_table.view_records.table.pagination.previous ? '' : 'grey darken-4'">
                                    keyboard_arrow_left
                                </v-icon>
                            </v-btn>
                            <v-btn icon small class="paginator-margin-03rem-top-reversed paginator-last-action-btn"
                                   @click="next_page_click_DialogRecordsByDPU_table()"
                                   :disabled="!outbound_table.view_records.table.pagination.next">
                                <v-icon
                                        :color="!outbound_table.view_records.table.pagination.next ? '' : 'grey darken-4'">
                                    keyboard_arrow_right
                                </v-icon>
                            </v-btn>
                        </v-layout>
                    </v-card>
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
    import DatetimePicker from '../custom_components/DatetimePicker.vue'
    import UploadButton from 'vuetify-upload-button';

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const default_headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
        // 'Authorization': 'bearer ' + document.getElementsByName('csrfmiddlewaretoken')[0].value
    };

    var generate_empty_project_obj = () => {
        return {
            description: '',
            name: '',
            short_name: '',
            active: true,
            startfrom: '',
            parent: null,
            parent_project: null,
            organization: null,
            select_orgs_list: [],
            select_projects_list: [{text: '-----', value: null}],
            gateway: 0,
        };
    };

    var generate_empty_project_data_upload_obj = () => {
        return {
            name: '',
            active: false,
            text_all: '',
            file_name: '',
            original_file_name: '',
            field_number: '',
            field_sms_text: '',
            description: '',
            parent: null,
            row_id: null,
            status: '',
            status_changed_date: '',
            sms_amount: 0,
            sms_parts_amount: 0,
        }
    };

    var generate_empy_upload_file_obj = () => {
        return {
            file: null,
            file_active: false,
            filename: '',
            csv_fieldnames: [],
            csv_fieldnames_select: [{text: '-----', value: ''}],
            upload_icon_color: '',
        }
    };

    var generate_empy_pagination_obj = () => {
        return {
            page: 1,
            totalItems: 0,
            rows_per_page_list: [10, 15, 25, 50],
            next: null,
            previous: null,
            filter: '',
            left_num: 0,
            right_num: 0
        }
    };

    var generate_empy_statistics_obj = () => {
        return {
            PENDING: 0,
            REJECTED: 0,
            SUCCESS: 0,
            ALL: 0,
        }
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

    var calculate_paginator_rows = (page, rowPerPage, total) => {
        let left_num = ((page - 1) * rowPerPage) + 1;
        let right_num = page * rowPerPage;
        if (right_num > total) {
            right_num = right_num - (right_num - total);
        }
        return ({left_num: left_num, right_num: right_num});
    };

    var sleep = (ms) => {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    };


    export default {
        data() {
            return {
                myFile: null,
                selected_node: {},
                user: {
                    obj: {},
                    permissions: [],
                },
                dialog_new_project: {
                    node: {},
                    obj: generate_empty_project_obj(),
                    select_orgs_list: [],
                    select_projects_list: [{text: '-----', value: null}],
                    select_gateway_list: [],
                    totaly_new: false,
                    show: false,
                },
                dialog_edit_project: {
                    node: {},
                    obj: generate_empty_project_obj(),
                    select_orgs_list: [],
                    select_projects_list: [{text: '-----', value: null}],
                    select_gateway_list: [],
                    show: false
                },
                watching_data_for_comparison: {
                    dialog_new_project: {
                        last_parent_organization: null,
                        last_project_row_id: null,
                        last_organization_id: null,
                    },
                    dialog_totaly_new_project: {
                        last_parent_organization: null,
                        last_project_row_id: null,
                        last_organization_id: null,
                    },
                    dialog_edit_project: {
                        last_parent_organization: null,
                        last_project_row_id: null,
                        last_organization_id: null,
                    },
                },
                dialog_delete_project: {
                    show: false,
                },
                tree_list: [],
                outbound_table_view_records_table_pagination_rowPerPage: 10,
                outbound_table: {
                    list: [],
                    headers: [
                        {text: 'Название рассылки', sortable: false, value: "name"},
                        {text: 'Дата загрузки', sortable: false, value: "create_dt"},
                        {text: 'Количество SMS', sortable: false, value: "sms_amount"},
                        {text: 'Количество частей SMS', sortable: false, value: "sms_parts_amount"},
                        {text: 'Проект', sortable: false, value: "project.short_name"},
                        {text: 'Статус', sortable: false, value: "status"},
                    ],
                    loading: false,
                    checked_table_obj: generate_empty_project_data_upload_obj(),
                    show_add_btn: false,
                    dialog_delete: {
                        show: false
                    },
                    dialog_edit: {
                        percentage: 0,
                        loading: false,
                        obj: generate_empty_project_data_upload_obj(),
                        uploaded_file: generate_empy_upload_file_obj(),
                        show: false,
                    },
                    dialog_new: {
                        percentage: 0,
                        loading: false,
                        obj: generate_empty_project_data_upload_obj(),
                        uploaded_file: generate_empy_upload_file_obj(),
                        show: false,
                    },
                    view_records: {
                        filter_list: {},
                        show_dialog: false,
                        table: {
                            choise_list: [{text: '----', value: ''}],
                            choise_value: '',
                            list: [],
                            loading: false,
                            headers: [
                                {text: 'Статус', value: 'status', sortable: false},
                                {text: 'Телефон', value: 'phone', sortable: false},
                                {text: 'Текст', value: 'text', sortable: false},
                                {text: 'Частей SMS', value: 'sms_parts', sortable: false},
                                {text: 'Символов', value: 'character_amount', sortable: false},
                                {text: 'Язык', value: 'language', sortable: false},
                            ],
                            statistics_numbers: generate_empy_statistics_obj(),
                            pagination: generate_empy_pagination_obj(),
                        },
                    },
                },
                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },
            };
        },

        methods: {

            cs_log(item) {
                console.log(item);
            },

            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },

            generate_xml_file() {
                let post_params = {
                    model_name: 'DATA_PROJECT_ROW_SMS',
                    filter_list: this.outbound_table.view_records.filter_list,
                };
                axios.post('/rest_api/generate_xmlfile_with_params/', post_params, {headers: default_headers})
                    .then(resp => {
                        console.log(resp.data);
                        window.location.href = "/media/xls/" + resp.data;
                        this.snackbar_show('Генерация Excel прошла успешно');
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка генерации Excel файла', 'error');
                });
                console.log(post_params);
            },

            // Records by DPU (DPU = Data Project Upload)

            getDataProjectUploadRecordsList(url = '', status = '') {
                this.outbound_table.view_records.table.loading = true;
                this.outbound_table.view_records.filter_list = [];
                this.outbound_table.view_records.filter_list = {
                    distribution_id: this.outbound_table.dialog_edit.obj.row_id,
                    status: status
                };
                if (!url) {
                    this.outbound_table.view_records.table.pagination.page = 1;
                    url = ('/rest_api/distributions/records/list/?distribution_ides='
                        + this.outbound_table.dialog_edit.obj.row_id
                        + '&page_size=' + this.outbound_table_view_records_table_pagination_rowPerPage
                        + '&page=' + this.outbound_table.view_records.table.pagination.page
                        + '&status=' + status);
                }
                axios.get(url)
                    .then(resp => {
                        this.save_pagination_data_DialogRecordsByDPU_table(resp.data);
                        this.outbound_table.view_records.table.list = [];
                        resp.data.results.forEach(element => {
                            this.outbound_table.view_records.table.list.push(element);
                        });
                        this.outbound_table.view_records.table.loading = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.outbound_table.view_records.table.loading = false;
                    this.snackbar_show("Ошибка получения записей", 'error')
                });
                axios.get('/rest_api/distributions/records/statistics/?distribution_id='
                    + this.outbound_table.dialog_edit.obj.row_id)
                    .then(resp => {
                        if (resp.data) {
                            resp.data.forEach(element => {
                                console.log(element);
                                if (element.status === 'PENDING') {
                                    this.outbound_table.view_records.table.statistics_numbers.PENDING = element.value
                                } else if (element.status === 'REJECTED') {
                                    this.outbound_table.view_records.table.statistics_numbers.REJECTED = element.value
                                } else if (element.status === 'SUCCESS') {
                                    this.outbound_table.view_records.table.statistics_numbers.SUCCESS = element.value
                                } else if (element.status === 'ALL') {
                                    this.outbound_table.view_records.table.statistics_numbers.ALL = element.value
                                }
                            })
                        }
                    }).catch(err => {
                    console.log(err.response);
                });
            },

            OpenDialogRecordsByDPU() {
                this.getDataProjectUploadRecordsList();
                this.outbound_table.view_records.show_dialog = true;
            },

            CloseDialogRecordsByDPU() {
                this.outbound_table.view_records.show_dialog = false;
                this.outbound_table.view_records.table.list = [];
                this.outbound_table.view_records.table.loading = false;
                this.outbound_table.view_records.table.pagination = generate_empy_pagination_obj();
            },

            save_pagination_data_DialogRecordsByDPU_table(data) {
                this.outbound_table.view_records.table.pagination.totalItems = data.count;
                this.outbound_table.view_records.table.pagination.next = data.next;
                this.outbound_table.view_records.table.pagination.previous = data.previous;
                let pag_nums = calculate_paginator_rows(this.outbound_table.view_records.table.pagination.page,
                    this.outbound_table_view_records_table_pagination_rowPerPage,
                    this.outbound_table.view_records.table.pagination.totalItems);
                this.outbound_table.view_records.table.pagination.left_num = pag_nums.left_num;
                this.outbound_table.view_records.table.pagination.right_num = pag_nums.right_num;
            },

            next_page_click_DialogRecordsByDPU_table() {
                this.outbound_table.view_records.table.pagination.page++;
                this.getDataProjectUploadRecordsList(this.outbound_table.view_records.table.pagination.next);
            },

            previous_page_click_DialogRecordsByDPU_table() {
                this.outbound_table.view_records.table.pagination.page--;
                this.getDataProjectUploadRecordsList(this.outbound_table.view_records.table.pagination.previous);
            },

            OpenBtnCreateProjectDataUpload() {
                this.outbound_table.dialog_new.uploaded_file = generate_empy_upload_file_obj();
                this.outbound_table.dialog_new.obj = generate_empty_project_data_upload_obj();
                this.outbound_table.dialog_new.show = true;
            },

            // Project Data Upload

            CloseBtnCreateProjectDataUpload() {
                this.outbound_table.dialog_new.show = false;
                this.outbound_table.dialog_new.uploaded_file = generate_empy_upload_file_obj();
                this.outbound_table.dialog_new.obj = generate_empty_project_data_upload_obj();
            },

            async check_taskID_status_DPU_loading(task_id, type, object) {
                try {
                    let res = await axios.get('/rest_api/check_celery_task_id_status/?task_id=' + task_id, {headers: default_headers});
                    let status = res.data.status;
                    if (type === 'NEW') {
                        if (res.data.progress_data !== null) {
                            this.outbound_table.dialog_new.percentage = res.data.progress_data.persantage;
                        } else {
                            this.outbound_table.dialog_new.percentage = 0;
                        }
                        if ((status === 'PENDING') || (status === 'PROGRESS')) {
                            this.check_taskID_status_DPU_loading(task_id, type, object);
                        } else {
                            this.outbound_table.dialog_new.loading = false;
                            this.snackbar_show('Рассылка успешно создана');
                            this.CloseBtnCreateProjectDataUpload();
                        }
                    } else if (type === 'EDIT') {
                        if (res.data.progress_data !== null) {
                            this.outbound_table.dialog_edit.percentage = res.data.progress_data.persantage;
                        } else {
                            this.outbound_table.dialog_edit.percentage = 0;
                        }
                        if ((status === 'PENDING') || (status === 'PROGRESS')) {
                            this.check_taskID_status_DPU_loading(task_id, type, object);
                        } else {
                            let index = get_index_of_array_by_id(this.outbound_table.list, this.outbound_table.dialog_edit.obj.row_id);
                            this.outbound_table.list.splice(index, 1, res.data.progress_data.DPU_obj);
                            this.outbound_table.dialog_edit.obj = Object.assign({}, res.data.progress_data.DPU_obj);
                            this.outbound_table.checked_table_obj = Object.assign({}, res.data.progress_data.DPU_obj);
                            this.snackbar_show('Рассылка успешно изменена');
                            this.outbound_table.dialog_edit.loading = false;
                            this.outbound_table.dialog_edit.show = false;
                        }
                    }
                    sleep(1000);
                } catch (err) {
                    console.log(err.message);
                    return err
                }
            },


            SaveBtnCreateProjectDataUpload() {
                if (this.outbound_table.dialog_new.obj.name.replace(/\s/g, "").length === 0) {
                    this.snackbar_show("Невозможно сохранить рассылку без названия", 'error');
                } else if (!this.outbound_table.dialog_new.uploaded_file.file) {
                    this.snackbar_show("Не загружен файл для рассылки", 'error');
                    this.outbound_table.dialog_new.uploaded_file.upload_icon_color = 'error';
                } else if ((this.outbound_table.dialog_new.obj.text_all.replace(/\s/g, "").length === 0)
                    && (!this.outbound_table.dialog_new.obj.field_sms_text)) {
                    this.snackbar_show("Заполните поле 'Сообщение' или выберите его из файла в поле 'Текст сообщения'", 'error')
                } else if (!this.outbound_table.dialog_new.obj.field_number) {
                    this.snackbar_show("Поле 'Номер телефона' не заполнено", 'error')
                } else {
                    this.outbound_table.dialog_new.loading = true;
                    let post_params = {
                        name: this.outbound_table.dialog_new.obj.name,
                        text_all: this.outbound_table.dialog_new.obj.text_all,
                        field_sms_text: this.outbound_table.dialog_new.obj.field_sms_text,
                        field_number: this.outbound_table.dialog_new.obj.field_number,
                        description: this.outbound_table.dialog_new.obj.description,
                        project: this.dialog_edit_project.obj.row_id
                    };
                    console.log(post_params);
                    axios.post('/rest_api/distributions/', post_params, {headers: default_headers})
                        .then(resp => {
                            let data_project_uplad_obj = resp.data;
                            //save file to obj
                            let formData = new FormData();
                            formData.append('file', this.outbound_table.dialog_new.uploaded_file.file);
                            formData.append('action_type', "save");
                            formData.append('project_row_id', resp.data.row_id);
                            axios.post('/rest_api/distributions/file/', formData, {headers: {'Content-Type': 'multipart/form-data'}})
                                .then(resp => {
                                    //check status of celery task
                                    if (resp.data.task_id) {
                                        this.outbound_table.dialog_new.loading = true;
                                        let status = 'PENDING';
                                        this.check_taskID_status_DPU_loading(resp.data.task_id, 'NEW', null);
                                        this.outbound_table.list.push(data_project_uplad_obj);
                                    }
                                }).catch(err => {
                                console.log(err.response);
                                axios.delete('/rest_api/distributions/?pk=' + data_project_uplad_obj.row_id)
                                    .catch(err => {
                                        console.log(err.response);
                                    });
                                this.outbound_table.dialog_new.loading = false;
                                this.snackbar_show('Ошибка при создании рассылки (сохранение файла)', 'error');
                            });
                        })
                }
            },

            OpenBtnEditProjectDataUpload() {
                this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames_select = [{text: '----', value: ''}];
                this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames = [];
                this.outbound_table.dialog_edit.uploaded_file.filename = '';
                this.outbound_table.dialog_edit.uploaded_file.file_active = false;
                if (this.outbound_table.dialog_edit.obj.file_name) {
                    axios.get('/rest_api/distributions/file/?file_name=' + this.outbound_table.dialog_edit.obj.file_name, {headers: default_headers})
                        .then(resp => {
                            if (!resp.data.error) {
                                resp.data.fieldnames.forEach(element => {
                                    this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames.push({
                                        text: element,
                                        value: element
                                    });
                                    this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames_select.push({
                                        text: element,
                                        value: element
                                    });
                                });
                                if (this.outbound_table.dialog_edit.obj.original_file_name) {
                                    this.outbound_table.dialog_edit.uploaded_file.filename = this.outbound_table.dialog_edit.obj.original_file_name;
                                } else {
                                    this.outbound_table.dialog_edit.uploaded_file.filename = this.outbound_table.dialog_edit.obj.file_name;
                                }
                                this.outbound_table.dialog_edit.uploaded_file.file_active = true;
                            } else {
                                this.snackbar_show(resp.data.error, 'error')
                            }
                        })
                        .catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка обработки прикрепленного файла', 'error')
                        });
                }
                this.outbound_table.dialog_edit.show = true;
            },

            CloseBtnEditProjectDataUpload() {
                this.outbound_table.dialog_edit.obj = Object.assign({}, this.outbound_table.checked_table_obj);
                this.outbound_table.dialog_edit.show = false;
            },

            SaveBtnEditProjectDataUpload(update_to_status = '') {
                console.log(update_to_status);
                if (!update_to_status) {
                    if (this.outbound_table.dialog_edit.obj.name.replace(/\s/g, "").length === 0) {
                        this.snackbar_show("Невозможно сохранить рассылку без названия", 'error');
                    } else if ((this.outbound_table.dialog_edit.obj.text_all.replace(/\s/g, "").length === 0)
                        && (!this.outbound_table.dialog_edit.obj.field_sms_text)) {
                        this.snackbar_show("Заполните поле 'Сообщение' или выберите его из файла в поле 'Текст сообщения'", 'error')
                    } else if (!this.outbound_table.dialog_edit.obj.field_number) {
                        this.snackbar_show("Поле 'Номер телефона' не заполнено", 'error')
                    } else {
                        let post_params = {
                            name: this.outbound_table.dialog_edit.obj.name,
                            text_all: this.outbound_table.dialog_edit.obj.text_all,
                            field_sms_text: this.outbound_table.dialog_edit.obj.field_sms_text,
                            field_number: this.outbound_table.dialog_edit.obj.field_number,
                            description: this.outbound_table.dialog_edit.obj.description,
                        };
                        console.log('post_params1');
                        console.log(post_params);
                        axios.put('/rest_api/distributions/?pk=' + this.outbound_table.dialog_edit.obj.row_id, post_params, {headers: default_headers})
                            .then(resp => {
                                if (resp.data.task_id) {
                                    this.outbound_table.dialog_edit.loading = true;
                                    this.check_taskID_status_DPU_loading(resp.data.task_id, 'EDIT', resp.data.object);
                                } else {
                                    this.outbound_table.list
                                        .splice(get_index_of_array_by_id(this.outbound_table.list, this.outbound_table.dialog_edit.obj.row_id), 1, resp.data.object);
                                    this.outbound_table.dialog_edit.obj = Object.assign({}, resp.data.object);
                                    this.outbound_table.checked_table_obj = Object.assign({}, resp.data.object);
                                    this.snackbar_show('Рассылка успешно изменена');
                                    this.outbound_table.dialog_edit.show = false;
                                }
                            }).catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка при изменении рассылки: ' + err.response, 'error');
                        })
                    }
                } else {
                    let post_params = {
                        status: update_to_status,
                        what_to_do: 'UPDATE_STATUS',
                    };
                    console.log('post_params2');
                    console.log(post_params);
                    axios.put('/rest_api/distributions/?pk=' + this.outbound_table.dialog_edit.obj.row_id, post_params, {headers: default_headers})
                        .then(resp => {
                            let index = get_index_of_array_by_id(this.outbound_table.list, this.outbound_table.dialog_edit.obj.row_id);
                            this.outbound_table.list.splice(index, 1, resp.data.object);
                            this.outbound_table.dialog_edit.obj = Object.assign({}, resp.data.object);
                            this.outbound_table.checked_table_obj = Object.assign({}, resp.data.object);
                            this.snackbar_show('Статус рассылки успешно изменен');
                        }).catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при изменении статуса рассылки', 'error');
                    })
                }
            },

            remove_uploaded_file(type) {
                this.outbound_table.dialog_new.uploaded_file = generate_empy_upload_file_obj();
                if (type === 'NEW') {
                    this.outbound_table.dialog_new.obj.text_all = '';
                }
            },

            translit_text(type) {
                let text = '';
                if (type === 'NEW') {
                    text = this.outbound_table.dialog_new.obj.text_all
                } else if (type === 'EDIT') {
                    text = this.outbound_table.dialog_edit.obj.text_all
                }
                axios.get('/rest_api/translit_text/?text=' + text, {headers: default_headers})
                    .then(resp => {
                        if (type === 'NEW') {
                            this.outbound_table.dialog_new.obj.text_all = resp.data;
                        } else if (type === 'EDIT') {
                            this.outbound_table.dialog_edit.obj.text_all = resp.data
                        }
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show("Ошибка транслита", 'error');
                })
            },

            add_param_to_text(item_value, type) {
                if (type === 'NEW') {
                    let current_text = this.outbound_table.dialog_new.obj.text_all;
                    this.outbound_table.dialog_new.obj.text_all = current_text.concat("{{" + item_value + "}}");
                } else if (type === 'EDIT') {
                    let current_text = this.outbound_table.dialog_edit.obj.text_all;
                    this.outbound_table.dialog_edit.obj.text_all = current_text.concat("{{" + item_value + "}}");
                }
            },

            uploadedFileChanged(file) {
                let file_format = file.name.split('.').pop();
                console.log(file_format);
                console.log(file);
                if (file) {
                    if (file_format === 'csv') {
                        console.log(file_format);
                        this.outbound_table.dialog_new.uploaded_file.csv_fieldnames = [];
                        this.outbound_table.dialog_new.uploaded_file.csv_fieldnames_select = [{
                            text: '-----',
                            value: ''
                        }];
                        let formData = new FormData();
                        formData.append('file', file);
                        formData.append('action_type', "get_fieldnames");
                        axios.post('/rest_api/distributions/file/', formData, {headers: {'Content-Type': 'multipart/form-data'}})
                            .then(resp => {
                                if (!resp.data.error) {
                                    this.outbound_table.dialog_new.uploaded_file.file = file;
                                    this.outbound_table.dialog_new.uploaded_file.filename = resp.data.filename;
                                    this.outbound_table.dialog_new.uploaded_file.file_active = true;
                                    this.outbound_table.dialog_new.uploaded_file.upload_icon_color = 'success';
                                    this.outbound_table.dialog_new.obj.field_number = '';
                                    this.outbound_table.dialog_new.obj.field_sms_text = '';
                                    resp.data.fieldnames.forEach(element => {
                                        this.outbound_table.dialog_new.uploaded_file.csv_fieldnames.push({
                                            text: element,
                                            value: element
                                        });
                                        this.outbound_table.dialog_new.uploaded_file.csv_fieldnames_select.push({
                                            text: element,
                                            value: element
                                        });
                                    });
                                } else {
                                    this.outbound_table.dialog_new.uploaded_file.file = null;
                                    this.outbound_table.dialog_new.uploaded_file.filename = '';
                                    this.outbound_table.dialog_new.uploaded_file.file_active = false;
                                    this.outbound_table.dialog_new.uploaded_file.csv_fieldnames = [];
                                    this.outbound_table.dialog_new.uploaded_file.upload_icon_color = 'error';
                                    this.outbound_table.dialog_new.obj.field_number = '';
                                    this.outbound_table.dialog_new.obj.field_sms_text = '';
                                    this.snackbar_show(resp.data.error, 'error');
                                }
                            }).catch(err => {
                            console.log(err.response);
                        });
                    } else {
                        this.outbound_table.dialog_new.uploaded_file.file = null;
                        this.outbound_table.dialog_new.uploaded_file.filename = '';
                        this.outbound_table.dialog_new.uploaded_file.file_active = false;
                        this.outbound_table.dialog_new.uploaded_file.csv_fieldnames = [];
                        this.outbound_table.dialog_new.uploaded_file.upload_icon_color = 'error';
                        this.outbound_table.dialog_new.obj.field_number = '';
                        this.outbound_table.dialog_new.obj.field_sms_text = '';
                        this.snackbar_show('Для загрузки необходим *.csv файл', 'error');
                    }
                }
            },

            tableRowClicked(element) {
                if (this.outbound_table.checked_table_obj === element) {
                    this.outbound_table.checked_table_obj = generate_empty_project_data_upload_obj();
                    this.outbound_table.dialog_edit.obj = generate_empty_project_data_upload_obj();
                } else {
                    this.outbound_table.checked_table_obj = element;
                    this.outbound_table.dialog_edit.obj = Object.assign({}, element);
                }
                this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames_select = [{text: '----', value: ''}];
                this.outbound_table.dialog_edit.uploaded_file.csv_fieldnames = [];
                this.outbound_table.dialog_edit.uploaded_file.filename = '';
                this.outbound_table.dialog_edit.uploaded_file.file_active = false;
            },

            make_projects_data_as_new_opened_page() {
                this.dialog_new_project = {
                    node: {},
                    obj: generate_empty_project_obj(),
                    select_orgs_list: [],
                    select_projects_list: [{text: '-----', value: null}],
                    totaly_new: false,
                    show: false,
                },
                    this.dialog_edit_project = {
                        node: {},
                        obj: generate_empty_project_obj(),
                        select_orgs_list: [],
                        select_projects_list: [{text: '-----', value: null}],
                        show: false
                    },
                    this.watching_data_for_comparison = {
                        dialog_new_project: {
                            last_parent_organization: null,
                            last_project_row_id: null,
                            last_organization_id: null,
                        },
                        dialog_totaly_new_project: {
                            last_parent_organization: null,
                            last_project_row_id: null,
                            last_organization_id: null,
                        },
                        dialog_edit_project: {
                            last_parent_organization: null,
                            last_project_row_id: null,
                            last_organization_id: null,
                        },
                    }
            },

            //when page is start up the first generation of organizations
            getOrganizationsFromServer() {
                axios.get('/rest_api/tree_view_orgs_and_projs/?type=1&children_exists=true', {headers: default_headers})
                    .then(resp => {
                        this.tree_list = [];
                        resp.data.organizations.forEach(element => {
                            console.log(element)
                            element.tree_type = 'organization';
                            let node = {};
                            node.title = element.name;
                            node.data = element;
                            node.isExpanded = false;
                            node.isActive = false;
                            node.isDraggable = false;
                            if (!element.children_exists) {
                                node.isLeaf = true
                            }
                            this.tree_list.push(node);
                        });
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при получении организаций, в которых вы состоите', 'error');
                    });
            },

            // on toogle open\close get children as projects and orgs from server to org or proj
            getChildrenProjectsAndOrganizationsFromServer(node) {
                const slVueTree = this.$refs.slVueTree;
                if (node) {
                    slVueTree.updateNode(node.path, {children: []});
                    node.isExpanded = !node.isExpanded;
                    node.isSelected = !node.isSelected;
                    let post_query_params = {};
                    if (node.isExpanded) {
                        let url = '';
                        if (node.data.tree_type === 'project') {
                            url = "/rest_api/tree_view_orgs_and_projs/?type=4&children_exists=true"
                                + "&project_id=" + node.data.row_id
                        } else if (node.data.tree_type === 'organization') {
                            url = "/rest_api/tree_view_orgs_and_projs/?type=2&children_exists=true"
                                + "&organization_id=" + node.data.id
                        }

                        axios.get(url, {headers: default_headers})
                            .then(resp => {
                                let project_list = resp.data.projects;
                                let organizations_list = resp.data.organizations;
                                organizations_list.forEach(element => {
                                    element.tree_type = 'organization';
                                    let node_local = {};
                                    node_local.title = element.name;
                                    node_local.data = element;
                                    node_local.isExpanded = false;
                                    node_local.isActive = false;
                                    node_local.isDraggable = false;
                                    if (!element.children_exists) {
                                        node_local.isLeaf = true
                                    }
                                    node.children.push(node_local);
                                });
                                project_list.forEach(element => {
                                    element.tree_type = 'project';
                                    element.parent_project = element.parent;
                                    let node_local = {};
                                    node_local.title = element.short_name;
                                    node_local.data = element;
                                    node_local.isExpanded = false;
                                    node_local.isActive = false;
                                    node_local.isDraggable = false;
                                    if (!element.children_exists) {
                                        node_local.isLeaf = true
                                    }
                                    node.children.push(node_local);
                                    // this.updateNode(node.path, {isDraggable: true});
                                });
                                slVueTree.updateNode(node.path, {children: node.children});
                            }).catch(err => {
                            console.log(err.response);
                            this.snackbar_show('Ошибка при отображении дочерних проектов/организаций: ' + err.response, 'error');
                        });
                    }
                }
            },

            getDataProjectUploadFromServer(url) {
                this.outbound_table.loading = true;
                axios.get(url)
                    .then(resp => {
                        this.outbound_table.list = [];
                        resp.data.results.forEach(element => {
                            console.log(element);
                            this.outbound_table.list.push(element);
                        });
                        // this.save_pagination_data(resp.data);
                        this.outbound_table.loading = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при получении рассылок по текущему проекту: ' + err.response, 'error');
                    });
            },

            onSelectTreeNode(node) {
                if (node) {
                    node = node[0];

                    this.selected_node = node;
                    this.dialog_edit_project.node = this.selected_node;
                    this.dialog_edit_project.obj = this.selected_node.data;
                    if (!node.isSelected) {
                        this.outbound_table.list = [];
                        if (this.dialog_edit_project.obj.tree_type === 'project') {
                            this.getDataProjectUploadFromServer('/rest_api/distributions/?project_ides=' + this.dialog_edit_project.obj.row_id);
                            this.outbound_table.show_add_btn = true;
                        } else {
                            this.outbound_table.show_add_btn = false;
                        }
                        this.outbound_table.checked_table_obj = generate_empty_project_data_upload_obj();
                        this.outbound_table.dialog_edit.obj = generate_empty_project_data_upload_obj();
                    }
                }
            },

            open_dialog_new_project() {
                this.dialog_new_project.obj = generate_empty_project_obj();
                let org_id = null;
                if (this.selected_node.data.tree_type === 'organization') {
                    org_id = this.selected_node.data.id;
                } else if (this.selected_node.data.tree_type === 'project') {
                    org_id = this.selected_node.data.organization;
                    this.dialog_new_project.obj.parent_project = this.dialog_edit_project.obj.row_id;
                }
                if (org_id !== null) {
                    axios.get('/rest_api/organizations/?children_recursive=True&pk=' + org_id)
                        .then(resp => {
                            console.log(resp)
                            this.dialog_new_project.select_orgs_list = [];
                            resp.data.results.forEach(element => {
                                this.dialog_new_project.select_orgs_list.push({
                                    text: element.name,
                                    value: element.id
                                });
                                if (this.dialog_new_project.obj.organization === null) {
                                    this.dialog_new_project.obj.organization = element.id;
                                }
                            });
                        }).catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при получении выбранной организации: ' + err.response, 'error');
                    });
                }
                this.dialog_new_project.show = true;
            },

            save_dialog_new_project() {
                let post_params = Object.assign({}, this.dialog_new_project.obj);
                if (this.dialog_new_project.obj.parent_project !== null) {
                    post_params.parent = this.dialog_new_project.obj.parent_project;
                } else {
                    post_params.parent = null;
                }
                axios.post('/rest_api/projects/list/', post_params, {headers: default_headers})
                    .then(resp => {
                        this.getOrganizationsFromServer();
                        this.make_projects_data_as_new_opened_page();
                        this.snackbar_show('Проект успешно создан');
                        this.dialog_new_project.show = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка при создании проекта: ' + err.response, 'error');
                });
            },

            open_dialog_edit_project() {
                this.dialog_edit_project.show = true;
            },

            save_dialog_edit_project() {
                let post_params = Object.assign({}, this.dialog_edit_project.obj);
                if (this.dialog_edit_project.obj.parent_project !== null) {
                    post_params.parent = this.dialog_edit_project.obj.parent_project;
                } else {
                    post_params.parent = null
                }
                axios.put('/rest_api/projects/list/?pk=' + this.dialog_edit_project.obj.row_id, post_params, {headers: default_headers})
                    .then(resp => {
                        this.getOrganizationsFromServer();
                        this.make_projects_data_as_new_opened_page();
                        this.snackbar_show('Проект успешно изменен');
                        this.dialog_edit_project.show = false;
                    }).catch(err => {
                    console.log(err.response);
                    this.snackbar_show('Ошибка при изменении проекта: ' + err.response, 'error');
                });
            },

            deleteProjectAccept() {
                axios.delete('/rest_api/projects/list/?pk=' + this.dialog_edit_project.obj.row_id, {headers: default_headers})
                    .then(resp => {
                        this.getOrganizationsFromServer();
                        this.make_projects_data_as_new_opened_page();
                        this.snackbar_show('Проект ' + this.dialog_edit_project.obj.short_name + ' удален');
                        this.dialog_delete_project.show = false;
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при удалении проекта: ' + err.response, 'error');
                    })
            },

            deleteOutboundProjectDataUpload() {
                axios.delete('/rest_api/distributions/?pk=' + this.outbound_table.dialog_edit.obj.row_id)
                    .then(resp => {
                        let index = get_index_of_array_by_id(this.outbound_table.list, this.outbound_table.dialog_edit.obj.row_id);
                        this.outbound_table.list.splice(index, 1);
                        this.snackbar_show('Рассылка ' + this.outbound_table.dialog_edit.obj.name + ' была удалена');
                        this.outbound_table.dialog_delete.show = false;
                        this.outbound_table.checked_table_obj = generate_empty_project_data_upload_obj();
                        this.outbound_table.dialog_edit.obj = generate_empty_project_data_upload_obj();
                    })
                    .catch(err => {
                        console.log(err.response);
                        this.snackbar_show('Ошибка при удалении проекта: ' + err.response, 'error');
                    })
            },

            custom_event() {
                console.log(this.dialog_edit_project);
            },
        },

        components: {
            navigation,
            DatetimePicker,
            UploadButton,
        },

        created() {
            this.user.obj = JSON.parse(this.$root.$el.attributes.user_obj.value);
            this.user.permissions = JSON.parse(this.$root.$el.attributes.user_perms.value);
            this.getOrganizationsFromServer();
            // console.log(this.$root.$el.attributes.user_obj.value);
        },

        watch: {

            outbound_table_view_records_table_pagination_rowPerPage: {
                handler() {
                    this.getDataProjectUploadRecordsList();
                },
                deep: true
            },

            dialog_new_project: {
                handler: function () {
                    if (!this.dialog_new_project.totaly_new) {
                        if ((this.dialog_edit_project.obj.tree_type === 'project' && this.dialog_new_project.obj.organization !== this.watching_data_for_comparison.dialog_new_project.last_parent_organization)
                            || (this.dialog_edit_project.obj.tree_type === 'organization' && this.dialog_edit_project.obj.id !== this.watching_data_for_comparison.dialog_new_project.last_organization_id)
                        ) {
                            let org_id = null;
                            let parent_organization_id = null;
                            if (this.dialog_edit_project.obj.tree_type === 'project') {
                                this.watching_data_for_comparison.dialog_new_project.last_parent_organization = this.dialog_new_project.obj.organization;
                                if (this.dialog_new_project.obj.organization !== null) {
                                    parent_organization_id = this.dialog_new_project.obj.organization;
                                    org_id = this.dialog_new_project.obj.organization;
                                }
                            } else if (this.dialog_edit_project.obj.tree_type === 'organization') {
                                this.watching_data_for_comparison.dialog_new_project.last_organization_id = this.dialog_edit_project.obj.id;
                                parent_organization_id = this.dialog_edit_project.obj.id;
                                org_id = this.dialog_edit_project.obj.id;
                            }
                            if (parent_organization_id !== null) {
                                axios.get('/rest_api/tree_view_orgs_and_projs/?type=6&organization_id=' + parent_organization_id, {headers: default_headers})
                                    .then(resp => {
                                        this.dialog_new_project.select_projects_list = [{text: '-----', value: null}];
                                        if (this.dialog_edit_project.obj.tree_type === 'project') {
                                            this.dialog_new_project.obj.parent = this.dialog_edit_project.obj.row_id;
                                        }
                                        resp.data.projects.forEach(element => {
                                            this.dialog_new_project.select_projects_list.push({
                                                text: element.short_name,
                                                value: element.row_id
                                            });
                                        });
                                    }).catch(err => {
                                    console.log(err.response);
                                    this.snackbar_show('Ошибка при получении связанных с организацией проектов: ' + err.response, 'error');
                                });
                            }
                            if (org_id !== null) {
                                axios.get('/rest_api/gateways/?page=1&page_size=100&organization_ides=' + org_id, {headers: default_headers})
                                    .then(resp => {
                                        this.dialog_new_project.select_gateway_list = [];
                                        resp.data.results.forEach(element => {
                                            this.dialog_new_project.select_gateway_list.push({
                                                text: element.name,
                                                value: element.row_id,
                                            })
                                        });
                                        if (this.dialog_new_project.select_gateway_list.length > 0) {
                                            this.dialog_new_project.obj.gateway = this.dialog_new_project.select_gateway_list[0].value;
                                        }
                                    }).catch(err => {
                                    console.log(err.reponse);
                                });
                            }
                        }
                    } else {

                    }
                },
                deep: true
            },
            //check selection in the tree view and change data if it is necessary
            dialog_edit_project: {
                handler() {
                    if ((this.dialog_edit_project.obj.tree_type === 'project' && this.dialog_edit_project.obj.organization !== this.watching_data_for_comparison.dialog_edit_project.last_parent_organization)
                        || (this.dialog_edit_project.obj.tree_type === 'project' && this.dialog_edit_project.obj.row_id !== this.watching_data_for_comparison.dialog_edit_project.last_project_row_id)
                        || (this.dialog_edit_project.obj.tree_type === 'organization' && this.dialog_edit_project.obj.parent !== this.watching_data_for_comparison.dialog_edit_project.last_parent_organization)
                    ) {
                        let org_id = null;
                        if (this.dialog_edit_project.obj.tree_type === 'organization') {
                            org_id = this.dialog_edit_project.obj.parent
                        } else if (this.dialog_edit_project.obj.tree_type === 'project') {
                            org_id = this.dialog_edit_project.obj.organization
                        }
                        if (org_id !== this.watching_data_for_comparison.dialog_edit_project.last_parent_organization) {
                            this.watching_data_for_comparison.dialog_edit_project.last_parent_organization = org_id;
                            if (org_id !== null) {
                                axios.get('/rest_api/organizations/?children_recursive=True&pk=' + org_id)
                                    .then(resp => {
                                        this.dialog_edit_project.select_orgs_list = [];
                                        resp.data.results.forEach(element => {
                                            this.dialog_edit_project.select_orgs_list.push({
                                                text: element.name,
                                                value: element.id
                                            });
                                        });
                                    }).catch(err => {
                                    console.log(err.response);
                                    this.snackbar_show('Ошибка при получении выбранной организации: ' + err.response, 'error');
                                });

                                axios.get('/rest_api/gateways/?page=1&page_size=100&organization_ides=' + org_id, {headers: default_headers})
                                    .then(resp => {
                                        this.dialog_edit_project.select_gateway_list = [];
                                        resp.data.results.forEach(element => {
                                            this.dialog_edit_project.select_gateway_list.push({
                                                text: element.name,
                                                value: element.row_id,
                                            })
                                        });
                                    }).catch(err => {
                                    console.log(err.reponse);
                                });

                            }
                        }
                        if (this.dialog_edit_project.obj.tree_type === 'project') {
                            this.watching_data_for_comparison.dialog_edit_project.last_project_row_id = this.dialog_edit_project.obj.row_id;
                            axios.get('/rest_api/tree_view_orgs_and_projs/?type=6'
                                + '&organization_id=' + this.dialog_edit_project.obj.organization
                                + '&project_id=' + this.dialog_edit_project.obj.row_id, {headers: default_headers})
                                .then(resp => {
                                    this.dialog_edit_project.select_projects_list = [{text: '-----', value: null}];
                                    if (this.dialog_edit_project.obj.tree_type === 'project') {
                                        this.dialog_edit_project.obj.parent = this.dialog_edit_project.obj.row_id;
                                    }
                                    resp.data.projects.forEach(element => {
                                        this.dialog_edit_project.select_projects_list.push({
                                            text: element.short_name,
                                            value: element.row_id
                                        });
                                    });
                                }).catch(err => {
                                console.log(err.response);
                                this.snackbar_show('Ошибка при получении связанных с организацией проектов: ' + err.response, 'error');
                            });
                        }
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

    .table-card {
        border-radius: 5px;
        border: 1px solid darkgray;
        margin: 2rem;
    }

    .add-shadow {
        border-radius: 5px;
        border: 1px solid darkgray;
        min-height: 5rem;
        margin-left: 2rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .span-text {
        margin: 1rem;
    }

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

    .small-select-project-data-upload {
        font-size: 11px;
        max-height: 0.5rem;
    }

</style>
