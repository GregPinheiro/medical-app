import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { UserContext } from "../../providers/user";

function Navbar() {
  const { user, setUser } = useContext(UserContext);

  const UserMenu = () => {
    return (
      <div className="userMenu">
        <li className="nav-item">
          <p className="nav-link">
            Olá, {user.name} (
            <a style={{ margin: "20px 0" }} onClick={handleLogout}>
              sair
            </a>
            )
          </p>
        </li>
      </div>
    );
  };

  const handleLogout = () => {
    setUser({
      auth: false,
      name: "",
      token: "",
    });
    sessionStorage.removeItem("user");
  };

  const menuItem = (value) => {
    return user.auth ? (
      <Link to={`/${value.toLowerCase()}`} className="nav-link">
        {value}
      </Link>
    ) : (
      <Link to={"/user/signin"} className="nav-link">
        {value}
      </Link>
    );
  };

  return (
    <div className="NavBar">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/home" className="navbar-brand">
          Medical App
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">{menuItem("Consultas")}</li>
          <li className="nav-item">{menuItem("Acomp-Cirurgias")}</li>
          <li className="nav-item">{menuItem("Reembolsos")}</li>
          <li className="nav-item">{menuItem("Pacientes")}</li>
          <li className="nav-item">{menuItem("Médicos")}</li>
          <li className="nav-item">{menuItem("Hospitais")}</li>
          <li className="nav-item">{menuItem("Convênios")}</li>
          <li className="nav-item">{menuItem("Cirurgias")}</li>
          <li className="nav-item">{menuItem("Fornecedores")}</li>
          {user.auth ? (
            UserMenu()
          ) : (
            <li className="nav-item">
              <Link to={"/user/signin"} className="nav-link">
                Login
              </Link>
            </li>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
