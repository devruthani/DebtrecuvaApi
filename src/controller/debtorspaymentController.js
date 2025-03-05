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
    async getPayRecordByagentid(req,res){
        try {
            
      
        const limit = Number(req.query.limit) || 10; // Default limit
        let page = Number(req.query.page) || 1;
        let offset = (page - 1) * limit;

        const { agentid } = req.params;
          // Get total count of assigned debtors for pagination
          const totalCount = await Debtorspayment.count({ where: { agentid } });
          const totalPages = Math.ceil(totalCount / limit);
  
          let debtorsPayment = await Debtorspayment.findAll({
              where: { agentid },
              limit,
              offset
          });

          if(debtorsPayment.length>0){
            return res.status(200).json({
                error: false,
                message: "Payment Record Acquired",
                data: debtorsPayment,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalPages,
                    totalCount
                }
            });
        } else {
            return res.status(200).json({
                error: true,
                message: "No Records founds for this id ",
                data: debtorsPayment,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalPages,
                    totalCount
                }
            });

          }
        } catch (error) {
            console.log(error);
        return res.status(400).json({
            error: true,
            message: "Oops! Something went wrong",
            data: error.message,
        });
            
        }


    },

    
   
    /* ------------------- get all records of debtors payment ------------------- */
    async getAllPayments(req,res){
        try{
        const limit = Number(req.query.limit) || 10; // Default limit
        let page = Number(req.query.page) || 1;
        let offset = (page - 1) * limit;
         // Get total count of assigned debtors for pagination
         const totalCount = await Debtorspayment.count({});
         const totalPages = Math.ceil(totalCount / limit);
 
         let allPaymentrecords = await Debtorspayment.findAll({
             limit,
             offset
         });

         if(allPaymentrecords.length>0){
           return res.status(200).json({
               error: false,
               message: "Payment Record Acquired",
               data: allPaymentrecords,
               pagination: {
                   currentPage: page,
                   itemsPerPage: limit,
                   totalPages,
                   totalCount
               }
           });
       } else {
           return res.status(200).json({
               error: true,
               message: "No Records founds for this id ",
               data: allPaymentrecords,
               pagination: {
                   currentPage: page,
                   itemsPerPage: limit,
                   totalPages,
                   totalCount
               }
           });

         }
       } catch (error) {
           console.log(error);
       return res.status(400).json({
           error: true,
           message: "Oops! Something went wrong",
           data: error.message,
       });
           
       }


    }

}
module.exports = debtorspaymentController;