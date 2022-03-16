<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Rollout

## LAB Overview

In this lab you will create an application Deployment. Then you'll update it, examine its history and do the rollback.

## Task 1: Create a Deployment

1. Open the [manifest file](./files/deployment.yaml) and check its contents.
1. Create new Deployment by running:

    ```bash
    kubectl apply -f deployment.yaml
    ```

1. Check if  Deployment is created and Pods are running:

    ```bash
    kubectl get deployment
    ```

    ```bash
    kubectl get pods
    ```

## Task 2: Expose Deployment via `kubectl port-forward` and Azure Web Preview

1. Setup port-forwarding to route incoming traffic on port 9000 to Deployment's Pods:

    ```bash
    kubectl port-forward deployment/rollout 9000:8080
    ```

1. Visit web page via Azure Web Preview

    ![img](./img/01-web-preview.png)
    ![img](./img/02-configure-web-preview.png)
    ![img](./img/03-running-app.png)

## Task 3: Examine the deployment

1. Verify details of the Deployment

    ```bash
    kubectl describe deployment rollout
    ```

1. Check if each Pod belonging to current rollout has `pod-template-hash` label

    ```bash
    kubectl get pods --show-labels
    ```

## Task 4: Update the Deployment

1. To update the container image of the Deployment run the following command:

    ```bash
    kubectl set image --record deployment/rollout app=macborowy/workshop-rollout:2.0.0
    ```

1. Check if all Pods in Deployment are `READY`, `UP-TO-DATE` and `AVAILABLE`: 

    ```bash
    kubectl get deployment
    ```

1. Verify if new Pods were created:

    ```bash
    kubectl get pods --show-lables
    ```

1. Configure the port-forwarding to your Deployment again: 

    ```bash
    kubectl port-forward deployment/rollout 9001:8080
    ```

1. Change the Web Preview configuration to open port 9001 (instead of previous 9000; if you try to expose application on same port keep in mind that Azure needs time to reload application exposed by Web Preview).

    ![img](./img/04-change-web-preview-config.png)
    ![img](./img/05-new-version.png)

## 5. Update application version by modifing Deployment manifest

1. Open the manifest file by running:

    ```bash
    nano deployment.yaml
    ```

 1. Edit the following properties of the Deployment:

    - set replicas to: 5
    - set image to: `macborowy/workshop-rollout:3.0.0`

    To Deployment's `metadata` add new annotation:

    ```bash
    annotations:
      kubernetes.io/change-cause: "Image changed to 3.0.0"
    ```

    If you're not quite sure how to update manifest file, use [updated-deployment.yaml](./files/updated-deployment.yaml) file.

1. Update the Deployment by running: 

    ```bash
    kubectl apply -f <manifest-file>
    ```

    After a while you'll have 5 Pods with version `3.0.0` running managed by your Deployment.

    ![img](./img/06-five-pods.png)

1. Setup port-forwarding and check if application is running in new version:

    ```bash
    kubectl port-forward deployment/rollout 9003:8080
    ```

    ![img](./img/07-new-version.png)

## Task 6: Managing Rollout History

1. Get the history of the Deployment by running:

    ```bash
    kubectl rollout history deployment rollout
    ```
    ![img](./img/08-rollout-history.png)

1. If you are interested in more details about a particular revision, you can add the **--revision** flag to view details about that specific revision:

    ```bash
    kubectl rollout history deployment rollout --revision=2
    ```

    ![img](./img/09-rollout-details.png)

1. Undo the last rollout by running:

    ```bash
    kubectl rollout undo deployments rollout
    ```

1. Check the history of Deployments

    ```bash
    kubectl rollout history deployment rollout
    ```

    ![img](./img/10-rollback.png)

    As you notices, there is no longer Deployment 2, and Deployment 4 was added. Now we have revisions 1,3 and 4.

1. Check if application is actually rolled-back:

    ```bash
    kubectl port-forward deployment/rollout 9004:8080
    ```

    ![img](./img/11-rollback-effect.png)

1. Rollback to revision 3 by running

    ```bash
    kubectl rollout undo deployments rollback --to-revision=3
    ```

    and check the history: 
    
    ```bash
    kubectl rollout history deployment rollback
    ```

    The application should be now back in version `3.0.0`.

    ![img](./img/07-new-version.png)

## Task 7: Delete the Deployment

1. Please delete the Deployment:

    ```bash
    kubectl delete deployment rollback
    ```

## END LAB

<center><p>&copy; 2022 Chmurowisko Sp. z o.o.<p></center>
