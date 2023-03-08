import fs from 'fs'

const base64MimeType = (encoded) => {
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

export const categories = (router, model) => {
  router.get('/categories', (req, res) => {
    if (typeof req.temp !== 'undefined') {
      Object.assign(req.where, { categorieName: req.temp })
    }

    model.Categorie.findAll({
      attributes: req.attr,
      where: req.where,
      order: req.order,
      limit: req.limit,
      offset: req.offset
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

  router.post('/categories', async (req, res) => {
    const mime = base64MimeType(req.body.cover)

    if (mime) {
      const timestamp = await Math.floor(Date.now() / 1000)
      const ext = await mime.split('/')[1]
      const fileData = await req.body.cover.split(';base64,').pop()

      fs.writeFile(`static/categories/${timestamp}.${ext}`, fileData, { encoding: 'base64' }, (errUpl) => {
        if (errUpl) {
          return res.status(410).send({
            success: false,
            response: 'Gagal upload cover'
          })
        }
      })

      req.body.cover = await `${timestamp}.${ext}`
    }

    model.Categorie.create(req.body)
      .then((result) => {
        return res.status(201).send({
          success: true,
          response: result
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
          response: response
        })
      })
  })

  router.put('/categories/:id', async (req, res) => {
    req.body['slug'] = ''
    const mime = base64MimeType(req.body.cover)

    if (mime) {
      const timestamp = await Math.floor(Date.now() / 1000)
      const ext = await mime.split('/')[1]
      const fileData = await req.body.cover.split(';base64,').pop()

      fs.writeFile(`static/categories/${timestamp}.${ext}`, fileData, { encoding: 'base64' }, (errUpl) => {
        if (errUpl) {
          return res.status(410).send({
            success: false,
            response: 'Gagal upload cover'
          })
        }
      })

      req.body.cover = await `${timestamp}.${ext}`
    }

    model.Categorie.findById(req.params.id).then((category) => {
      category.updateAttributes(req.body).then((result) => {
        return res.status(201).send({
          success: true,
          response: 'A Category updated successfuly',
          result: result
        })
      }).catch((err) => {
        return res.status(410).send({
          success: false,
          response: 'Failed to update category',
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

  router.delete('/categories/:id', (req, res) => {
    const where = {}
    const ids = req.params.id

    where['id'] = { [model.Sequelize.Op.in]: ids.split(',') }
    model.Categorie.destroy({
      where: where
    }).then((result) => {
      return res.status(200).send({
        success: true,
        response: result
      })
    }).catch((err) => {
      return res.status(410).send({
        success: false,
        response: err
      })
    })
  })
}
