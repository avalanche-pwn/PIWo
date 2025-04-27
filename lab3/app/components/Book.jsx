import { useBooks } from '../contexts/BookContext';

export default function Book({ book }) {
  const { deleteBook } = useBooks();

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-text">Autor: {book.author}</p>
        <p className="card-text">Rok wydania: {book.year}</p>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-warning"
            onClick={() => alert('TODO: Edycja')}
          >
            Edytuj
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => deleteBook(book.id)}
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
