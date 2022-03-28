<img src="../../../img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Secrets

## Overview

In this lab you will work with Secrets.

Secrets enable container images to be created without bundling sensitive data. This allows containers to remain portable across environments.

## Task 1: Create a Secret

1. Create a Secret using [secret.yaml](./files/secret.yaml) manifest file: 

    ```bash
    kubectl create -f secret.yaml
    ```

    and check the Secret:

    ```bash
    kubectl describe secret my-secret
    ```

1. Check exact value of the `my-secret`

    ```bash
    kubectl get secret my-secret -o yaml
    ```

    `kubectl describe` and `kubectl get` is not showing the contents of a secret by default. This is to protect the secret from being exposed accidentally to an onlooker or from being stored in a terminal log.

    ![svg](./img/secret.svg)

1. Decode secret values stored as Base64

    ```bash
    kubectl get secret my-secret -o=jsonpath='{.data.user}' | base64 -d
    kubectl get secret my-secret -o=jsonpath='{.data.password}' | base64 -d
    ```

    ![svg](./img/decode.svg)

## Task 2: Inject a Secret to Pod as environment variable and volume

1. Create a Pod with Secrets injected as environment variables:

    ```bash
    kubectl apply -f deploy-secret-env-vars.yaml
    ```

1. List environment variables on running container and check if `SECRET_USER` and `SECRET_PASSWORD` exist:

    ```bash
    kubectl exec <SECRET-ENV-VARS-POD> -- env
    ```

1. Create a Pod with Secrets injected as attached Volume:

    ```bash
    kubectl  apply -f deploy-secret-volume.yaml
    ```

1. Check if volume is attached and if it contains files with secret values:

    ```bash
    kubectl exec <SECRET-VOLUME-POD> -- ls /mnt/secrets
    kubectl exec <SECRET-VOLUME-POD> -- ls /mnt/secrets/postgres
    ```

    ```bash
    kubectl exec <SECRET-VOLUME-POD> -- cat /mnt/secrets/postgres/username
    kubectl exec <SECRET-VOLUME-POD> -- cat /mnt/secrets/postgres/password
    ```

![svg](./img/pod-output.svg)

## END LAB

<br><br>

<center><p>&copy; 2021-2022 Chmurowisko Sp. z o.o.<p></center>
