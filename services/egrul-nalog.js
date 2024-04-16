const axios = require("axios");
const moment = require('moment');

async function getDataByQuery(query) {
    try {
        let response = await axios.post('https://egrul.nalog.ru/', { query });
        const token = response.data.t;

        while (true) {
            response = await axios.get(`https://egrul.nalog.ru/search-result/${token}`);
            if (response.data?.status === 'wait') continue;

            if (response.data?.rows) {
                return response.data.rows.map(x => ({
                    name: x.n,
                    registerDate: moment(x.r, 'DD.MM.YYYY').toDate(),
                    closeDate: x.e ? moment(x.e, 'DD.MM.YYYY').toDate() : null,
                    inn: x.i,
                    ogrn: x.o,
                }));
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = {
    getDataByQuery
};
