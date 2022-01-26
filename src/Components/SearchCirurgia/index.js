import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function SearhCirurgia({ open, cirurgias, selectCirurgia }) {
  const [filteredCirurgias, setFilteredCirurgias] = useState([]);

  useEffect(() => {
    cirurgias.length > 0 && setFilteredCirurgias(cirurgias);
  }, [cirurgias]);

  const filterCirurgias = (e) => {
    setFilteredCirurgias(
      e.target.value ? filterArray(cirurgias, e.target.value) : cirurgias
    );
  };

  const cirurgiasTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">CID</th>
            <th scope="col">TUSS</th>
          </tr>
        </thead>
        <tbody>
          {filteredCirurgias.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectCirurgia}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.CID}</td>
              <td>{item.TUSS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar Cirurgia "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterCirurgias}
          />
        </div>
        {cirurgiasTable()}
      </DialogContent>
    </Dialog>
  );
}

export default SearhCirurgia;
