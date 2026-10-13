require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CUSTOM_OBJECT_TYPE = 'contacts';

const hubspotHeaders = {
    headers: {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN ? process.env.PRIVATE_APP_ACCESS_TOKEN.trim() : ''}`,
        'Content-Type': 'application/json'
    }
};

app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        let allRecords = [];
        let after;

        do {
            const response = await axios.get(url, {
                ...hubspotHeaders,
                params: { limit: 100, after, properties: 'firstname,lastname,email' }
            });

            allRecords = allRecords.concat(response.data.results);
            after = response.data.paging?.next?.after; // undefined on the last page
        } while (after);

        res.render('homepage', {
            title: 'Contact Records | Integrating With HubSpot I Practicum',
            records: allRecords
        });
    } catch (error) {
        console.error('Error fetching records:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving records from HubSpot.');
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Contact Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    console.log('Form data received:', req.body);

    const { firstname, lastname, email } = req.body;
    const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    const payload = {
        properties: { firstname, lastname, email }
    };

    try {
        await axios.post(createUrl, payload, hubspotHeaders);
        res.redirect('/');
    } catch (error) {
        const details = error.response ? error.response.data : { message: error.message };
        console.error('Error creating record:', details);
        res.status(error.response?.status || 500).send(
            `Failed to create record in HubSpot: ${details.message || JSON.stringify(details)}`
        );
    }
});
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});