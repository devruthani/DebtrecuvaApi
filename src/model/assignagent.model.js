



const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        agentid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        debtorsid : {
            type: Sequelize.STRING,
            allowNull:false
        },
               
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("assignagent", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Assignagent = instance.define("assignagent", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Assignagent;
}

module.exports = { Schema , Model};