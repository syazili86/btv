import fs from 'fs'
import { base64MimeType, uploadFile } from '../helpers'
import multipart from 'connect-multiparty'

const multipartMiddleware = multipart()
// const timestamp = Math.floor(Date.now() / 1000)
const ACCESS_CONTROLL_ALLOW_ORIGIN = false

export const programContents = (router, model) => {
  router.get('/program-contents', (req, res) => {
    if (typeof req.temp !== 'undefined') {
      Object.assign(req.where, { categorieName: req.temp })
    }

    model.ProgramContent.findAll({
      attributes: req.attr,
      where: req.where,
      order: req.order,
      limit: req.limit,
      offset: req.offset,
      include: [
        {
          model: model.Program,
          required: true
        }
      ]
    }).then((result) => {
      return res.status(200).send({
        success: true,
        data: result
      })
    }).catch((err) => {
      return res.status(410).send({
        success: false,
        response: err
      })
    })
  })

  router.post('/program-contents', async (req, res) => {
    const contentFile = req.body.contentFile
    // Overide content name
    req.body.content = '152ss'

    // Check if content video is corrupted or video content is not uploaded
    if (typeof contentFile === 'undefined' || contentFile.chunksSize <= 0 || !contentFile.uniqueIdentifier) {
      return res.status(401).send({
        success: false,
        response: 'Content Video cannot be empty!'
      })
    }

    model.ProgramContent.create(req.body)
      .then(async (result) => {
        // get list of all content video chunks in tmp folder
        const files = fs
          .readdirSync(`.tmp/`)
          .filter((item, _) => item.includes(contentFile.uniqueIdentifier))

        if (files.length !== contentFile.chunksSize) {
          result.destroy({
            force: true
          }).then(() => {
            return res.status(401).send({
              success: false,
              response: 'Failed upload program content video! Data is corrupted.'
            })
          })
        } else {
          try {
            fs.mkdirSync(`static/programs/contents/${result.id}`)

            for (let index = 1; index <= contentFile.chunksSize; index++) {
              fs.rename(`.tmp/${contentFile.uniqueIdentifier}.${index}`, `static/programs/contents/${result.id}/${result.id}${contentFile.ext}.${index}`, (err) => {
                console.log(err)
              })
            }

            result.update(
              { content: `${result.id}${contentFile.ext}` }
            ).then(() => {
              return res.status(201).send({
                success: true,
                response: 'New Program Content has been added',
                result: result
              })
            })
          } catch (e) { }
        }
      }).catch((err) => {
        let response = ''
        if (err.name === 'SequelizeValidationError') {
          response = err.errors[0].message
        } else {
          response = err
        }

        for (let index = 1; index <= contentFile.chunksSize; index++) {
          fs.unlinkSync(`.tmp/${contentFile.uniqueIdentifier}.${index}`)
        }

        return res.status(410).send({
          success: false,
          response: 'Failed to save program',
          result: response
        })
      })
  })

  router.put('/program-contents/:id', async (req, res) => {
    req.body['slug'] = ''
    const mime = base64MimeType(req.body.poster)

    if (mime) {
      const uplResult = await uploadFile(mime, req.body.poster, 'programs')

      if (uplResult.status) {
        req.body.poster = await uplResult.fileName
      }
    }

    model.Program.findById(req.params.id).then((category) => {
      category.updateAttributes(req.body).then((result) => {
        return res.status(201).send({
          success: true,
          response: 'A Program updated successfuly',
          result: result
        })
      }).catch((err) => {
        return res.status(410).send({
          success: false,
          response: 'Failed to update program',
          result: err
        })
      })
    }).catch((errCat) => {
      return res.status(410).send({
        success: false,
        response: 'No records were found with that id',
        result: errCat
      })
    })
  })

  router.delete('/program-contents/:id', (req, res) => {
    const where = {}
    const ids = req.params.id

    where['id'] = { [model.Sequelize.Op.in]: ids.split(',') }
    model.Program.destroy({
      where: where
    }).then((result) => {
      return res.status(200).send({
        success: true,
        response: 'A Program has been removed',
        result: result
      })
    }).catch((err) => {
      return res.status(410).send({
        success: false,
        response: 'Failed to remove program',
        result: err
      })
    })
  })

  router.post('/program-contents/upload', multipartMiddleware, (req, res) => {
    const uploader = require('../helpers/uploader-node')(`.tmp`)

    uploader.post(req, (status, identifier) => {
      console.log('POST', status, identifier)
      if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'content-type')
      }

      setTimeout(() => {
        res.send(status)
      }, 500)
    })
  })

  router.get('/program-contents/download/:identifier', (req, res) => {
    const uploader = require('../helpers/uploader-node')(`.tmp`)

    uploader.write(req.params.identifier, res)
  })

  router.get('/stream/:unq', async (req, res) => {
    const streamHelper = await require('../helpers/uploader-node')(`static/programs/contents/${req.params.unq}`)

    model.ProgramContent.findOne({
      where: { id: req.params.unq }
    }).then((result) => {
      streamHelper.write(`${result.content}`, res)
    }).catch((err) => {
      console.log(err)
    })
  })
}
