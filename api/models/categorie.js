'use strict'
export default (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    categorieName: {
      allowNull: false,
      type: DataTypes.STRING(100),
      validate: {
        len: {
          args: [3, 100],
          msg: 'Categorie name must be between 3 and 100 characters. Please try again.'
        }
      },
      set (val) {
        this.setDataValue('categorieName', val.toUpperCase())
      }
    },
    cover: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    slug: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    }
  }, {
    schema: 'ref',
    paranoid: true,
    hooks: {
      beforeValidate: (Categorie) => {
        Categorie.slug = `${Categorie.id.split('-', 1)[0]}-${Categorie.categorieName.split(' ').join('-').toLowerCase()}`
      }
    },
    getterMethods: {
      _createdAt () {
        const mm = (this.createdAt.getMonth() + 1 < 10) ? '0' + (this.createdAt.getMonth() + 1) : this.createdAt.getMonth() + 1

        return `${this.createdAt.getDate()}/${mm}/${this.createdAt.getFullYear()} ${this.createdAt.getHours()}:${this.createdAt.getMinutes()}`
      },
      _updatedAt () {
        const mm = (this.updatedAt.getMonth() + 1 < 10) ? '0' + (this.updatedAt.getMonth() + 1) : this.updatedAt.getMonth() + 1

        return `${this.updatedAt.getDate()}/${mm}/${this.updatedAt.getFullYear()} ${this.updatedAt.getHours()}:${this.updatedAt.getMinutes()}`
      }
    }
  })
  // Sync
  // Kategori.sync({ alter: true })

  // Relation
  Categorie.associate = function (models) {
    Categorie.hasMany(models.Program, {
      foreignKey: 'categorieId',
      onDelete: 'CASCADE'
    })
  }

  return Categorie
}
