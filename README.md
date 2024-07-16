# URL Shortener Microservice

This is a URL Shortener Microservice built with Node.js, Express, and MongoDB for freeCodeCamp.

## Endpoints

- `POST /api/shorturl`: Accepts a URL and returns a JSON object with `original_url` and `short_url` properties.
- `GET /api/shorturl/:short_url`: Redirects to the original URL.

### Example Usage

- `POST /api/shorturl` with a URL in the request body
- `GET /api/shorturl/1`

### Example Output

```json
{
  "original_url": "https://freeCodeCamp.org",
  "short_url": 1
}
