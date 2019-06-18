const express = require("express");
const axios = require("axios");
const h2p = require("html2plaintext");

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /^(https?:\/\/)?([\w.-]+(?:\.[\w\.-]+)+[\w\-\._~\/?#[\]@!\$&'\(\)\*\+,;=.]+)$/;

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (request, response) => {
    response.send("Hello World");
})
app.get("/count", (request, response) => {
    const urlQuery = request.query.url;
    let url;

    if (urlQuery) {
        const [fullMatch, group1, group2] = urlQuery.match(URL_REGEX);
        if (group2) {
            url = "https:\\\\" + group2;
        }
    }

    return axios.get(url).then(resp => {
        let data = h2p(resp.data);
        let count = {};

        data.match(/\w+/g).forEach(word => {
            if (count.hasOwnProperty(word)) {
                count[word]++;
            } else {
                count[word] = 1;
            }
        })
        return response.status(200).send(count);
    }).catch(error => {
        if (error.response) {
            return response.status(error.response.status).send(error.response.data);
        }
        return response.sendStatus(500);
    });
});

module.exports = app;