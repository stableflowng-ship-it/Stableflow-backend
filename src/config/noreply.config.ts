// 

import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import { envHelper } from './env.helper'
const fs = require('fs')
const path = require('path')

type EmailType = {
  to: string,
  subject: string,
  html: object,
  htmlPath?: string,
  htmlTemplate?: string
}


export const sendEmail = ({ to, subject, html, htmlPath, htmlTemplate }: EmailType) => {
  let template: HandlebarsTemplateDelegate
  if (htmlPath) {
    const templatePath = path.join(__dirname, htmlPath)
    const templateSource = fs.readFileSync(templatePath, 'utf8')
    template = Handlebars.compile(templateSource)
  } else if (htmlTemplate) {
    template = Handlebars.compile(JSON.parse(htmlTemplate))
  }
  // console.log('-----------------', `${from ?? 'Swifo'} ${envHelper.postmark.od_email}`)
  const mailOptions = {
    from: `Stableflow ${envHelper.email.email}`,
    to: to,
    subject: subject,
    html: template(html),
  }

  const transporter = nodemailer.createTransport({
    host: envHelper.email.host,
    port: 465,
    secure: true,
    auth: {
      user: envHelper.email.username,
      pass: envHelper.email.password
    }
  })
  return transporter.sendMail(mailOptions)
}