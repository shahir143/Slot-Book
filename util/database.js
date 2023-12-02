const Sequelize=require('sequelize');

//instance connection server to dataBase
const sequelize=new Sequelize('meets','root','root',({
    dialect:'mysql',
    host: 'localhost',
}))

module.exports=sequelize;