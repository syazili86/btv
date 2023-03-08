export const watch = (router, model) => {
  const currentTime = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour12: false
  })
  const currentDate = new Date()

  const day = currentDate.getDay()
  const time = currentTime.split(' ')[1]

  router.get('/watch/:slug', (req, res) => {
    model.Schedule.findOne({
      where: {
        isActive: true,
        dayId: `${day}`,
        [model.Sequelize.Op.and]: model.sequelize.literal("('" + time + "' between \"Schedule\".\"timeStart\" and \"Schedule\".\"timeFinish\")")
      },
      include: [
        {
          model: model.Program,
          where: { slug: req.params.slug },
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
