import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Texto e Botões */}
          <div className="relative z-10"> {/* Adicionado z-index para garantir que o texto fica sobre a imagem se houver sobreposição */}
            <span className="text-green-600 font-bold tracking-wider uppercase text-sm">
              Bem-vindo ao Mercado Orestes
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Os produtos mais <span className="text-green-600">frescos</span> próximos de si.
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-lg">
              Qualidade garantida em frutas, legumes e produtos de mercearia todos os dias. Veja o nosso catálogo e venha-nos visitar!
              Ou veja os destaques da nossa loja nos destaques abaixo!
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/loja/catalogo" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-sm transition-colors text-center">
                Ver Catálogo
              </Link>
              <Link to="/loja/promocoes" className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-8 rounded-full border border-green-200 transition-colors text-center">
                Ver Promoções
              </Link>
            </div>
          </div>

          {/* Imagem de Destaque (Aumentada e deslocada para a esquerda) */}
          {/* Alterado md:justify-end para md:justify-center e adicionado md:-ml-12 */}
          <div className="flex items-center justify-center md:justify-center p-4 md:-ml-12">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/067/752/776/small/assorted-fresh-fruits-on-transparent-background-png.png" 
              alt="Seleção de produtos frescos" 
              // Aumentámos o tamanho aqui (w-60 h-60 base, md:w-80 md:h-80 em desktop)
              className="w-60 h-60 md:w-80 md:h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </div>
    </div>
  );
}