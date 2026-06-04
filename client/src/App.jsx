import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <div className="app">
      <Toaster />
      <header>
        <h1>Creator's Platform</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
