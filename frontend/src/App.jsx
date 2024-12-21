import './App.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Albums from "./pages/Albums.jsx";
import Tracks from "./pages/Tracks.jsx";
import Performers from "./pages/Performers.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlaylistsCreate from "./pages/PlaylistsCreate.jsx";
import AlbumsCreate from "./pages/AlbumsCreate.jsx";
import TracksCreate from "./pages/TracksCreate.jsx";
import PerformersCreate from "./pages/PerformersCreate.jsx";
import TrackById from "./pages/TrackById.jsx";
import TracksEdit from "./pages/TracksEdit.jsx";
import PerformerById from "./pages/PerformerById.jsx";
import PerformersEdit from "./pages/PerformersEdit.jsx";
import AlbumById from "./pages/AlbumById.jsx";
import AlbumsEdit from "./pages/AlbumsEdit.jsx";
import PlaylistById from "./pages/PlaylistById.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route element={<PrivateRoute />}>
                <Route index element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                {/*<Route path="/profile/edit-profile" element={<ProfileEdit />} />*/}

                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlist/create-playlist" element={<PlaylistsCreate />} />
                <Route path='/playlist/:id' element={<PlaylistById />}/>

                <Route path="/albums" element={<Albums />} />
                <Route path="/album/create-album" element={<AlbumsCreate />} />
                <Route path='/album/:id' element={<AlbumById />}/>
                <Route path="/album/edit-album/:id" element={<AlbumsEdit />} />

                <Route path="/tracks" element={<Tracks />} />
                <Route path="/track/create-track" element={<TracksCreate />} />
                <Route path='/track/:song_id' element={<TrackById />}/>
                <Route path="/track/edit-track/:id" element={<TracksEdit />} />

                <Route path="/performers" element={<Performers />} />
                <Route path="/performer/:id" element={<PerformerById />} />
                <Route path="/performer/create-performer" element={<PerformersCreate />} />
                <Route path="/performer/edit-performer/:id/:type" element={<PerformersEdit />} />


                {/*<Route path="/admin/">*/}
            </Route>

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
