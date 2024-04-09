const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
    const destinationNumber = "+917987058151"; // Destination number to mask
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

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
