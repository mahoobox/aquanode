import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';


const NotFound = () => {

  const navigate = useNavigate();
  return (
    <main className="w-full h-[78.5vh] px-16 md:px-0 flex items-center justify-center">
      <div className="bg-white border border-slateGray-50 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <div className="max-w-lg w-full text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <div className="w-64 h-64 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-20 blur-2xl"></div>
            </div>
            <div className="relative">
              <AlertCircle className="mx-auto h-24 w-24 text-indigo-500 mb-4" />
              <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-slateGray-300">
                404
              </p>
              <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-indigo-600 mt-4">
                Page Not Found
              </p>
              <p className="text-black-500 mt-4 pb-4 border-b-2 text-center">
                Sorry, the page you are looking for could not be found.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-2"
                >
                  Volver atrás
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-2"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
