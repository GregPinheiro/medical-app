import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

import CopyRights from "./Components/CopyRights";
import Signin from "./Components/Signin";
import Navbar from "./Components/Navbar";
import Pacientes from "./Components/Pacientes";

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

      <CopyRights />
    </BrowserRouter>
  );
}

export default App;
