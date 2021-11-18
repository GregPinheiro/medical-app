import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import Form from "./Form";
import { Snackbar } from "@material-ui/core";

import userServices from "../../services/user.services";
import { UserContext } from "../../providers/user";

const initialValues = {
  name: "",
  password: "",
};

export default () => {
  const { user, setUser } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [redirectHome, setredirectHome] = useState(false);

  const handleSubmit = (values) => {
    userServices
      .signin(values)
      .then((response) => {
        if (response.status == 202) {
          setUser({
            auth: response.data.auth,
            name: response.data.name,
            token: response.data.token,
          });
          sessionStorage.setItem("user", JSON.stringify(response.data));
          setOpenSnackbar(true);
        } else {
          alert(
            "Não foi possível realizar o login, verifique os dados e tente novamente"
          );
        }
      })
      .catch((e) => (e.response.data ? alert(e.response.data) : alert(e)));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setredirectHome(true);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        message="Login realizado com sucesso! Você será redirecionado para a home"
      />
      <Form handleSubmit={handleSubmit} initialValues={initialValues} />

      {redirectHome && <Redirect to="/home" />}
    </>
  );
};
