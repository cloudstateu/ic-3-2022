# Sample application

## Running application for development

In development mode the application source code is mounted to running containers. This allow us to use hot code reloading mechanism and don't rebuild images after every change in the code.

1. In directory containing `docker-compose.yaml` run:

    ```bash
    docker-compose -f docker-compose.dev.yaml up [--build]
    ```

    Use `--build` when you switch from development to production mode

1. Open browser and visit `frontend` at [http://localhost:8080](http://localhost:8080)
1. Open browser and request `api` [http://localhost:8888/info](http://localhost:8888/info)
1. Stop working containers using `Ctrl-C`


## Running application in production mode

1. In directory containing `docker-compose.yaml` run:

    ```bash
    docker-compose up [--build]
    ```

    Use `--build` when you switch from development to production mode

In production mode code is copied to container. There is no hot code reloading, so after each change in the code you need to rebuild your images. This mode is configured for production use.