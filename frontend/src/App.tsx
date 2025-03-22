import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from './pages/styles';
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./pages/UserAuth/login'));
const Register = lazy(() => import('./pages/UserAuth/register'));
const Home = lazy(() => import('./pages/Home/Home'));
const CreateManageProduct = lazy(() => import('./pages/Create Manage Product/CreateManageProduct'));
const ProductOptimization = lazy(() => import('./pages/Product Optimization/ProductOptimization'));

function App() {
  return (
    <div className="App">
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/create-manage-product" element={<CreateManageProduct />} />
            <Route path="/page-optimization" element={<ProductOptimization />} />
          </Routes>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;
