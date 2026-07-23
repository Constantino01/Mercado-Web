import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api'; 

export default function CategoriaForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Estados da Categoria
  const [categoria, setCategoria] = useState({
    category_name: '',
    category_description: '',
    category_image: '',
    is_featured: false,
    category_color: '#ffffff'
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [aGravar, setAGravar] = useState(false);
  const [erroAPI, setErroAPI] = useState(null); 

  // Estados de Imagem
  const [imagemFicheiro, setImagemFicheiro] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  // Estados para a Aba de Produtos
  const [activeTab, setActiveTab] = useState('detalhes');
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [pesquisaProduto, setPesquisaProduto] = useState(''); // Estado para a pesquisa

  const podeGerirProdutos = isEdit && categoria.is_featured;

  useEffect(() => {
    if (isEdit) {
      carregarCategoria();
      carregarProdutos();
    }
  }, [id]);

  const carregarCategoria = async () => {
    try {
      const data = await apiCRUD.read(`/categorias/${id}`);
      setCategoria({
        category_name: data.category_name || '',
        category_description: data.category_description || data.description || '',
        category_image: data.category_image || '',
        is_featured: Boolean(data.is_featured),
        category_color: data.category_color || '#ffffff'
      });
      
      if (data.category_image) setPreviewImagem(data.category_image);
    } catch (error) {
      alert('Erro ao carregar a categoria.');
      navigate('/private/categorias');
    } finally {
      setLoading(false);
    }
  };

  const carregarProdutos = async () => {
    setLoadingProdutos(true);
    try {
      const res = await apiCRUD.read('/produtos');
      const todosProdutos = Array.isArray(res) ? res : (res.data || []);
      setProdutos(todosProdutos.filter(p => p.category_id == id));
    } catch (error) {
      console.error('Erro ao carregar produtos desta categoria', error);
    } finally {
      setLoadingProdutos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category_color') { 
      let colorValue = value;
      if (!colorValue.startsWith('#') && colorValue.length > 0) {
        colorValue = '#' + colorValue;
      }
      if (colorValue.length > 7) {
        colorValue = colorValue.slice(0, 7);
      }
      setCategoria({ ...categoria, [name]: colorValue.toLowerCase() });
      return;
    }

    setCategoria({ 
      ...categoria, 
      [name]: type === 'checkbox' ? checked : value 
    });

    if (name === 'is_featured' && !checked && activeTab === 'produtos') {
      setActiveTab('detalhes');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFicheiro(file);
      setPreviewImagem(URL.createObjectURL(file)); 
    }
  };

  const toggleProductFeatured = async (productId, estadoAtual) => {
    // Atualização otimista
    setProdutos(produtos.map(p => 
      p.id === productId ? { ...p, is_featured: !estadoAtual } : p
    ));

    try {
      await apiCRUD.update(`/produtos/${productId}`, { is_featured: !estadoAtual });
    } catch (error) {
      setErroAPI('Não foi possível atualizar o destaque do produto.');
      carregarProdutos(); // Reverte em caso de erro
    }
  };

  const limparDestacados = async () => {
    if(window.confirm('Tem a certeza que deseja remover o destaque de todos os produtos desta categoria?')) {
      const produtosDestacados = produtos.filter(p => p.is_featured);
      
      // Atualização otimista
      setProdutos(produtos.map(p => ({ ...p, is_featured: false })));

      try {
        // Atualiza na API um a um (ou podes criar um endpoint mass update no backend)
        await Promise.all(produtosDestacados.map(p => 
          apiCRUD.update(`/produtos/${p.id}`, { is_featured: false })
        ));
      } catch (error) {
        setErroAPI('Ocorreu um erro ao tentar limpar os destaques.');
        carregarProdutos();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAGravar(true);
    setErroAPI(null);

    const formData = new FormData();
    Object.keys(categoria).forEach(key => {
      if (categoria[key] !== null && categoria[key] !== undefined) {
        if (key === 'is_featured') {
          formData.append(key, categoria[key] ? 1 : 0);
        } else {
          formData.append(key, categoria[key]);
        }
      }
    });

    if (imagemFicheiro) {
      formData.append('imagem', imagemFicheiro);
    }

    try {
      if (isEdit) {
        formData.append('_method', 'PUT'); 
        await apiCRUD.create(`/categorias/${id}`, formData); 
      } else {
        await apiCRUD.create('/categorias', formData);
      }
      
      navigate('/private/categorias');
    } catch (error) {
      setErroAPI(error.message || 'Erro ao guardar a categoria. Verifique os dados.');
      setAGravar(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar dados...</div>;
  }

  // Filtragem para a Transfer List
  const produtosFiltrados = produtos.filter(p => 
    p.product_name.toLowerCase().includes(pesquisaProduto.toLowerCase())
  );
  
  const produtosDisponiveis = produtosFiltrados.filter(p => !p.is_featured);
  const produtosDestacados = produtos.filter(p => p.is_featured);

  return (
    <div className="max-w-4xl mx-auto mb-10">
      
      <div className="flex items-center gap-4 mb-6">
        <Link to="/private/categorias" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button 
            type="button"
            onClick={() => setActiveTab('detalhes')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'detalhes' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
          >
            Detalhes da Categoria
          </button>
          
          <button 
            type="button"
            onClick={() => podeGerirProdutos && setActiveTab('produtos')}
            disabled={!podeGerirProdutos}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${!podeGerirProdutos ? 'opacity-40 cursor-not-allowed text-gray-400' : activeTab === 'produtos' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            title={!isEdit ? "Guarde a categoria primeiro para adicionar produtos." : !categoria.is_featured ? "Ative o destaque desta categoria para selecionar produtos." : ""}
          >
            Produtos Destacados
            {!podeGerirProdutos && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">

          {erroAPI && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div className="text-sm font-medium text-red-800 break-words overflow-hidden">
                {erroAPI}
              </div>
            </div>
          )}
          
          {/* CONTEÚDO DA ABA: DETALHES */}
          <div className={activeTab === 'detalhes' ? 'space-y-6' : 'hidden'}>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ícone / Imagem da Categoria</label>
              <div className="flex items-center gap-4">
                {previewImagem ? (
                  <img src={previewImagem} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
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
                  <p className="text-xs text-gray-500 mt-2">Formatos recomendados: PNG (transparente) ou JPG.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                <input 
                  type="text" 
                  name="category_name"
                  required
                  value={categoria.category_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Ex: Frutas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor de Fundo (HEX)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    name="category_color" 
                    value={categoria.category_color || '#ffffff'}
                    onChange={handleChange}
                    className="w-12 h-12 p-0 border-0 bg-transparent rounded-xl cursor-pointer shrink-0"
                  />
                  <input 
                    type="text" 
                    name="category_color" 
                    value={categoria.category_color || ''}
                    onChange={handleChange}
                    maxLength="7"
                    pattern="^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none uppercase"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                name="category_description"
                rows="4"
                value={categoria.category_description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="Descreva o que inclui esta categoria..."
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={categoria.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="is_featured" className="font-bold text-gray-900 cursor-pointer">
                  Destacar Categoria no Catálogo
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Esta categoria receberá maior visibilidade nas listagens de categorias e promoções.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={aGravar}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
              >
                {aGravar ? 'A guardar...' : (isEdit ? 'Guardar Alterações da Categoria' : 'Criar Categoria')}
              </button>
            </div>
          </div>

          {/* CONTEÚDO DA ABA: PRODUTOS DESTACADOS (Transfer List) */}
          <div className={activeTab === 'produtos' ? 'space-y-6' : 'hidden'}>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Gerir Destaques</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione os produtos que deseja apresentar na montra de destaques desta categoria.
                  <br/><span className="text-green-600 font-medium">As alterações nesta aba são guardadas automaticamente.</span>
                </p>
              </div>
            </div>

            {loadingProdutos ? (
               <div className="py-8 text-center text-gray-400 animate-pulse font-medium">A carregar os produtos...</div>
            ) : produtos.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-500 font-medium">Ainda não associou nenhum produto a esta categoria.</p>
                <Link to="/private/produtos/novo" className="inline-block mt-3 text-green-600 font-bold hover:underline">
                  Adicionar Produto Agora
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Esquerda: Disponíveis */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-[400px]">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <input 
                        type="text" 
                        placeholder="Procurar para destacar..." 
                        value={pesquisaProduto}
                        onChange={(e) => setPesquisaProduto(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {produtosDisponiveis.length > 0 ? (
                      produtosDisponiveis.map(prod => (
                        <button 
                          key={prod.id} 
                          type="button" 
                          onClick={() => toggleProductFeatured(prod.id, false)}
                          className="w-full text-left flex items-center justify-between p-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                            {prod.product_image ? (
                              <img src={prod.product_image} alt="" className="w-8 h-8 rounded-md object-contain border border-gray-100" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">📦</div>
                            )}
                            <span className="truncate">{prod.product_name}</span>
                          </div>
                          <span className="text-green-600 opacity-0 group-hover:opacity-100 text-lg leading-none shrink-0">+</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-center p-4 text-sm text-gray-400">Nenhum produto disponível.</div>
                    )}
                  </div>
                </div>

                {/* Direita: Destacados (Selecionados) */}
                <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50/30 flex flex-col h-[400px] shadow-inner">
                  <div className="p-3 border-b border-green-100 bg-green-100/50 flex justify-between items-center h-[53px]">
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Destacados ({produtosDestacados.length})</span>
                    {produtosDestacados.length > 0 && (
                      <button type="button" onClick={limparDestacados} className="text-xs text-red-500 hover:underline font-medium">Limpar</button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {produtosDestacados.length > 0 ? (
                      produtosDestacados.map(prod => (
                        <button 
                          key={prod.id} 
                          type="button" 
                          onClick={() => toggleProductFeatured(prod.id, true)}
                          className="w-full text-left flex items-center justify-between p-2 text-sm font-medium text-green-800 bg-white border border-green-100 hover:border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors group shadow-sm"
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                             {prod.product_image ? (
                              <img src={prod.product_image} alt="" className="w-8 h-8 rounded-md object-contain border border-gray-100" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs">📦</div>
                            )}
                            <span className="truncate">{prod.product_name}</span>
                          </div>
                          <span className="text-red-500 opacity-0 group-hover:opacity-100 text-lg leading-none shrink-0">×</span>
                        </button>
                      ))
                    ) : (
                       <div className="text-center p-4 text-sm text-green-600/60 mt-10">
                         Nenhum produto destacado.<br/>Pesquise e clique nos produtos à esquerda.
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}