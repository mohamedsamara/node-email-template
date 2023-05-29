import express from 'express';
import path from 'path';

import config from './config/keys';
import * as sendEmail from './send-email';

const PORT = config.port;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

interface TemplateData {
  buttonLink: string;
}

app.get('/', (req, res) => {
  return res.json({ message: 'Node Email Template!' });
});

app.use('/api/send-email', async (req, res) => {
  try {
    const templatePath = path.join(
      __dirname,
      './templates/email-templates/welcome.html',
    );
    const buttonLink = 'https://github.com/mohamedsamara/node-email-template';

    const templateData: TemplateData = {
      buttonLink,
    };
    const payload = {
      subject: 'Welcome to Email Templates!',
      recipients: ['test@gmail.com'],
      templatePath,
      templateData,
    };

    await sendEmail.send<TemplateData>(payload);

    res.status(200).json({
      success: true,
      message: 'Mail sent!',
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
