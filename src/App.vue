<template>
    <b-container id="id">
        <b-card>
            <b-form-group label="URL"
                          label-for="url-input"
                          v-bind:state="urlState"
                          v-bind:invalid-feedback="invalidFeedBack">
                <b-input-group>
                    <b-form-input id="url-input" v-model="url" type="url" v-bind:state="urlState" v-on:keyup.enter.native="getCount"></b-form-input>

                    <b-btn slot="append" v-on:click.stop="getCount">
                        Test
                    </b-btn>
                </b-input-group>
            </b-form-group>
            
            <b-list-group>
                <b-list-group-item v-for="word in Object.keys(wordCount)" v-bind:key="word" 
                class="d-flex justify-content-between align-items-center">
                    {{ word }}
                    <b-badge variant="primary">
                        {{ wordCount[word] }}
                    </b-badge>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-container>
</template>

<script>
import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
});

const URL_REGEX = /^(https?:\/\/)?([\w.-]+(?:\.[\w\.-]+)+[\w\-\._~\/?#[\]@!\$&'\(\)\*\+,;=.]+)$/;

export default {
    name: "App",
    data() {
        return {
            url: "",
            errorMsg: "",
            wordCount: {},
        };
    },
    computed: {
        isUrl() {
            if (this.url.length) {
                return URL_REGEX.test(this.url);
            }
            return false;
        },
        urlState() {
            if (this.errorMsg) {
                return false;
            }
            if (this.url.length) {
                return this.isUrl;
            }
            return null;
        },
        invalidFeedBack() {
            if (this.errorMsg) {
                return this.errorMsg;
            }
            return "Invalid URL";
        },
    },
    methods: {
        async getCount() {
            if (!this.isUrl) {
                return;
            }

            this.errorMsg = "";
            try {
                const resp = await http.get("api", {
                    params: {
                        url: this.url
                    }
                }); 
                this.wordCount = resp.data;

            } catch(e) {
                console.log(e);
                if (e.response) {
                    this.errorMsg = `${e.response.status} ${e.response.data}`;
                }
            }
        }
    }
};
</script>

<style lang="scss">
</style>
