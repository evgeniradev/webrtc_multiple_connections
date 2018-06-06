# WebRTC: Multiple Connections

A WebRTC app that allows multiple video connections between users.

## Installation

You will need to have [Docker](https://docs.docker.com/) to install the app.

```
$ ./build.sh
```

## Running the app

To run in production mode:

```
$ ./run.sh up
```

To run in development mode:

```
$ ./run.sh development up
```

To shut down:

```
$ ./run.sh down
```

The app will run at [http://localhost](http://localhost).

Please note, getUserMedia() requests are only allowed from secure origins(HTTPS or localhost) starting with Chrome 47.

## To-do list

* CSS/Design
