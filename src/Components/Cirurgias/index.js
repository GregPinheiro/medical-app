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

import cirurgiasServices from "../../services/cirurgias.service";

function Cirurgias() {
  const [updateTable, setUpdateTable] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cirurgias, setCirurgias] = useState([]);
  const [cirurgiaDetail, setCirurgiaDetail] = useState({});
  const [cirurgiaId, setCirurgiaId] = useState(0);
  const [cirurgiaName, setCirurgiaName] = useState("");
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

    const response = await cirurgiasServices.findAll();

    switch (response.status) {
      case 200:
        setCirurgias(response.data);
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
    if (cirurgiaDetail) {
      for (const detail in cirurgiaDetail) {
        loadDetail(detail, cirurgiaDetail[detail]);
      }
    }
  }, [cirurgiaDetail]);

  const createCirurgia = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await cirurgiasServices.create(body);

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

      const response = await cirurgiasServices.findOne(id);

      switch (response.status) {
        case 200:
          setCirurgiaDetail(response.data);
          break;
        default:
          setViewFailure(true);
          alert(
            "Falha ao buscar as informações da cirurgia, tente novamente mais tarde"
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
    setCirurgiaId(id);

    try {
      setLoadingEdit(true);

      const response = await cirurgiasServices.findOne(id);

      switch (response.status) {
        case 200:
          setCirurgiaDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar os informações da cirurgia, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editCirurgia = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await cirurgiasServices.update(cirurgiaId, body);

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
    setCirurgiaId(id);
    setCirurgiaName(name);
    setPopupDelete(true);
  };

  const deleteCirurgia = async () => {
    try {
      setLoadingDelete(true);

      const response = await cirurgiasServices.delete(cirurgiaId);

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
        <div class="form-group">
          <label for="CID">CID</label>
          <textarea
            class="form-control"
            id="CID"
            placeholder="CID"
            rows="2"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="TUSS">TUSS</label>
          <textarea
            class="form-control"
            id="TUSS"
            placeholder="TUSS"
            rows="2"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="justificativa">Justificativa</label>
          <textarea
            class="form-control"
            id="justificativa"
            placeholder="Justificativa"
            rows="4"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="materiais">Materiais</label>
          <textarea
            class="form-control"
            id="materiais"
            placeholder="Materiais"
            rows="4"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="observation">Observações</label>
          <textarea
            class="form-control"
            id="observation"
            placeholder="Observações"
            rows="4"
            cols="50"
            readOnly={readOnly}
          />
        </div>
      </form>
    );
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

  const getBody = () => {
    return {
      nome: getValue("nome"),
      CID: getValue("CID"),
      TUSS: getValue("TUSS"),
      justificativa: getValue("justificativa"),
      materiais: getValue("materiais"),
      observation: getValue("observation"),
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

  return (
    <>
      <div className="Medicos-Title">
        <h1>Cirurgias</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Nova Cirurgia{" "}
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
            <th scope="col">CID</th>
            <th scope="col">TUSS</th>
            <th scope="col">Justificativa</th>
            <th scope="col">Materiais</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {cirurgias.map((item) => (
            <tr scope="row">
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.CID}</td>
              <td>{item.TUSS}</td>
              <td>{item.justificativa}</td>
              <td>{item.materiais}</td>
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
      <Dialog open={popupNew} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Cadastrar Nova Cirurgia</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Cirurgia cadastrada com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar Cirurgia,
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
            <Button onClick={() => createCirurgia()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupView} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Dados da Cirurgia</DialogTitle>
        <DialogContent>
          {viewFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao carregar os dados da cirurgia
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closePopup()}>Sair</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupEdit} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Editar Dados da Cirurgia</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Cirurgia editada com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar cirurgia, verifique
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
            <Button onClick={() => editCirurgia()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Deletar Cirurgia</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Cirurgia deletada com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar cirurgia,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar a cirurgia {cirurgiaName} ({cirurgiaId}
          )?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => deleteCirurgia()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Cirurgias;
