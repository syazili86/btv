'use strict'
export default (sequelize, DataTypes) => {
  const Program = sequelize.define('Program', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    categorieId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: {
          args: 4,
          msg: 'You must select correct Category'
        }
      }
    },
    programName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Program name must be between 3 and 100 characters. Please try again.'
        }
      },
      set (val) {
        const programName = val.toLowerCase().replace(/\b[a-z]/g, (letter) => {
          return letter.toUpperCase()
        })

        this.setDataValue('programName', programName)
      }
    },
    synopsis: DataTypes.TEXT,
    poster: DataTypes.STRING(50),
    watchCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    schema: 'ref',
    paranoid: true,
    hooks: {
      beforeValidate: (Program) => {
        Program.slug = `${Program.id.split('-', 1)[0]}-${Program.programName.split(' ').join('-').toLowerCase()}`
      }
    }
  })
  // Sync
  // ProgramAcara.sync({ alter: true })

  // Relation
  Program.associate = function (models) {
    Program.hasMany(models.ProgramContent, {
      foreignKey: 'programId',
      onDelete: 'CASCADE'
    })
    Program.hasMany(models.Rating, {
      foreignKey: 'programId',
      onDelete: 'CASCADE'
    })
    Program.belongsTo(models.Categorie, {
      foreignKey: 'categorieId',
      onDelete: 'CASCADE'
    })
  }

  return Program
}
