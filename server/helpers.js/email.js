const nodemailer=require("nodemailer");
const jwt=require("jsonwebtoken");

    //replace resetcode with password;
    exports.sendMail = (email,emailSubject, content) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER, // Replace with your Gmail email
          pass: process.env.MAIL_PASS// Replace with your Gmail app password
        }
      });
    
      const mailOptions = {
        from: 'himanshusharma62610@gmail.com', // Replace with your Gmail email
        to: email,
        subject: `${emailSubject}`,
        html:` 
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Welcome To Realist App</title>
          </head>
          <body>
            <h1>Welcome To Realist App</h1>
            ${content}
          </body>
        </html>`
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          // Handle the error as needed
        } else {
          console.log('Email sent: ' + info.response);
          // Handle the success response as needed
        }
      });
    };
    
    