import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario en Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verificar contraseña con bcrypt
    if (!userData.password) {
      return res.status(401).json({ error: 'Usuario sin contraseña válida' });
    }

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Retornar información del usuario (sin la contraseña)
    return res.status(200).json({
      success: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
      },
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: error.message || 'Error al iniciar sesión' });
  }
}

