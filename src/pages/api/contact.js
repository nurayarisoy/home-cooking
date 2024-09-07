import dbConnect from '../../lib/db.js';
import Contact from '../../models/Contact';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    try {
      const contact = new Contact({
        name,
        email,
        message
      });

      await contact.save();

      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Message sending failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
