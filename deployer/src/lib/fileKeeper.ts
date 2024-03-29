import fs from 'fs'
import path from 'path'

export function getAllFilePaths(target: string) {
  let result: string[] = [];
  const folderData = fs.readdirSync(target)

  folderData.forEach(item => {
    const itemPath = path.join(target, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      result = result.concat(getAllFilePaths(itemPath))
    } else {
      result.push(itemPath)
    }
  });

  return result
}