import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch crashes and show a recovery UI
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Zoo Venture Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error_outline</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Beklenmedik Bir Hata Oluştu</h1>
          <p className="text-gray-600 mb-6 max-w-md bg-white p-4 rounded shadow text-xs font-mono text-left overflow-auto">
            {this.state.error?.toString()}
          </p>
          <div className="flex space-x-4">
             <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
             >
                Tekrar Dene
             </button>
             <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }} 
                className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600"
             >
                Verileri Sıfırla
             </button>
          </div>
          <p className="text-xs text-gray-400 mt-8">Bozuk kayıt dosyası nedeniyle açılmıyorsa 'Verileri Sıfırla' seçeneğini kullanın.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);