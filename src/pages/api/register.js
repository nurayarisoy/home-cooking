
import dp  from '../lib/db'
import User from '../../././models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, location } = req.body;

  try {
    const existingUser = await User.findOne(email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await User.create({ username, email, password, location });

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    return res.status(500).json({ error: 'User registration failed' });
  }
}

