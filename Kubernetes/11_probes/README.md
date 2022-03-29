<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Creating pods with a liveness probe

## LAB Overview

In this lab, you will create a Kubernetes pod with a liveness probe defined

## Task 1: Creating a pod with a liveness probe

> **_NOTE:_** File `pod_livenss.yaml` use a public image from Docker Hub: <https://hub.docker.com/r/danchmpis/chm-k8s-probe>.\
> This image was built using files from [./app directory](./files/app)

1. Open `pod_livenss.yaml` file and analyze its code
1. Create a pod:
    
    ```bash
    kubectl apply -f pod_liveness.yaml
    ```

1. Check if pod is created:

    ```bash
    kubectl get pods
    ```

1. Check whether or not the **STATUS** field is set to *Running*. If so, the liveness probe was passed.

## Task 2: Mimic application crash

1. Send request that causes the application to stop responding correctly to liveness probe:
   
    ```bash
   kubectl exec liveness-http -- curl -i -X POST -H 'Content-Type: application/json' -d '{"live":false}' localhost:8080/settings
    ```
    
   Now, the `/health` endpoint will respond with 500 HTTP Error on each request. This will cause the liveness probe to fail and thus kubelet will restart the container.

1. Check the number of **RESTART**s of a pod: 

    ```bash
    kubectl get pods -w
    ```

1. If your container was restarted, it means the liveness probe is working!

## Task 3: Clean up

1. Delete the pod using 

    ```bash
    kubectl delete pod liveness-http --grace-period=0 --force
    ```

## END LAB

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
