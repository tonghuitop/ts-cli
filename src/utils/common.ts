import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import * as clear from 'clear-console'

export interface PackageJSON {
  name: string
  version: string
  description: string
  scripts: {
    [key: string]: string
  }
  [key: string]: unknown
}

export interface JSON {
  [key: string]: unknown
}

/**
 * 读取指定文件下 json 文件
 * @param filename json 文件的路径
 */
export function readJsonFile<T>(filename: string): T {
  return JSON.parse(readFileSync(filename, { encoding: 'utf-8', flag: 'r' }))
}

/**
 * 覆写指定路径下的 json 文件
 * @param filename json 文件的路径
 * @param content json 内容
 */
export function writeJsonFile<T>(filename: string, content: T): void {
  writeFileSync(filename, JSON.stringify(content, null, 2), {
    encoding: 'utf-8'
  })
}

/**
 * 获取项目的绝对路径
 * @param projectName 项目名称
 */
export function getProjectPath(projectName: string): string {
  return resolve(process.cwd(), projectName)
}

/**
 * 打印信息
 */
export function printMsg(msg: string): void {
  console.log(msg)
}

/**
 * 清空命令行
 */
export function clearConsole(): void {
  clear()
}
