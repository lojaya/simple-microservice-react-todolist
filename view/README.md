# FRONTEND VIEW

Frontend view for todolist web app.

## Tech Stack

* ReactJS
* axios for AJAX call

## Prerequisites

* Install [nodejs](https://nodejs.org/en/)
* A running API services (user-service, todo-service, api-gateway)

## Usage

**Clone this repository**

```
git clone https://github.com/lojaya/simple-microservice-react-todolist
cd simple-microservice-react-todolist/view
```

**Install**

```
npm install
```

**Start the application in development mode**

```
npm start
```

you can test and access the app from http://localhost:8080 using your favorite
browser.

**Build the application for production**

```
npm run build
```

This will generate a bundled js and css files on the `build` folder.

to view the app, you need to install `serve`

```
npm install -g serve
```

then serve the file using this command

```
serve build
```

## Using Docker

You can choose whether if you want to use nginx, apache, or node image for
docker container. You can find the files in the root directory:

* Dockerfile (bitnami/nginx)
* Dockerfile-apache (php:apache)
* Dockerfile-node (node:alpine)

You need to build the application first, and then execute the commands below:

```
docker build -t view-service .
docker run -p 8080:8080 view-service
```

you can access the app from http://localhost:8080 using your favorite browser.
