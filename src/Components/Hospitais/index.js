import React, { useState, useEffect } from "react";
import {
  Pageview as PageviewIcon,
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
  WarningOutlined as WarningOutlinedIcon,
  CheckOutlined as CheckOutlinedIcon,
  PostAdd as PostAddIcon,
} from "@material-ui/icons";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";

import hospitaisServices from "../../services/hospitais.service";

function Hospitais() {
  const [updateTable, setUpdateTable] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitais, setHospitais] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState({});
  const [hospitalId, setHospitalId] = useState(0);
  const [hospitalName, setHospitalName] = useState("");
  const [popupNew, setPopupNew] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [newSucessfull, setNewSucessfull] = useState(false);
  const [newFailure, setNewFailure] = useState(false);
  const [popupView, setPopupView] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [viewSucessfull, setViewSucessfull] = useState(false);
  const [viewFailure, setViewFailure] = useState(false);
  const [popupEdit, setPopupEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editSucessfull, setEditSucessfull] = useState(false);
  const [editFailure, setEditFailure] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteSucessfull, setDeleteSucessfull] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);

  useEffect(async () => {
    setLoading(true);

    const response = await hospitaisServices.findAll();

    switch (response.status) {
      case 200:
        setHospitais(response.data);
        break;

      default:
        alert(
          "Não foi possível carregar os dados, tente novamente mais tarde!"
        );
    }

    setLoading(false);
    setUpdateTable(false);
  }, [updateTable]);

  useEffect(() => {
    if (hospitalDetail) {
      for (const detail in hospitalDetail) {
        loadDetail(detail, hospitalDetail[detail]);
      }
    }
  }, [hospitalDetail]);

  const handleSave = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await hospitaisServices.create(body);

      switch (response.status) {
        case 201:
          setNewSucessfull(true);
          setUpdateTable(true);
          break;

        default:
          setNewFailure(true);
      }
    } catch (e) {
      setNewFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingNew(false);
    }
  };

  const handleView = async (id) => {
    setPopupView(true);
    setReadOnly(true);

    try {
      setLoadingView(true);

      const response = await hospitaisServices.findOne(id);

      switch (response.status) {
        case 200:
          setHospitalDetail(response.data);
          break;
        default:
          setViewFailure(true);
          alert(
            "Falha ao buscar as informações do hospital, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setViewFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = async (id) => {
    setPopupEdit(true);
    setHospitalId(id);

    try {
      setLoadingEdit(true);

      const response = await hospitaisServices.findOne(id);

      switch (response.status) {
        case 200:
          setHospitalDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar os informações do hospital, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editHospital = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await hospitaisServices.update(hospitalId, body);

      switch (response.status) {
        case 202:
          setEditSucessfull(true);
          break;

        default:
          setEditFailure(true);
      }
    } catch (e) {
      setEditFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setUpdateTable(true);
      setLoadingEdit(false);
    }
  };

  const handleDelete = (id, name) => {
    setHospitalId(id);
    setHospitalName(name);
    setPopupDelete(true);
  };

  const deleteHospital = async () => {
    try {
      setLoadingDelete(true);

      const response = await hospitaisServices.delete(hospitalId);

      switch (response.status) {
        case 202:
          setDeleteSucessfull(true);
          break;

        default:
          setDeleteFailure(true);
      }
    } catch (e) {
      e.response.data ? alert(e.response.data) : alert(e);
      setDeleteFailure(true);
    } finally {
      setUpdateTable(true);
      setLoadingDelete(false);
    }
  };

  const form = () => {
    return (
      <form id="Form-Add-Paciente">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input
            type="text"
            class="form-control"
            id="nome"
            placeholder="Nome"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="unidade">Unidade</label>
            <input
              type="text"
              class="form-control"
              id="unidade"
              placeholder="Unidade"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="CNPJ">CNPJ</label>
            <input
              type="text"
              class="form-control"
              id="CNPJ"
              placeholder="CNPJ"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="endereco">Endereço</label>
          <input
            type="text"
            class="form-control"
            id="endereco"
            placeholder="Endereço"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="cidade">Cidade</label>
            <input
              type="text"
              class="form-control"
              id="cidade"
              placeholder="Cidade"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="UF">UF</label>
            <input
              type="text"
              class="form-control"
              id="UF"
              placeholder="Estado"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="CEP">CEP</label>
            <input
              type="text"
              class="form-control"
              id="CEP"
              placeholder="CEP"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="contato1">Contato (1)</label>
            <input
              type="text"
              class="form-control"
              id="contato1"
              placeholder="Contato"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="telefone1">Telefone</label>
            <input
              type="text"
              class="form-control"
              id="telefone1"
              placeholder="Telefone"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email1">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email1"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="contato2">Contato (2)</label>
            <input
              type="text"
              class="form-control"
              id="contato2"
              placeholder="Contato"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="telefone2">Telefone</label>
            <input
              type="text"
              class="form-control"
              id="telefone2"
              placeholder="Telefone"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email2">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email2"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="contato3">Contato (3)</label>
            <input
              type="text"
              class="form-control"
              id="contato3"
              placeholder="Contato"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="telefone3">Telefone</label>
            <input
              type="text"
              class="form-control"
              id="telefone3"
              placeholder="Telefone"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email3">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email3"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="contato4">Contato (4)</label>
            <input
              type="text"
              class="form-control"
              id="contato4"
              placeholder="Contato"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="telefone4">Telefone</label>
            <input
              type="text"
              class="form-control"
              id="telefone4"
              placeholder="Telefone"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email4">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email4"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
      </form>
    );
  };

  const getBody = () => {
    return {
      nome: getValue("nome"),
      CNPJ: getValue("CNPJ"),
      unidade: getValue("unidade"),
      endereco: getValue("endereco"),
      cidade: getValue("cidade"),
      UF: getValue("UF"),
      CEP: getValue("CEP"),
      contato1: getValue("contato1"),
      contato2: getValue("contato2"),
      contato3: getValue("contato3"),
      contato4: getValue("contato4"),
      telefone1: getValue("telefone1"),
      telefone2: getValue("telefone2"),
      telefone3: getValue("telefone3"),
      telefone4: getValue("telefone4"),
      email1: getValue("email1"),
      email2: getValue("email2"),
      email3: getValue("email3"),
      email4: getValue("email4"),
    };
  };

  const getValue = (id) => {
    const { value } = document.getElementById(id);
    return value.length > 0 ? value : null;
  };

  const loadDetail = (element, newValue) => {
    const item = document.getElementById(element);

    if (item) {
      item.value = newValue;
    }
  };

  const closePopup = () => {
    setPopupNew(false);
    setLoadingNew(false);
    setNewSucessfull(false);
    setNewFailure(false);

    setPopupView(false);
    setLoadingView(false);
    setViewSucessfull(false);
    setViewFailure(false);
    setReadOnly(false);

    setPopupEdit(false);
    setLoadingEdit(false);
    setEditSucessfull(false);
    setEditFailure(false);

    setPopupDelete(false);
    setLoadingDelete(false);
    setDeleteSucessfull(false);
    setDeleteFailure(false);
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Hospitais</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Novo Hospital{" "}
          <PostAddIcon
            className="Add-Button"
            onClick={() => setPopupNew(true)}
          />
        </p>
      </div>
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">Unidade</th>
            <th scope="col">CNPJ</th>
            <th scope="col">Endereço</th>
            <th scope="col">Cidade</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Contato</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {hospitais.map((item) => (
            <tr scope="row">
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.unidade}</td>
              <td>{item.CNPJ}</td>
              <td>{item.endereco}</td>
              <td>{item.cidade}</td>
              <td>{item.email1}</td>
              <td>{item.telefone1}</td>
              <td>{item.contato1}</td>
              <td className="td-funcoes">
                <PageviewIcon onClick={() => handleView(item.id)} />
                <EditIcon onClick={() => handleEdit(item.id)} />
                <DeleteForeverIcon
                  onClick={() => handleDelete(item.id, item.nome)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={popupNew} fullWidth={true}>
        <DialogTitle>Cadastrar Novo Hospital</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Hospital cadastrado com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar hospital,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          {loadingNew && <CircularProgress color="secondary" />}
          <Button onClick={() => closePopup()}>Cancelar</Button>
          {newSucessfull ? (
            <Button onClick={() => closePopup()}>Sair</Button>
          ) : (
            <Button onClick={() => handleSave()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupView} fullWidth={true}>
        <DialogTitle>Dados do Hospital</DialogTitle>
        <DialogContent>
          {viewFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao carregar os dados do hospital
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closePopup()}>Sair</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupEdit} fullWidth={true}>
        <DialogTitle>Editar Dados do Hospital</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Hospital editado com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar hosiptal, verifique
              os dados e tente novamente!!!
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          {loadingEdit && <CircularProgress color="secondary" />}
          <Button onClick={() => closePopup()}>Cancelar</Button>
          {editSucessfull ? (
            <Button onClick={() => closePopup()}>Sair</Button>
          ) : (
            <Button onClick={() => editHospital()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true}>
        <DialogTitle>Deletar Hospital</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Hospital deletado com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar hospital,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar o hospital {hospitalName} ({hospitalId}
          )?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => deleteHospital()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Hospitais;
