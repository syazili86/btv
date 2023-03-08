export default (req, model) => {
  const order = []
  const attributes = []
  let tempAvailable = false
  const temp = {}
  const Op = model.Sequelize.Op

  for (const item in req.query) {
    // Opertor
    if (req.query[item].includes(':')) {
      const ope = req.query[item].split(':')[0]
      const val = req.query[item].split(':')[1]

      req.query[item] = { [Op[ope]]: val }
    }

    // iLike Query
    if (item === '__+search') {
      tempAvailable = true
      Object.assign(temp, { [Op.iLike]: `%${req.query[item]}%` })
      delete req.query[item]
    }

    // notiLike Query
    if (item === '__-search') {
      tempAvailable = true
      Object.assign(temp, { [Op.notILike]: `%${req.query[item]}%` })
      delete req.query[item]
    }

    // Limit & Offset
    if (item === '__limit') {
      req.limit = req.query[item]
      delete req.query[item]
    }
    if (item === '__offset') {
      req.offset = req.query[item]
      delete req.query[item]
    }

    // Sorting
    if (item === '__sort_by') {
      order.push(req.query[item].split('.'))
      delete req.query[item]
    }

    // Attributes
    if (item === '__attr') {
      attributes.push(req.query[item].split(','))
      delete req.query[item]
    }
  }

  const where = Object.assign({}, req.query)
  if (attributes.length > 0) {
    req.attr = attributes
  }
  if (order.length > 0) {
    req.order = order
  }
  if (tempAvailable) {
    req.temp = temp
  }

  req.where = where
}
