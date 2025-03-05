const express = require("express");
const fieldAgentController = require("../controller/agents/fieldAgentController");
const assignagentController = require("../controller/assignagentController");
const { agenttaskController } = require("../controller/agenttaskController");
const { calllogController } = require("../controller/calllogController");
const { customerdocController } = require("../controller/customerdocController");
const debtorspaymentController = require("../controller/debtorspaymentController");
const router = express.Router();



calllogController
        // agent registration 
router.post("/api/fieldagent/register",fieldAgentController.fieldAgentsignUp);
router.post("/api/fieldagent/login",fieldAgentController.login);
router.post("/api/fieldagent/forgotpassword",fieldAgentController.forgotPassword);
router.post("/api/fieldagent/verifyotp",fieldAgentController.verifyOTP);
router.post("/api/fieldagent/resendotp",fieldAgentController.resendOTP);
router.post("/api/fieldagent/resetpassword",fieldAgentController.resetPassword);
router.get("/api/fieldagent/getbyid/:agentid",fieldAgentController.getAgentbyid);
router.get("/api/fieldagent/getbytenantid/:tenantid/:offset/:limit",fieldAgentController.getbytenantid);
router.get("/api/fieldagent/getall/:offset/:limit",fieldAgentController.getAllAgents);
router.post("/api/fieldagent/edit",fieldAgentController.editAgent);
router.post("/api/fieldagent/delete/:agentid",fieldAgentController.deleteAgent);
router.get("/api/fieldagent/stats/:agentid",fieldAgentController.stats);

// end 



// assign agent 

router.post("/api/assignagent/assign",assignagentController.assignAgent);
router.get("/api/getdebtors/:agentid",assignagentController.getassignedDebtorsbyid);
router.get("/api/alldebtorsid",assignagentController.getAllDebtorsid);
router.get("/api/getbyclientid/:clientid",assignagentController.getAllDebtorsidbyClientid);
router.post("/api/unassigndebtor/:agentid/:debtorsid",assignagentController.unassignDebtor);
// end 

// agent task starts here 
router.post("/api/task/createtask",agenttaskController.createAgentTask);
router.get("/api/task/getbyagentid/:agentid",agenttaskController.fetchByagentid);
router.get("/api/task/getbytaskid/:taskid",agenttaskController.fetchTaskByid);
router.get("/api/task/getall/:offset/:limit",agenttaskController.fetchAllAgenttask);
router.post("/api/task/updatetask",agenttaskController.editAgentTask);
router.post("/api/task/deletetask/:taskid",agenttaskController.deleteTask);


// ends here 
/* -------------------------------- call log -------------------------------- */

router.post("/api/calllog/create",calllogController.createCallog);
router.get("/api/calllog/getall/:offset/:limit",calllogController.fetchAllCallLogs);
router.get("/api/calllog/getbycalllogid/:calllogid",calllogController.fetchallByid);
router.get("/api/calllog/getbytenantid/:tenantid",calllogController.fetchByTenantid);
router.get("/api/calllog/getbyclientid/:clientid",calllogController.fetchByClientid);
router.get("/api/calllog/getbydebtorid/:debtorid",calllogController.fetchByDebtorid);
router.get("/api/calllog/getbyagentid/:agentid",calllogController.fetchByAgentid);
router.post("/api/calllog/edit",calllogController.editCallLog);
router.post("/api/calllog/delete/:calllogid",calllogController.deleteCalllog);
/* -------------------------------- call log ends here-------------------------------- */

/* ------------------------------ document api --------------------------------------- */

router.post("/api/document/create",customerdocController.createDocument);
router.get("/api/document/getall/:offset/:limit",customerdocController.fetchAllDocuments);
router.get("/api/document/getbyid/:documentid",customerdocController.getDocumentbyid);
router.get("/api/document/getbytenantid/:tenantid",customerdocController.getDocumentbytenantid);
router.post("/api/document/edit",customerdocController.editDocument);
router.post("/api/document/delete/:documentid",customerdocController.deleteDocument);


/* ------------------------------ document api ends here------------------------------ */

/* --------------------------- debtors payment api -------------------------- */
router.post("/api/payment/recordpayment",debtorspaymentController.recordPayment);

/* -------------------------------- ends here ------------------------------- */








module.exports = router;