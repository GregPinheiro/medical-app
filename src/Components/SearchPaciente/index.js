import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function PacienteTable({ open, pacientes, selectPaciente }) {
  const [filteredPacientes, setFilteredPacientes] = useState([]);

  useEffect(() => {
    pacientes.length > 0 && setFilteredPacientes(pacientes);
  }, [pacientes]);

  const filterPacientes = (e) => {
    setFilteredPacientes(
      e.target.value ? filterArray(pacientes, e.target.value) : pacientes
    );
  };

  const pacientesTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">Data Nasc.</th>
          </tr>
        </thead>
        <tbody>
          {filteredPacientes.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectPaciente}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.CPF}</td>
              <td>{new Date(item.dataNasc).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar do Paciente "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterPacientes}
          />
        </div>
        {pacientesTable()}
      </DialogContent>
    </Dialog>
  );
}

export default PacienteTable;
