import { base64MimeType, uploadFile } from '../helpers'

export const programs = (router, model) => {
  router.get('/programs', (req, res) => {
    if (typeof req.temp !== 'undefined') {
      Object.assign(req.where, { categorieName: req.temp })
    }

    model.Program.findAll({
      attributes: req.attr,
      where: req.where,
      limit: req.limit,
      offset: req.offset,
      include: [
        {
          model: model.Categorie
        },
        {
          model: model.ProgramContent
          // required: true
        }
      ],
      order: req.order
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

  router.post('/programs', async (req, res) => {
    const mime = await base64MimeType(req.body.poster)

    if (mime) {
      const uplResult = await uploadFile(mime, req.body.poster, 'programs')

      if (!uplResult.status) {
        return res.status(401).send({
          success: false,
          response: 'Failed upload poster image!'
        })
      } else {
        req.body.poster = await uplResult.fileName
      }
    } else {
      return res.status(401).send({
        success: false,
        response: 'Poster image cannot be empty!'
      })
    }

    model.Program.create(req.body)
      .then((result) => {
        return res.status(201).send({
          success: true,
          response: 'New Program has been added',
          result: result
        })
      }).catch((err) => {
        let response = ''
        if (err.name === 'SequelizeValidationError') {
          response = err.errors[0].message
        } else {
          response = err
        }

        return res.status(410).send({
          success: false,
          response: 'Failed to save program',
          result: response
        })
      })
  })

  router.put('/programs/:id', async (req, res) => {
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

  router.delete('/programs/:id', (req, res) => {
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
}
