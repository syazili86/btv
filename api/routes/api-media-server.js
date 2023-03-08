import rp from 'request-promise';

const options = (params) => {
  return {
    uri: `http://127.0.0.1:8000/api/${params.endpoint}`,
    method: 'GET',
    auth: {
      'user': 'mediaservice',
      'pass': 'm3d1@service123??'
    },
    json: true
  }
}

export const apiMediaServer = (router) => {
  router.get('/media-server/:endpoint', async (req, res) => {
    rp(options({endpoint: req.params.endpoint})).then((result) => {
      res.status(200).send({
        success: true,
        response: result
      });
    }).catch((e) => {
      res.status(200).send({
        success: false,
        response: e
      });
    })
  })

  router.get('/media-server/:endpoint/:app/:stream', async (req, res) => {
    const params = req.params
    const uri = `${params.endpoint}/${params.app}/${params.stream}`

    rp(options({endpoint: uri})).then((result) => {
      res.status(200).send({
        success: true,
        response: result
      });
    }).catch((e) => {
      res.status(200).send({
        success: false,
        response: e
      });
    })
  })
}
