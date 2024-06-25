#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync} = require('child_process')
// 源文件路径（根据你的项目结构调整）
let isDebug = false;
let releaseName;
const argv = process.argv.slice(2)
if (argv && argv[0] === '--debug') isDebug = true
const sourcePath = path.join(__dirname, "package/");
// 目标路径
const targetPath = path.join(__dirname, "node_modules/sqlite3/build/Release/");

const moveNodeSqlite = (targetPlatform) => {
  // 根据目标平台选择正确的文件
  let targetFile;
  const name = targetPlatform.split('-').slice(1).join('-')
  switch (name) {
    case "linux-x64":
      targetFile = "linux_x64_node_sqlite3.node";
      break;
    case "linux-arm64":
        targetFile = "linux_arm64_node_sqlite3.node";
        break;
    case "macos-arm64":
      targetFile = "macos_arm64_node_sqlite3.node";
      break;
    case "macos-arm64":
      targetFile = "macos_x64_node_sqlite3.node";
      break;
    default:
      console.error(`\n ❗️ Unsupported target platform：${targetPlatform} \n`);
  }
  if (targetFile) {
    // 复制文件
    fs.copyFileSync(
      path.join(sourcePath, targetFile),
      path.join(targetPath, "node_sqlite3.node")
    );
  
    console.log(
      `\n ✅ Copied ${path.join(sourcePath, targetFile)} to ${path.join(
        targetPath,
        "node_sqlite3.node"
      )}\n`
    );
  }
};


const pkgRelease = (targetPlatform) => {
    moveNodeSqlite(targetPlatform);
    // 执行打包命令
    execSync(`pkg . -t ${targetPlatform} --output ./dist/${releaseName}-${targetPlatform}${targetPlatform.indexOf('windows') !== -1 ? '.exe' : ''}` + (isDebug ? ' --debug' : ''), { stdio: 'inherit' })
};

const start = () => {
  try {
    const dataString = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
    const data = JSON.parse(dataString)
    const platforms = data.pkg.targets
    releaseName = data.name
    for (let item of platforms) {
      pkgRelease(item)
    }
  } catch (e) {
    console.error('❗️ read package.json failed', e)
  }
}

const getSqliteReleaseDir = () => {
  const baseDir = path.join(__dirname, 'node_modules')
  const allDir = fs.readdirSync(baseDir)
  const sqlite3Dir = allDir.find(i => i.startsWith('sqlite3'))
  const ReleaseDir = path.join(baseDir, sqlite3Dir, "build/Release/")
  console.log(ReleaseDir)
}
start()
