



const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        documentid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        tenantid : {
            type: Sequelize.STRING,
            allowNull:false
        },
        documenttitle : {
            type: Sequelize.STRING,
            allowNull:false
        },
        documentdescription : {
            type: Sequelize.STRING,
            allowNull:false
        },
        documentstructure : {
            type: Sequelize.TEXT,
            allowNull:false
        },
               
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("customerdoc", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Customerdoc = instance.define("customerdoc", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Customerdoc;
}

module.exports = { Schema , Model};