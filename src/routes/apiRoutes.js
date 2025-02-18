const express = require("express");
const fieldAgentController = require("../controller/agents/fieldAgentController");
const assignagentController = require("../controller/assignagentController");
const { agenttaskController } = require("../controller/agenttaskController");
const router = express.Router();




        // agent registration 
router.post("/api/fieldagent/register",fieldAgentController.fieldAgentsignUp);
router.post("/api/fieldagent/login",fieldAgentController.login);
router.post("/api/fieldagent/forgotpassword",fieldAgentController.forgotPassword);
router.post("/api/fieldagent/verifyotp",fieldAgentController.verifyOTP);
router.post("/api/fieldagent/resendotp",fieldAgentController.resentOTP);
router.post("/api/fieldagent/resetpassword",fieldAgentController.resetPassword);
router.get("/api/fieldagent/getbyid/:agentid",fieldAgentController.getAgentbyid);
router.get("/api/fieldagent/getall/:offset/:limit",fieldAgentController.getAllAgents);
router.post("/api/fieldagent/edit",fieldAgentController.editAgent);
router.post("/api/fieldagent/delete/:agentid",fieldAgentController.deleteAgent);
// end 



// assign agent 

router.post("/api/assignagent/assign",assignagentController.assignAgent);
router.get("/api/getdebtors/:agentid",assignagentController.getassignedDebtorsbyid);
// end 

// agent task starts here 
router.post("/api/task/createtask",agenttaskController.createAgentTask);
router.get("/api/task/getbyid/:agentid",agenttaskController.fetchByagentid);
router.get("/api/task/getbytaskid/:taskid",agenttaskController.fetchTaskByid);
router.get("/api/task/getall/:offset/:limit",agenttaskController.fetchAllAgenttask);
router.post("/api/task/updatetask",agenttaskController.editAgentTask);
router.post("/api/task/deletetask",agenttaskController.deleteTask);


// ends here 













module.exports = router;