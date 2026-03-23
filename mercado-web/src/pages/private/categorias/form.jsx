import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCRUD } from '../../../utils/api'; 

export default function CategoriaForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categoria, setCategoria] = useState({
    category_name: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [aGravar, setAGravar] = useState(false);

  useEffect(() => {
    if (isEdit) {
      carregarCategoria();
    }
  }, [id]);

  const carregarCategoria = async () => {
    try {
      const data = await apiCRUD.read(`/categorias/${id}`);
      setCategoria({
        category_name: data.category_name || '',
        description: data.description || '',
      });
    } catch (error) {
      alert('Erro ao carregar a categoria.');
      navigate('/private/categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAGravar(true);

    try {
      if (isEdit) {
        await apiCRUD.update(`/categorias/${id}`, categoria);
      } else {
        await apiCRUD.create('/categorias', categoria);
      }
      
      navigate('/private/categorias');
    } catch (error) {
      alert(error.message || 'Erro ao guardar a categoria. Verifique os dados.');
      setAGravar(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">A carregar dados...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="flex items-center gap-4 mb-6">
        <Link to="/private/categorias" className="p-2 bg-white text-gray-500 hover:text-gray-900 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
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

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={aGravar}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            {aGravar ? 'A guardar...' : (isEdit ? 'Guardar Alterações' : 'Criar Categoria')}
          </button>
        </div>

      </form>
    </div>
  );
}