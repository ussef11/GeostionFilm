import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Film from "./pages/DetailsFilms/DetailsFilms";
import Layout from "./Component/Layout";
import SideBar from "./Component/SideBar";
import WatchList from "./pages/WatchList/WatchList";
import NewMovie from "./pages/AddNewMovie/NewMovie";
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<SideBar />}>
          <Route index element={<Home />} />
          <Route path="film/:id" element={<Film />} />
          <Route path="WatchList" element={<WatchList />} />
          <Route path="addNew" element={<NewMovie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
