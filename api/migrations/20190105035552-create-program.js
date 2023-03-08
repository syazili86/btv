'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createSchema('ref'),
      queryInterface.createTable('Programs', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        categorieId: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          allowNull: false,
          references: {
            model: {
              tableName: 'Categories',
              schema: 'ref'
            },
            key: 'id'
          }
        },
        programName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        synopsis: {
          type: Sequelize.TEXT
        },
        poster: {
          type: Sequelize.STRING(50)
        },
        watchCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        slug: {
          type: Sequelize.STRING,
          unique: true
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
    return queryInterface.dropTable({
      tableName: 'Programs',
      schema: 'ref'
    })
  }
}
