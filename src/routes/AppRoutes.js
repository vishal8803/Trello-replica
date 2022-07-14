import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
  
  import Dashboard from '../Components/Dashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes