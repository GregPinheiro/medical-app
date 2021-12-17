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

import medicosServices from "../../services/medicos.services";

function Medicos() {
  const [updateTable, setUpdateTable] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [medicos, setMedicos] = useState([]);
  const [medicoDetail, setMedicoDetail] = useState({});
  const [medicoId, setMedicoId] = useState(0);
  const [medicoName, setMedicoName] = useState("");
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
    const response = await medicosServices.findAll();

    response.status == 200
      ? setMedicos(response.data)
      : alert(
          "Não foi possível carregar os dados, tente novamente mais tarde!"
        );

    setUpdateTable(false);
    setLoading(false);
  }, [updateTable]);

  useEffect(async () => {
    if (medicoDetail) {
      for (const detail in medicoDetail) {
        loadDetail(detail, medicoDetail[detail]);
      }
    }
  }, [medicoDetail]);

  const handleSaveNew = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await medicosServices.create(body);

      switch (response.status) {
        case 201:
          setNewSucessfull(true);
          break;

        default:
          setNewFailure(true);
      }
    } catch (e) {
      setNewFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingNew(false);
      setUpdateTable(true);
    }
  };

  const handleView = async (id) => {
    setPopupView(true);
    setReadOnly(true);

    try {
      setLoadingView(true);

      const response = await medicosServices.findOne(id);

      response.status == 200
        ? setMedicoDetail(response.data)
        : alert(
            "Falha ao buscar as informações do médicos, tente novamente mais tarde!"
          );
    } catch (e) {
      setViewFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = async (id) => {
    setPopupEdit(true);
    setMedicoId(id);

    try {
      setLoadingEdit(true);

      const response = await medicosServices.findOne(id);

      switch (response.status) {
        case 200:
          setMedicoDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar as informações do médicos, tente novamente mais tarde!"
          );
          break;
      }
    } catch (e) {
      setEditFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditSave = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await medicosServices.update(medicoId, body);

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
    setMedicoId(id);
    setMedicoName(name);
    setPopupDelete(true);
  };

  const handleDeleteMedico = async () => {
    try {
      setLoadingDelete(true);

      const response = await medicosServices.delete(medicoId);

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

  const getBody = () => {
    return {
      nome: getValue("nome"),
      especialidade: getValue("especialidade"),
      CRO_CRM: getValue("CRO_CRM"),
      endereco: getValue("endereco"),
      cidade: getValue("cidade"),
      UF: getValue("UF"),
      CEP: getValue("CEP"),
      telefone: getValue("telefone"),
      celular: getValue("celular"),
      email: getValue("email"),
      secretaria: getValue("secretaria"),
    };
  };

  const getValue = (id) => {
    const { value } = document.getElementById(id);
    return value.length > 0 ? value : null;
  };

  const loadDetail = (element, newValue) => {
    const item = document.getElementById(element);

    if (item) {
      if (item.type === "text") {
        item.value = newValue;
      } else {
        const date = new Date(newValue);
        item.value = date.toISOString().substr(0, 10);
      }
    }
  };

  const closePopup = () => {
    setReadOnly(false);

    setPopupNew(false);
    setLoadingNew(false);
    setNewSucessfull(false);
    setNewFailure(false);

    setPopupView(false);
    setLoadingView(false);
    setViewSucessfull(false);
    setViewFailure(false);

    setPopupEdit(false);
    setLoadingEdit(false);
    setEditSucessfull(false);
    setEditFailure(false);

    setPopupDelete(false);
    setLoadingDelete(false);
    setDeleteSucessfull(false);
    setDeleteFailure(false);
  };

  const form = () => {
    return (
      <form id="Form-Add-Paciente">
        <div class="form-group">
          <label for="nome">Nome do Médico</label>
          <input
            type="text"
            class="form-control"
            id="nome"
            placeholder="Nome do paciente"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="especialidade">Especialidade</label>
            <input
              type="text"
              class="form-control"
              id="especialidade"
              placeholder="Especialidade"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="CRO_CRM">CRO/CRM</label>
            <input
              type="text"
              class="form-control"
              id="CRO_CRM"
              placeholder="CRO/CRM"
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
            <label for="telefone">Telefone</label>
            <input
              type="text"
              class="form-control"
              id="telefone"
              placeholder="Telefone"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="celular">Celular</label>
            <input
              type="text"
              class="form-control"
              id="celular"
              placeholder="Celular"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="text"
            class="form-control"
            id="email"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="secretaria">Contato Secretária</label>
          <input
            type="text"
            class="form-control"
            id="secretaria"
            placeholder="Contato Secretária"
            readOnly={readOnly}
          />
        </div>
      </form>
    );
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Médicos</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Novo Médico{" "}
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
            <th scope="col">Especialidade</th>
            <th scope="col">CRO/CRM</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Celular</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((item) => (
            <tr scope="row">
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.especialidade}</td>
              <td>{item.CRO_CRM}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
              <td>{item.celular}</td>
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
        <DialogTitle>Cadastrar Novo Médico</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Médico cadastrado com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar médico,
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
            <Button onClick={() => handleSaveNew()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupView} fullWidth={true}>
        <DialogTitle>Dados do Médico</DialogTitle>
        <DialogContent>
          {viewFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao carregar os dados do médico
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closePopup()}>Sair</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupEdit} fullWidth={true}>
        <DialogTitle>Editar Dados do Médico</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Médico editado com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar médico, verifique
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
            <Button onClick={() => handleEditSave()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true}>
        <DialogTitle>Deletar Médico</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Médico deletado com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar médico, verifique
              os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar o médico {medicoName} ({medicoId})?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => handleDeleteMedico()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Medicos;
