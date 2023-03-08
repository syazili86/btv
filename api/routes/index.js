/* 'use strict'

import fs from 'fs'
import path from 'path'

const basename = path.basename(__filename)
const routers = []

export default (router, model) => {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(async file => {
      const imported = await import('./sysoverview')
      imported.default.execute(router, model)
      // console.log('file route', imported.default())
      // routers.push(require(path.join(__dirname, file))(router, model))
    })
}
 */