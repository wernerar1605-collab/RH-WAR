import React, { useState, useEffect } from 'react';
import { PerformanceReview as Review, Employee } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

// FIX: Added missing properties to each employee object to match the Employee type.
const mockEmployees: Employee[] = [
  { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Frontend', department: 'Tecnologia', email: 'ana.silva@example.com', avatar: 'https://picsum.photos/seed/1/200', status: 'Ativo', dataDeAdmissao: '2022-03-15', cpf: '111.111.111-11', rg: '11.111.111-1', dataDeNascimento: '1990-05-10', telefone: '(11) 98888-7777', regimeDeTrabalho: 'CLT' },
  { id: 3, name: 'Carla Dias', role: 'Gerente de Projetos', department: 'Tecnologia', email: 'carla.dias@example.com', avatar: 'https://picsum.photos/seed/3/200', status: 'Ativo', dataDeAdmissao: '2020-01-10', cpf: '333.333.333-33', rg: '33.333.333-3', dataDeNascimento: '1988-02-14', telefone: '(11) 96666-5555', regimeDeTrabalho: 'PJ' },
];

const mockReviews: Review[] = [
  { id: 1, employee: mockEmployees[0], date: '2024-06-30', reviewer: 'Gerente de TI', feedback: 'Excelente desempenho técnico e proatividade.', rating: 5, aiSuggestion: '' },
  { id: 2, employee: mockEmployees[1] || mockEmployees[0], date: '2024-06-28', reviewer: 'Diretor de Produto', feedback: 'Ótima liderança, mas precisa melhorar a comunicação com stakeholders.', rating: 4, aiSuggestion: '' },
];

const PerformanceReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const emptyForm = {
    employeeId: mockEmployees.length > 0 ? mockEmployees[0].id.toString() : '',
    date: new Date().toISOString().split('T')[0],
    reviewer: '',
    feedback: '',
    rating: 0,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (modalMode === 'edit' && currentReview) {
      setFormData({
        employeeId: currentReview.employee.id.toString(),
        date: currentReview.date,
        reviewer: currentReview.reviewer,
        feedback: currentReview.feedback,
        rating: currentReview.rating,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [modalMode, currentReview]);


  const openModal = (mode: 'create' | 'edit', review: Review | null = null) => {
    setModalMode(mode);
    setCurrentReview(review);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setFormData(prev => ({ ...prev, rating: newRating }));
  };
  
  const handleDelete = (reviewId: number) => {
      if(window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
          setReviews(reviews.filter(r => r.id !== reviewId));
      }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === parseInt(formData.employeeId));
    if (!employee) return;

    if (modalMode === 'create') {
        const newReview: Review = {
            id: Math.max(...reviews.map(r => r.id), 0) + 1,
            employee,
            aiSuggestion: '',
            date: formData.date,
            reviewer: formData.reviewer,
            feedback: formData.feedback,
            rating: formData.rating,
        };
        setReviews([newReview, ...reviews]);
    } else if (currentReview) {
        setReviews(reviews.map(r => r.id === currentReview.id ? {
            ...r,
            employee,
            date: formData.date,
            reviewer: formData.reviewer,
            feedback: formData.feedback,
            rating: formData.rating,
        } : r));
    }
    closeModal();
  };

  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
  
  const InteractiveRatingStars: React.FC<{ rating: number; onRate: (rating: number) => void }> = ({ rating, onRate }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button type="button" key={i} onClick={() => onRate(starValue)} className="focus:outline-none">
            <svg className={`w-7 h-7 cursor-pointer ${starValue <= rating ? 'text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Avaliações de Desempenho</h2>
            <button
                onClick={() => openModal('create')}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Nova Avaliação
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <img src={review.employee.avatar} alt={review.employee.name} className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <p className="font-bold text-gray-900">{review.employee.name}</p>
                    <p className="text-sm text-gray-600">{review.employee.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">Avaliado em: {new Date(review.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                <RatingStars rating={review.rating} />
                <p className="text-gray-700 mt-3 text-sm italic">"{review.feedback}"</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button onClick={() => openModal('edit', review)} className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 p-2 rounded-md hover:bg-gray-200">
                      <EditIcon className="w-4 h-4 mr-1"/> Editar
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="flex items-center text-sm font-medium text-rose-500 hover:text-rose-700 p-2 rounded-md hover:bg-rose-100">
                      <TrashIcon className="w-4 h-4 mr-1"/> Excluir
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleFormSubmit} className="p-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Nova Avaliação' : 'Editar Avaliação'}</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Funcionário</label>
                    <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                       {mockEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="reviewer" className="block text-sm font-medium text-gray-700">Avaliador</label>
                    <input type="text" name="reviewer" id="reviewer" value={formData.reviewer} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data da Avaliação</label>
                    <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                    <InteractiveRatingStars rating={formData.rating} onRate={handleRatingChange} />
                </div>
                <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Comentários</label>
                    <textarea name="feedback" id="feedback" value={formData.feedback} onChange={handleInputChange} required rows={5} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
            </div>
             <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Salvar</button>
            </div>
          </form>
      </Modal>
    </>
  );
};

export default PerformanceReview;