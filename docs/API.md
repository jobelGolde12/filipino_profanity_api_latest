# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### GET /api/profanity

Fetch profanity words with optional filtering.

**Query Parameters:**

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| type      | string | No       | Filter by language: `filipino`, `regional`, `all` (default: `all`) |
| word      | string | No       | Search for specific word             |

**Example Requests:**

```bash
# Fetch all profanity words
curl http://localhost:3000/api/profanity

# Fetch only Filipino profanity
curl http://localhost:3000/api/profanity?type=filipino

# Fetch only regional profanity
curl http://localhost:3000/api/profanity?type=regional

# Search for a specific word
curl "http://localhost:3000/api/profanity?word=gago"
```

**Response:**

```json
{
  "success": true,
  "type": "all",
  "count": 310,
  "source": "database",
  "data": [
    {
      "word": "abnormal",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    },
    {
      "word": "agbaliw",
      "language": "regional",
      "region": "visayan",
      "severity": "medium"
    }
  ]
}
```

### POST /api/check

Check if a text contains profanity.

**Request Body:**

```json
{
  "text": "Sample text to check"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "This text contains gago"}'
```

**Response:**

```json
{
  "success": true,
  "hasProfanity": true,
  "count": 1,
  "data": [
    {
      "word": "gago",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    }
  ]
}
```

## Error Responses

```json
{
  "success": false,
  "error": "Invalid type parameter. Use: filipino, regional, or all"
}
```

## Code Examples

### JavaScript (Fetch)

```javascript
async function getData() {
  try {
    const response = await fetch("http://localhost:3000/api/profanity?type=all");
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getData();
```

### Axios

```javascript
import axios from "axios";

async function getData() {
  try {
    const response = await axios.get("http://localhost:3000/api/profanity?type=all");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getData();
```

### Python

```python
import requests

try:
    response = requests.get("http://localhost:3000/api/profanity?type=all")
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print("Error fetching data:", e)
```
