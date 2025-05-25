import { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import Book from '../components/Book';

export default function HomePage() {
  const { books } = useBooks();
  const [search, setSearch] = useState({
    title: '',
    author: '',
    minYear: '',
    maxYear: ''
  });

  const filteredBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(search.title.toLowerCase()) &&
      book.author.toLowerCase().includes(search.author.toLowerCase()) &&
      (search.minYear === '' || book.year >= parseInt(search.minYear)) &&
      (search.maxYear === '' || book.year <= parseInt(search.maxYear))
    );
  });

  return (
    <div className="container">
      <h1 className="my-4">Księgarnia</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtry wyszukiwania</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Tytuł"
                value={search.title}
                onChange={e => setSearch({...search, title: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Autor"
                value={search.author}
                onChange={e => setSearch({...search, author: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Min rok"
                value={search.minYear}
                onChange={e => setSearch({...search, minYear: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Max rok"
                value={search.maxYear}
                onChange={e => setSearch({...search, maxYear: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row" name="books">
        {filteredBooks.map(book => (
          <div className="col-md-6" key={book.id}>
            <Book book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
