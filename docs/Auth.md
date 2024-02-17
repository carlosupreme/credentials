# Auth

## Model

### User

```json
{
  "id": "0000-0000-0000-0000",
  "isAdmin": false,
  "email": "email@example.com",
  "password": "$2b$10$8tKo04cRR9...pH7q",
  "photo": "path/to/image.png"
}
```

## Endpoints

### Register

- Method: `POST`
- Path: `/auth/register`
- Description: Register a user with basic information.

`email`

- Required
- Valid Email

`password`

- Required
- At least 8 characters
- At least 1 letter uppercase, lowercase, digit and a special char

##### Register examples

```json
{
  "email": "",
  "password": "123",
  "isAdmin": false
}
```

Response:

```json
// 400 Bad Request ⚠️
{
  "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",
  "status": 400,
  "title": "Bad Request",
  "detail": "There is an error in your request.",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

✅ Good Request:

```json
{
  "email": "email@example.com",
  "password": "Valid-password123",
  "isAdmin": false
}
```

Response:

```json
// 200 OK 🆗
{
  "message": "You have been registered successfully",
  "user": {
    "id": "6ca3b7d7-4315-4865-953b-118c83a134bc",
    "email": "email@example.com",
    "photo": "default-profile/photo.png",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mOc"
  }
}
```

#### Login

- Method: `POST`
- Path: `/auth/login`
- Description: This endpoint is for authenticating the user, it receives the username and password in plain text.
  If the credentials are correct the access token is answered, otherwise the error is answered".

`email`:

- Required
- Valid Email

`password`: Required

✅ Good Request:

```json
{
  "email": "email@example.com",
  "password": "Valid-password123"
}
```

Response:

```json
// 200 OK 🆗
{
  "message": "Logged in successfully",
  "user": {
    "id": "6ca3b7d7-4315-4865-953b-118c83a134bc",
    "email": "email@example.com",
    "photo": "default-profile/photo.png",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...mOc"
  }
}
```

In case of the given credentials do not match our records:

```json
{
  "email": "userDoes@notexists.com",
  "password": "Valid-password123"
}
```

Response:

```json
// 400 Bad Request ⚠️
{
  "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1",
  "status": 400,
  "title": "Bad Request",
  "detail": "There is an error in your request.",
  "errors": {
    "InvalidCredentials": "Invalid email or password"
  }
}
```
