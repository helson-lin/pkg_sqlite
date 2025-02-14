# PKG_BUILD_NODE_DEPENDENCE

This is a template for packaging a Node program with node sqlite3.node across platforms using pkg.

The business code for this project is a direct copy, don't care.


## About

### How to build for my project?

1. Create a directory named `package` drop the all platform’s `.node` file, Keep the command mode consistent with the current project
2. Copy the `build.js` to your project root directory. And make sure there have `name` and `pkg` options in your `packge.json`. `pkg.assets` must be the same as this project.
3. Change your package build method with `node build.js` in your `package.json` and your github action's yml file.

### Notification

You should know the `.node` file must is compitable with you `sqlite3` version

If you want to change the dist filename, please modify the code in `build.js`, it's easy for you.


### Github Action

If you want auto build executable file and docker image, you can work with the below configuration file.

This GitHub action will only be triggered when you push a version, and you cannot use it directly, please modify it according to the actual situation.


```yml
name: Build and push Docker image

on:
  push:
    branches: [ main ]
    tags:
        - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:

    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up QEMU
      uses: docker/setup-qemu-action@v1

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Extract tag name
      id: tag_name
      run: echo "TAG=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV


    - name: Login to Docker Hub
      uses: docker/login-action@v1
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Prepare Docker Tags
      id: docker_tags
      run: |
        if [[ "${{ env.TAG }}" == *beta* ]]; then
          echo "::set-output name=tags::h55205l/pkg_node_template:${{ env.TAG }}"
        else
          echo "::set-output name=tags::h55205l/pkg_node_template:latest,h55205l/pkg_node_template:${{ env.TAG }}"
        fi

    - name: Build And Push Docker image
      uses: docker/build-push-action@v3
      with:
          context: ./
          file: Dockerfile
          push: true
          platforms: linux/amd64
          tags: ${{ steps.docker_tags.outputs.tags }}


    - name: Prepare Arm Docker Tags
      id: docker_arm_tags
      run: |
        if [[ "${{ env.TAG }}" == *beta* ]]; then
          echo "::set-output name=tags::h55205l/pkg_node_template:arm-${{ env.TAG }}"
        else
          echo "::set-output name=tags::h55205l/pkg_node_template:arm,h55205l/pkg_node_template:arm-${{ env.TAG }}"
        fi


    - name: Build Docker Arm image
      uses: docker/build-push-action@v3
      with:
        context: ./
        file: Dockerfile-arm
        push: true
        platforms: linux/arm64
        tags: ${{ steps.docker_arm_tags.outputs.tags }}


```

