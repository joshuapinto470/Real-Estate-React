import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import Profile from "./pages/Profile"
import SingUp from "./pages/SingUp"
import Home from "./pages/Home"
import About from "./pages/About"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import DisplayListing from "./pages/DisplayListing"

const App = () => {
  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SingUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/display-listing" element={<DisplayListing/>} />
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing/>} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App