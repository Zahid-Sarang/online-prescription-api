# Ideamagix-task-api

## Technologies Used

-   TypeScript
-   Node.js
-   Express.js
-   MongoDB
-   Express Validators
-   JWT Tokens
-   Bcrypt
-   winston

## app.ts (Express App Configuration):

-   Sets up Express app with middleware (cookie-parser, cors).
-   Defines routes for authentication (/api/auth), courses (/api/courses), and lectures (/api/lectures).
-   Handles static file serving for uploads.
-   Implements error handling middleware to log errors and send a standardized JSON response.

# Authentication and Authtorization

## Register User

Register a new user in the system.

-   **URL:** `/api/auth/register`
-   **Method:** `POST

### Request

    Body:{
          "userName":"roman",
          "email": "roman@gmail.com",
          "password":"password"
          }

### Response

    Status Code: 201 (Created)
    Body: {
    "user": {
    	"userName": "roman",
    	"email": "roman@gmail.com",
    	"password": "$2b$10$0OMkHDClC/hnY8lujQiOK.bEl0DslELGUs86eH0RoGBJWbkt0mK8i",
    	"role": "instructor",
    	"_id": "655380672862376e4f8e8508",
    	"__v": 0
    }
    }

### Error Responses

    Status Code: 400 (Bad Request)
    Body: { "error": "Validation failed. Check the provided fields." }
    Description: Indicates that one or more required fields are missing or invalid.

    Status Code: 500 (Internal Server Error)
    Body: { "error": "Internal Server Error" }
    Description: Indicates an unexpected server error during user registration.

## Login

Authenticate a user and generate access and refresh tokens.

-   **URL:** `/api/auth/login`
-   **Method:** `POST

### Request

    Body:
    {
    "email": "zahid@gmail.com",
    "password":"Zahid@123"
    }
    Response
    Status Code: 200 (OK)
    Body:
    {
    "id": "655362b58baf8576adf48e17"
    }

