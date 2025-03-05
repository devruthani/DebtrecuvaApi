const db = require("../../dbconnection/dbconfig");
const crypto = require("crypto");
const { Debtorspayment } = require("../model");




const debtorspaymentController = {

    /* ------------------------- record debtors payment ------------------------- */
    async recordPayment(req,res){
        try {
            const paymentId = crypto.randomBytes(16).toString("hex");
               // Ensure numerical values for calculation
        const totalOutstandingAmount = parseFloat(req.body.totaloutstandingamount) || 0;
        const amountPaid = parseFloat(req.body.amountpaid) || 0;
        const remainingBalance = totalOutstandingAmount - amountPaid;

            const paymentRecord = await Debtorspayment.create({
                paymentid:paymentId,
                agentid:req.body.agentid,
                clientid:req.body.clientid,
                tenantid:req.body.tenantid,
                debtorid:req.body.debtorid,
                loanid:req.body.loanid,
                debtorsfullname:req.body.debtorsfullname,
                debtorsemail:req.body.debtorsemail,
                debtorsmobile:req.body.debtorsmobile,
                agentfullname:req.body.agentfullname,
                clientname:req.body.clientname,
                totaloutstandingamount:req.body.totaloutstandingamount,
                amountpaid:req.body.amountpaid,
                remainingbalance:remainingBalance,
                dayslate:req.body.dayslate,
                status:"Successful"
            });

            if(paymentRecord){
                return res.status(200).json({
                    error: false,
                    message: "Transaction Successful",
                });

            }else{
                return res.status(400).json({
                    error: true,
                    message: "Failed Transaction",
                });

            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                message: "Oops! Something went wrong",
                data: error.message,
            });

            
        }
    },

    /* --------------------- get debtors payment by agentid --------------------- */


    
   
    /* ------------------- get all records of debtors payment ------------------- */

}
module.exports = debtorspaymentController;