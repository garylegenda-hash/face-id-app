import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('resetToken', '==', token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data() as any;

    if (!userData.resetTokenExpiry || userData.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: 'Token expired' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await updateDoc(doc(db, 'users', userDoc.id), {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}



