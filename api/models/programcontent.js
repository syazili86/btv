'use strict'
export default (sequelize, DataTypes) => {
  const ProgramContent = sequelize.define('ProgramContent', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    programId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: 'You must select correct Program'
        }
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Content title must be between 3 and 100 characters. Please try again.'
        }
      },
      set (val) {
        const title = val.toLowerCase().replace(/\b[a-z]/g, (letter) => {
          return letter.toUpperCase()
        })

        this.setDataValue('title', title)
      }
    },
    episode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        async customValidation (val) {
          const checkEpisode = await ProgramContent.count({ where: { episode: val, programId: this.programId, season: this.season } })
          if (checkEpisode > 0 && !this.isLooping) {
            throw new Error('Episode on Program Content in the same Program is already exist. Please insert new number of episode.')
          }
        }
      }
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isLooping: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    liveEnded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    schema: 'public',
    paranoid: true,
    hooks: {
      beforeValidate: (ProgramContent) => {
        ProgramContent.slug = `${ProgramContent.id.split('-', 1)[0]}-${ProgramContent.title.split(' ').join('-').toLowerCase()}`
      }
    }
  })
  // Sync
  // KontenAcara.sync({ alter: true })

  // Relation
  ProgramContent.associate = function (models) {
    ProgramContent.belongsTo(models.Program, {
      foreignKey: 'programId',
      onDelete: 'CASCADE'
    })
  }

  return ProgramContent
}
