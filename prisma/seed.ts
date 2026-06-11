import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const IMG = (id: number, w = 600, h = 600) => `https://picsum.photos/seed/tt${id}/${w}/${h}`;

async function main() {
  console.log("Seeding TodoTerramar...\n");

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@todoterramar.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminTerramar2025!";
  const hashed = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({ where: { email: adminEmail }, update: { password: hashed, name: "Admin TodoTerramar" }, create: { email: adminEmail, name: "Admin TodoTerramar", password: hashed, role: "ADMIN" } });
  console.log("Admin: " + adminEmail + " / " + adminPassword);

  // Settings
  const settings = [
    { key: "whatsappNumber",        value: "5215512345678" },
    { key: "whatsappDefaultMessage",value: "Hola! Vengo de TodoTerramar y me gustaria obtener mas informacion." },
    { key: "location",              value: "Ciudad de Mexico y area metropolitana" },
    { key: "businessHours",         value: "Lunes a Viernes 9:00-19:00 | Sabado 10:00-14:00" },
    { key: "facebook",              value: "https://facebook.com" },
    { key: "instagram",             value: "https://instagram.com" },
    { key: "youtube",               value: "https://youtube.com" },
    { key: "seoTitle",              value: "TodoTerramar - Distribuidora Terramar Mexico" },
    { key: "seoDescription",        value: "Unete al equipo Terramar Mexico o compra productos de belleza y bienestar." },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log("Settings done");

  // Categories
  const catData = [
    { nameEs: "Cuidado de la Piel", nameEn: "Skincare",          slug: "cuidado-piel",   sortOrder: 1 },
    { nameEs: "Maquillaje",          nameEn: "Makeup",            slug: "maquillaje",      sortOrder: 2 },
    { nameEs: "Cabello",             nameEn: "Hair Care",         slug: "cabello",         sortOrder: 3 },
    { nameEs: "Salud y Bienestar",   nameEn: "Health & Wellness", slug: "salud-bienestar", sortOrder: 4 },
    { nameEs: "Fragrancias",         nameEn: "Fragrances",        slug: "fragrancias",     sortOrder: 5 },
    { nameEs: "Nutricion",           nameEn: "Nutrition",         slug: "nutricion",       sortOrder: 6 },
  ];
  const cats: Record<string, string> = {};
  for (const c of catData) {
    const created = await prisma.productCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
    cats[c.slug] = created.id;
  }
  console.log("Categories done");

  // Products
  const products = [
    { id:"prod-001", nameEs:"Crema Hidratante Intensiva 24h", nameEn:"24h Intensive Moisturizer", descriptionEs:"Crema hidratante con acido hialuronico y vitamina E. Absorcion rapida, piel suave y luminosa todo el dia. Apta para todo tipo de piel.", price:289, categoryId:cats["cuidado-piel"], imageUrl:IMG(10), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:1 },
    { id:"prod-002", nameEs:"Serum Vitamina C Antienvejecimiento", nameEn:"Anti-aging Vitamin C Serum", descriptionEs:"Serum concentrado con 15% Vitamina C estabilizada. Ilumina, unifica y rejuvenece en 2 semanas. Resultados visibles garantizados.", price:459, categoryId:cats["cuidado-piel"], imageUrl:IMG(20), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:2 },
    { id:"prod-003", nameEs:"Kit Maquillaje Esencial Luxe", nameEn:"Luxe Essential Makeup Kit", descriptionEs:"Kit completo con base, corrector, polvo, rubor y labial. Formula larga duracion 16h. Cobertura media a alta con acabado natural.", price:649, categoryId:cats["maquillaje"], imageUrl:IMG(30), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:3 },
    { id:"prod-004", nameEs:"Labial Mate Larga Duracion", nameEn:"Long-lasting Matte Lipstick", descriptionEs:"Labial mate alta pigmentacion con formula hidratante. No reseca ni transfiere. 12 tonos disponibles.", price:189, categoryId:cats["maquillaje"], imageUrl:IMG(40), availability:"IN_STOCK" as const, isFeatured:false, isPublished:true, sortOrder:4 },
    { id:"prod-005", nameEs:"Shampoo Reparador con Keratina", nameEn:"Keratin Repair Shampoo", descriptionEs:"Shampoo profesional con keratina hidrolizada y aceite de argan. Repara el cabello danado y aporta brillo intenso.", price:219, categoryId:cats["cabello"], imageUrl:IMG(50), availability:"IN_STOCK" as const, isFeatured:false, isPublished:true, sortOrder:5 },
    { id:"prod-006", nameEs:"Mascarilla Capilar Nutricion Extrema", nameEn:"Extreme Nutrition Hair Mask", descriptionEs:"Mascarilla con manteca de karite y proteinas de seda. Transforma el cabello seco en 3 minutos.", price:259, categoryId:cats["cabello"], imageUrl:IMG(60), availability:"IN_STOCK" as const, isFeatured:false, isPublished:true, sortOrder:6 },
    { id:"prod-007", nameEs:"Perfume Floral Rose Gold", nameEn:"Floral Rose Gold Perfume", descriptionEs:"Fragancia femenina con rosas, jazmin y almizcle blanco. Elegante y sofisticado. Presentacion 50 ml.", price:395, categoryId:cats["fragrancias"], imageUrl:IMG(70), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:7 },
    { id:"prod-008", nameEs:"Colonia Fresca Citrus y Flor", nameEn:"Fresh Citrus & Flower Cologne", descriptionEs:"Colonia fresca con notas citricas y florales. Perfecta para el calor mexicano. Larga duracion.", price:279, categoryId:cats["fragrancias"], imageUrl:IMG(80), availability:"IN_STOCK" as const, isFeatured:false, isPublished:true, sortOrder:8 },
    { id:"prod-009", nameEs:"Suplemento Colageno + Vitaminas", nameEn:"Collagen + Vitamins Supplement", descriptionEs:"Colageno hidrolizado tipo I y III, biotina, vitamina C y zinc. Salud de piel, cabello y unas.", price:349, categoryId:cats["nutricion"], imageUrl:IMG(90), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:9 },
    { id:"prod-010", nameEs:"Proteina Natural Vainilla", nameEn:"Natural Vanilla Protein", descriptionEs:"24g proteina por porcion, sabor vainilla natural sin azucar agregada.", price:420, categoryId:cats["nutricion"], imageUrl:IMG(100), availability:"COMING_SOON" as const, isFeatured:false, isPublished:true, sortOrder:10 },
    { id:"prod-011", nameEs:"Crema Contorno de Ojos Reafirmante", nameEn:"Firming Eye Contour Cream", descriptionEs:"Retinol y peptidos para reducir ojeras, bolsas y lineas de expresion. Uso manana y noche.", price:329, categoryId:cats["cuidado-piel"], imageUrl:IMG(110), availability:"IN_STOCK" as const, isFeatured:false, isPublished:true, sortOrder:11 },
    { id:"prod-012", nameEs:"Kit Bienestar y Aromaterapia", nameEn:"Wellness & Aromatherapy Kit", descriptionEs:"Aceites esenciales de lavanda, eucalipto y rosa con difusor portatil. Perfecto para el autocuidado.", price:499, categoryId:cats["salud-bienestar"], imageUrl:IMG(120), availability:"IN_STOCK" as const, isFeatured:true, isPublished:true, sortOrder:12 },
  ];
  for (const p of products) { await prisma.product.upsert({ where: { id: p.id }, update: {}, create: p }); }
  console.log("Products done: " + products.length);

  // Promotions
  const now = new Date();
  const UNS = (id: string, w=1200, h=700) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop`;
  const promos = [
    {
      id:"promo-001",
      titleEs:"Rutina Glow Facial — 20% de Descuento",
      titleEn:"Glow Facial Routine — 20% Off",
      descriptionEs:"Transforma tu piel con nuestra rutina completa: limpiador suave, serum vitamina C y crema hidratante 24h. Todo lo que necesitas para un rostro radiante, luminoso y protegido. Descuento especial por tiempo limitado.",
      imageUrl:UNS("1598440947619-2c35fc9aa908"),
      startDate:new Date(now.getFullYear(),now.getMonth(),1),
      endDate:new Date(now.getFullYear(),now.getMonth()+1,0),
      isActive:true, sortOrder:1,
    },
    {
      id:"promo-002",
      titleEs:"Pack Belleza Completa — Ahorra $200",
      titleEn:"Complete Beauty Pack — Save $200",
      descriptionEs:"Kit Maquillaje Esencial + Serum Vitamina C + Labial Mate en un solo paquete irresistible. El combo favorito de nuestras distribuidoras. Ahorro garantizado con envío a todo México.",
      imageUrl:UNS("1596462502278-27bfdc403348"),
      startDate:new Date(now.getFullYear(),now.getMonth(),1),
      endDate:new Date(now.getFullYear(),now.getMonth()+2,0),
      isActive:true, sortOrder:2,
    },
    {
      id:"promo-003",
      titleEs:"Especial Aromaterapia y Bienestar",
      titleEn:"Aromatherapy & Wellness Special",
      descriptionEs:"Kit Aromaterapia completo + Suplemento Colágeno + Crema Contorno de Ojos en un paquete exclusivo. Cuídate de adentro hacia afuera con 15% de descuento especial de temporada.",
      imageUrl:UNS("1571781926291-c477ebfd024b"),
      startDate:new Date(now.getFullYear(),now.getMonth(),1),
      endDate:new Date(now.getFullYear(),now.getMonth()+3,0),
      isActive:true, sortOrder:3,
    },
    {
      id:"promo-004",
      titleEs:"Kit Skincare Premium — Edición Limitada",
      titleEn:"Premium Skincare Kit — Limited Edition",
      descriptionEs:"Crema Hidratante 24h + Serum Vitamina C + Contorno de Ojos en estuche exclusivo. Edición especial de temporada para regalar o premiarte. Disponibilidad muy limitada.",
      imageUrl:UNS("1608248543803-ba4f8c70ae0b"),
      startDate:new Date(now.getFullYear(),now.getMonth(),1),
      endDate:new Date(now.getFullYear(),now.getMonth()+1,15),
      isActive:true, sortOrder:4,
    },
  ];
  for (const p of promos) { await prisma.promotion.upsert({ where: { id: p.id }, update: {}, create: p }); }
  console.log("Promotions done: " + promos.length);

  // Videos
  const videos = [
    { id:"video-001", titleEs:"Como unirte al equipo Terramar - Guia completa", titleEn:"How to join the Terramar team", descriptionEs:"Todo lo que necesitas saber para afiliarte a Terramar y comenzar tu negocio de venta directa.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(301,800,450), category:"Afiliacion", isFeatured:true, isPublished:true, sortOrder:1 },
    { id:"video-002", titleEs:"Tour del catalogo de productos Terramar", titleEn:"Terramar Product Catalog Tour", descriptionEs:"Conoce toda la linea de productos: belleza, cuidado de la piel, cabello, nutricion y mas.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(302,800,450), category:"Productos", isFeatured:false, isPublished:true, sortOrder:2 },
    { id:"video-003", titleEs:"Rutina de Skincare con Productos Terramar", titleEn:"Skincare Routine with Terramar", descriptionEs:"Mi rutina completa de cuidado de la piel usando productos Terramar.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(303,800,450), category:"Tutoriales", isFeatured:false, isPublished:true, sortOrder:3 },
    { id:"video-004", titleEs:"Mi primer mes vendiendo Terramar - Resultados reales", titleEn:"My first month selling Terramar", descriptionEs:"Te comparto mi experiencia y resultados de mi primer mes como distribuidora Terramar.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(304,800,450), category:"Testimonios", isFeatured:false, isPublished:true, sortOrder:4 },
    { id:"video-005", titleEs:"Como usar redes sociales para vender Terramar", titleEn:"Using social media to sell Terramar", descriptionEs:"Estrategias probadas para vender en Facebook, Instagram y WhatsApp.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(305,800,450), category:"Ventas", isFeatured:false, isPublished:true, sortOrder:5 },
    { id:"video-006", titleEs:"Review Serum Vitamina C - Antes y Despues", titleEn:"Vitamin C Serum Review", descriptionEs:"Resultados reales del Serum Vitamina C Terramar despues de 30 dias de uso.", externalUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnailUrl:IMG(306,800,450), category:"Reviews", isFeatured:false, isPublished:true, sortOrder:6 },
  ];
  for (const v of videos) { await prisma.video.upsert({ where: { id: v.id }, update: {}, create: v }); }
  console.log("Videos done: " + videos.length);

  // Blog posts
  const blogs = [
    { id:"blog-001", title:"Como vender Terramar en Mexico - Guia 2025", slug:"como-vender-terramar-mexico", language:"ES" as const, excerpt:"Todo lo que necesitas saber para comenzar a vender productos Terramar en Mexico.", content:"<h2>Vender Terramar en Mexico</h2><p>Terramar es una de las empresas de venta directa mas reconocidas en Mexico con mas de 30 anios de presencia. Sus productos de belleza y bienestar han conquistado a miles de familias mexicanas.</p><h2>Quien puede vender</h2><p>Cualquier persona mayor de 18 anios residente en Mexico puede ser distribuidora. No se necesita experiencia previa en ventas.</p><h2>Cuanto puedes ganar</h2><p>Las distribuidoras activas generan desde $3,000 hasta $15,000+ pesos mensuales segun su dedicacion y red de clientes.</p>", seoTitle:"Como vender Terramar en Mexico 2025", seoDesc:"Aprende como vender productos Terramar en Mexico. Guia completa para distribuidoras.", coverImage:IMG(401,1200,630), isPublished:true, publishedAt:new Date() },
    { id:"blog-002", title:"Como afiliarse a Terramar - Paso a paso", slug:"como-afiliarse-terramar", language:"ES" as const, excerpt:"Guia detallada para afiliarte a Terramar Mexico de forma facil y rapida.", content:"<h2>Afiliarse a Terramar es facil</h2><p>Registrate en nuestro sitio, te contactamos en 24h, te explicamos todo y comenzamos juntas. El proceso es sencillo y con apoyo completo.</p>", seoTitle:"Como afiliarse a Terramar Mexico 2025", seoDesc:"Aprende como afiliarte a Terramar Mexico. Proceso facil con apoyo completo.", coverImage:IMG(402,1200,630), isPublished:true, publishedAt:new Date() },
    { id:"blog-003", title:"Beneficios de ser distribuidora Terramar", slug:"beneficios-distribuidora-terramar", language:"ES" as const, excerpt:"Conoce todos los beneficios de unirte al equipo Terramar.", content:"<h2>Por que ser distribuidora Terramar</h2><p>Ingresos sin limite, horario flexible, descuentos exclusivos y capacitacion gratuita. Miles de mujeres en Mexico ya transformaron su vida economica.</p>", seoTitle:"Beneficios de ser distribuidora Terramar Mexico", seoDesc:"Descubre los beneficios de ser distribuidora Terramar: ingresos, flexibilidad y mas.", coverImage:IMG(403,1200,630), isPublished:true, publishedAt:new Date() },
    { id:"blog-004", title:"Productos Terramar mas vendidos en Mexico", slug:"productos-terramar-mas-vendidos", language:"ES" as const, excerpt:"Los productos Terramar favoritos de nuestras clientas mexicanas.", content:"<h2>Los mas populares</h2><p>Serum Vitamina C, Crema Hidratante 24h, Kit Maquillaje Esencial y Perfume Rose Gold son los favoritos. Cada uno con resultados comprobados.</p>", seoTitle:"Productos Terramar mas vendidos Mexico 2025", seoDesc:"Los productos Terramar favoritos en Mexico. Calidad comprobada.", coverImage:IMG(404,1200,630), isPublished:true, publishedAt:new Date() },
    { id:"blog-005", title:"Como ganar dinero desde casa con Terramar", slug:"ganar-dinero-casa-terramar", language:"ES" as const, excerpt:"Estrategias para generar ingresos extras desde casa como distribuidora.", content:"<h2>Trabaja desde casa con Terramar</h2><p>WhatsApp, Instagram, Facebook y el boca a boca son las herramientas mas efectivas. La consistencia es la clave del exito.</p>", seoTitle:"Como ganar dinero desde casa con Terramar Mexico", seoDesc:"Estrategias para ganar dinero desde casa vendiendo Terramar.", coverImage:IMG(405,1200,630), isPublished:true, publishedAt:new Date() },
  ];
  for (const b of blogs) { await prisma.blogPost.upsert({ where: { slug: b.slug }, update: b, create: b }); }
  console.log("Blog posts done: " + blogs.length);

  // Leads
  const leads = [
    { id:"lead-001", fullName:"Maria Gonzalez Torres",  phone:"5512345678", email:"maria@example.com",  city:"Ciudad de Mexico", state:"CDMX",            interest:"JOIN_TEAM" as const,    source:"GOOGLE" as const,    status:"NEW" as const,        consentGiven:true },
    { id:"lead-002", fullName:"Ana Patricia Lopez",     phone:"3312345678", email:"ana@example.com",    city:"Guadalajara",      state:"Jalisco",         interest:"BOTH" as const,         source:"INSTAGRAM" as const, status:"CONTACTED" as const,  consentGiven:true },
    { id:"lead-003", fullName:"Patricia Ruiz Mendoza",  phone:"8112345678", email:undefined,            city:"Monterrey",        state:"Nuevo Leon",      interest:"JOIN_TEAM" as const,    source:"WHATSAPP" as const,  status:"AFFILIATED" as const, consentGiven:true },
    { id:"lead-004", fullName:"Carmen Sanchez Flores",  phone:"2222345678", email:"carmen@example.com", city:"Puebla",           state:"Puebla",          interest:"BUY_PRODUCTS" as const, source:"FACEBOOK" as const,  status:"BUYER" as const,      consentGiven:true },
    { id:"lead-005", fullName:"Laura Martinez Vega",    phone:"3332345678", email:"laura@example.com",  city:"Zapopan",          state:"Jalisco",         interest:"BOTH" as const,         source:"REFERRAL" as const,  status:"FOLLOW_UP" as const,  consentGiven:true },
  ];
  for (const l of leads) { await prisma.lead.upsert({ where: { id: l.id }, update: {}, create: l }); }
  console.log("Leads done: " + leads.length);

  // Chat inquiries
  const chats = [
    { id:"chat-001", name:"Sofia R.",   phone:"5598765432", message:"Hola! Me interesa el serum vitamina C. Tienen envio a Monterrey?" },
    { id:"chat-002", name:"Valeria M.", phone:"3387654321", message:"Buenos dias! Quiero saber como ser distribuidora. Que necesito?" },
    { id:"chat-003", name:"Daniela C.", phone:"5576543210", message:"Me interesaron los productos. Tienen el kit de maquillaje disponible?" },
  ];
  for (const c of chats) { await prisma.chatInquiry.upsert({ where: { id: c.id }, update: {}, create: c }); }
  console.log("Chat inquiries done: " + chats.length);

  // Promotion Slider Images
  const sliderImages = [
    { id:"slider-001", titleEs:"Skincare Esenciales", titleEn:"Skincare Essentials", imageUrl:UNS("1598440947619-2c35fc9aa908",400,400), altTextEs:"Productos de skincare sobre fondo neutro", altTextEn:"Skincare products on neutral background", sortOrder:1, isPublished:true },
    { id:"slider-002", titleEs:"Colección Maquillaje", titleEn:"Makeup Collection", imageUrl:UNS("1596462502278-27bfdc403348",400,400), altTextEs:"Paleta de maquillaje y cosméticos", altTextEn:"Makeup palette and cosmetics", sortOrder:2, isPublished:true },
    { id:"slider-003", titleEs:"Serum Vitamina C", titleEn:"Vitamin C Serum", imageUrl:UNS("1571781926291-c477ebfd024b",400,400), altTextEs:"Serum en frasco de vidrio", altTextEn:"Serum in glass bottle", sortOrder:3, isPublished:true },
    { id:"slider-004", titleEs:"Ritual Facial", titleEn:"Facial Ritual", imageUrl:UNS("1616394584738-fc6e612e71b9",400,400), altTextEs:"Productos para rutina facial", altTextEn:"Facial routine products", sortOrder:4, isPublished:true },
    { id:"slider-005", titleEs:"Crema Hidratante Premium", titleEn:"Premium Moisturizer", imageUrl:UNS("1608248543803-ba4f8c70ae0b",400,400), altTextEs:"Crema hidratante en frasco elegante", altTextEn:"Moisturizer in elegant jar", sortOrder:5, isPublished:true },
    { id:"slider-006", titleEs:"Set Belleza Completo", titleEn:"Complete Beauty Set", imageUrl:UNS("1583241800698-e8ab01830a09",400,400), altTextEs:"Set completo de productos de belleza", altTextEn:"Complete beauty products set", sortOrder:6, isPublished:true },
    { id:"slider-007", titleEs:"Bienestar y Spa", titleEn:"Wellness & Spa", imageUrl:UNS("1522337360788-8b13dee7a37e",400,400), altTextEs:"Productos de bienestar y spa", altTextEn:"Wellness and spa products", sortOrder:7, isPublished:true },
    { id:"slider-008", titleEs:"Fragrancias Exclusivas", titleEn:"Exclusive Fragrances", imageUrl:UNS("1586495777744-4e6232bf4b9e",400,400), altTextEs:"Colección de perfumes y fragancias", altTextEn:"Perfume and fragrance collection", sortOrder:8, isPublished:true },
  ];
  for (const s of sliderImages) {
    await prisma.promotionSliderImage.upsert({ where: { id: s.id }, update: {}, create: s });
  }
  console.log("Slider images done: " + sliderImages.length);

  console.log("\nSeed complete!");
  console.log("Admin: " + adminEmail + " | Password: " + adminPassword);
  console.log("Public: http://localhost:3000/es");
  console.log("Admin:  http://localhost:3000/admin");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
