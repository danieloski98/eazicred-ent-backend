import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import EmailConfirmation from '../../templates/EmailConfirmation';
import WaitlistEmail from '@/common/templates/waitlist';

@Injectable()
export class EmailService implements OnModuleInit {
  private resend: Resend;
  private logger = new Logger(EmailService.name);
  private from = `Eazicred Support <support@eazicred.com>`;
  constructor(private configService: ConfigService) { }

  onModuleInit() {
    this.resend = new Resend(this.configService.get('RESEND_KEY'));
    this.logger.debug('RESEND SETUP DONE');
  }

  async sendConfirmationMail({
    email,
    code,
    name,
  }: {
    email: string;
    code: string;
    name: string;
  }) {
    const { error, data } = await this.resend.emails.send({
      from: this.from,
      to: [email],
      subject: 'Verify Your email',
      react: EmailConfirmation({ code, firstName: name }),
    });
    if (error) {
      this.logger.error(error);
    }
    this.logger.log(data);
  }

  async sendCoachMail({
    emails,
    subject,
    body,
    html,
  }: {
    emails: string[];
    subject: string;
    body: string;
    html?: string;
  }) {
    const formattedHtml =
      html ??
      (body.trim().startsWith('<')
        ? body
        : `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; white-space: pre-line; line-height: 1.6; color: #1e293b;">${body}</div>`);

    const { error, data } = await this.resend.emails.send({
      from: this.from,
      to: emails,
      subject,
      html: formattedHtml,
      text: body,
    });
    if (error) {
      this.logger.error(error);
    }
    this.logger.log(data);
  }
}
