import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

import CopyRights from "./Components/CopyRights";
import Signin from "./Components/Signin";
import Navbar from "./Components/Navbar";
import Pacientes from "./Components/Pacientes";
import Medicos from "./Components/Medicos";
import Convenios from "./Components/Convenios";
import Hospitais from "./Components/Hospitais";

function App() {
  return (
    <BrowserRouter className="App">
      <Navbar />

      <Route path="/user/signin">
        <Signin />
      </Route>

      <Route path="/pacientes">
        <Pacientes />
      </Route>

      <Route path="/médicos">
        <Medicos />
      </Route>

      <Route path="/convênios">
        <Convenios />
      </Route>

      <Route path="/hospitais">
        <Hospitais />
      </Route>

      <CopyRights />
    </BrowserRouter>
  );
}

export default App;
