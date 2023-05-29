import * as fs from 'fs';
import handlebars from 'handlebars';
import AWS from 'aws-sdk';

const EMAIL_SUPPORT = 'support@email-template.com';
const FRONTEND_TITLE = 'Node Email Template';

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

interface SendEmailPayload<TemplateData> {
  subject: string;
  recipients: string[];
  templatePath: string;
  templateData: TemplateData;
}

export const send = async <TemplateData>(
  payload: SendEmailPayload<TemplateData>,
) => {
  try {
    const source = fs.readFileSync(payload.templatePath, { encoding: 'utf-8' });
    const template: HandlebarsTemplateDelegate = handlebars.compile(source);
    const html = template(payload.templateData);

    const params = {
      Destination: {
        ToAddresses: payload.recipients,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: payload.subject,
        },
      },
      ReturnPath: `"${FRONTEND_TITLE}" <${EMAIL_SUPPORT}>`,
      Source: `"${FRONTEND_TITLE}" <${EMAIL_SUPPORT}>`,
    };

    ses.sendEmail(params, (err) => {
      if (err) {
        return err;
      } else {
        return true;
      }
    });
  } catch (error) {
    console.log('Something has gone wrong!', error);
    return error;
  }
};
