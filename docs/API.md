# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [WebSocket Events](#websocket-events)
- [HTTP Endpoints](#http-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

Inscribe uses WebSocket for real-time communication. Authentication is handled via JWT tokens.

## WebSocket Events

### Connection
- **Event**: `connection`
  - **Description**: Fires when a client connects to the WebSocket server

### Drawing Events
- **Event**: `draw`
  - **Description**: Broadcasts drawing data to all connected clients
  - **Data**:
    ```json
    {
      "type": "draw",
      "x": 100,
      "y": 150,
      "color": "#000000",
      "size": 5,
      "tool": "pencil"
    }
    ```

### Chat Events
- **Event**: `chatMessage`
  - **Description**: Sends a chat message to all connected clients
  - **Data**:
    ```json
    {
      "user": "username",
      "message": "Hello, world!",
      "timestamp": 1620000000000
    }
    ```

## HTTP Endpoints

### GET `/api/health`
- **Description**: Health check endpoint
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-05-24T17:30:00.000Z"
  }
  ```

## Error Handling

All error responses follow the same format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## Rate Limiting

- **WebSocket Connections**: 100 connections per IP per minute
- **HTTP API**: 100 requests per IP per minute

---

For more information, please refer to the [GitHub repository](https://github.com/Keshabkjha/Inscribe).
