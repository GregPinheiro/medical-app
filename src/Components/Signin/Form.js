import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { ErrorMessage, Formik, Form as FormikForm, Field } from "formik";

const validations = yup.object().shape({
  name: yup
    .string()
    .min(5, "O usuário deve ter ao menos 5 caractéres")
    .required("O usuário deve ser informado"),
  password: yup
    .string()
    .min(6, "A senha deve ter ao menos 6 caractéres")
    .required("A senha deve ser informada"),
});

function Form({ handleSubmit, initialValues }) {
  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validations}
        >
          <FormikForm className="FormSignin">
            <div>
              <p className="FormSigninTitle">Login</p>
            </div>
            <div className="DivForm">
              <div className="Form-Group">
                <label className="lbSignin">E-mail do Usuário: </label>
                <Field className="Form-Field" name="name" />
                <ErrorMessage
                  className="Form-Error"
                  component="span"
                  name="name"
                />
              </div>
              <div className="Form-Group">
                <label className="lbSignin">Senha do Usuário: </label>
                <Field className="Form-Field" name="password" type="password" />
                <ErrorMessage
                  className="Form-Error"
                  component="span"
                  name="password"
                />
              </div>
              <br />
              <button className="btLogin" type="submit">
                Login
              </button>
            </div>
          </FormikForm>
        </Formik>
      </div>
    </>
  );
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default Form;
