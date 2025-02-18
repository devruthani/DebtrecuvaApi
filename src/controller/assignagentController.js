const db = require("../../dbconnection/dbconfig")
const { Assignagent } = require("../model")




const assignagentController = {

    async assignAgent(req,res){

        try {
            if(req.body.agentid && req.body.debtorsid){

                const agentAssigned = await Assignagent.create({
                    agentid: req.body.agentid,
                    debtorsid:req.body.debtorsid
                })
    
                if(agentAssigned){
                    return res.status(200).json({
                        error: false,
                        message: "Agent has been assigned to this debtor"
                    })
                }else{
                    return res.status(400).json({
                        error: true,
                        message: "Failed to assign agent to debtor"
                    })
                }

            }else{
                return res.status(400).json({
                    error: true,
                    message: "All fields are required"
                })
                
            }

           
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
              error: true,
              message: "Oops! some thing went wrong",
              data: error.message,
            });
            
        }

    },

    // get debtors by agent assinged id 
    async getassignedDebtorsbyid(req, res) {
        try {
          const { agentid } = req.params;
          let agentAssigned = await Assignagent.findAll({ where: { agentid }});
          agentAssigned= agentAssigned.map(agent => agent.get({ plain: true }));
          let newarray =[];


           async function getThedebtor(item){
            
            // return new Promise(async resolve => {
                let getdebtor= await db.select('loan_records', { id: item.debtorsid});
                
            getdebtor= getdebtor[0];
            item.debtorsdata= getdebtor;
            newarray.push(item)
                  
            //  })
            
           }
          await Promise.all(
            agentAssigned.map(async(item) => 
                await getThedebtor(item)
               
             )
         );
          agentAssigned = await newarray;
          console.log(agentAssigned)

          if (agentAssigned.length>0) {
            return res.status(200).json({
              error: false,
              message: "Agent and debtors list acquired",
              data: agentAssigned,
            });
          } else {
            return res.status(404).json({
              error: true,
              message: "Failed to acquire agent list",
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


}
module.exports = assignagentController