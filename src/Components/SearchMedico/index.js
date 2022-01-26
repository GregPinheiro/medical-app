import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function Medicos({ open, medicos, selectMedico }) {
  const [filteredMedicos, setFilteredMedicos] = useState([]);

  useEffect(() => {
    medicos.length > 0 && setFilteredMedicos(medicos);
  }, [medicos]);

  const filterMedicos = (e) => {
    setFilteredMedicos(
      e.target.value ? filterArray(medicos, e.target.value) : medicos
    );
  };

  const pacientesTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">Especialidade</th>
            <th scope="col">Data Nasc.</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicos.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectMedico}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.especialidade}</td>
              <td>{item.CRO_CRM}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar do Médico "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterMedicos}
          />
        </div>
        {pacientesTable()}
      </DialogContent>
    </Dialog>
  );
}

export default Medicos;
