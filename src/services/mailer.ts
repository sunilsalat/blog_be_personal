import fs from "fs";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export interface IEmail {
  to: string;
  cc?: string;
  template: any;
  subject: any;
  attachments?: any;
}

// ensuring 3 attempts for successful delivery
const retryEmail = async (fn: any, n: number) => {
  for (let i = 0; i < n; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log(err);
    }
  }
};

// constructor function
export const sendMail = async ({ to, cc, template, subject }: IEmail) => {
  let transport: any;

  if (process.env.SMTP_PORT) {
    transport = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };
  }

  let transporter = nodemailer.createTransport(transport);
  var mailOptions: any = {
    from: `${process.env.SUPPROT_EMAIL}`,
    to: to, // receiver
    subject: subject, // Subject line
    secure: true,
    html: template,
  };

  if (cc) {
    mailOptions.cc = cc;
  }

  let response = await transporter.sendMail(mailOptions);
  return response;
};

export const sendWelcomeMail = async ({ to, payload }: any) => {
  let subject = `Welcome To ${process.env.PROJECT_NAME}`;

  let html = `<h1>Welcome</h1>`;

  try {
    const response = await retryEmail(
      () => sendMail({ to, template: html, subject }),
      3
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendOTPEmail = async ({ to, otp }: any) => {
  let subject = `OTP verification for ${process.env.PROJECT_NAME}`;

  const parameters = {
    otp,
  };

  let html = ejs.render(
    fs.readFileSync(__dirname + `/templates/otp.ejs`).toString(),
    parameters
  );

  try {
    const response = await retryEmail(
      () => sendMail({ to, template: html, subject }),
      3
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const sendFeedBackEmail = async ({ to, data }: any) => {
    let subject = `feed back from admin`;
    
    let html = `<h1> ${data} </h1>`
  
    try {
      const response = await retryEmail(
        () => sendMail({ to, template: html, subject }),
        3
      );
      return response;
    } catch (error) {
      return error;
    }
  };
  