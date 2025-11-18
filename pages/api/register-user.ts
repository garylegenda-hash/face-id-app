import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, faceDescriptor } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Firestore no está inicializado' });
    }

    // Verificar si el usuario ya existe
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userData: any = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
    };

    if (faceDescriptor) {
      userData.faceDescriptor = faceDescriptor;
    }

    await addDoc(usersRef, userData);

    return res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

