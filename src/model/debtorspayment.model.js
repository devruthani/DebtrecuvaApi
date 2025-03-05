

const generateTimestamps = require("./timestamp");

let Schema = (Sequelize,mode) => {

    return {

        paymentid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        agentid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        clientid : {
            type: Sequelize.STRING,
            allowNull:true
        },
        debtorid : {
            type: Sequelize.STRING,
            allowNull:true

        },
        tenantid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        loanid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        debtorsfullname: {
            type: Sequelize.STRING,
            allowNull:true

        },
        debtorsemail: {
            type: Sequelize.STRING,
            allowNull:true

        },
        debtorsmobile: {
            type: Sequelize.STRING,
            allowNull:true

        },
        agentfullname: {
            type: Sequelize.STRING,
            allowNull:true

        },
        clientname: {
            type: Sequelize.STRING,
            allowNull:true

        },
        totaloutstandingamount: {
            type: Sequelize.STRING,
            allowNull:true

        },
        amountpaid: {
            type: Sequelize.STRING,
            allowNull:true

        },
        remainingbalance: {
            type: Sequelize.STRING,
            allowNull:true

        },
        dayslate: {
            type: Sequelize.STRING,
            allowNull:true

        },
        status: {
            type: Sequelize.STRING,
            allowNull:true

        },
     
        
              
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("debtorspayment", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Debtorspayment = instance.define("debtorspayment", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Debtorspayment;
}

module.exports = { Schema , Model};
