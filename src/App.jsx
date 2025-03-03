import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Products from "./pages/products/Products";
import Nav from "./elements/nav/Nav";
import './app.scss';


const App = () => {
  return (
      <div>
        <BrowserRouter>
          <Nav/>
          <Routes>
            <Route path='/' index element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact'  element={<Contact />} />
            <Route path='/products'  element={<Products />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
};

export default App;
