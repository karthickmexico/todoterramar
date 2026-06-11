import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | TodoTerramar",
};

export default async function TermsPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Identificación del sitio</h2>
            <p>
              TodoTerramar es un sitio web operado por una distribuidora independiente de Terramar
              y no representa ni está afiliado oficialmente con la empresa corporativa Terramar México.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Uso del sitio</h2>
            <p>
              Al utilizar este sitio web, aceptas estos términos. El sitio está destinado a
              personas mayores de 18 años residentes en México.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Información del sitio</h2>
            <p>
              La información proporcionada en este sitio es de carácter informativo. Los precios,
              promociones y disponibilidad de productos están sujetos a cambios sin previo aviso.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Datos personales</h2>
            <p>
              El tratamiento de datos personales se rige por nuestro Aviso de Privacidad.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitación de responsabilidad</h2>
            <p>
              TodoTerramar no se hace responsable por daños derivados del uso del sitio o de la
              información contenida en él.
            </p>
          </section>
          <p className="text-sm text-gray-500 mt-8">
            Última actualización: Junio 2025
          </p>
        </div>
      </div>
    </div>
  );
}
