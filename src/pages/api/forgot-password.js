import dbConnect from '../../lib/db.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user) {
        // Şifre sıfırlama işlemi burada gerçekleştirilir.
        res.status(200).json({ message: 'Password reset link sent' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
