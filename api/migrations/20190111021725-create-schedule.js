'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      dayId: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.ENUM,
        values: [1, 2, 3, 4, 5, 6, 7]
      },
      timeStart: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.TIME
      },
      timeFinish: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.TIME
      },
      programId: {
        primaryKey: true,
        onDelete: 'CASCADE',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Programs',
            schema: 'ref'
          },
          key: 'id'
        }
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable({
      tableName: 'Schedules',
      schema: 'ref'
    })
  }
}