### Error Responses

    Status Code: 400 (Bad Request)
    Body: { "errors": [{ "msg": "Email and password don't match!" }]
    Description: Indicates that the provided email and password combination is incorrect.

    Status Code: 500 (Internal Server Error)
    Body: { "error": "Internal Server Error" }
    Description: Indicates an unexpected server error during user login.

## Refresh Token

Refresh the access token using a valid refresh token.

-   **URL:** `/api/auth/refresh`
-   **Method:** `POST
-   **Authentication:** Required

### Request

-   **HttpOnlyCooki:**

    -   `Authorization`: access token obtained during authentication.

### Response

    Status Code: 200 (OK)
    Body:
    {"id": "655362b58baf8576adf48e17"}

### Error Responses

     Status Code: 401 (Unauthorized)
     Body: { "error": "Unauthorized" }
     Description: Indicates that the request is missing a valid authentication token.

      Status Code: 500 (Internal Server Error)
      Body: { "error": "Internal Server Error" }
      Description: Indicates an unexpected server error during token refresh.

## Get Users List

Retrieve a list of all users in the system.

-   **URL:** `/api/auth/getUsers`
-   **Method:** `POST`
-   **Authentication:** Required
-   **Authorization:** Requires admin access

    ### Request

-   **HttpOnlyCooki:**

    -   `Authorization`: access token obtained during authentication.

### Response

    Status Code: 200 (OK)
    Body:[
    {
    	"_id": "655362b58baf8576adf48e17",
    	"userName": "zahid",
    	"email": "zahid@gmail.com",
    	"role": "admin"
    }
    ]

### Error Responses

    Status Code: 401 (Unauthorized)
    Body: { "error": "Unauthorized" }
    Description: Indicates that the request is missing a valid authentication token.

    Status Code: 403 (Forbidden)
    Body: { "error": "Forbidden" }
    Description: Indicates that the authenticated user does not have sufficient privileges to perform this action.

    Status Code: 500 (Internal Server Error)
    Body: { "error": "Internal Server Error" }
    Description: Indicates an unexpected server error during user retrieval.

## Create a Course

Create a new course in the system.

-   **URL:** `/api/courses/`
-   **Method:** `POST`
-   **Authentication:** Required
-   **Authorization:** Requires admin access

### Request

-   **HttpOnlyCooki:**

    -   `Authorization`: access token obtained during authentication.

-   **Body:**
    -   `name` (string): The name of the course.
    -   `level` (string): The level or category of the course.
    -   `description` (string): A brief description of the course.
    -   `file` (multipart/form-data): The file representing the course content.

### Response

-   **Status Code:** 201 (Created)
-   **Body:**
    ```json
    {
        "name": "Php",
        "level": "high",
        "description": "it's a high level course",
        "image": "http://localhost:8005/src/uploads/1699972836198-539067249.png",
        "lectures": [],
        "_id": "655386e42862376e4f8e87aa",
        "createdAt": "2023-11-14T14:40:36.208Z",
        "updatedAt": "2023-11-14T14:40:36.208Z",
        "__v": 0,
        "id": "655386e42862376e4f8e87aa"
    }
    ```

## Error Responses

-   Status Code: 400 (Bad Request)

    -   Body: { "error": "All fields are required!" }
    -   Description: Indicates that one or more required fields are missing.

-   Status Code: 401 (Unauthorized)
    -   Body: { "error": "Unauthorized" }
    -   Description: Indicates that the request is missing a valid authentication token.
-   Status Code: 403 (Forbidden)
    -   Body: { "error": "Forbidden" }
    -   Description: Indicates that the authenticated user does not have sufficient privileges to perform this action.
-   Status Code: 500 (Internal Server Error)
    -   Body: { "error": "Internal Server Error" }
    -   Description: Indicates an unexpected server error during course creation.

## Get Courses

#### Retrieve a list of all courses in the system.

-   URL: /api/courses/
-   Method: GET
-   Authentication: Required
-   Authorization: Requires admin access

## Response

-   Status Code: 200 (OK)
-   Body:
    ```json
    [
        {
            "_id": "6553999aefe320be90ec32b7",
            "name": "Python",
            "level": "medium",
            "description": "basic to advance python course",
            "image": "http://localhost:8005/src/uploads/1699977626657-849179482.png",
            "lectures": [],
            "createdAt": "2023-11-14T16:00:26.666Z",
            "updatedAt": "2023-11-14T16:00:26.666Z",
            "__v": 0,
            "id": "6553999aefe320be90ec32b7"
        }
    ]
    ```

## Add a Lecture

Add a new lecture to the system.

-   **URL:** `/api/lectures/`
-   **Method:** `POST`
-   **Authentication:** Required
-   **Authorization:** Requires admin access

### Body

```json
{
    "date": "2024-11-13T10:59:02.784+00:00",
    "instructor": "65525e4d419c0464964fcafe",
    "course": "6553210a8356bda8787d282d"
}
```

### Response

    Status Code: 201 (Created)
    Body:
    {
    "date": "2024-11-13T10:59:02.784Z",
    "instructor": "65525e4d419c0464964fcafe",
    "course": "6553210a8356bda8787d282d",
    "_id": "6553ba1a2e016ad15313724c",
    "__v": 0
    }

## Error Responses

    Status Code: 400 (Bad Request)

-   Body: { "error": "Validation failed. Check the provided fields." }
-   Description: Indicates that one or more required fields are missing or invalid.

-   Status Code: 401 (Unauthorized)

    -   Body: { "error": "Unauthorized" }
    -   Description: Indicates that the request is missing a valid authentication token.

-   Status Code: 403 (Forbidden)

    -   Body: { "error": "Forbidden" }
    -   Description: Indicates that the authenticated user does not have sufficient privileges to - perform this action.

-   Status Code: 409 (Conflict)

    -   Body: { "error": "Lecture time conflict. Choose a different time." }
    -   Description: Indicates a time conflict with an existing lecture.

-   Status Code: 500 (Internal Server Error)

    -   Body: { "error": "Internal Server Error" }
    -   Description: Indicates an unexpected server error during lecture creation.

## Get Lectures

Retrieve a list of all lectures in the system.

-   **URL:** `/api/lectures/`
-   **Method:** `GET`
-   **Authentication:** Required
-   **Authorization:** Requires admin access

### Response

    Status Code: 200 (OK)
    Body: [
    {
    	"_id": "65539ddcefe320be90ec3a44",
    	"date": "2023-11-16T00:00:00.000Z",
    	"instructor": {
    		"_id": "65537530ce2aaa625f4b8186",
    		"userName": "user",
    		"email": "user@gmail.com",
    		"role": "instructor",
    		"__v": 0
    	},
    	"course": {
    		"_id": "6553999aefe320be90ec32b7",
    		"name": "Zahid SARANG",
    		"level": "medium",
    		"description": "hdkehdakjhdgakjdgajd",
    		"image": "http://localhost:8005/src/uploads/1699977626657-849179482.png",
    		"lectures": [],
    		"createdAt": "2023-11-14T16:00:26.666Z",
    		"updatedAt": "2023-11-14T16:00:26.666Z",
    		"__v": 0,
    		"id": "6553999aefe320be90ec32b7"
    	},
    	"__v": 0
    }
    ]

### Error Responses

-   Status Code: 401 (Unauthorized)

    -   Body: { "error": "Unauthorized" }
    -   Description: Indicates that the request is missing a valid authentication token.

-   Status Code: 403 (Forbidden)

    -   Body: { "error": "Forbidden" }
    -   Description: Indicates that the authenticated user does not have sufficient privileges to perform this action.

-   Status Code: 500 (Internal Server Error)

    -   Body: { "error": "Internal Server Error" }
    -   Description: Indicates an unexpected server error during lecture retrieval.
