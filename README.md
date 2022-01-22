# school-register :student: :heart: :school: :trophy: ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/macieksitko/school-register/NestJS%20CI?label=NestJS-build) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/macieksitko/school-register/React.js%20CI?label=React.js-build)

Web application designed to manage the register of students grades

## Prerequisites

In order to run application in convenient way following dependencies are required:

- :whale: Docker Engine
- :whale: Docker Compose

## Application bootstrapping

To run application in no time using Docker :whale: containers and Docker Compose orchestration tool,
just select one of commands listed below which best suit your needs and run it in **project root directory**:

- `development environment` - starts NestJS backend with Swagger REST API documentation, MongoDB database, Mongo Express database management UI and React.js
  application frontend

```bash
docker-compose --project-name school_register up
```

- `production environment` - starts NestJS backend without Swagger REST API documentation, MongoDB database and React.js application frontend

```bash
docker-compose --project-name school_register -f docker-compose.yaml -f docker-compose.prod.yaml  up
```

Table of ports exposed by ran containers (for Swagger endpoint is listed):

| Service               |  development   | production |
| --------------------- | :------------: | :--------: |
| NestJS backend        |     :3000      |    :80     |
| Swagger REST API Docs | :3000/api/docs |     -      |
| MongoDB database      |     :3001      |   :3001    |
| Mongo Express UI      |     :3002      |     -      |
| React.js frontend     |     :3005      |   :3005    |

Table of default credentials:

| Service                                      |                     user:password                      |
| -------------------------------------------- | :----------------------------------------------------: |
| Web app (NestJS backend + React.js frontend) | **admin**:_{password_generated_on_app_startup_in_log}_ |
| MongoDB `admin` database                     |                  **admin**:**admin**                   |
| MongoDB `school_register` database           |        **school_register**:**school_register**         |
| Mongo Express UI                             |                  **admin**:**admin**                   |

To stop Docker containers orchestrated by Docker Compose, run following command in project root directory:

```bash
docker-compose down
```

## Troubleshooting

### Known issues :bug:

It was reported by some team members, that MongoDB database initialization script doesn't work when running Docker container on Windows OS.
Currently tested and working mitigation of this problem is to run following steps.

1. Exec `mongosh` MongoDB shell in MongoDB container by running

```bash
docker exec -it school-register-mongodb mongosh --port 27017 -u "admin" --authenticationDatabase "admin" -p
```

2. Enter password for `admin` user when prompted

3. Switch used database to `school_register` in container shell

```bash
use school_register
```

4. Create user for `school_register` database by running in shell:

```js
db.createUser({
  user: 'school_register',
  pwd: 'school_register',
  roles: [
    {
      role: 'readWrite',
      db: 'school_register',
    },
  ],
});
```
