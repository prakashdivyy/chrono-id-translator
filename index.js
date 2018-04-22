const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const chrono = require('chrono-node');
const request = require('request-promise');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/process', asyncHandler(async (req, res, next) => {
    try {
        const { text } = req.body;
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURI(text)}`;
        let result = await request({
            uri: url,
            json: true
        });
        let date = chrono.parseDate(result[0][0][0]);
        if (!date) {
            throw new Error("Invalid date");
        }
        let calendarDate = moment(date).format("DD-MM-YYYY");
        let calendarHour = moment(date).format("HH:mm");
        res.send({
            status: "ok",
            date: calendarDate,
            time: calendarHour
        });
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.send({
            status: "error"
        });
    }
}));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));