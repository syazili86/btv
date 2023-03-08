'use strict'
export default (sequelize, DataTypes) => {
  const LiveBroadcast = sequelize.define('LiveBroadcast', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    liveName: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    key: {
      allowNull: false,
      type: DataTypes.STRING(8)
    }
  }, {
      schema: 'ref',
      paranoid: false,
      timestamps: false,
      freezeTableName: true,
      hooks: {
        beforeValidate: async (LiveBroadcast) => {
          let key = await '';
          const char = await 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let index = 0; index < 8; index++) {
            key += await char.charAt(Math.floor(Math.random() * char.length))
          }

          LiveBroadcast.key = await key
        }
      }
    })

  return LiveBroadcast
}
