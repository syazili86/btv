export const schedules = (router, model) => {
  router.get('/schedules/:slug', (req, res) => {
    model.Schedule.findOne({
      where: {
        isActive: true
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

  router.get('/live-now', (req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour12: false
    })
    const currentDate = new Date()

    const day = currentDate.getDay()
    const time = currentTime.split(' ')[1]

    model.Schedule.findOne({
      attributes: ['id', 'timeStart', 'timeFinish', 'programId'],
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
              attributes: ['id', 'programId', 'title', 'episode', 'season', 'content', 'fileType', 'isLooping'],
              required: true,
              where: {
                [model.Sequelize.Op.or]: [
                  { isLooping: true }, { liveEnded: false }
                ]
              },
              limit: 1,
              offset: 0,
              order: [
                ['season', 'ASC'],
                ['episode', 'ASC']
              ]
            }
          ]
        }
      ]
    }).then(async (result) => {
      try {
        let response = {}, liveBroadcast = await model.LiveBroadcast.findOne()

        response['isLiveBroadcast'] = await false
        if (liveBroadcast != null) {
          liveBroadcast = await liveBroadcast.dataValues

          response['isLiveBroadcast'] = await true
          response['liveBroadcast'] = await liveBroadcast
          response['liveBroadcast']['uri'] = await `http://btv.binadarma.ac.id/downstream/${liveBroadcast.key}/index.m3u8`;
        }

        if (result != null) {
          await Object.assign(response, result.dataValues)
        } else {
          await Object.assign(response, result)
        }

        return res.status(200).send({
          success: true,
          data: response
        })
      } catch (error) {
        console.log(error)
      }
    }).catch((err) => {
      return res.status(410).send({
        success: false,
        response: err
      })
    })
  })

  router.get('/live-otd', (req, res) => {
    const currentDate = new Date()
    const day = currentDate.getDay()

    model.Schedule.findAll({
      attributes: ['id', 'dayId', 'timeStart', 'timeFinish', 'programId'],
      where: {
        isActive: true,
        dayId: `${day}`
      },
      include: [
        {
          model: model.Program,
          attributes: ['id', 'slug', 'programName', 'poster', 'watchCount'],
          required: true,
          include: [
            {
              model: model.ProgramContent,
              attributes: ['id', 'programId', 'title', 'episode', 'season', 'content', 'fileType', 'isLooping'],
              required: true,
              where: {
                [model.Sequelize.Op.or]: [
                  { isLooping: true }, { liveEnded: false }
                ]
              },
              order: [
                ['season', 'ASC'],
                ['episode', 'ASC']
              ]
            }
          ]
        }
      ]
    }).then(async (result) => {
      if (result != null) {
        await result.forEach(async item => {
          await item.Program.ProgramContents.sort((a, b) => a.season - b.season || a.episode - b.episode)
          await item.Program.ProgramContents.splice(1)
        });
      }

      res.status(200).send({
        success: true,
        data: result
      })
    }).catch((err) => {
      res.status(401).send({
        success: false,
        response: err
      })
    })
  })
}
