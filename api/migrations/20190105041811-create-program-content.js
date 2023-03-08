'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProgramContents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      programId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: {
            tableName: 'Programs',
            schema: 'ref'
          },
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      episode: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      season: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      isLooping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true
      },
      liveEnded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      schema: 'public'
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable({
      tableName: 'ProgramContents',
      schema: 'public'
    })
  }
}
