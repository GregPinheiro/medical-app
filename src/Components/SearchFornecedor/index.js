import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@material-ui/core";

import { filterArray } from "../../commom/filters";

function Fornecedores({ open, fornecedores, selectFornecedor }) {
  const [filteredFornecedores, setFilteredFornecedores] = useState([]);

  useEffect(() => {
    fornecedores.length > 0 && setFilteredFornecedores(fornecedores);
  }, [fornecedores]);

  const filterFornecedores = (e) => {
    setFilteredFornecedores(
      e.target.value ? filterArray(fornecedores, e.target.value) : fornecedores
    );
  };

  const fornecedoresTable = () => {
    return (
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col" />
            <th scope="col">Nome</th>
            <th scope="col">CNPJ</th>
          </tr>
        </thead>
        <tbody>
          {filteredFornecedores.map((item) => (
            <tr scope="row">
              <td>
                <Checkbox
                  id={item.id}
                  color="default"
                  onChange={selectFornecedor}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.CNPJ}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{"Buscar do Fornecedor "}</DialogTitle>
      <DialogContent>
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Filtro"
            onChange={filterFornecedores}
          />
        </div>
        {fornecedoresTable()}
      </DialogContent>
    </Dialog>
  );
}

export default Fornecedores;
