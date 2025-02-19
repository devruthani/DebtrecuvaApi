const crypto = require("crypto");
const { encrypt } = require("../../utils/encrypt");
const randomOtp = require("random-otp-generator");
const { sendMail } = require("../../utils/nodemailer");
const Cache = require("memory-cache");
const jwt = require("jsonwebtoken");
const { Fieldagent } = require("../../model");
const { Model } = require("../../model/fieldagent.model");
require("dotenv").config();

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


const fieldAgentController = {
    async fieldAgentsignUp(req, res) {
        try {
          const agentId = crypto.randomBytes(16).toString("hex");
          const password = encrypt(req.body.password);
    
          if (
            req.body.firstname &&
            req.body.tenantid &&
            req.body.lastname &&
            req.body.email &&
            req.body.mobile &&
            req.body.password &&
            req.body.lga &&
            req.body.state &&
            req.body.address 

          ) {
            if (emailRegexp.test(req.body.email)) {
              const regAgent = await Fieldagent.create({
                agentid: agentId,
                tenantid:req.body.tenantid,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile,
                state: req.body.state,
                address: req.body.address,
                lga: req.body.lga,
                password: password,
              });
              if (regAgent) {
                return res.status(200).json({
                  error: false,
                  message: "You have been registered successfully",
                });
              } else {
                return res.status(400).json({
                  error: true,
                  message: "Registration failed",
                });
              }
            } else {
              return res.status(400).json({
                error: true,
                message: "Email should be provided in the right format",
              });
            }
          } else {
            return res.status(400).json({
              error: true,
              message: "All fields are required",
            });
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

    //   Login user 
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
                    message: "User with this email does not exist",
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
    
      async resentOTP(req, res) {
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
                  message: "User with this email does not exist",
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
    
          // Check if token or verifyotp is missing
          if (!token || !verifyotp) {
            return res.status(400).json({
              error: true,
              message: "OTP or token is missing",
            });
          }
    
          // Verify the JWT token
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
          // Check if the decoded OTP matches the provided one
          if (decoded.otp === verifyotp) {
            return res.status(200).json({
              error: false,
              message: "OTP verified successfully",
            });
          } else {
            return res.status(404).json({
              error: true,
              message: "The OTP you provided is incorrect",
            });
          }
        } catch (error) {
          if (error.name === "TokenExpiredError") {
            return res.status(500).json({
              error: true,
              message: "The OTP has expired",
            });
          } else {
            return res.status(500).json({
              error: true,
              message: "Invalid Token",
            });
          }
        }
      },
    
      /* ----------------------------- reset password ----------------------------- */
      async resetPassword(req, res) {
        try {
          const newpassword = req.body.password;
          const confirmpassword = req.body.confirmpassword;
          const checkemail = req.body.email;
    
          // Check if the new password matches the confirmed password
          if (newpassword !== confirmpassword) {
            return res.status(404).json({
              error: true,
              message: "Passwords do not match",
            });
          } else {
            // Find user by email
            const theAgent = await Fieldagent.findOne({ where: { email: checkemail } });
    
            if (theAgent.length > 0) {
              // Encrypt the new password (replace with your encryption method)
              const encryptedPassword = encrypt(newpassword);
    
              // Update the user's password in the "Users" table
              await Fieldagent.update(
                { password: encryptedPassword },
                { email: checkemail }
              );
    
              return res.status(200).json({
                error: false,
                message: "Password reset successfully",
              });
            } else {
              return res.status(400).json({
                error: true,
                message: "Admin with this email does not exist",
              });
            }
          }
        } catch (error) {
          console.error("Password reset failed", error);
          return res.status(404).json({
            error: true,
            message: "Failed to reset password",
            data: error.message,
          });
        }
      },

      // GET AGENT BY ID 
  
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






}
module.exports = fieldAgentController;