## Github Action Sync Docker Image

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
          echo "::set-output name=tags::h55205l/con:${{ env.TAG }}"
        else
          echo "::set-output name=tags::h55205l/con:latest,h55205l/con:${{ env.TAG }}"
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
          echo "::set-output name=tags::h55205l/con:arm-${{ env.TAG }}"
        else
          echo "::set-output name=tags::h55205l/con:arm,h55205l/con:arm-${{ env.TAG }}"
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