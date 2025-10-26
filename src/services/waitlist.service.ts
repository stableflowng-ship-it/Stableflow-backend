// 

import { sendEmailResend } from "../config/resend.config"
import { AppDataSource } from "../data-source"
import { Waitlist } from "../entities/waitlist/waitlist.entity"

const wailistRepo = AppDataSource.getRepository(Waitlist)
export class WaitlistService {

  static joinWaitlist = async (payload: { email: string }) => {
    const newW = new Waitlist
    newW.email = payload.email
    await wailistRepo.save(newW)
    sendEmailResend({ html: {}, subject: "Welcome to the waitlist — something big is coming 👀", to: payload.email, htmlPath: "../email_templates/waitlist.html", })
    return "Your email has been added to the waitlist"
  }
}