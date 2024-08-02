'use server';

import Mailjet from 'node-mailjet';

const key = process.env.APP_MAILJET_KEY || '';
const secret = process.env.APP_MAILJET_SECRET || '';

const mailjet = Mailjet.apiConnect(key, secret);

type IAttachment = {
  ContentType: string;
  Filename: string;
  Base64Content: string;
};

type IMessage = {
  From: {
    Email?: string;
    Name?: string;
  };
  To: any;
  TemplateID: number;
  TemplateLanguage: boolean;
  Subject: string;
  Variables: any;
  Attachments: IAttachment[];
};

export type IEmailData = {
  receiver: string;
  templateId: string;
  subject: string;
  variables: any;
};

export const sendEmail = async (emailData: IEmailData) => {
  try {
    const { receiver, templateId, subject, variables } = emailData;

    const message: IMessage[] = [
      {
        From: {
          Email: 'noreply@ygestion.com',
          Name: 'Site Yazid',
        },
        To: [
          {
            Email: receiver,
          },
        ],
        TemplateID: parseInt(templateId, 10),
        TemplateLanguage: true,
        Subject: subject,
        Variables: variables,
        Attachments: [],
      },
    ];

    const res = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: message,
    });
    if (res.response.status !== 200) {
      throw new Error('error mailjet');
    }
    return res.response.status;
  } catch (error: any) {
    console.error('Error sending email', error);
    throw new Error(error.message);
  }
};
