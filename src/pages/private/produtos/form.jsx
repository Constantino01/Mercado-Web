import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function ProdutoForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [produto, setProduto] = useState({
    product_name: '',
    category_id: '',
    product_cost: '',
    product_description: '',
    unit_type: 'un',
    product_min_quantity: 1,
    imagem_url: '' // Para mostrar a imagem atual caso exista
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aGravar, setAGravar] = useState(false);
  
  // Novos estados para a imagem
  const [imagemFicheiro, setImagemFicheiro] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const catsData = await apiCRUD.read('/categorias');
      setCategorias(Array.isArray(catsData) ? catsData : (catsData.data || []));

      if (isEdit) {
        const prodData = await apiCRUD.read(`/produtos/${id}`);
        setProduto({
          product_name: prodData.product_name || '',
          category_id: prodData.category_id || '',
          product_cost: prodData.product_cost || '',
          product_description: prodData.product_description || '',
          unit_type: prodData.unit_type || 'un',
          product_min_quantity: prodData.product_min_quantity || 1,
          imagem_url: prodData.product_image || '' // CORREÇÃO AQUI
        });
        
        // CORREÇÃO AQUI
        if (prodData.product_image) {
            setPreviewImagem(prodData.product_image);
        }
      }
    } catch (error) {
      alert('Erro ao carregar os dados.');
      navigate('/private/produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  // Nova função para lidar com o upload da imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFicheiro(file);
      setPreviewImagem(URL.createObjectURL(file)); // Cria preview local imediato
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAGravar(true);
    
    // Converter para FormData por causa do ficheiro
    const formData = new FormData();
    Object.keys(produto).forEach(key => {
      if (produto[key] !== null && produto[key] !== undefined) {
        formData.append(key, produto[key]);
      }
    });

    if (imagemFicheiro) {
      formData.append('imagem', imagemFicheiro);
    }

    try {
      if (isEdit) {
        // O Laravel precisa do _method=PUT quando recebe FormData em edições
        formData.append('_method', 'PUT'); 
        // ATENÇÃO: Se usares apiCRUD.update, garante que ele não força Content-Type: application/json
        await apiCRUD.create(`/produtos/${id}`, formData); // Enviamos como POST por causa do FormData
      } else {
        await apiCRUD.create('/produtos', formData);
      }
      navigate('/private/produtos');
    } catch (error) {
      alert(error.message || 'Erro ao guardar o produto.');
      setAGravar(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar dados...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4 mb-6">
        <Link to="/private/produtos" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Informação Geral</h2>
            
            {/* NOVO CAMPO DE IMAGEM */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
              <div className="flex items-center gap-4">
                {previewImagem ? (
                  <img src={previewImagem} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
                    Sem Foto
                  </div>
                )}
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, WEBP.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input 
                type="text" 
                name="product_name"
                required
                value={produto.product_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Ex: Maçãs de Alcobaça"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                name="product_description" 
                rows="4"
                value={produto.product_description} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Descreva o produto..."
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Medida de Venda</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Como é vendido?</label>
                <select 
                  name="unit_type"
                  value={produto.unit_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
                >
                  <option value="un">À Unidade</option>
                  <option value="kg">Ao Quilo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mínimo/Incremento ({produto.unit_type === 'kg' ? 'Gramas' : 'Unidades'})
                </label>
                <input 
                  type="number" 
                  name="product_min_quantity"
                  min="1"
                  step="1"
                  required
                  value={produto.product_min_quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder={produto.unit_type === 'kg' ? "Ex: 100" : "Ex: 1"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {produto.unit_type === 'kg' 
                    ? "Quantas gramas adiciona de cada vez? (ex: 100)" 
                    : "Quantas unidades adiciona de cada vez?"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Organização e Preço</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select 
                name="category_id"
                value={produto.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="">Sem Categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Base (€ / {produto.unit_type === 'kg' ? 'Kg' : 'Un'})
              </label>
              <input 
                type="number" 
                name="product_cost"
                step="0.01"
                required
                value={produto.product_cost}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-xl font-bold text-gray-900"
                placeholder="0.00"
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold block mb-1">Cálculo de exemplo no carrinho:</span>
                  {(() => {
                    const custoLimpo = Number(String(produto.product_cost).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;
                    const minQty = Number(produto.product_min_quantity) || 1;
                    const divisor = produto.unit_type === 'kg' ? 1000 : 1;
                    const precoFinal = ((custoLimpo / divisor) * minQty).toFixed(2);

                    return (
                      <>
                        1 Incremento ({minQty}{produto.unit_type === 'kg' ? 'g' : ' un'}) custará <strong>€{precoFinal}</strong>
                      </>
                    );
                  })()}
                </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={aGravar}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-colors shadow-sm mt-2"
          >
            {aGravar ? 'A guardar...' : (isEdit ? 'Guardar Alterações' : 'Criar Produto')}
          </button>
          
        </div>
      </form>
    </div>
  );
}