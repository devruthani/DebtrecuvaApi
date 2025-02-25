const crypto = require("crypto");
const { encrypt } = require("../../utils/encrypt");
const randomOtp = require("random-otp-generator");
const { sendMail } = require("../../utils/nodemailer");
const Cache = require("memory-cache");
const jwt = require("jsonwebtoken");
const { Fieldagent, Assignagent, Calllog } = require("../../model");
const { Model } = require("../../model/fieldagent.model");
const { error } = require("console");
require("dotenv").config();

var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


const fieldAgentController = {
    // async fieldAgentsignUp(req, res) {
    //     try {
    //       const agentId = crypto.randomBytes(16).toString("hex");
    //       const password = encrypt(req.body.password);
    
    //       if (
    //         req.body.firstname &&
    //         req.body.tenantid &&
    //         req.body.lastname &&
    //         req.body.email &&
    //         req.body.mobile &&
    //         req.body.password &&
    //         req.body.lga &&
    //         req.body.state &&
    //         req.body.address 

    //       ) {
    //         if (emailRegexp.test(req.body.email)) {
    //           const regAgent = await Fieldagent.create({
    //             agentid: agentId,
    //             tenantid:req.body.tenantid,
    //             firstname: req.body.firstname,
    //             lastname: req.body.lastname,
    //             email: req.body.email,
    //             mobile: req.body.mobile,
    //             state: req.body.state,
    //             address: req.body.address,
    //             lga: req.body.lga,
    //             password: password,
    //           });
    //           if (regAgent) {
    //             return res.status(200).json({
    //               error: false,
    //               message: "You have been registered successfully",
    //             });
    //           } else {
    //             return res.status(400).json({
    //               error: true,
    //               message: "Registration failed",
    //             });
    //           }
    //         } else {
    //           return res.status(400).json({
    //             error: true,
    //             message: "Email should be provided in the right format",
    //           });
    //         }
    //       } else {
    //         return res.status(400).json({
    //           error: true,
    //           message: "All fields are required",
    //         });
    //       }
    //     } catch (error) {
    //       console.log(error);
    //       return res.status(500).json({
    //         error: true,
    //         message: "Oops! some thing went wrong",
    //         data: error.message,
    //       });
    //     }
    //   },

    //   Login user 
    
    async fieldAgentsignUp(req, res) {
      try {
        const {
          tenantid,
          firstname,
          lastname,
          email,
          mobile,
          password,
          lga,
          state,
          address
        } = req.body;
    
        // Validate required fields
        if (!firstname || !tenantid || !lastname || !email || !mobile || !password || !lga || !state || !address) {
          return res.status(400).json({
            error: true,
            message: "All fields are required",
          });
        }
    
        // Validate email format
        if (!emailRegexp.test(email)) {
          return res.status(400).json({
            error: true,
            message: "Email should be provided in the right format",
          });
        }
    
        // Validate password format
        if (!passwordRegex.test(password.trim())) {
          return res.status(400).json({
            error: true,
            message: "Password should contain at least 6 characters, uppercase, lowercase, number, and a special symbol",
          });
        }
    
        // Validate mobile number (should be numeric)
        if (isNaN(mobile.trim())) {
          return res.status(400).json({
            error: true,
            message: "Mobile should be a number",
          });
        }
    
        // Check if the agent already exists in the database
        const existingAgent = await Fieldagent.findOne({ where: { email } });
        if (existingAgent) {
          return res.status(400).json({
            error: true,
            message: "Agent with this email already exists",
          });
        }
    
        // Generate agent ID and encrypt password
        const agentId = crypto.randomBytes(16).toString("hex");
        const encryptedPassword = encrypt(password);
    
        // Register the new agent
        const newAgent = await Fieldagent.create({
          agentid: agentId,
          tenantid,
          firstname,
          lastname,
          email,
          mobile,
          state,
          address,
          lga,
          password: encryptedPassword,
        });
    
        if (newAgent) {
          return res.status(200).json({
            error: false,
            message: "Agent registered successfully",
          });
        } else {
          return res.status(400).json({
            error: true,
            message: "Registration failed",
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
    
    
    
    
    async login(req, res) {
        try {
          var regemail = req.body.email;
          var securedPassword = encrypt(req.body.password);
          const loginAgent = await Fieldagent.findOne({
            where: {
              email: regemail,
              password: securedPassword,
            },
          });
    
          if (loginAgent) {
            return res.status(200).json({
              error: false,
              message: "You've been logged in successfully",
              data: loginAgent,
            });
          } else {
            return res.status(400).json({
              error: true,
              message: "Invalid credentials",
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            error: true,
            message: "Oops! Something went wrong",
            data: error.message,
          });
        }
      },
      // async forgotPassword(req, res) {
      //   try {
      //     // check if email was sent
      //     const checkEmail = req.body.email;
      //     if (!checkEmail) {
      //       return res.status(400).json({
      //         error: true,
      //         message: "No email was sent",
      //       });
      //     } else {
      //       const otp = randomOtp(6);
      //       // create a jwt containing the otp and email, with a 5 minutes expiration time
      //       const token = jwt.sign(
      //         { otp, email: checkEmail },
      //         process.env.JWT_SECRET_KEY,
      //         { expiresIn: "5m" }
      //       );
    
      //       // Send the token in the email (user will use this token in the verification process)
      //       await sendMail(
      //         checkEmail,
      //         "OTP Verification Code",
      //         `<h1>Your OTP verification code is ${otp} </h1>`
      //       );
    
      //       return res.status(200).json({
      //         error: false,
      //         message: "An OTP has been sent to your email",
      //         token: token,
      //       });
      //     }
      //   } catch (error) {
      //     console.log(error);
      //     return res.status(500).json({
      //       error: true,
      //       message: "Oops! some thing went wrong",
      //       data: error.message,
      //     });
      //   }
      // },
    
      async forgotPassword(req, res) {
        try {
            // Check if email was provided
            const checkEmail = req.body.email;
            if (!checkEmail) {
                return res.status(400).json({
                    error: true,
                    message: "No email was sent",
                });
            }
            
    
            // Check if the email exists in the database
            const user = await Fieldagent.findOne({ where: {email: checkEmail} });
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: "Agent with this email does not exist",
                });
            }else{

           console.log(user, checkEmail)
             
            // Generate OTP
            const otp = randomOtp(6);
    
            // Create a JWT containing the OTP and email with a 5-minute expiration time
            const token = jwt.sign(
                { otp, email: checkEmail },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "5m" }
            );
    
            // Send OTP via email
            await sendMail(
                checkEmail,
                "OTP Verification Code",
                `<h1>Your OTP verification code is ${otp}</h1>`
            );
    
            return res.status(200).json({
                error: false,
                message: "An OTP has been sent to your email",
                token: token,
            });
          }
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Oops! Something went wrong",
                data: error.message,
            });
        }
    },
    
      /* ---------------- // resend otp if you did not get any one ---------------- */
    
      async resendOTP(req, res) {
        try {
          // Check if email was provided
          const checkEmail = req.body.email;
          if (!checkEmail) {
              return res.status(400).json({
                  error: true,
                  message: "No email was sent",
              });
          }
          
  
          // Check if the email exists in the database
          const user = await Fieldagent.findOne({ where: {email: checkEmail} });
          if (!user) {
              return res.status(404).json({
                  error: true,
                  message: "Agent with this email does not exist",
              });
          }else{

         console.log(user, checkEmail)
           
          // Generate OTP
          const otp = randomOtp(6);
  
          // Create a JWT containing the OTP and email with a 5-minute expiration time
          const token = jwt.sign(
              { otp, email: checkEmail },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5m" }
          );
  
          // Send OTP via email
          await sendMail(
              checkEmail,
              "OTP Verification Code",
              `<h1>Your OTP verification code is ${otp}</h1>`
          );
  
          return res.status(200).json({
              error: false,
              message: "An OTP has been sent to your email",
              token: token,
          });
        }
  
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              error: true,
              message: "Oops! Something went wrong",
              data: error.message,
          });
      }
      },
      //
      /* ------------------------------- verify otp ------------------------------- */
      async verifyOTP(req, res) {
        try {
            const { token, verifyotp } = req.body;
            console.log("Received token:", token);
            console.log("Received OTP:", verifyotp);
    
            if (!token || !verifyotp) {
                return res.status(400).json({ error: true, message: "OTP or token is missing" });
            }
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("Decoded token:", decoded);
    
            if (decoded.otp === verifyotp) {
                return res.status(200).json({ error: false, message: "OTP verified successfully" });
            } else {
                return res.status(400).json({ error: true, message: "The OTP you provided is incorrect" });
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                console.log("Token expired at:", error.expiredAt);
                return res.status(400).json({ error: true, message: "The OTP has expired" });
            } else {
                console.log("JWT Verification Error:", error);
                return res.status(400).json({ error: true, message: error.message });
            }
        }
    },
    
    
      /* ----------------------------- reset password ----------------------------- */
      async resetPassword(req, res) {
        try {
          // const { password: newpassword, confirmpassword } = req.body;
          const newpassword = req.body.newpassword
          const confirmpassword = req.body.confirmpassword
      
          // Check if both password fields are provided
          if (!newpassword || !confirmpassword) {
            return res.status(400).json({
              error: true,
              message: "New password and confirm password are required",
            });
          }
      
          // Check if the new password matches the confirmed password
          if (newpassword !== confirmpassword) {
            return res.status(400).json({
              error: true,
              message: "Passwords do not match",
            });
          }
      
          // Validate the new password format (at least 6 characters, uppercase, lowercase, number, and a symbol)
          if (!passwordRegex.test(newpassword.trim())) {
            return res.status(400).json({
              error: true,
              message:
                "Password must contain at least 6 characters, including uppercase, lowercase, number, and a special symbol",
            });
          }
      
          // Encrypt the new password using your encryption method
          const encryptedPassword = encrypt(newpassword);
      
          // Update the password for the user; assuming the user is already verified via email
          const updated = await Fieldagent.update(
            { password: encryptedPassword },
            { where: { email: req.body.email } }
          );
      
          // Check if any row was affected
          if (updated[0] === 0) {
            return res.status(400).json({
              error: true,
              message: "Failed to reset password. Please try again.",
            });
          }
      
          return res.status(200).json({
            error: false,
            message: "Password reset successfully",
          });
        } catch (error) {
          console.error("Password reset failed", error);
          return res.status(500).json({
            error: true,
            message: "Failed to reset password",
            data: error.message,
          });
        }
      },
      

      /* --------------------------- // GET AGENT BY ID --------------------------- */
  
   async getAgentbyid(req, res) {
    try {
      const { agentid } = req.params;
      const agentInfo = await Fieldagent.findOne({ where: { agentid } });

      if (agentInfo) {
        return res.status(200).json({
          error: false,
          message: "Agent information acquired successfully",
          data: agentInfo,
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "Failed to acquire agent information",
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

  // fetch all agents 
  async getAllAgents(req, res) {
    try {
        const limit = Number(req.params.limit);
        const offset = Number(req.params.offset);

        const totalAgent = await Fieldagent.count(); // Get the total number of admin
        const totalPages = Math.ceil(totalAgent / limit); // Calculate total pages

        const fetchAllAgent = await Fieldagent.findAll({
            limit: limit,
            offset: offset
        });

        if (fetchAllAgent) {
            return res.status(200).json({
                error: false,
                message: "Agents acquired successfully",
                data: fetchAllAgent,
                totalPages: totalPages // Send totalPages in the response
            });
        } else {
            return res.status(404).json({
                error: true,
                message: "Failed to fetch agents"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Error fetching agents",
            data: error.message
        });
    }
},

  /* ------------------------- UPDATE AGENT INFORMATION ------------------------ */
  async editAgent(req, res) {
    try {
      const { agentid } = req.body;
      const editAgent = await Fieldagent.findOne({ where: { agentid: agentid } });

      if (!editAgent) {
        return res.status(400).json({
          error: true,
          message: "Agent with this id not found",
        });
      } else {
        await editAgent.update(
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            address: req.body.address,
            state: req.body.state,
            lga: req.body.lga,
          },
          { where: { agentid: req.body.agentid } }
        );
        return res.status(200).json({
          error: false,
          message: "Your profile have been updated successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        message: "Error in updating agent profile",
        data: error.message,
      });
    }
  },

  /* ------------------------------ DELETE AGENT ------------------------------ */
  async deleteAgent(req, res) {
    try {
      const { agentid } = req.params;
      const delAgent = await Fieldagent.findOne({ where: { agentid:agentid } });

      if (!delAgent) {
        return res
          .json({ error: true, message: "Agent with this id not found" });
      } else {
        const deleteAgent = await delAgent.destroy();
        if(deleteAgent) {
            res.status(200).json({
              error: false,
              message: "Agent deleted successfully",
            });
        } else {
          res.status(400).json({
            error: true,
            message: "Failed to complete the request at the moment"
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: "Error deleting admin",
        data: error.message,
      });
    }
  },

  /* -------------------------------All Statistics ------------------------------- */

  async stats(req,res){
      try {
        
        const {agentid} = req.params;
    
        var allCustomers = await Assignagent.findAll({where: {agentid}})
        var allCallLogs = await Calllog.findAll({where:{agentid}})
       
        return res.status(200).json({
          error:false,
          message:"Stats acquired Successful",
          data: [{
            "TotalCustomers": allCustomers.length,
            "TotalCallLogs":allCallLogs.length
          }]

        })


      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: true,
          message: "Oops! some thing went wrong",
          data: error.message,
        });
      }


  },
 





}
module.exports = fieldAgentController;