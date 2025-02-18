




const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        taskid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        agentid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        tasktype : {
            type: Sequelize.STRING,
            allowNull:false
        },
        taskdate : {
            type: Sequelize.STRING,
            allowNull:false

        },
        description: {
            type: Sequelize.TEXT,
            allowNull:false

        },
        linemanager: {
            type: Sequelize.STRING,
            allowNull:false

        },
        taskstatus: {
            type: Sequelize.STRING,
            allowNull:true

        },
        taskfeedback: {
            type: Sequelize.TEXT,
            allowNull:true

        },
        
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("agenttask", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Agenttask = instance.define("agenttask", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Agenttask;
}

module.exports = { Schema , Model};