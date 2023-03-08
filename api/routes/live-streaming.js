export const liveStreaming = (router, model) => {
  router.get('/live-streaming', (req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour12: false
    })
    const currentDate = new Date()

    const day = currentDate.getDay()
    const time = currentTime.split(' ')[1]

    model.Schedule.findAndCountAll({
      attributes: ['timeStart', 'timeFinish', 'programId'],
      where: {
        isActive: true,
        dayId: `${day}`,
        [model.Sequelize.Op.and]: model.sequelize.literal("('" + time + "' between \"Schedule\".\"timeStart\" and \"Schedule\".\"timeFinish\")")
      },
      include: [
        {
          model: model.Program,
          attributes: ['id', 'programName', 'poster', 'watchCount'],
          required: true,
          include: [
            {
              model: model.ProgramContent,
              attributes: ['id', 'title', 'episode', 'season', 'content', 'fileType', 'isLooping'],
              required: true,
              where: {
                [model.Sequelize.Op.or]: [
                  { isLooping: true },
                  { liveEnded: false }
                ]
              }
            }
          ]
        }
      ]
    }).then((result) => {
      if (result.count <= 0) {
        return res.status(503).send({
          success: false,
          res: 'No live streaming schedule is availabke right now.'
        })
      } else {
        const data = result.rows[0]
        const streamHelper = require('../helpers/uploader-node')(`static/programs/contents/${data.Program.ProgramContents[0].id}`)
        streamHelper.write(`${data.Program.ProgramContents[0].content}`, res)
        /* return res.status(200).send({
          success: true,
          result
        }) */
      }
    }).catch((err) => {
      return res.status(410).send({
        success: false,
        response: err
      })
    })
  })
}
