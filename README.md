# minelev-tjommi-api

Buddy compatible api service for MinElev

## API

All API calls needs an Authorization header with valid jwt  

### ```GET /students?name={name}```

Search all your students

### ```GET /students/{id}```

Get a specific student

### ```GET /students/{id}/contactteachers```

Get all contact teacher for a given student

### ```GET /teachers```

Get all teachers

### ```GET /teachers/{id}```

Get a given teacher

### ```GET /teachers/{id}/contactclasses```

Get all contact classes for a given teacher

### ```GET /classes/{id}/students```

Get all students in a class

### ```GET /classes/{id}/teachers```

Get all teachers in a class

### ```GET /schools```

Get all schools

### ```GET /schools/{id}```

Get a given school

### ```GET /schools/{id}/teachers```

Get all teachers for a given school

### ```Get /schools/{id}/students```

Get all students for a given school

## Development

Add a local `.env` file

```
NODE_ENV=development
JWT_SECRET=jwt-secret-for-the-service
MONGODB_CONNECTION=mongodb-connection-string
MONGODB_COLLECTION=mongodb-collection-name
MONGODB_NAME=mongodb-name
LOGGED_IN_USER=username-for-testuser
PAPERTRAIL_HOST=papertrail-host
PAPERTRAIL_PORT=12345
```

Start the dev environment

```
$ npm run dev
```

In the [utils directory](utils) you'll find a [test call method](utils/testcall.js).

Add the url you want to test and run the script

```
$ node utils/testcall.js
```

## Deploy to ZEIT/Now

Configure [now.json](now.json)

Run the deployment script

```
$ npm run deploy
```

## Related

- [minelev-web](https://github.com/telemark/minelev-web) web frontend for MinElev
- [minelev-logs](https://github.com/telemark/minelev-logs) logs service for MinElev
- [minelev-notifications](https://github.com/telemark/minelev-notifications) notifications service for MinElev
- [minelev-leder](https://github.com/telemark/minelev-leder) web frontend for MinElev - school administration
- [minelev-pifu-tools](https://github.com/telemark/minelev-pifu-tools) toolbox for converting pifu xml to tjommi data

# License

[MIT](LICENSE)