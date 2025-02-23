const { MercadoPagoConfig, Payment } = require("mercadopago");
const { mercadopago } = require('../config.json')
const axios = require('axios');
const clientMP = new MercadoPagoConfig({ accessToken: mercadopago, options: { timeout: 60 * 1000 } });
const paymentMP = new Payment(clientMP);
const { pagamentosPendentes } = require('../DataBaseJson')

module.exports = {
    clientMP,
    paymentMP,

    paymentSearch: async (client, id) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.mercadopago.com/v1/payments/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mercadopago}`
            }
        };
        const yy = await axios.request(config)
        if (yy.data.status == 'approved') {
            return {
                status: 'success',
                response: yy.data
            }

        } else {
            return {
                status: 'error',
                response: yy.data.status
            }
        }


    }
};