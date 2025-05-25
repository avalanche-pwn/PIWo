import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBooks } from '../contexts/BookContext';

export default function NewBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    price: ''
  });
  const { addBook } = useBooks();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook({
      ...formData,
      year: parseInt(formData.year),
      price: parseFloat(formData.price)
    });
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="my-4">Dodaj nową książkę</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tytuł</label>
          <input
            type="text"
            name='title'
            className="form-control"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Autor</label>
          <input
            type="text"
            name='author'
            className="form-control"
            required
            value={formData.author}
            onChange={e => setFormData({...formData, author: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rok wydania</label>
          <input
            type="number"
            name='year'
            className="form-control"
            required
            value={formData.year}
            onChange={e => setFormData({...formData, year: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cena</label>
          <input
            type="number"
            step="0.01"
            name='price'
            className="form-control"
            required
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <button type="submit" className="btn btn-primary">Dodaj książkę</button>
      </form>
    </div>
  );
}
