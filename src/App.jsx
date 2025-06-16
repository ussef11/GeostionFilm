import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Film from "./pages/DetailsFilms/DetailsFilms";
import Layout from "./Component/Layout";
import SideBar from "./Component/SideBar";
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<SideBar />}>
          <Route index element={<Home />} />
          <Route path="film" element={<Film />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
