// import { InformationEntry } from "../types"
import { Request, Response, NextFunction } from 'express'
import Information from '../models/information.model'
import nodemailer from 'nodemailer'

const mailServer = process.env.NODEMAILER_HOST
const mailPort = process.env.NODEMAILER_PORT
const mailTo = process.env.NODEMAILER_TO
const mailUser = process.env.NODEMAILER_USER
const mailPassword = process.env.NODEMAILER_PASSWORD
const mailSubject = process.env.NODEMAILER_SUBJECT

export const getInformation = async (_req: Request, res: Response, next: NextFunction) => {
  // const informationList: InformationEntry[] = data as InformationEntry[]
  try {
    const info = await Information.findAll()
    res.json(info)
  } catch (error) {
    next(error)
  }
}
export const addInformation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { body } = req
  try {
    //verify if already exist a user with this email
    const user = await Information.findOne({ where: { email: body?.email } })
    if (user) return res.status(400).json({ message: 'There is already a user with this email.' })

    // send email to company email
    const transporter = nodemailer.createTransport({
      host: mailServer,
      port: parseInt(mailPort ? mailPort : '465'),
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPassword
      }
    });

    let contentHtml = ``
    if (body.message === '') {
      contentHtml = `
      <h2>INFORMACION</h2>
      <ul>
        <li><b>Nombre:</b> ${body.name}</li>
        <li><b>Correo electronico</b> ${body.email}</li>
      </ul>
      `
    } else {
      contentHtml = `
        <h2>INFORMACIÓN</h2>
        <ul>
          <li><b>Nombre: </b>${body.name}</li>
          <li><b>Correo electrónico: </b>${body.email}</li>
          <li><b>Mensaje: </b>${body.message}</li>
        </ul>
      `
    }
    await transporter.sendMail({
      from: `"Contacts Website" <${body.email || 'info@goar.pe'}>`, // sender address
      to: mailTo, // list of receivers
      subject: mailSubject, // Subject line
      html: contentHtml, // html body
      replyTo: mailTo
    });

    //send information to database 
    const information = await Information.create(body)

    res.json(information)
  } catch (error) {
    next(error)
  }
}