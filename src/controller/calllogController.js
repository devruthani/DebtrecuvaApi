const crypto = require("crypto");
const { Calllog } = require("../model");




const calllogController = {
    async createCallog(req,res){
        try{
            const calllogId = crypto.randomBytes(16).toString("hex");

            var agentDoc = JSON.stringify(req.body.agentdoc)
    
            const createCallog = await Calllog.create({
                calllogid: calllogId,
                debtorid: req.body.debtorid,
                clientname: req.body.clientname,
                tenantid: req.body.tenantid,
                nameofborrower: req.body.nameofborrower,
                primarynumber: req.body.primarynumber,
                loanid: req.body.loanid,
                agentdoc : agentDoc,
                agentid : req.body.agentid,
                clientid : req.body.clientid,
                callconnected : req.body.callconnected,
                rightparty : req.body.rightparty,
                ptp : req.body.ptp,
                noofattemp : req.body.noofattemp,
                noofconnected : req.body.noofconnected,
                deliquence : req.body.deliquence,
                noofsms : req.body.noofsms,
                callstatus : req.body.callstatus,
                comment : req.body.comment,
                ptpamount : req.body.ptpamount,
                ptpdate : req.body.ptpdate,
                modeofcommunication : req.body.modeofcommunication,
                timeSpent: req.body.timeSpent,
                adjustedTimeSpent: req.body.adjustedTimeSpent
            });
            if(createCallog){
                return res.status(200).json({
                    error:false,
                    message:"Call log created successfully",
                    
                })
                
            }else{
                return res.status(400).json({
                    error:true,
                    message:"Failed to create call log",
                    
                })
    
            }
    
        }catch(error){
            console.log(error);
            return  res.status(500).json({
                error:true,
                message: "Oops! some thing went wrong",
                data:error.message
                })
    
        }
    },

    async fetchAllCallLogs(req, res) {
        try {
          
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
    
            const totalCalls = await Calllog.count(); // Get the total number of admin
            const totalPages = Math.ceil(totalCalls / limit); // Calculate total pages
    
            const fetchAllcalls = await Calllog.findAll({
                limit: limit,
                offset: offset
            });
    
            if (fetchAllcalls) {
                return res.status(200).json({
                    error: false,
                    message: "Call Log acquired successfully",
                    data: fetchAllcalls,
                    totalPages: totalPages // Send totalPages in the response
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Failed to fetch call log"
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Oops! some thing went wrong",
                data: error.message
            });
        }
    },
    
    
    /* ----------------------------- GET call log BY CALL LOG id---------------------------- */
    
    
    
    async fetchallByid(req,res){
        try {
            
       const {calllogid} = req.params;
        const getByid = await Calllog.findAll({where:{calllogid}});

        if(!getByid){
            return res.status(400).json({
                error:true,
                message:"Failed to acquire call log"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Call log acquired successfully",
                data:getByid
            })
           
        }
    } catch (error) {
    console.log(error);
    return  res.status(500).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
            
    }
    },

    /* --------------------------- fetch by debtors id --------------------------- */
    async fetchByDebtorid(req,res){
        try {
            
       const {debtorid} = req.params;
        const getBydebtorid = await Calllog.findAll({where:{debtorid}});
        if(getBydebtorid.length === 0){
            return res.status(400).json({
                error:true,
                message:"ID not found"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Call log acquired successfully",
                data:getBydebtorid
            })
           
        }
    } catch (error) {
    console.log(error);
    return  res.status(500).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
            
    }
    },
    /* --------------------------- fetch by agent id --------------------------- */
    async fetchByAgentid(req,res){
        try {
            
       const {agentid} = req.params;
        const getByagentid = await Calllog.findAll({where:{agentid}});
        if(getByagentid.length === 0){
            return res.status(400).json({
                error:true,
                message:"ID not found"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Call log acquired successfully",
                data:getByagentid
            })
           
        }
    } catch (error) {
    console.log(error);
    return  res.status(500).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
            
    }
    },
    /* --------------------------- fetch by client id --------------------------- */
    async fetchByClientid(req,res){
        try {
            
       const {clientid} = req.params;
        const getByclientid = await Calllog.findAll({where:{clientid}});
        if(getByclientid.length === 0){
            return res.status(400).json({
                error:true,
                message:"ID not Found "
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Call log acquired successfully",
                data:getByclientid
            })
           
        }
    } catch (error) {
    console.log(error);
    return  res.status(500).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
            
    }
    },
    /* --------------------------- fetch by tenant id --------------------------- */
    async fetchByTenantid(req,res){
        try {
            
       const {tenantid} = req.params;
        const getBytenantid = await Calllog.findAll({where:{tenantid}});
        if(getBytenantid.length === 0){
            return res.status(400).json({
                error:true,
                message:"ID not found"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Call log acquired successfully",
                data:getBytenantid
            })
           
        }
    } catch (error) {
    console.log(error);
    return  res.status(500).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
            
    }
    },
    
    /* ---------------------------- // edit call log ---------------------------- */
    async editCallLog(req,res){
        try{
            const {calllogid} = req.body;
            const updateCalllog = await Calllog.findOne({where:{calllogid: calllogid}});
         
            if(!updateCalllog){
                return res.status(400).json({
                    error:true,
                    message:"Call log with this id does not exist"
                })
    
            }else{
                var agentDoc = JSON.stringify(req.body.agentdoc)
                await updateCalllog.update({
                    debtorid: req.body.debtorid,
                    clientname: req.body.clientname,
                    tenantid: req.body.tenantid,
                    nameofborrower: req.body.nameofborrower,
                    primarynumber: req.body.primarynumber,
                    loanid: req.body.loanid,
                    agentdoc : agentDoc,
                    agentid : req.body.agentid,
                    clientid : req.body.clientid,
                    callconnected : req.body.callconnected,
                    rightparty : req.body.rightparty,
                    ptp : req.body.ptp,
                    noofattemp : req.body.noofattemp,
                    noofconnected : req.body.noofconnected,
                    deliquence : req.body.deliquence,
                    noofsms : req.body.noofsms,
                    callstatus : req.body.callstatus,
                    comment : req.body.comment,
                    ptpamount : req.body.ptpamount,
                    ptpdate : req.body.ptpdate,
                    modeofcommunication : req.body.modeofcommunication,
                    timeSpent: req.body.timeSpent,
                    adjustedTimeSpent: req.body.adjustedTimeSpent

                },{where:{calllogid:req.body.calllogid}})
               
                return res.status(200).json({
                    error:false,
                    message:"Call log updated successfully"
                })
    
            }
    
        }catch(error){
            console.log(error);
        return  res.status(400).json({
        error:true,
        message: "Oops! some thing went wrong",
        data:error.message
        })
    
        }
    },
    
    /* ------------------------------ DELETE calllog ----------------------------- */
    async deleteCalllog(req,res){
        try{
            const {calllogid } = req.params;
            const delCalllog = await Calllog.findOne({where: {calllogid}});
    
            if(!delCalllog){
                return res.status(400).json({ error:true,message: "Call log not found" });
    
            }else{
                await delCalllog.destroy();
                res.status(200).json({ 
                    error:false,
                    message: "Call log deleted successfully"});
    
            }
    
        }catch(error){
            console.log(error)
            return res.status(500).json({
                error:true,
                message:"Error deleting agent task",
                data:error.message
            });
    
        }
    }


}
module.exports = {calllogController}