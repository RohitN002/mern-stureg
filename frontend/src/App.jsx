import React from 'react'
import { Routes, Route } from 'react-router-dom';

import RegistrationForm from './components/RegForm';
import AdminDashboard from './components/Admin';

const App = () => {
  return (
    
          <Routes>
     <Route path='/' element={<RegistrationForm/>} />
      
     <Route path='/Admin' element={<AdminDashboard/>}/>
    
      </Routes>
    
  )
}

export default App