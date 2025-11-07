require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // your@gmail.com
    pass: process.env.GMAIL_APP_PASS   // your 16-char app password
  }
});

app.post('/send', async (req, res) => {
  const { to, subject, html, text } = req.body;

  if (!to || (!html && !text)) {
    return res.status(400).json({ error: 'Need: to + (html or text)' });
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
      text
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gmail send failed — likely blocked' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Gmail proxy running');
});
