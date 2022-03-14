<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Run web application

## Lab Overeview

In this lab you'll learn how to run simple Node.js application in the container. You'll also see how to get new version of application running in container after adding a new feature to the application.

## Task 1: Create container and test web application

1. In terminal go to `/app` directory.
2. Run: `docker build -t app .`. Wait for the build to finish.
3. Run `docker images` and verify that your image is on a list.
4. Execute `docker run -d -p 8080:8080 app`
5. Check your web application - execute: `curl localhost:8080`
6. Run: `curl localhost:8080/greet?name=`**`<here write your name>`**
7. Stop the container

## Task 2: Modify your web app and test it

1. Open `app.js` and add code below:
   
    ```js
    app.get("/test", (req, res) => {
        res.json({status: 'ok', data: null});
    });
    ```

1. Save your modyfication and then build image again: `docker build -t app .`
1. Run container: `docker run -d -p 8080:8080 app`
1. Execute `curl localhost:8080/test` and check if it returns expected data

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>