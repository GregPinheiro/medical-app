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

import conveniosServices from "../../services/convenios.service";
import hospitaisServices from "../../services/hospitais.service";

function Convenios() {
  const [updateTable, setUpdateTable] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [convenios, setConvenios] = useState([]);
  const [ConvenioDetail, setConvenioDetail] = useState({});
  const [convenioId, setConvenioId] = useState(0);
  const [convenioName, setConvenioName] = useState("");
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
    setLoading(true);

    const response = await conveniosServices.findAll();

    switch (response.status) {
      case 200:
        setConvenios(response.data);
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
    if (ConvenioDetail) {
      for (const detail in ConvenioDetail) {
        loadDetail(detail, ConvenioDetail[detail]);
      }
    }

    let ids = [];
    ConvenioDetail.hospitais &&
      ConvenioDetail.hospitais.length > 0 &&
      ConvenioDetail.hospitais.map(({ id }) => ids.push(id));

    setHospitalId(ids);
  }, [ConvenioDetail]);

  const handleSaveNew = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await conveniosServices.create(body);

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
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingNew(false);
    }
  };

  const handleView = async (id) => {
    setPopupView(true);
    setReadOnly(true);

    try {
      setLoadingView(true);

      const response = await conveniosServices.findOne(id);

      switch (response.status) {
        case 200:
          setConvenioDetail(response.data);
          break;

        default:
          setViewFailure(true);
          alert("Falha ao buscar as informações do convênio, tente novamente");
      }
    } catch (e) {
      setViewFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingView(false);
    }
  };

  const handleEdit = async (id) => {
    setPopupEdit(true);
    setConvenioId(id);

    try {
      setLoadingEdit(true);

      const response = await conveniosServices.findOne(id);

      switch (response.status) {
        case 200:
          setConvenioDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar as informações do convênio, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editConvenio = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await conveniosServices.update(convenioId, body);

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
    setConvenioId(id);
    setConvenioName(name);
    setPopupDelete(true);
  };

  const deleteConvenio = async () => {
    try {
      setLoadingDelete(true);

      const response = await conveniosServices.delete(convenioId);

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

  const handleAssociate = async (id) => {
    try {
      setLoadingAssociate(true);

      const convenioResponse = await conveniosServices.findOne(id);

      switch (convenioResponse.status) {
        case 200:
          setConvenioDetail(convenioResponse.data);
          break;

        default:
          setAssociateFailure(true);
          alert(
            "Falha ao buscar as informações do convenio, tente novamente mais tarde!"
          );
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
      setConvenioId(id);
    } catch (e) {
      setAssociateFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingAssociate(false);
    }
  };

  const getBody = () => {
    return {
      nome: getValue("nome"),
      endereco: getValue("endereco"),
      cidade: getValue("cidade"),
      UF: getValue("UF"),
      CEP: getValue("CEP"),
      telefone: getValue("telefone"),
      celular: getValue("celular"),
      email: getValue("email"),
      plano: getValue("plano"),
      acomodacao: getValue("acomodacao"),
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
            type="email"
            class="form-control"
            id="email"
            placeholder="e-mail"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="plano">Plano</label>
          <input
            type="text"
            class="form-control"
            id="plano"
            placeholder="Plano"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="acomodacao">Acomodação</label>
          <input
            type="text"
            class="form-control"
            id="acomodacao"
            placeholder="Acomodação"
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

      const response = await conveniosServices.setHospitais(convenioId, data);

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
          <label>Nome do Convênio</label>
          <input
            type="text"
            class="form-control"
            value={ConvenioDetail.nome}
            readOnly={true}
          />
        </div>
        <div class="row">
          <div class="col">
            <label>Plano</label>
            <input
              type="text"
              class="form-control"
              value={ConvenioDetail.plano}
              readOnly={true}
            />
          </div>
          <div class="col">
            <label>Acomodação</label>
            <input
              type="text"
              class="form-control"
              value={ConvenioDetail.acomodacao}
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
              <th scope="col">CPNJ</th>
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
        </table>
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

    setPopupAssociate(false);
    setLoadingAssociate(false);
    setAssociateSucessfull(false);
    setAssociateFailure(false);
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Convênios</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Novo Convênio{" "}
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
            <th scope="col">Plano</th>
            <th scope="col">Acomodação</th>
            <th scope="col">Endereço</th>
            <th scope="col">Cidade</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Celular</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {convenios.map((item) => (
            <tr>
              <th scope="row">{item.id}</th>
              <td>{item.nome}</td>
              <td>{item.plano}</td>
              <td>{item.acomodacao}</td>
              <td>{item.endereco}</td>
              <td>{item.cidade}</td>
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
        <DialogTitle>Cadastrar Novo Convênio</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Convênio cadastrado com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar convênio,
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
        <DialogTitle>Dados do Convênio</DialogTitle>
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
        <DialogTitle>Editar Dados do Convênio</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Convênio editado com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar convênio, verifique
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
            <Button onClick={() => editConvenio()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Deletar Convênio</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Convênio deletado com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar convênio,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar o convênio {convenioName} ({convenioId}
          )?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => deleteConvenio()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupAssociate} fullWidth={true} maxWidth={"lg"}>
        <DialogTitle>Associações Convênios</DialogTitle>
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

export default Convenios;
