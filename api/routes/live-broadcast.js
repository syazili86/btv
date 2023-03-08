export const liveBroadcast = (router, model) => {
  router.post('/live-broadcast', async (req, res) => {
    model.LiveBroadcast.create(req.body)
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

  router.get('/live-broadcast', (req, res) => {
    model.LiveBroadcast.findOne().then(async (result) => {
      if (result != null) {
        result['dataValues']['isLiveBroadcast'] = await true
        result['dataValues']['uri'] = await `http://btv.binadarma.ac.id/downstream/${result.key}/index.m3u8`
      }

      return res.status(200).send({
        success: true,
        data: result
      })
    }).catch((e) => {
      return res.status(410).send({
        success: false,
        response: e
      })
    })
  })

  router.delete('/live-broadcast/:key', async (req, res) => {
    model.LiveBroadcast.destroy({
      where: { key: req.params.key }
    }).then((result) => {
      return res.status(200).send({
        success: true,
        data: result
      })
    }).catch((e) => {
      return res.status(410).send({
        success: false,
        response: e
      })
    })
  })
}
