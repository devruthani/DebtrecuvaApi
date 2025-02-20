


const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        calllogid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        debtorid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        tenantid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        nameofborrower : {
            type: Sequelize.STRING,
            allowNull:true
        },
        primarynumber : {
            type: Sequelize.STRING,
            allowNull:true

        },
        loanid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        agentdoc: {
            type: Sequelize.STRING,
            allowNull:true

        },
        agentid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        clientid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        callconnected: {
            type: Sequelize.STRING,
            allowNull:true

        },
        rightparty: {
            type: Sequelize.STRING,
            allowNull:true

        },
        ptp: {
            type: Sequelize.STRING,
            allowNull:true

        },
        noofattemp: {
            type: Sequelize.STRING,
            allowNull:true

        },
        noofconnected: {
            type: Sequelize.STRING,
            allowNull:true

        },
        deliquence: {
            type: Sequelize.STRING,
            allowNull:true

        },
        noofsms: {
            type: Sequelize.STRING,
            allowNull:true

        },
        callstatus: {
            type: Sequelize.STRING,
            allowNull:true

        },
        comment: {
            type: Sequelize.STRING,
            allowNull:true

        },
        ptpamount: {
            type: Sequelize.STRING,
            allowNull:true

        },
        ptpdate: {
            type: Sequelize.STRING,
            allowNull:true

        },
        modeofcommunication: {
            type: Sequelize.STRING,
            allowNull:true

        },
        timeSpent: {
            type: Sequelize.STRING,
            allowNull:true

        },
        adjustedTimeSpent: {
            type: Sequelize.STRING,
            allowNull:true

        },
       
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("calllog", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Calllog = instance.define("calllog", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Calllog;
}

module.exports = { Schema , Model};