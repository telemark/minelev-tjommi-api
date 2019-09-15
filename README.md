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

### ```GET /schools````

Get all schools

### ```GET /schools/{id}```

Get a given school

### ```GET /schools/{id}/teachers```

Get all teachers for a given school

### ```Get /schools/{id}/students```

Get all students for a given school

## Development

Start the dev environment

```
$ npm run dev
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


# License

[MIT](LICENSE)