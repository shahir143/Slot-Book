const Sequelize=require('sequelize');
const sequelize=require('../util/database');


//create database named as slots
const slot=sequelize.define('slots',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    time:{
        type:Sequelize.STRING,
        allowNull:false,
    },
})

module.exports=slot;