const db = require("../../dbconnection/dbconfig")
const { Assignagent, Fieldagent } = require("../model")




const assignagentController = {
 
    async assignAgent(req, res) {
      try {
          const { agentid, debtorsid, clientid, tenantid } = req.body;
  
          if (!agentid || !debtorsid || !clientid || !tenantid) {
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
          const agentAssigned = await Assignagent.create({ 
            agentid, 
            debtorsid, 
            clientid, 
            tenantid 
          });
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
  
    /* ----------------------------- get by agent id ---------------------------- */
//  modified one 
async getassignedDebtorsbyid(req, res) {
    try {
        const limit = Number(req.query.limit) || 10; // Default limit
        let page = Number(req.query.page) || 1;
        let offset = (page - 1) * limit;

        const { agentid } = req.params;

        // Get total count of assigned debtors for pagination
        const totalCount = await Assignagent.count({ where: { agentid } });
        const totalPages = Math.ceil(totalCount / limit);

        let agentAssigned = await Assignagent.findAll({
            where: { agentid },
            limit,
            offset
        });

        agentAssigned = agentAssigned.map(agent => agent.get({ plain: true }));

        let newarray = [];

        async function getThedebtor(item) {
            let getdebtor = await db.select('loan_records', { id: item.debtorsid });
            getdebtor = getdebtor[0];

            // Parse loaninformation JSON string
            if (getdebtor && getdebtor.loaninformation) {
                getdebtor.loaninformation = JSON.parse(getdebtor.loaninformation);
            }

            item.debtorsdata = getdebtor;
            newarray.push(item);
        }

        await Promise.all(agentAssigned.map(async (item) => await getThedebtor(item)));

        // Sorting logic
        const sortBy = req.query.sortBy || 'dayslate'; // Default sorting field
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default is ascending

        newarray.sort((a, b) => {
            const aValue = a.debtorsdata?.loaninformation?.[sortBy] || 0;
            const bValue = b.debtorsdata?.loaninformation?.[sortBy] || 0;
            return (aValue - bValue) * sortOrder;
        });

        if (newarray.length > 0) {
            return res.status(200).json({
                error: false,
                message: "Agent and debtors list acquired",
                data: newarray,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalPages,
                    totalCount
                }
            });
        } else {
            return res.status(404).json({
                error: true,
                message: "Failed to acquire agent list",
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


    // original 
  //   async getassignedDebtorsbyid(req, res) {
  //     try {
  //         const limit = Number(req.query.limit);
  //         let page = 1;
  //         if (req.query.page) {
  //             page = parseInt(req.query.page);
  //         }
  //         let offset = (page - 1) * limit;

  //         const { agentid } = req.params;

  //         let agentAssigned = await Assignagent.findAll({
  //             where: { agentid },
  //             limit,
  //             offset
  //         });

  //         agentAssigned = agentAssigned.map(agent => agent.get({ plain: true }));

  //         let newarray = [];

  //         async function getThedebtor(item) {
  //             let getdebtor = await db.select('loan_records', { id: item.debtorsid });
  //             getdebtor = getdebtor[0];

  //             // Parse loaninformation JSON string
  //             if (getdebtor && getdebtor.loaninformation) {
  //                 getdebtor.loaninformation = JSON.parse(getdebtor.loaninformation);
  //             }

  //             item.debtorsdata = getdebtor;
  //             newarray.push(item);
  //         }

  //         await Promise.all(agentAssigned.map(async (item) => await getThedebtor(item)));

  //         // Sorting logic
  //         const sortBy = req.query.sortBy || 'dayslate'; // Default sorting field
  //         const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default is ascending

  //         newarray.sort((a, b) => {
  //             const aValue = a.debtorsdata?.loaninformation?.[sortBy] || 0;
  //             const bValue = b.debtorsdata?.loaninformation?.[sortBy] || 0;
  //             return (aValue - bValue) * sortOrder;
  //         });

  //         if (newarray.length > 0) {
  //             return res.status(200).json({
  //                 error: false,
  //                 message: "Agent and debtors list acquired",
  //                 data: newarray,
  //             });
  //         } else {
  //             return res.status(404).json({
  //                 error: true,
  //                 message: "Failed to acquire agent list",
  //             });
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         return res.status(400).json({
  //             error: true,
  //             message: "Oops! Something went wrong",
  //             data: error.message,
  //         });
  //     }
  // },


 
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
      },

      /* ----------------------- get all debtors by clientid ---------------------- */

      async getAllDebtorsidbyClientid(req, res) {
        try {
          const {clientid} = req.params;
          // Fetch only the 'debtorsid' field from the database.
          const clientDebtors = await Assignagent.findAll({ where:{clientid},
            attributes: ['debtorsid']
          });
      
          // Check if the returned array is empty
          if (!clientDebtors || clientDebtors.length === 0) {
            return res.status(404).json({
              error: true,
              message: "No debtors found"
            });
          } else {
            return res.status(200).json({
              error: false,
              message: "All Debtorsid Assigned to client",
              data: clientDebtors
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

      /* --------------------- un assign debtor from an agent --------------------- */
      async unassignDebtor(req, res) {
        try {
            const { agentid, debtorsid } = req.params;
    
            if (!agentid || !debtorsid) {
                return res.status(400).json({
                    error: true,
                    message: "Both agentid and debtorsid are required",
                });
            }
    
            // Find the assignment with both agentid and debtorsid
            const checkDebtor = await Assignagent.findOne({
                where: {debtorsid},
            });
            const checkAgent = await Assignagent.findOne({
                where: {agentid},
            });
    
            if (!checkDebtor) {
                return res.status(400).json({
                    error: true,
                    message: "Debtor with this id not found",
                });
            }
            if (!checkAgent) {
                return res.status(400).json({
                    error: true,
                    message: "Agent with this id not found",
                });
            }
    
            // Delete the assignment
            await Assignagent.destroy({
                where: { agentid, debtorsid },
            });
    
            return res.status(200).json({
                error: false,
                message: "Debtor successfully unassigned from agent",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                message: "Oops! Something went wrong",
                data: error.message,
            });
        }
    },

    
      

}
module.exports = assignagentController