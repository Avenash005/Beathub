import { useState } from 'react';
import Dashboard from './components/Dashboard';
import CreatePost from './components/CreatePost';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="app">
      <Toaster />
      <header>
        <h1>Creator's Platform</h1>
        <nav>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={currentPage === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('create-post')}
            className={currentPage === 'create-post' ? 'active' : ''}
          >
            Create Post
          </button>
        </nav>
      </header>
      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'create-post' && <CreatePost />}
      </main>
    </div>
  );
}

export default App;
