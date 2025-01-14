const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
require('dotenv').config();

// Root route
app.get('/', (req, res) => {
  res.send('Hello, Railway!');
});

// Route to fetch transcript
app.post('/transcript', async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    // Fetch transcript using RapidAPI
    const transcript = await fetchTranscript(videoUrl);

    // Send the transcript as response
    res.json({ transcript });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// Function to fetch transcript using RapidAPI
async function fetchTranscript(videoUrl) {
  const options = {
    method: 'GET',
    url: 'https://youtube-transcript3.p.rapidapi.com/api/transcript-with-url',
    params: {
      url: videoUrl, // Use the provided video URL
      flat_text: 'true', // Get the transcript as flat text
      lang: 'en', // Language of the transcript
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use environment variable for API key
      'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com',
    },
  };

  const response = await axios.request(options);
  return response.data; // Return the transcript data
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});