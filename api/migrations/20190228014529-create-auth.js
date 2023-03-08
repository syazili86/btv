'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createSchema('auth'),
      queryInterface.createTable('Auths', {
        id: {
          allowNull: false,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        level: {
          type: Sequelize.ENUM,
          values: ['programmer', 'admin']
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      }, {
        schema: 'auth'
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropSchema('auth'),
      queryInterface.dropTable('Auths')
    ])
  }
}
