import './App.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import Signup from "./pages/Signup.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
          <Route element={<PrivateRoute />}>
            <Route index element={<Home />} />
              {/*<Route path='song/:song_id' element={}/>*/}

            {/*<Route path="/admin/">*/}
            </Route>
          {/*</Route>*/}

          <Route element={<PublicRoute restricted />}>
              <Route path='signup' element={<Signup />} />
              <Route path='signin' element={<Signin />} />
              <Route path='forget-password' element={<ForgetPassword />} />
              <Route path='auth/reset-password' element={<ResetPassword />} />
              <Route path='auth/verify-email' element={<VerifyEmail />} />
          </Route>
        </Route>
    )
);

function App() {

  return (
    <>
        <RouterProvider router={router} />
        <ToastContainer />
    </>
  )
}

export default App
