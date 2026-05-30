import { createBrowserRouter } from 'react-router'
import About from './pages/about'
import Products from './pages/products'
import RootComponent from './components/root-component'
import Homepage from './pages/homepage'
import AddProduct from './pages/add-product'
import Orders from './pages/orders'
import OrderDetail from './pages/order-detail'
import ChangePassword from './pages/change-password'
import ResetPassword from './pages/reset-password'
import AdminProducts from './pages/admin-products'
import Error from './pages/error'
import NewPassword from './pages/new-password'
import Auth from './pages/auth'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    children: [
      {
        index: true,
        errorElement: <Error />,
        element: <Homepage />
      },
      {
        path: 'about',
        errorElement: <Error />,
        element: <About />
      },
      {
        path: 'products',
        errorElement: <Error />,
        element: <Products />
      },
      {
        path: 'add-product',
        errorElement: <Error />,
        element: <AddProduct />
      },
      {
        path: 'auth',
        children: [
          {
            index: true,
            errorElement: <Error />,
            element: <Auth />
          },
          {
            path: 'changePassword',
            errorElement: <Error />,
            element: <ChangePassword />
          },
          {
            path: 'resetPassword',
            errorElement: <Error />,
            element: <ResetPassword />
          },
          {
            path: 'newPassword',
            errorElement: <Error />,
            element: <NewPassword />
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            errorElement: <Error />,
            element: <Orders />
          },
          {
            path: 'order-detail/:orderId',
            errorElement: <Error />,
            element: <OrderDetail />
          }
        ]
      },
      {
        path: 'adminProducts',
        errorElement: <Error />,
        element: <AdminProducts />
      }
    ]
  },
])