import dbConnect from '../../../lib/db.js';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { username, email, password, latitude, longitude } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      location: {
        latitude,
        longitude,
      },
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'User registration failed' });
  }
}

