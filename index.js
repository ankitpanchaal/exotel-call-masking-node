const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Route to handle incoming requests from Exotel
app.get('/exotel-webhook', (req, res) => {
    // Extract relevant information from the query parameters
    const { CallFrom, CallTo } = req.query;

    // Customize your number masking logic here
    const destinationNumber = "+91798xx581xx"; // Destination number to mask
    const maskedResponse = {
        "fetch_after_attempt": false,
        "destination": {
            "numbers": [destinationNumber]
        },
        "outgoing_phone_number": CallTo, // Your Exotel number
        "record": true,
        "recording_channels": "dual",
        "max_ringing_duration": 45,
        "max_conversation_duration": 3600,
        "music_on_hold": {
            "type": "operator_tone"
        },
        "start_call_playback": {
            "playback_to": "both",
            "type": "text",
            "value": "This text would be spoken out to the callee"
        }
    };

    // Send the masked response back to Exotel
    res.json(maskedResponse);
});

// Route to handle click-to-call requests
app.post('/click-to-call', async (req, res) => {
    try {
        const { from, to, callerId } = req.body;

        // Construct the request body for Exotel API
        const requestBody = {
            From: 919993673521,
            To: 917054557586,
            CallerId: "5555553625362563",
            // StatusCallback: statusCallback,
            StatusCallbackEvents: ['terminal'],
            StatusCallbackContentType: 'application/json'
        };

        // Make a POST request to Exotel's API
        const response = await axios.post(
            'https://api.exotel.com/v1/Accounts/skilzen2/Calls/connect',
            requestBody,
            {
                auth: {
                    username: '85cb7d43da5f4ed28f20a7c6b3c934cf59df99b3a7bd400e',
                    password: 'c1b9d09d21e09fd9c82d802fc5dd0376f306ca631f060106'
                }
            }
        );


        // Send the Exotel response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
