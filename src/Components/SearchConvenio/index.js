import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function SearchConvenio({ open, convenios, selectConvenio }) {
  const [filteredConvenios, setFilteredConvenios] = useState([]);

  useEffect(() => {
    convenios.length > 0 && setFilteredConvenios(convenios);
  }, [convenios]);

  const filterConvenios = (e) => {
    setFilteredConvenios(
      e.target.value ? filterArray(convenios, e.target.value) : convenios
    );
  };

  const conveniosTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">Plano</th>
            <th scope="col">Acomodação</th>
          </tr>
        </thead>
        <tbody>
          {filteredConvenios.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectConvenio}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.plano}</td>
              <td>{item.acomodacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar Convênio "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterConvenios}
          />
        </div>
        {conveniosTable()}
      </DialogContent>
    </Dialog>
  );
}

export default SearchConvenio;
