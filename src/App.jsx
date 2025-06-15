import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
<div className="min-h-screen bg-background text-gray-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
theme="light"
          toastClassName="!bg-surface !text-gray-900 !border !border-gray-200"
          progressClassName="!bg-gradient-to-r !from-primary !to-accent"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;