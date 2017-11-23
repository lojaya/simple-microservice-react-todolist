# TODO SERVICE

Todolist todo CRUD API service.

## Tech Stack

* Express.js
* jsonwebtoken for JWT auth

## Prerequisites

* Install [nodejs](https://nodejs.org/en/)
* Install [postman](https://www.getpostman.com/) for API testing
* An AWS account
* An AWS credential attached on your machine,
  [refer here](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
* Create a table named `Todolist_User` (P-Key: userId) and `Todolist_Todo`
  (P-Key: todoId) on DynameDB.

## Usage

**Clone this repository**

```
git clone https://github.com/lojaya/simple-microservice-react-todolist
cd simple-microservice-react-todolist/todo-service
```

**Install**

```
npm install
```

**Start the application in development mode**

```
npm run dev
```

you can test and access the API from http://localhost:3002 using your favorite
tool.

**Start the application in production mode**

```
npm run prod
```

you can test and access the API from http://localhost:3002 using your favorite
tool.

## Using Docker

If you're using docker, the default environment would be production. To change
it you can edit `Dockerfile`.

```
docker build -t todo-service .
docker run -p 3001:3001 todo-service
```

you can test and access the API from http://localhost:3002 using your favorite
tool.
