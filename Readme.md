# Node.js + express + mongodb + mongoose REST API Example

## Add .env file should contain DBURL & PORT
    PORT=5000
    DBURL='mongodb://localhost:27017/learning?readPreference=primary&ssl=false'

## Routes:
    1. `/signup`   // Creates user.
        Request Method: POST,
        Body: {
            "name":"Rohit Mahto",
            "email":"rohit@test.com",
            "password":"myexample@password"
        },

    2. `/login`   // Login user.
        Request Method: POST,
        Body: {
            "email":"rohit@test.com",
            "password":"myexample@password"
        },

    3. `/updateName`   // Updates name.
        Request Method: POST,
        Body: {
            "email":"rohit@test.com",
            "name":"Mr. Rohit Mahto",
            "password":"myexample@password"
        },

    4. `/deleteUser`   // Deletes name.
        Request Method: POST,
        Body: {
            "email":"rohit@test.com",
            "password":"myexample@password"
        },