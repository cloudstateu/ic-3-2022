<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Deployments

## LAB Overview
#### In this lab you will work with Deployments

## Lab visualization:
![img](./img/s1.png)

## Task 1: Creating a Deployment

In this task you will create a deployment containing twree replicas od nginx.

1. Create new file by typing `nano deployment.yaml`.
1. Download [manifest file](./files/deployment.yaml) and paste its content into editor.
1. Save changes by pressing *CTRL+O* and *CTRL-X*.
1. Type `kubectl apply -f deployment.yaml` and press enter.

## Task 2: Exploring Deployment

The Deployment is managind ReplicaSet. Let's see the label selector used by Deployment.

1. Run following command: 

   ```bash
   kubectl get deployments deployment -o=jsonpath='{.spec.selector.matchLabels}'
   ```
   ![img](./img/deployment1.png)

1. The Deployment is managing a ReplicaSet with the label app=nginx. Find that ReplicaSet by running command: `kubectl get replicasets --selector=app=nginx`
You can see, that you have 3 replicas in your Deployment and in your ReplicaSet.
    ![img](./img/deployment2.png)

1. Scale the deployment by running: 

    ```bash
    kubectl scale deployments deployment --replicas=4
    ```

1. Get the list of Pods inside ReplicaSet: 
   ```bash
   kubectl get replicasets --selector=app=nginx
   ```
   As expected you have 4 replicas of nginx Pod.
   ![img](./img/deployment3.png)

1. Let’s try the opposite, scaling the ReplicaSet. Replace the ReplicaSet name with yours (you can find it using this command: `kubectl get replicasets --selector=app=nginx` ) and execute following command:
   
   ```bash
   kubectl scale replicasets <-REPLICASET-NAME-> --replicas=1
   ```

1. Get the list of Pods inside ReplicaSet once again: 
   ```bash
   kubectl get replicasets --selector=app=nginx
   ```
   "Unexpectedly" you have still 4 replicas of the Pod.
   ![img](./img/deployment4.png)

   Remember, Kubernetes is self-healing system. The top-level Deployment object is managing this ReplicaSet. When you adjust the number of replicas to one, it no longer matches the desired state of the deployment, which has replicas set to 4.

1. Please delete the deployment: 
   ```bash
   kubectl delete -f deployment.yaml
   ```
## END LAB


<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
