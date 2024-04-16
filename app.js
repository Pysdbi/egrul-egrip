const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const {findOrCreateCompanies, updateCompanyByINN} = require("./services/company");

const app = express();
const port = 3000;

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Company API',
            version: '1.0.0',
            description: 'A Test Express Company API',
        },
        servers: [{url: `http://localhost:${port}`, description: 'Local server'}],
    },
    apis: ['./docs/swagger/company.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/egrul'
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/list', async (req, res) => {
    const { s: search, page = 1, limit = 10, closed, order = '-name' } = req.query;
    if (!search) {
        return res.status(400).send('No search provided');
    }

    try {
        const hasClosed = closed ? closed.toLowerCase() === 'true' : false;
        const sort = {[order.split('-').slice(-1)[0]]: order.includes('-') ? 1 : -1}
        let list = await findOrCreateCompanies(search, page, limit, hasClosed, sort);
        if (list.totalResults) {
            return res.status(200).send(list);
        } else {
            return res.status(404).send('Data not found');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

app.patch('/update/:inn', async (req, res) => {
    const { inn } = req.params;
    const updateData = req.body;

    const result = await updateCompanyByINN(inn, updateData);
    res.status(result.status).send(result.data);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
