import React, { useState, useEffect } from "react";
import {
  Pageview as PageviewIcon,
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
} from "@material-ui/icons";
import { Button } from "@material-ui/core";

import pacientesServices from "../../services/pacientes.services";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(async () => {
    const response = await pacientesServices.findAll();
    response.status == 200
      ? setPacientes(response.data)
      : alert(
          "Não foi possível carregar os dados, tente novamente mais tarde!"
        );
  }, []);

  const handleView = (id) => {
    alert(`detail ${id}`);
  };

  const handleEdit = (id) => {
    alert(`edit ${id}`);
  };

  const handleDelete = (id) => {
    alert(`delete ${id}`);
  };

  return (
    <div>
      <h1>Pacientes</h1>

      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome do Paciente</th>
            <th scope="col">CPF</th>
            <th scope="col">Data Nasc.</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Celular</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((item) => (
            <tr scope="row">
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.CPF}</td>
              <td>{item.dataNasc}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
              <td>{item.celular}</td>
              <td>
                <PageviewIcon onClick={() => handleView(item.id)} />
                <EditIcon onClick={() => handleEdit(item.id)} />
                <DeleteForeverIcon onClick={() => handleDelete(item.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pacientes;
