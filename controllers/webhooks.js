const Sessions = require('../controllers/sessions');
const superagent = require('superagent');
require('superagent-queue');
require('dotenv').config();

module.exports = class Webhooks {

    static async wh_messages(session, response) {
        let data = Sessions.getSession(session)
        try {

            await superagent
                .post(data.wh_message)
                .send(response)
                .queue('messages')
                .end(function () {
                    console.log('webhooks receive message....')
                });
            if (data.wh_message == '') {
                console.log('Webhook no defined')
            }


        } catch (error) {
            console.log(error)
        }
    }

    static async wh_connect(session, response, number = null, browserless = null, tokens = []) {
        let data = Sessions.getSession(session)
        if (response == 'autocloseCalled' || response == 'desconnectedMobile') {
            Sessions.deleteSession(session)
        }
        try {
            if (response == 'qrReadSuccess' || response == 'connected') {
                var object = {
                    "wook": 'STATUS_CONNECT',
                    'result': 200,
                    'session': session,
                    'status': response,
                    'number': number,
                    'browserless': browserless,
                    'tokens': tokens
                }
            } else {

                var object = {
                    "wook": 'STATUS_CONNECT',
                    'result': 200,
                    'session': session,
                    'status': response
                }
            }

            await superagent
                .post(data.wh_connect)
                .send(object)
                .queue('connection')
                .end(function () {
                    console.log('webhooks connect status....')
                });
            if (data.wh_connect == '') {
                console.log('Webhook no defined')
            }

        } catch (error) {
            console.log(error)
        }


    }

    static async wh_status(session, response) {
        let data = Sessions.getSession(session)
        try {

            await superagent
                .post(data.wh_status)
                .send(response)
                .queue('status')
                .end(function () {
                    console.log('webhooks status message....')
                });
            if (data.wh_status == '') {
                console.log('Webhook no defined')
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async wh_qrcode(session, response) {
        let data = Sessions.getSession(session)
        try {
            let object = {
                "wook": 'QRCODE',
                'result': 200,
                'session': session,
                'qrcode': response
            }

            await superagent
                .post(data.wh_qrcode)
                .send(object)
                .queue('qrcode')
                .end(function () {
                    console.log('webhooks status message....')
                });
            if (data.wh_qrcode == '') {
                console.log('Webhook no defined')
            }
        } catch (error) {
            console.log(error)
        }
    }
}