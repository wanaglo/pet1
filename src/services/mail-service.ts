import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, API_URL } = process.env;

class MailService {
    private transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: +SMTP_PORT!,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

    async sendMailActivation(recipient: string, link: string) {
        await this.transporter.sendMail({
            from: SMTP_USER,
            to: recipient,
            subject: 'Активация аккаунта на ' + API_URL,
            html: `
                    <div>
                        <h1>Перейдите по ссылке для активации аккаунта</h1>
                        <a href="${link}">${link}</a>
                    </div>
            `,
        });
    }

    async resetAccauntPassword(recipient: string, link: string) {
        await this.transporter.sendMail({
            from: SMTP_USER,
            to: recipient,
            subject: 'Сброс пароля на ' + recipient,
            html: `
                    <div>
                        </h1>Перейдите по ссылке для сброса пароля</h1>
                        <a href="${link}">${link}</a>
                    </div>
            `,
        });
    }
}

export default new MailService();
