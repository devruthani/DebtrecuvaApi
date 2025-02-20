const crypto = require("crypto");
const { Agenttask } = require("../model");



const agenttaskController = {
    async createAgentTask(req,res){
        try{
            const taskId = crypto.randomBytes(16).toString("hex");
    
            const agentTask = await Agenttask.create({
                taskid: taskId,
                agentid:req.body.agentid,
                tasktype:req.body.tasktype,
                taskdate:req.body.taskdate,
                description:req.body.description,
                linemanager:req.body.linemanager,
                taskstatus:"assigned",
                taskfeedback:req.body.taskfeedback
            });
            if(agentTask){
                return res.status(200).json({
                    error:false,
                    message:"Task created successfully",
                    
                })
                
            }else{
                return res.status(400).json({
                    error:true,
                    message:"Failed to create task",
                    
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

    async fetchAllAgenttask(req, res) {
        try {
          
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
    
            const totalTask = await Agenttask.count(); // Get the total number of admin
            const totalPages = Math.ceil(totalTask / limit); // Calculate total pages
    
            const fetchAllTask = await Agenttask.findAll({
                limit: limit,
                offset: offset
            });
    
            if (fetchAllTask) {
                return res.status(200).json({
                    error: false,
                    message: "Task acquired successfully",
                    data: fetchAllTask,
                    totalPages: totalPages // Send totalPages in the response
                });
            } else {
                return res.status(404).json({
                    error: true,
                    message: "Failed to fetch task"
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
    
    
    /* ----------------------------- GET TASK BY ID ---------------------------- */
    
    
    
    async fetchTaskByid(req,res){
        try {
            
       const {taskid} = req.params;
        const getByid = await Agenttask.findOne({where:{taskid}});
        if(!getByid){
            return res.status(400).json({
                error:true,
                message:"Failed to acquire Task"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Task acquired successfully",
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

    /* --------------------------- fetch by agentid --------------------------- */
    async fetchByagentid(req,res){
        try {
            
       const {agentid} = req.params;
        const getByagentid = await Agenttask.findAll({where:{agentid}});
        if(!getByagentid){
            return res.status(400).json({
                error:true,
                message:"Failed to acquire Task"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Task acquired successfully",
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
    
    async editAgentTask(req,res){
        try{
            const {agentid} = req.body;
            const updateTask = await Agenttask.findOne({where:{agentid: agentid}});
         
            if(!updateTask){
                return res.status(400).json({
                    error:true,
                    message:"Agent Task with this id does not exist"
                })
    
            }else{
                await updateTask.update({
                tasktype:req.body.tasktype,
                taskdate:req.body.taskdate,
                description:req.body.description,
                linemanager:req.body.linemanager,
                taskstatus:req.body.taskstatus,
                taskfeedback:req.body.taskfeedback

                },{where:{agentid:req.body.agentid}})
               
                return res.status(200).json({
                    error:false,
                    message:"Agent Task updated successfully"
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
    
    /* ------------------------------ DELETE TASK ----------------------------- */
    async deleteTask(req,res){
        try{
            const {taskid } = req.params;
            const delTask = await Agenttask.findOne({where: {taskid}});
    
            if(!delTask){
                return res.status(400).json({ error:true,message: "Task not found" });
    
            }else{
                await delTask.destroy();
                res.status(200).json({ 
                    error:false,
                    message: "Agent task deleted successfully"});
    
    
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
module.exports = {agenttaskController}