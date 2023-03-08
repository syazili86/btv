export const ratings = (router, model) => {
  router.get('/ratings', (req, res) => {
    model.Rating.findAll({
      attributes: [
        [model.sequelize.literal('cast(sum(rate) as float) / count("programId")'), 'rate_val']
      ],
      group: [
        'Program.id',
        'Program.programName',
        'Program.synopsis',
        'Program.poster',
        'Program.slug'
      ],
      order: model.sequelize.fn('random'),
      limit: req.limit,
      include: [
        {
          model: model.Program,
          attributes: [
            'programName',
            'synopsis',
            'poster',
            'slug'
          ],
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
}
