import React, { useState, useEffect } from "react";
import {
  Pageview as PageviewIcon,
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
  WarningOutlined as WarningOutlinedIcon,
  CheckOutlined as CheckOutlinedIcon,
  PostAdd as PostAddIcon,
  DeviceHub as DeviceHubIcon,
} from "@material-ui/icons";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Checkbox,
} from "@material-ui/core";

import medicosServices from "../../services/medicos.service";
import hospitaisServices from "../../services/hospitais.service";

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
  const [popupAssociate, setPopupAssociate] = useState(false);
  const [loadingAssociate, setLoadingAssociate] = useState(false);
  const [associateSucessfull, setAssociateSucessfull] = useState(false);
  const [associateFailure, setAssociateFailure] = useState(false);
  const [hospitais, setHospitais] = useState([]);
  const [filteredHospitais, setFilteredHospitais] = useState([]);
  const [hospitalId, setHospitalId] = useState([]);

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

      let ids = [];
      medicoDetail.hospitais &&
        medicoDetail.hospitais.length > 0 &&
        medicoDetail.hospitais.map(({ id }) => ids.push(id));

      setHospitalId(ids);
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
      e.response?.data ? alert(e.response.data) : alert(e);
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
      e.response?.data ? alert(e.response.data) : alert(e);
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
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleAssociate = async (id) => {
    try {
      setLoadingAssociate(true);

      const medicoResponse = await medicosServices.findOne(id);

      switch (medicoResponse.status) {
        case 200:
          setMedicoDetail(medicoResponse.data);
          break;

        default:
          setAssociateFailure(true);
          alert(
            "Falha ao buscar as informações do médicos, tente novamente mais tarde!"
          );
          break;
      }

      const hospitalResponse = await hospitaisServices.findAll();

      switch (hospitalResponse.status) {
        case 200:
          setHospitais(hospitalResponse.data);
          setFilteredHospitais(hospitalResponse.data);
          break;

        default:
          setAssociateFailure(true);
          alert(
            "Falha ao buscar as informações dos hospitais, tente novamente mais tarde!"
          );
      }

      setPopupAssociate(true);
      setMedicoId(id);
    } catch (e) {
      setAssociateFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingAssociate(false);
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
      e.response?.data ? alert(e.response.data) : alert(e);
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
      e.response?.data ? alert(e.response.data) : alert(e);
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

    setPopupAssociate(false);
    setLoadingAssociate(false);
    setAssociateSucessfull(false);
    setAssociateFailure(false);
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

  const toggleHospitalId = (e) => {
    e.target.checked
      ? setHospitalId([...hospitalId, Number(e.target.id)])
      : setHospitalId(hospitalId.filter((id) => id !== Number(e.target.id)));
  };

  const handleSetHospitais = async () => {
    const data = { hospitalId };
    setAssociateSucessfull(false);
    setAssociateFailure(false);

    try {
      setLoadingAssociate(true);

      const response = await medicosServices.setHospital(medicoId, data);

      switch (response.status) {
        case 201:
          setAssociateSucessfull(true);
          break;

        default:
          setAssociateFailure(true);
      }
    } catch (e) {
      setAssociateFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingAssociate(false);
    }
  };

  const filterHospitais = (e) => {
    setFilteredHospitais(
      e.target.value
        ? hospitais.filter((hospital) => hospital.nome.includes(e.target.value))
        : hospitais
    );
  };

  const associateForm = () => {
    return (
      <form id="Form-Add-Paciente">
        <div class="form-group">
          <label for="nome">Nome do Médico</label>
          <input
            type="text"
            class="form-control"
            value={medicoDetail.nome}
            readOnly={true}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="especialidade">Especialidade</label>
            <input
              type="text"
              class="form-control"
              value={medicoDetail.especialidade}
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="CRO_CRM">CRO/CRM</label>
            <input
              type="text"
              class="form-control"
              value={medicoDetail.CRO_CRM}
              readOnly={true}
            />
          </div>
        </div>
        <div class="row" style={{ marginTop: "20px" }}>
          <div class="col">
            <h5>Hospitais</h5>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              placeholder="Filtro"
              onChange={filterHospitais}
            />
          </div>
        </div>
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
                    checked={hospitalId.includes(item.id)}
                    color="default"
                    id={item.id}
                    onChange={(e) => toggleHospitalId(e)}
                  />
                </td>
                <td>{item.nome}</td>
                <td>{item.unidade}</td>
                <td>{item.CNPJ}</td>
              </tr>
            ))}
          </tbody>
          {filteredHospitais.length == 0 && <h5>No content</h5>}
        </table>
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
      <table class="table table-hover">
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
            <tr>
              <th scope="row">{item.id}</th>
              <td>{item.nome}</td>
              <td>{item.especialidade}</td>
              <td>{item.CRO_CRM}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
              <td>{item.celular}</td>
              <td className="td-funcoes">
                <PageviewIcon
                  titleAccess="Visualizar"
                  onClick={() => handleView(item.id)}
                />
                <DeviceHubIcon
                  titleAccess="Associações"
                  onClick={() => handleAssociate(item.id)}
                />
                <EditIcon
                  titleAccess="Editar"
                  onClick={() => handleEdit(item.id)}
                />
                <DeleteForeverIcon
                  titleAccess="Deletar"
                  onClick={() => handleDelete(item.id, item.nome)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={popupNew} fullWidth={true} maxWidth={"md"}>
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
      <Dialog open={popupView} fullWidth={true} maxWidth={"md"}>
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
      <Dialog open={popupEdit} fullWidth={true} maxWidth={"md"}>
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
      <Dialog open={popupDelete} fullWidth={true} maxWidth={"md"}>
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
      <Dialog open={popupAssociate} fullWidth={true} maxWidth={"lg"}>
        <DialogTitle>Associações Médico</DialogTitle>
        <DialogContent>
          {associateSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Associações salvas com sucesso!!!
            </DialogContentText>
          )}
          {associateFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar salvar associações,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          {associateForm()}
        </DialogContent>
        <DialogActions>
          {loadingAssociate && <CircularProgress color="secondary" />}
          <Button onClick={() => closePopup()}>Sair</Button>
          <Button onClick={() => handleSetHospitais()}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Medicos;
