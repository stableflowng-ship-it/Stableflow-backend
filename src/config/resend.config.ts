// 
import { Resend } from 'resend';
import { envHelper } from "./env.helper";
import Handlebars from 'handlebars'
const fs = require('fs')
const path = require('path')


// API key auth

// set API key


type EmailType = {
  to: string,
  subject: string,
  html: object,
  htmlPath?: string,
  // htmlTemplate?: string
}


const resend = new Resend(envHelper.email.resend);


export async function sendEmailResend({ to, subject, html, htmlPath }: EmailType) {

  const templatePath = path.join(__dirname, htmlPath)
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(templateSource)

  const { data, error } = await resend.emails.send({
    from: `Stableflow <${envHelper.email.email}>`,
    to: [to],
    subject: subject,
    html: template(html),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

// sendWelcomeEmail();