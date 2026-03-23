import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api';

export default function DescontoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [desconto, setDesconto] = useState({
    nome: '',
    valor: '',
    tipo: 'percent',
    dataInicio: '',
    dataFim: '',
    produtosSelecionados: [],
    categoriasSelecionadas: []
  });
  
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Novos estados para as barras de pesquisa
  const [pesquisaCategoria, setPesquisaCategoria] = useState('');
  const [pesquisaProduto, setPesquisaProduto] = useState('');
  
  const [erroValidacao, setErroValidacao] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDependencias();
  }, [id]);

  const carregarDependencias = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        apiCRUD.read('/produtos'),
        apiCRUD.read('/categorias')
      ]);
      
      setProdutos(Array.isArray(resProdutos) ? resProdutos : (resProdutos.data || []));
      setCategorias(Array.isArray(resCategorias) ? resCategorias : (resCategorias.data || []));

      if (isEdit) {
        const data = await apiCRUD.read(`/descontos/${id}`);
        setDesconto({
          nome: data.discount_name || '',
          valor: data.discount_value || '',
          tipo: 'percent',
          dataInicio: data.discount_start_date ? data.discount_start_date.substring(0, 10) : '', 
          dataFim: data.discount_end_date ? data.discount_end_date.substring(0, 10) : '',
          produtosSelecionados: data.products?.map(p => p.id) || [],
          categoriasSelecionadas: data.categories?.map(c => c.id) || []
        });
      }
    } catch (error) {
      alert('Erro ao carregar dados.');
      navigate('/private/descontos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesconto(prev => ({ ...prev, [name]: value }));
    setErroValidacao('');
  };

  // Nova função para gerir as checkboxes
  const toggleSelection = (id, campo) => {
    setDesconto(prev => {
      const selecionados = prev[campo];
      if (selecionados.includes(id)) {
        return { ...prev, [campo]: selecionados.filter(item => item !== id) };
      } else {
        return { ...prev, [campo]: [...selecionados, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroValidacao('');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const inicio = new Date(desconto.dataInicio);
    const fim = new Date(desconto.dataFim);

    if (!isEdit && inicio < hoje) {
      setErroValidacao('A data de início não pode ser no passado.');
      return;
    }
    if (fim < inicio) {
      setErroValidacao('A data de fim não pode ser anterior à data de início.');
      return;
    }
    if (desconto.valor < 1 || desconto.valor > 100) {
      setErroValidacao('A percentagem de desconto tem de estar entre 1 e 100.');
      return;
    }

    const payload = {
      discount_name: desconto.nome,
      discount_value: desconto.valor,
      discount_type: 'percent',
      discount_start_date: desconto.dataInicio, 
      discount_end_date: desconto.dataFim,      
      products: desconto.produtosSelecionados,
      categories: desconto.categoriasSelecionadas
    };

    try {
      let descontoSalvo;
      if (isEdit) {
        descontoSalvo = await apiCRUD.update(`/descontos/${id}`, payload);
      } else {
        descontoSalvo = await apiCRUD.create('/descontos', payload);
      }
      
      const idParaSync = isEdit ? id : descontoSalvo.id;
      await apiCRUD.create(`/descontos/${idParaSync}/sync`, {
        products: desconto.produtosSelecionados,
        categories: desconto.categoriasSelecionadas
      });

      navigate('/private/descontos');
    } catch (error) {
      setErroValidacao(error.message || 'Erro ao guardar o desconto.');
    }
  };

  // Filtros de pesquisa
  const categoriasFiltradas = categorias.filter(c => 
    c.category_name.toLowerCase().includes(pesquisaCategoria.toLowerCase())
  );
  const produtosFiltrados = produtos.filter(p => 
    p.product_name.toLowerCase().includes(pesquisaProduto.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">A carregar...</div>;

  return (
    <div className="max-w-4xl mx-auto mb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/private/descontos" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Desconto' : 'Configurar Novo Desconto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        {erroValidacao && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <span className="font-medium text-sm">{erroValidacao}</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Informação Base</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Promoção</label>
            <input type="text" name="nome" required value={desconto.nome} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 outline-none" placeholder="Ex: Semana da Fruta" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Desconto</label>
              <input type="text" value="Percentagem (%)" disabled className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentagem (%)</label>
              <input type="number" name="valor" min="1" max="100" step="1" required value={desconto.valor} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 outline-none" placeholder="Ex: 15" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Período de Validade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input type="date" name="dataInicio" required value={desconto.dataInicio} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
              <input type="date" name="dataFim" required value={desconto.dataFim} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-green-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SECÇÃO NOVA: CHECKBOXES COM PESQUISA */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Aplicar Desconto A</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Bloco Categorias */}
            <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Categorias Abrangidas</label>
                <input 
                  type="text" 
                  placeholder="Pesquisar categoria..." 
                  value={pesquisaCategoria}
                  onChange={(e) => setPesquisaCategoria(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="h-48 overflow-y-auto p-3 space-y-2 bg-white">
                {categoriasFiltradas.length > 0 ? categoriasFiltradas.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                      checked={desconto.categoriasSelecionadas.includes(cat.id)}
                      onChange={() => toggleSelection(cat.id, 'categoriasSelecionadas')}
                    />
                    <span className="text-sm text-gray-700">{cat.category_name}</span>
                  </label>
                )) : (
                  <p className="text-sm text-gray-400 text-center mt-4">Nenhuma categoria encontrada.</p>
                )}
              </div>
            </div>

            {/* Bloco Produtos */}
            <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Produtos Abrangidos</label>
                <input 
                  type="text" 
                  placeholder="Pesquisar produto..." 
                  value={pesquisaProduto}
                  onChange={(e) => setPesquisaProduto(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="h-48 overflow-y-auto p-3 space-y-2 bg-white">
                {produtosFiltrados.length > 0 ? produtosFiltrados.map(prod => (
                  <label key={prod.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                      checked={desconto.produtosSelecionados.includes(prod.id)}
                      onChange={() => toggleSelection(prod.id, 'produtosSelecionados')}
                    />
                    <span className="text-sm text-gray-700">{prod.product_name}</span>
                  </label>
                )) : (
                  <p className="text-sm text-gray-400 text-center mt-4">Nenhum produto encontrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm">
          {isEdit ? 'Guardar Alterações' : 'Criar Promoção'}
        </button>
      </form>
    </div>
  );
}