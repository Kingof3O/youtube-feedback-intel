# API Reference (Current Contract)

Base URL: `http://localhost:3000`

## `GET /api/dashboard`
Returns:
```json
{
  "channels": 0,
  "videos": 0,
  "comments": 0,
  "feedback": 0
}
```

## `GET /api/channels`
Returns tracked channel rows ordered by `fetched_at DESC`.

## `POST /api/sync/channel`
Body:
```json
{
  "channelId": "string",
  "days": 14,
  "maxVideos": 50,
  "maxCommentsPerVideo": 2000
}
```

## `GET /api/feedback`
Query params:
- `channelId`
- `videoId`
- `category`
- `search`
- `minLikes`
- `since`
- `until`
- `limit`
- `offset`
- `mode` (`classified` or `all`)

Returns flat list of feedback items:
```json
[
  {
    "commentId": "string",
    "text": "string",
    "author": "string",
    "likes": 0,
    "date": "ISO",
    "videoId": "string",
    "videoTitle": "string",
    "labels": [
      {
        "category": "bug",
        "score": 3,
        "keywords": ["bug"],
        "lang": "en"
      }
    ]
  }
]
```

## Rules Endpoints
- `GET /api/rules`
- `GET /api/rules/:name/content`
- `PUT /api/rules/:name/content`
- `POST /api/rules/import-default`
- `POST /api/rules/activate`

These endpoints are intentionally unchanged from previous frontend expectations.
