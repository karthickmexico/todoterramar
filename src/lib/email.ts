import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "TodoTerramar <noreply@todoterramar.com>",
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function getAdminLeadNotificationEmail(lead: {
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  interest: string;
  source: string;
  message?: string | null;
}): { subject: string; html: string } {
  const subject = `Nuevo prospecto: ${lead.fullName} - TodoTerramar`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo Prospecto</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #be123c, #e11d48); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
          .body { padding: 30px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
          .value { font-size: 16px; color: #111827; margin-top: 4px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .badge-new { background: #dcfce7; color: #15803d; }
          .actions { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 8px; }
          .btn-whatsapp { background: #25D366; color: white; }
          .btn-admin { background: #e11d48; color: white; }
          .footer { padding: 20px 30px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 Nuevo Prospecto</h1>
            <p>Acabas de recibir una nueva solicitud en TodoTerramar</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">Nombre completo</div>
              <div class="value">${lead.fullName}</div>
            </div>
            <div class="field">
              <div class="label">Teléfono / WhatsApp</div>
              <div class="value">${lead.phone}</div>
            </div>
            ${lead.email ? `<div class="field"><div class="label">Correo electrónico</div><div class="value">${lead.email}</div></div>` : ""}
            ${lead.city || lead.state ? `<div class="field"><div class="label">Ubicación</div><div class="value">${[lead.city, lead.state].filter(Boolean).join(", ")}</div></div>` : ""}
            <div class="field">
              <div class="label">Le interesa</div>
              <div class="value">${lead.interest === "JOIN_TEAM" ? "Unirse al equipo" : lead.interest === "BUY_PRODUCTS" ? "Comprar productos" : "Ambas opciones"}</div>
            </div>
            <div class="field">
              <div class="label">Cómo nos encontró</div>
              <div class="value">${lead.source}</div>
            </div>
            ${lead.message ? `<div class="field"><div class="label">Mensaje</div><div class="value">${lead.message}</div></div>` : ""}
            <div class="actions">
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola ${encodeURIComponent(lead.fullName)}, te contacto de TodoTerramar" class="btn btn-whatsapp">💬 WhatsApp</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads" class="btn btn-admin">Ver en Admin</a>
            </div>
          </div>
          <div class="footer">
            <p>TodoTerramar — Distribuidora Independiente Terramar</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
}

export function getLeadAutoReplyEmail(lead: {
  fullName: string;
  interest: string;
}): { subject: string; html: string } {
  const subject = `¡Gracias por tu interés en TodoTerramar! 🌸`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #be123c, #e11d48); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .body { padding: 30px; }
          .footer { padding: 20px 30px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Hola ${lead.fullName}! 🌸</h1>
          </div>
          <div class="body">
            <p>Gracias por registrarte en <strong>TodoTerramar</strong>. Hemos recibido tu solicitud y estamos muy emocionados de conectar contigo.</p>
            <p>Uno de nuestros asesores se pondrá en contacto contigo en las próximas <strong>24 horas</strong> para platicarte todos los detalles sobre ${lead.interest === "JOIN_TEAM" ? "cómo unirte a nuestro equipo" : lead.interest === "BUY_PRODUCTS" ? "nuestros productos disponibles" : "las oportunidades disponibles"}.</p>
            <p>Mientras tanto, puedes escribirnos directamente por <strong>WhatsApp</strong> si tienes alguna pregunta urgente.</p>
            <p style="margin-top: 30px;">Con cariño,<br><strong>El equipo de TodoTerramar</strong></p>
          </div>
          <div class="footer">
            <p>TodoTerramar — Distribuidora Independiente Terramar México</p>
            <p style="font-size: 11px; color: #d1d5db;">Este es un sitio independiente y no representa a la empresa oficial de Terramar.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
}
