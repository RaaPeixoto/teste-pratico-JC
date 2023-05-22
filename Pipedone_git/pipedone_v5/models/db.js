// Data base conect
const Sequelize = require('sequelize')
const sequelize = new Sequelize('pipe_v3', 'raisa', '13121993', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+03:00'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}