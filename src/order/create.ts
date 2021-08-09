/**
 * create 命令行的具体任务
 */
import {
  isFileExist,
  selectFeature,
  initProjectDir,
  changePackageInfo,
  installTSAndInit,
  installTypesNode,
  installDevEnvironment,
  installFeature,
  end
} from '../utils/create'
export default async function create(projectName: string): Promise<void> {
  // 判断文件是否存在
  isFileExist(projectName)
  // 选择需要的功能
  const feature = await selectFeature()
  // 初始化项目目录
  initProjectDir(projectName)
  // 改写项目的 package.json 基本信息，比如 name
  changePackageInfo(projectName)
  // 安装 typescript 并初始化
  installTSAndInit()
  // 安装 @types/node
  installTypesNode()
  // 安装开发环境，支持实时编译
  installDevEnvironment()
  // 安装 feature
  installFeature(feature)
  // 结束
  end(projectName)
}
