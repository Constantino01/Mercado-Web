import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Texto e Botões */}
          <div>
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm">
              Bem-vindo à Mercearia Orestes
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Os produtos mais <span className="text-green-600">frescos</span> à sua porta.
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-lg">
              Qualidade garantida em frutas, legumes e produtos de mercearia todos os dias. Compre online e receba no conforto da sua casa.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/catalogo" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-sm transition-colors text-center">
                Comprar Agora
              </Link>
              <Link to="/promocoes" className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-8 rounded-full border border-green-200 transition-colors text-center">
                Ver Promoções
              </Link>
            </div>
          </div>

          {/* Imagem de Destaque (Placeholder) */}
          <div className="relative h-72 sm:h-80 md:h-full min-h-[300px] bg-gradient-to-br from-green-50 to-green-100 rounded-3xl overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
            <div className="text-center">
              <span className="text-7xl block mb-4">🛒</span>
              <span className="text-green-800 font-medium font-sans">
                [ Imagem de Frescos ]
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}