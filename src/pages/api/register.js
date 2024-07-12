import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: 'User registration failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
