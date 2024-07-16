const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const cors = require('cors');
const URL = require('./models/url');

const app = express();

// Enable CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Index route
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// URL Shortener API endpoint
app.post("/api/shorturl", async (req, res) => {
  const originalUrl = req.body.url;
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    let url = await URL.findOne({ original_url: originalUrl });
    if (url) {
      res.json({ original_url: url.original_url, short_url: url.short_url });
    } else {
      const shortUrl = await URL.countDocuments({}) + 1;
      url = new URL({ original_url: originalUrl, short_url: shortUrl });
      await url.save();
      res.json({ original_url: url.original_url, short_url: url.short_url });
    }
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  try {
    const url = await URL.findOne({ short_url: req.params.short_url });
    if (url) {
      return res.redirect(url.original_url);
    } else {
      return res.json({ error: 'No short URL found for the given input' });
    }
  } catch (err) {
    res.status(500).json('Server Error');
  }
});

// Listen for requests
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
