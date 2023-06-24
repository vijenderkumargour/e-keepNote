
import './App.css';
import Home from './components/Home';
import About from './components/About';
import Nav from './components/Nav'
import NoteState from './components/context/note/NoteState'
import Alert from './components/Alert';
import Login from './components/Login'
import Signup from './components/Signup'
import { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  return (
    <>
      <Router>
        <NoteState>
          <Nav />
          <Alert alert={alert} />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home showAlert={showAlert} />}> </Route>
              <Route path='/about' element={<About />}></Route>
              <Route path='/loging' element={<Login showAlert={showAlert} />}></Route>
              <Route path='/signup' element={<Signup showAlert={showAlert} />}></Route>
            </Routes>
          </div>
        </NoteState>
      </Router>
    </>
  );
}

export default App;
