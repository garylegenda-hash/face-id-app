import nodemailer from 'nodemailer';

function getTransporter() {
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('[Email] Faltan variables de entorno: EMAIL_USER o EMAIL_PASS');
    throw new Error('Email configuration is incomplete');
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass.trim(), // Eliminar espacios en blanco
    },
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"Sistema de Gestión" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Recuperación de Contraseña</h2>
          <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            O copia y pega este enlace en tu navegador:<br>
            <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Este enlace expirará en 1 hora.<br>
            Si no solicitaste este cambio, ignora este correo.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    // Proporcionar mensajes de error más específicos
    if (error.code === 'EAUTH') {
      return { success: false, error: 'Error de autenticación. Verifica EMAIL_USER y EMAIL_PASS' };
    }
    if (error.code === 'ECONNECTION') {
      return { success: false, error: 'Error de conexión con el servidor de email' };
    }
    return { success: false, error: error.message || 'Error al enviar el email' };
  }
}

