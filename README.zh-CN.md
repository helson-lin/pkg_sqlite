# PKG_BUILD_NODE_DEPENDENCE

这是一个使用 pkg 跨平台打包带有 `node_sqlite3.node` 的 Node.js 程序的模板。

项目的业务代码是直接复制的，不需要关心。

## 关于

### 如何为我的项目构建？

1. 创建一个名为 `package` 的目录，把所有平台的 `.node` 文件放入其中，确命名规则与当前项目保持一致。
2. 将 `build.js` 复制到你的项目根目录中。确保你的 `package.json` 中有 `name` 和 `pkg` 选项，并且 `pkg.assets` 必须与该项目一致。
3. 在你的 `package.json` 和 GitHub Actions 的 YAML 文件中使用 `node build.js` 来更改你的构建方法。

### 注意事项

 `.node` 文件必须与你的 `sqlite3` 版本兼容。

如果你想要修改打包之后的文件名，请修改 `build.js` 中的代码。

### GitHub Actions

如果你想要自动构建可执行文件和 Docker 镜像，可以使用下面的配置文件。

这个 GitHub Actions 只会在推送版本时触发，并且你不能直接使用它，请根据实际情况进行修改。


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

