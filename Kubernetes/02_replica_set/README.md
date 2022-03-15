<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# ReplicaSet

## LAB Overview
   In this lab you will work with a ReplicaSet

## Task 1: Creating a ReplicaSet

1. Get the [manifest file](./files/rs.yaml) and save it on your machine.
1. In terminal type `kubectl create -f rs.yaml` and press enter.
1. Using `kubectl get pods`, check if Kubernetes created a new pod.

   ![img](./img/replicaset1.png)

## Task 2: Inspecting ReplicaSet and its behaviour

1. Execute following command:

   ```bash
   kubectl describe rs frontend
   ```

   ![img](./img/replicaset2.png)

   You can see the label selector for the ReplicaSet, as well as the state of all of the replicas managed by the ReplicaSet.

1. Once again get a list of pods inside the replica `kubectl get pods -l app=frontend`
1. Execute the following command `kubectl delete pod <POD-NAME>` but replace _<POD-NAME>_ with one of the pod's name, i.e.: `kubectl delete pod frontend-z5bwf`.
1. Get a list of pods `kubectl get pods -l app=frontend`

   ![img](./img/replicaset3.png)

   As you can see, ReplicaSet still have 3 running pods.

## Task 3: Scaling ReplicaSet

You can scale ReplicaSet using declarative way by changing manifest file. But you can also do it imperative way.

1. Execute following command:
   `kubectl scale replicaset frontend --replicas=5`
2. Get a list of pods `kubectl get pods -l app=frontend`
   ![img](./img/replicaset4.png)
   Now you should have 5 pods running inside ReplicaSet.

## Task 4: Delete ReplicaSet

1. Delete the replicaset by executing following command:
   ```bash
   kubectl delete rs frontend
   ```
1. Now all the pods managed by replica set should be deleted.

## END LAB

<br><br>

<center><p>&copy; 2022 Chmurowisko Sp. z o.o.<p></center>
