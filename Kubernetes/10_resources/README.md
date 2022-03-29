<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Pod's resources management

## LAB Overview

In this lab, you will learn how to manage the resources allocated to a container running in Pod.

## Task 1: Show resources available on a Node

1. Show resources details on a Node (look for _Capacity_ and _Allocatable_ sections)

    ```bash
    kubectl describe nodes
    ```

    ![img](img/01-kubectl-describe-nodes.svg)

    - `Capacity` - resources provisioned on a Node; `Standard_DS2_v2` machine has 2 CPUs and 7 GB of memory
    - `Allocatable` - resources available for use by a Pod; here it is 1.9 CPU and ~4.5GiB of memory

    The remaining resources are reserved by system and Kubernetes tools installed on a Node.

1. View the currently used resources (CPU and memory) on a Node

    ```bash
    kubectl top nodes
    ```

    ![img](img/01-kubectl-top-nodes.svg)

## Task 2: Create a Pod with `request` and `limits` defined

1. Display the contents of the file [`pod.yaml`](./files/pod.yaml) and check how Pod's `requests` and `limits` are defined

    YAML describes a Pod with a `vish/stress` container. The application performs a stress test on the CPU. This way, we imitate running application that actually uses the resources available on a Node.

    YAML has 3 important parts:

    ![img](img/02-resource-details.svg)

    - `.spec.containers[].resources.requests.cpu` - guaranteed CPU time, which will be allocated to the container
    - `.spec.containers[].resources.limits.cpu` - CPU time that will be assigned to the container when Node has unused resources
    - `.spec.containers[].args[]` - arguments configuring the stress test; `-cpus 2` means stress test use 2 CPUs

    Note that the value of `.spec.containers[0].args[]` is greater than the value of `requests` and `limits`. However, we expect that despite the application's high consumption (2 CPUs), Kubernetes will not allow it to use more than 1 CPU (the `limits` value).

1. Create a Pod using the [`pod.yaml`](./files/pod.yaml)

    ```bash
    kubectl create -f pod.yaml
    ```

    ![img](img/03-pod-created.svg)

1. Check the resources used by Pod

    ```bash
    kubectl top pods
    ```

    ![img](./img/04-top-pods.svg)

    If Pod does not use any resources yet, wait a while for the stress test to warm up.

1. Check how information about `requests` and `limits` are displayed in the Pod details

    ```bash
    kubectl describe pod/<name> # replace <name> with Pod's name
    ```

    ![img](./img/06-pod-details.svg)

1. Delete the Pod

    ```bash
    kubectl delete pod --all
    ```

## Task 3: Create a Pod that requires more resources than resources available on a single Node

1. Modify `pod.yaml` file and change container's `requests.cpu` and `limits.cpu` to `10` (leave `memory` value as is)

    ```yaml
    ...
    resources:
      requests:
        cpu: "10"
        memory: 128Mi
      limits:
        cpu: "10"
        memory: 256Mi
    ...
    ```

1. Create the Pod

    ```bash
    kubectl create -f pod.yaml
    ```

1. Check Pod status

    ```bash
    kubectl get pods
    ```

    ![img](./img/07-huge-pod-pending.svg)

1. Describe the Pod (replace `<name>` with correct name)

    ```bash
    kubectl describe pod/<name>
    ```

    Note that scheduler failed to schedule a Pod due to insufficient resources available.

    ![img](./img/08-huge-pod-details.svg)

1. Delete the Pod

    ```bash
    kubectl delete pod --all
    ```

## Task 4: Visualize difference between _requests_ and _limits_

1. Change the values ​​of `requests` and `limits` in the file [`pod.yaml`](./files/pod.yaml). Set them to `request.cpu: 0.25` and `limits.cpu: 1`:

    ```yaml
    ...
    resources:
      requests:
        cpu: "0.25"
        memory: 128Mi
      limits:
        cpu: "1"
        memory: 256Mi
    ...
    ```

1. Create a Pod, check its status and list the resources it currently uses

    ```bash
    kubectl create -f pod.yaml
    ```

    ![img](./img/09-limits-first-pod.svg)

    Note that the Pod uses approximately `1000m` CPU (1000m = 1). It is the value of `limits.cpu`. Kubernetes allowed the Pod to use more resources than the value of `requests.cpu`, because currently there were no other Pods that needed them for their work.

1. View details of a Node and find the _Non-terminated Pods_ section showing Pods `requests` and` limits` values

    ```bash
    kubectl describe node
    ```

    ![img](./img/10-limits-node-details.svg)

    Note that the Node has `250m` CPU reserved for the Pod created earlier (value in the _CPU Requests_ column)

1. Create another Pod, check its status and list the resources currently used by both Pods

    ```bash
    kubectl create -f pod.yaml
    ```

    ```bash
    kubectl top pods
    ```

    ![img](./img/11-limits-second-pod.svg)
    
1. Check how _Allocated Resources_ section changed

    ![img](./img/12-limits-node-details.svg)
    
    Kubernetes reserved more resources, meaning it will be guaranted for Pods that requested them, but cluster has less space to schedule new Pods.

1. Create another Pod, check its status and list the resources currently used by Pods

   ![img](./img/13-limits-third-pod.svg)

   Kubernetes created new Pod and distributed all extra resources evenly between running Pods. It means Kubernetes throttled CPU resources on previously created Pods and assigned them to a new Pod.

1. Check how _Allocated Resources_ section changed

    ![img](./img/14-limits-node-details.svg)

1. Try to create 3 more Pods, check their statuses and list the resources currently used by Pods

    ```bash
    for i in {0..2}; do kubectl create -f pod.yaml; done
    ```

    Note that, not all Pods could be created because the Node no longer had resources that could be reserved for new Pods.

    ![img](./img/15-limits-unavailable-resources.svg)
    ![img](./img/16-limits-node-details.svg)


## END LAB

<br><br>


<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
