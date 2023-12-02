const Sequelize=require('sequelize');
const sequelize=require('../util/database');

//create database named as meet
const meet=sequelize.define('meet',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    time:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    slotsAvail:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
})

module.exports=meet;