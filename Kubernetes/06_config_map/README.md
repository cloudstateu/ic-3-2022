<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# ConfigMaps

## LAB Overview

In this lab you will work with ConfigMaps.

ConfigMaps are used to provide configuration information for workloads. This can either be a single evnironment variable or a whole configuration in the form of a file.

## Task 1: Create a ConfigMap using Manifest File

1. Open [manifest file](./files/configmaps.yaml) and check its contents
1. Create ConfigMaps by running:

    ```bash
    kubectl apply -f configmaps.yaml
    ```

1. Check if ConfigMaps are created:

    ```bash
    kubectl get cm
    ```

1. Check ConfigMaps details:

    ```bash
    kubectl describe cm/cm-frontend
    kubectl describe cm/cm-backend
    ```

## Task 2: Use ConfigMap to populate environment variables into container

You will create a Pods with three environment variables.

1. Open [Deployment's manifest file](./files/deploy-cm-env-vars.yaml) and check how environment variables are defined for container
1. Create a Deployment by running: 

    ```bash
    kubectl apply -f deploy-cm-env-vars.yaml
    ```

1. Check if Pod has expected environment variables:

    ```bash
    kubectl exec <pod> -- env
    ```

    Command above runs `env` inside container and returns the output to the user.

## Task 3: Inject all ConfigMap values as environment variables

In this task you'll inject all ConfigMap values as container's environment variables using `envFrom` property.

1. Open [Deployment's manifest file](./files/deploy-cm-env-from.yaml) and check how environment variables are defined for container
1. Create a Deployment by running: 

    ```bash
    kubectl apply -f deploy-cm-env-from.yaml
    ```

1. Check if Pod has expected environment variables:

    ```bash
    kubectl exec <pod> -- env
    ```

## Task 4: Mount ConfigMap as Volume

When you mount a ConfigMap as Volume each ConfigMap key is converted to single file with matching content.

This method of injecting configuration is useful if your application already expects configuration to be provided in file form.

1. Open [Deployment's manifest file](./files/deploy-cm-volume.yaml) and check how environment variables are defined for container
1. Create a Deployment by running: 

    ```bash
    kubectl apply -f deploy-cm-volume.yaml
    ```

1. Get the list of files inside `/mnt/config` directory:

    ```bash
    kubectl exec <pod> -- ls /mnt/config
    ```

1. Get the content of `appsettings.json` file:

    ```bash
    kubectl exec <pod> -- cat /mnt/config/appsettings.json
    ```

## Task 5: Delete Deployments and ConfigMaps

1. Inside `/files` directory run following command to delete all objects created during this lab:

    ```bash
    kubectl delete -f .
    ```

## END LAB

<br><br>

<center><p>&copy; 2021 Chmurowisko Sp. z o.o.<p></center>
