import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function Hospitais({ open, hospitais, selectHospital }) {
  const [filteredHospitais, setFilteredHospitais] = useState([]);

  useEffect(() => {
    hospitais.length > 0 && setFilteredHospitais(hospitais);
  }, [hospitais]);

  const filterHospitais = (e) => {
    setFilteredHospitais(
      e.target.value ? filterArray(hospitais, e.target.value) : hospitais
    );
  };

  const hospitaisTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">Unidade</th>
            <th scope="col">CNPJ</th>
          </tr>
        </thead>
        <tbody>
          {filteredHospitais.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectHospital}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.unidade}</td>
              <td>{item.CNPJ}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar do Hospitais "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterHospitais}
          />
        </div>
        {hospitaisTable()}
      </DialogContent>
    </Dialog>
  );
}

export default Hospitais;
