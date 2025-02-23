const db = require("../../dbconnection/dbconfig")
const { Assignagent, Fieldagent } = require("../model")




const assignagentController = {

//   async assignAgent(req, res) {
//     try {
//         const { agentid, debtorsid } = req.body;

//         if (!agentid || !debtorsid) {
//             return res.status(400).json({
//                 error: true,
//                 message: "All fields are required",
//             });
//         }

//         // Check if the debtor has already been assigned to an agent
//         const existingDebtor = await Assignagent.findOne({ where: { debtorsid },});

//         if (existingDebtor) {
//             return res.status(400).json({
//                 error: true,
//                 message: "This Customer has already been assigned to an agent",
//             });
//         }

//         // Assign the agent to the debtor
//         const agentAssigned = await Assignagent.create({ agentid, debtorsid });

//         if (agentAssigned) {
//             return res.status(200).json({
//                 error: false,
//                 message: "Agent successfully assigned to a customer",
//             });
//         } else {
//             return res.status(400).json({
//                 error: true,
//                 message: "Failed to assign Agent to customer",
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             error: true,
//             message: "Oops! Something went wrong",
//             data: error.message,
//         });
//     }
// },


    // get debtors by agent assinged id 
    
    async assignAgent(req, res) {
      try {
          const { agentid, debtorsid } = req.body;
  
          if (!agentid || !debtorsid) {
              return res.status(400).json({
                  error: true,
                  message: "All fields are required",
              });
          }
  
          // Check if the agent exists in the agent table
          const agentExists = await Fieldagent.findOne({
              where: { agentid: agentid },
          });
          if (!agentExists) {
              return res.status(400).json({
                  error: true,
                  message: "Agent does not exist",
              });
          }
  
          // Check if the debtor has already been assigned to an agent
          const existingAssignment = await Assignagent.findOne({
              where: { debtorsid },
          });
          if (existingAssignment) {
              return res.status(400).json({
                  error: true,
                  message: "This Customer has already been assigned to an Agent",
              });
          }
  
          // Assign the agent to the debtor
          const agentAssigned = await Assignagent.create({ agentid, debtorsid });
          if (agentAssigned) {
              return res.status(200).json({
                  error: false,
                  message: "Agent assigned to customer successfully",
              });
          } else {
              return res.status(400).json({
                  error: true,
                  message: "Failed to assign Agent to customer",
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

      /* --------------- get all debtors id that have been assigned --------------- */
      async getAllDebtorsid(req, res) {
        try {
          // Fetch only the 'debtorsid' field from the database.
          const debtors = await Assignagent.findAll({
            attributes: ['debtorsid']
          });
      
          // Check if the returned array is empty
          if (!debtors || debtors.length === 0) {
            return res.status(404).json({
              error: true,
              message: "No debtors found"
            });
          } else {
            return res.status(200).json({
              error: false,
              message: "All Assigned Debtorsid",
              data: debtors
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
      }
      

}
module.exports = assignagentController