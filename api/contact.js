module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, school, phone, message } = req.body;

  if (!name || !email || !school || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const escape = s => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GoGolf Website <noreply@contact.chookwebdesign.com>',
        to: ['gogolfcoachingnz@gmail.com'],
        reply_to: email,
        subject: `New GoGolf enquiry from ${escape(name)}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1B4332;">New enquiry from GoGolf website</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;font-weight:600;width:100px;">Name</td><td>${escape(name)}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;">Email</td><td><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
              <tr><td style="padding:8px 0;font-weight:600;">School</td><td>${escape(school)}</td></tr>
              ${phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td>${escape(phone)}</td></tr>` : ''}
            </table>
            <h3 style="color:#1B4332;margin-top:24px;">Message</h3>
            <p style="white-space:pre-wrap;background:#f6fcf8;padding:16px;border-radius:8px;">${escape(message)}</p>
            <hr style="margin-top:32px;border:none;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;">Sent from the GoGolf website contact form</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Resend error');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
