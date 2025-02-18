


const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        agentid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        tenantid : {
            type: Sequelize.TEXT,
            allowNull:false
        },
        firstname : {
            type: Sequelize.STRING,
            allowNull:false
        },
        lastname : {
            type: Sequelize.STRING,
            allowNull:false

        },
        mobile: {
            type: Sequelize.STRING,
            allowNull:false

        },
        email: {
            type: Sequelize.STRING,
            allowNull:false

        },
        state: {
            type: Sequelize.STRING,
            allowNull:true

        },
        address: {
            type: Sequelize.TEXT,
            allowNull:true

        },
        lga: {
            type: Sequelize.STRING,
            allowNull:true

        },
        password: {
            type: Sequelize.STRING,
            allowNull:false

        },
       
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("fieldagent", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Fieldagent = instance.define("fieldagent", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Fieldagent;
}

module.exports = { Schema , Model};