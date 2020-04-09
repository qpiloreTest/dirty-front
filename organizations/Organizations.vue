<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-app>
            <navigation></navigation>

            <OrganizationsOrgs :checked_organization="checked_organization"
                               :default_org_object="default_org_obj">
            </OrganizationsOrgs>

            <br>

            <OrganizationsUsers :checked_organization="checked_organization"
                                :default_org_object="default_org_obj">
            </OrganizationsUsers>
        </v-app>
    </div>
</template>

<script>
    import axios from 'axios'
    import navigation from '../navigation_panel.vue'

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
        components: {
            navigation,
        },
        data() {
            return {
                checked_organization: generate_null_organization_obj(),

                snackbar: {
                    show: false,
                    text: '',
                    color: '',
                },

                default_org_obj: {
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

        methods: {
            cs_log(item) {
                console.log(item)
            },
            snackbar_show(text, color) {
                this.snackbar.show = true;
                this.snackbar.text = text;
                this.snackbar.color = color;
            },
        },
        created() {

        },
        watch: {
            checked_organization: {
                handler(data) {
                    console.log(2);
                },
            },
        },
    }
</script>

<style lang="scss">

</style>
