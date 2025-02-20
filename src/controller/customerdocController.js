const crypto = require("crypto");
const {Customerdoc } = require("../model");



const customerdocController = {
    async createDocument(req,res){
        try{
            const docId = crypto.randomBytes(16).toString("hex");
    
           let docstructure = JSON.stringify(req.body.documentstructure)
           
            const document = await Customerdoc.create({
                documentid: docId,
                documenttitle:req.body.documenttitle,
                documentdescription:req.body.documentdescription,
                documentstructure: docstructure
                
            });
            if(document){
                return res.status(200).json({
                    error:false,
                    message:"Document created successfully",
                    
                })
                
            }else{
                return res.status(400).json({
                    error:true,
                    message:"Failed to create Document",
                    
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

    async fetchAllDocuments(req, res) {
        try {
          
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
    
            const totalDocs = await Customerdoc.count(); // Get the total number of admin
            const totalPages = Math.ceil(totalDocs / limit); // Calculate total pages
    
            const fetchDocuments = await Customerdoc.findAll({
                limit: limit,
                offset: offset
            });
    
            if (fetchDocuments) {
                return res.status(200).json({
                    error: false,
                    message: "Documents acquired successfully",
                    data: fetchDocuments,
                    totalPages: totalPages // Send totalPages in the response
                });
            } else {
                return res.status(404).json({
                    error: true,
                    message: "Failed to fetch Documents"
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
    
    
    
    async getDocumentbyid(req,res){
        try {
            
       const {documentid} = req.params;
        const getByid = await Customerdoc.findOne({where:{documentid}});
        if(!getByid){
            return res.status(400).json({
                error:true,
                message:"Failed to acquire Document"
            })
          
    
        }else{
            return res.status(200).json({
                error:false,
                message:"Document acquired successfully",
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

  
    
    async editDocument(req,res){
        try{
            const {documentid} = req.body;
            const updateDoc = await Customerdoc.findOne({where:{documentid: documentid}});
         
            if(!updateDoc){
                return res.status(400).json({
                    error:true,
                    message:"Document with this id does not exist"
                })
    
            }else{
                await updateDoc.update({
                    documenttitle:req.body.documenttitle,
                    documentdescription:req.body.documentdescription,
                    documentstructure: docstructure

                },{where:{documentid:req.body.documentid}})
               
                return res.status(200).json({
                    error:false,
                    message:"Document updated successfully"
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
    async deleteDocument(req,res){
        try{
            const {documentid } = req.params;
            const delTask = await Customerdoc.findOne({where: {documentid}});
    
            if(!delTask){
                return res.status(400).json({ error:true,message: "Document not found" });
    
            }else{
                await delTask.destroy();
                res.status(200).json({ 
                    error:false,
                    message: "Document deleted successfully"});
    
    
            }
    
        }catch(error){
            console.log(error)
            return res.status(500).json({
                error:true,
                message:"Oops! some thing went wrong",
                data:error.message
            });
    
        }
    }


}
module.exports = {customerdocController}