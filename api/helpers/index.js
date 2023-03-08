import fs from 'fs'

export const base64MimeType = (encoded) => {
  let result = null

  if (typeof encoded !== 'string') {
    return result
  }

  const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

  if (mime && mime.length) {
    result = mime[1]
  }

  return result
}

export const uploadFile = (mime, streamData, path, subDir = null) => new Promise((resolve, reject) => {
  let fullPath = `static/${path}`
  const timestamp = Math.floor(Date.now() / 1000)
  const ext = mime.split('/')[1]
  const fileData = streamData.split(';base64,').pop()

  if (subDir !== null) {
    if (!fs.access(`${fullPath}/${subDir}`)) {
      fs.mkdirSync(`${fullPath}/${subDir}`)
    }

    fullPath += `/${subDir}`
  }

  fs.writeFile(`${fullPath}/${timestamp}.${ext}`, fileData, { encoding: 'base64' }, (err) => {
    if (err) {
      resolve({
        status: false
      })
    } else {
      resolve({
        status: true,
        fileName: `${timestamp}.${ext}`
      })
    }
  })
})
