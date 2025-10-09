// 
import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";


import { envHelper } from "./env.helper";
import Handlebars from 'handlebars'
const fs = require('fs')
const path = require('path')


// API key auth
const apiInstance = new TransactionalEmailsApi();

// set API key

apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

type EmailType = {
  to: string,
  subject: string,
  html: object,
  htmlPath?: string,
  // htmlTemplate?: string
}


export async function sendEmailBrevo({ to, subject, html, htmlPath }: EmailType) {
  const sendSmtpEmail = new SendSmtpEmail();

  const templatePath = path.join(__dirname, htmlPath)
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(templateSource)


  sendSmtpEmail.subject = subject
  sendSmtpEmail.sender = { email: envHelper.email.email, name: "Stableflow" };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.htmlContent = template(html)
  // sendSmtpEmail.params = 

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // console.log("✅ Email sent:", result);
  } catch (error) {
    // console.error("❌ Email error:", error);
  }
}

// sendWelcomeEmail();