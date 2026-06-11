# TodoTerramer

**Plataforma de generación de leads y afiliación para distribuidoras independientes Terramar en México.**

Una aplicación web full-stack, production-ready, bilingüe (Español/English), con panel de administración completo, SEO optimizado y sistema de gestión de prospectos.

---

## 🚀 Stack Tecnológico

| Tecnología | Descripcion |
|------------|-------------|
| Next.js 16 App Router | Framework SSR/SSG |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos utility-first |
| ShadCN UI (radix-ui) | Componentes accesibles |
| PostgreSQL 14+ | Base de datos |
| Prisma ORM | ORM type-safe |
| JWT Auth (jose) | Autenticación custom |
| next-intl | Internacionalización ES/EN |
| React Hook Form + Zod | Formularios y validación |
| Nodemailer | Notificaciones por email |

---

## 📋 Requisitos

- Node.js 20.19+ / 22.x / 24.x
- PostgreSQL 14+
- npm

---

## ⚡ Instalación rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus valores reales
```

Variables obligatorias:
- `DATABASE_URL` — String de conexión PostgreSQL
- `NEXTAUTH_SECRET` — Mínimo 32 caracteres aleatorios
- `NEXTAUTH_URL` — URL base de la app

### 3. Inicializar base de datos

```bash
npm run db:push       # Desarrollo (sin migraciones)
npm run db:migrate    # Producción (con migraciones)
```

### 4. Ejecutar seed

```bash
npm run db:seed
```

Crea: admin user, categorías, productos, promociones, blog posts y leads de ejemplo.

**Credenciales admin por defecto:**
- Email: `admin@todoterramar.com`
- Password: `AdminTerramar2025!`

### 5. Iniciar desarrollo

```bash
npm run dev
```

- **Sitio público**: http://localhost:3000 → redirige a `/es`
- **Admin panel**: http://localhost:3000/admin

---

## 🌐 Páginas públicas

| URL | Descripción |
|-----|-------------|
| `/es` `/en` | Home |
| `/es/sobre-terramar` | Acerca de Terramar |
| `/es/unete-al-equipo` | Únete al equipo + formulario |
| `/es/beneficios` | Beneficios de afiliación |
| `/es/promociones` | Promociones activas |
| `/es/videos` | Videos de capacitación |
| `/es/productos` | Catálogo con filtros |
| `/es/contacto` | Contacto |
| `/es/registro` | Formulario de registro |
| `/es/blog` | Blog SEO |
| `/es/privacidad` | Aviso de privacidad |
| `/es/terminos` | Términos y condiciones |

---

## 🔑 Panel de Administración (`/admin`)

| Módulo | Funcionalidad |
|--------|---------------|
| Dashboard | Estadísticas, prospectos recientes |
| Prospectos | CRUD, filtros, notas, estados |
| Promociones | CRUD, imagen, PDF, fechas |
| Videos | CRUD, YouTube/Vimeo, destacados |
| Productos | CRUD, categorías, precios |
| Blog | CRUD, SEO, bilingüe |
| Chat | Consultas del widget |
| Configuración | WhatsApp, redes, SEO, analytics |

---

## 🚀 Despliegue en Vercel

### Variables de entorno requeridas

```env
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=<32+ chars>
NEXTAUTH_URL=https://tu-dominio.com
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=contraseña-segura
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASSWORD=app-password
ADMIN_NOTIFICATION_EMAIL=admin@tudominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=521XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### PostgreSQL recomendado

- [Neon](https://neon.tech) — Serverless, plan gratuito generoso
- [Supabase](https://supabase.com) — PostgreSQL + Storage
- [Railway](https://railway.app) — Fácil configuración

---

## 🔒 Características de seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 rounds)
- ✅ JWT con expiración de 7 días
- ✅ Rate limiting en formularios públicos
- ✅ Honeypot anti-spam
- ✅ Validación Zod en servidor
- ✅ Rutas admin protegidas
- ✅ Sin datos sensibles expuestos al frontend
- ✅ Audit logs de acciones admin

---

## 🌍 Internacionalización

- `/es/*` — Español (default)
- `/en/*` — English
- `/` — Redirige a `/es`
- Todas las páginas, formularios, validaciones y SEO en ambos idiomas

---

## ⚠️ Aviso legal

TodoTerramer es un sitio operado por una distribuidora independiente de Terramar.
No está afiliado con la empresa corporativa Terramar México.
