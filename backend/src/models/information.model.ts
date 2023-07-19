import { DataTypes } from 'sequelize'
import db from '../db/connection'

const Information = db.define('Information', {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Information