import os from 'os'
import disk from 'diskusage'

export const sysoverview = (router) => {
  router.post('/sysoverview/disk', async (req, res) => {
    let path = os.platform() === 'win32' ? 'c:' : '/'
    const symbol = req.body.symbol

    try {
      const diskInfo = await disk.check(path)

      if (symbol) {
        if (symbol === 'GB') {
          diskInfo.available = Math.round((diskInfo.available / 1000000000) * 100) / 100
          diskInfo.total = Math.round((diskInfo.total / 1000000000) * 100) / 100
        } else if (symbol === 'MB') {
          diskInfo.available = Math.round((diskInfo.available / 1000000000) * 100) / 100
          diskInfo.total = Math.round((diskInfo.total / 1000000) * 100) / 100
        } else if (symbol === 'KB') {
          diskInfo.available = Math.round((diskInfo.available / 1000000000) * 100) / 100
          diskInfo.total = Math.round((diskInfo.total / 1000) * 100) / 100
        }
      }

      return res.status(200).send({
        success: true,
        response: 'Success get disk info.',
        result: diskInfo
      })
    } catch (error) {
      return res.status(401).send({
        success: false,
        response: 'Failed',
        result: error
      })
    }
  })
}
