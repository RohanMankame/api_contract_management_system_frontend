import { AuthProvider } from './context/AuthProvider';  
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <h1>Contract Management System</h1>
        
      </div>
    </AuthProvider>
  );
}

export default App;