'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createSchema('ref'),
      queryInterface.createTable('Categories', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        categorieName: {
          allowNull: false,
          type: Sequelize.STRING(100)
        },
        cover: {
          allowNull: false,
          type: Sequelize.STRING(50)
        },
        slug: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
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
        schema: 'ref'
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropSchema('ref'),
      queryInterface.dropTable({
        tableName: 'Categories',
        schema: 'ref'
      })
    ])
  }
}
