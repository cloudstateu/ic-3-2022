<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Working with Dockerfiles

## Lab Overeview

In this lab you will learn how to work with Dockerfiles and how to build your own docker images and containers

## Task 1: Create container with nginx server

1. Verify content of `Dockerfile` file
1. Run: 

    ```bash
    docker build -t my-nginx:1.0.0 .
    ```
    
    Wait for the build to finish.

1. Run `docker images` and verify that your image is on a list
1. Execute `docker run -d -p 8081:80 my-nginx:1.0.0`
1. Open web browser and verify that your container is running `http://<VM-IP>:8081`

## Task 2: Run nginx server with custom page added

1. Modify existing Dockerfile so it replace default NGINX page with custom `index.html`:

    ```bash
    COPY src/index.html /usr/share/nginx/html
    ```

1. Build image: `docker build -t my-nginx:2.0.0 .`
1. Run container: `docker run -d -p 8082:80 my-nginx:2.0.0`
1. Check your web page: `http://<VM-IP>:8082`

## Task 3: Mount /src directory for development

1. Run another container with local `/src` directory mounted to containers filesystem:

    ```bash
    docker run -d -p 8083:80 -v $(pwd)/src:/usr/share/nginx/html my-nginx:3.0.0
    ```

1. Verify that NGINX is serving `index.html`
1. Change `index.html` and save file
1. Verify that NGINX is serving updated version of `index.html`