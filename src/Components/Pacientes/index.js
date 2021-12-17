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

import pacientesServices from "../../services/pacientes.services";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteDetail, setPacienteDetail] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [saveSceneSucessfull, setSaveSceneSucessfull] = useState(false);
  const [saveSceneFailure, setSaveSceneFailure] = useState(false);
  const [loadingSceneInfo, setLoadingSceneInfo] = useState(false);
  const [updateTable, setUpdateTable] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const [deleteSucessfull, setDeleteSucessfull] = useState(false);
  const [deleteFailure, setDeleteFailure] = useState(false);
  const [popupView, setPopupView] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [popupEdit, setPopupEdit] = useState(false);
  const [editSucessfull, setEditSucessfull] = useState(false);
  const [editFailure, setEditFailure] = useState(false);
  const [pacienteId, setPacienteId] = useState(0);
  const [pacienteName, setPacienteName] = useState("");

  useEffect(async () => {
    const response = await pacientesServices.findAll();
    response.status == 200
      ? setPacientes(response.data)
      : alert(
          "Não foi possível carregar os dados, tente novamente mais tarde!"
        );

    setUpdateTable(false);
  }, [updateTable]);

  useEffect(() => {
    if (pacienteDetail) {
      for (const detail in pacienteDetail) {
        loadDetail(detail, pacienteDetail[detail]);
      }
    }
  }, [pacienteDetail]);

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

  const handleView = async (id) => {
    setPopupView(true);
    setReadOnly(true);

    try {
      const response = await pacientesServices.findOne(id);

      response.status == 200 && setPacienteDetail(response.data);
    } catch (e) {
      e.response.data ? alert(e.response.data) : alert(e);
    }
  };

  const openPopupEdit = async (id) => {
    setPopupEdit(true);
    setReadOnly(false);
    setPacienteId(id);

    try {
      const response = await pacientesServices.findOne(id);

      response.status == 200 && setPacienteDetail(response.data);
    } catch (e) {
      e.response.data ? alert(e.response.data) : alert(e);
    }
  };

  const deletePopup = (id, name) => {
    setPacienteId(id);
    setPacienteName(name);
    setPopupDelete(true);
  };

  const handleSavePaciente = async () => {
    const body = getBody();

    try {
      setLoadingSceneInfo(true);

      const response = await pacientesServices.create(body);

      switch (response.status) {
        case 201:
          setSaveSceneSucessfull(true);
          break;

        default:
          setSaveSceneFailure(true);
      }
    } catch (e) {
      setSaveSceneFailure(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingSceneInfo(false);
    }
  };

  const handleEditPaciente = async () => {
    const body = getBody();

    try {
      setLoadingSceneInfo(true);

      const response = await pacientesServices.edit(pacienteId, body);

      switch (response.status) {
        case 202:
          setEditSucessfull(true);
          break;

        default:
          setEditFailure(true);
      }
    } catch (e) {
      setEditSucessfull(true);
      e.response.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingSceneInfo(false);
    }
  };

  const handleDeletePaciente = async () => {
    try {
      setLoadingSceneInfo(true);

      const response = await pacientesServices.delete(pacienteId);

      switch (response.status) {
        case 202:
          setDeleteSucessfull(true);
          break;

        default:
          setDeleteFailure(true);
      }
    } catch (e) {
      setDeleteFailure(true);
    } finally {
      setLoadingSceneInfo(false);
    }
  };

  const closePopup = () => {
    setUpdateTable(true);
    setOpenPopup(false);
    setSaveSceneSucessfull(false);
    setSaveSceneFailure(false);
    setLoadingSceneInfo(false);
    setPopupDelete(false);
    setDeleteSucessfull(false);
    setDeleteFailure(false);
    setPopupView(false);
    setReadOnly(false);
    setPacienteDetail({});
    setPopupEdit(false);
    setEditSucessfull(false);
    setEditFailure(false);
  };

  const getBody = () => {
    return {
      nome: getValue("nome"),
      CPF: getValue("CPF"),
      dataNasc: getValue("dataNasc"),
      endereco: getValue("endereco"),
      cidade: getValue("cidade"),
      UF: getValue("UF"),
      CEP: getValue("CEP"),
      telefone: getValue("telefone"),
      celular: getValue("celular"),
      email: getValue("email"),
      noCarteirinha: getValue("noCarteirinha"),
      dataInclusao: getValue("dataInclusao"),
      validade: getValue("validade"),
      login: getValue("login"),
      senha: getValue("senha"),
    };
  };

  const getValue = (id) => {
    const { value } = document.getElementById(id);
    return value.length > 0 ? value : null;
  };

  const form = () => {
    return (
      <form id="Form-Add-Paciente">
        <div class="form-group">
          <label for="nome">Nome do Paciente</label>
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
            <label for="CPF">CPF</label>
            <input
              type="text"
              class="form-control"
              id="CPF"
              placeholder="CPF"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="dataNasc">Data de Nascimento</label>
            <input
              type="date"
              class="form-control"
              id="dataNasc"
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
          <label for="noCarteirinha">No Carteirinha</label>
          <input
            type="text"
            class="form-control"
            id="noCarteirinha"
            placeholder="Número da carteirinha do paciente"
            readOnly={readOnly}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="dataInclusao">Data Inclusão</label>
            <input
              type="date"
              class="form-control"
              id="dataInclusao"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="validade">Validade</label>
            <input
              type="date"
              class="form-control"
              id="validade"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="login">Login</label>
            <input
              type="text"
              class="form-control"
              id="login"
              placeholder="Login"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="senha">Senha</label>
            <input
              type="text"
              class="form-control"
              id="senha"
              placeholder="Senha"
              readOnly={readOnly}
            />
          </div>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="Paciente-Title">
        <h1>Pacientes</h1>
        <p>
          Novo Paciente{" "}
          <PostAddIcon
            className="Add-Button"
            onClick={() => setOpenPopup(true)}
          />
        </p>
      </div>
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome do Paciente</th>
            <th scope="col">CPF</th>
            <th scope="col">Data Nasc.</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Celular</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((item) => (
            <tr scope="row">
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.CPF}</td>
              <td>{item.dataNasc}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
              <td>{item.celular}</td>
              <td className="td-funcoes">
                <PageviewIcon onClick={() => handleView(item.id)} />
                <EditIcon onClick={() => openPopupEdit(item.id)} />
                <DeleteForeverIcon
                  onClick={() => deletePopup(item.id, item.nome)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Dialog open={openPopup} fullWidth={true}>
          <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          <DialogContent>
            {saveSceneSucessfull && (
              <DialogContentText>
                <CheckOutlinedIcon /> Paciente cadastrado com sucesso!!!
              </DialogContentText>
            )}
            {saveSceneFailure && (
              <DialogContentText>
                <WarningOutlinedIcon /> Falha ao tentar cadastrar paciente,
                verifique os dados e tente novamente!!!
              </DialogContentText>
            )}
            {form()}
          </DialogContent>
          <DialogActions>
            {loadingSceneInfo && <CircularProgress color="secondary" />}
            <Button onClick={() => closePopup()}>Cancelar</Button>
            {saveSceneSucessfull ? (
              <Button onClick={() => closePopup()}>Sair</Button>
            ) : (
              <Button onClick={() => handleSavePaciente()}>Salvar</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={popupDelete} fullWidth={true}>
          <DialogTitle>Deletar Paciente</DialogTitle>
          <DialogContent>
            {deleteSucessfull && (
              <DialogContentText>
                <CheckOutlinedIcon /> Paciente deletado com sucesso!!!
              </DialogContentText>
            )}
            {deleteFailure && (
              <DialogContentText>
                <WarningOutlinedIcon /> Falha ao tentar deletar paciente, tente
                novamente!!!
              </DialogContentText>
            )}
            Você realmente desejar deletar o paciente {pacienteName} (
            {pacienteId})?
          </DialogContent>
          <DialogActions>
            {loadingSceneInfo && <CircularProgress color="secondary" />}
            {deleteSucessfull && (
              <Button onClick={() => closePopup()}>Sair</Button>
            )}
            {!deleteSucessfull && (
              <Button onClick={() => handleDeletePaciente()}>Sim</Button>
            )}
            {!deleteSucessfull && (
              <Button onClick={() => closePopup()}>Não</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={popupView} fullWidth={true}>
          <DialogTitle>Dados do Paciente</DialogTitle>
          <DialogContent>{form()}</DialogContent>
          <DialogActions>
            <Button onClick={() => closePopup()}>Sair</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog open={popupEdit} fullWidth={true}>
          <DialogTitle>Editar Dados do Paciente</DialogTitle>
          <DialogContent>
            {editSucessfull && (
              <DialogContentText>
                <CheckOutlinedIcon /> Paciente atualizado com sucesso!!!
              </DialogContentText>
            )}
            {editFailure && (
              <DialogContentText>
                <WarningOutlinedIcon /> Falha ao tentar atualizar paciente,
                verifique os dados e tente novamente!!!
              </DialogContentText>
            )}
            {form()}
          </DialogContent>
          <DialogActions>
            {loadingSceneInfo && <CircularProgress color="secondary" />}
            <Button onClick={() => closePopup()}>Cancelar</Button>
            {editSucessfull ? (
              <Button onClick={() => closePopup()}>Sair</Button>
            ) : (
              <Button onClick={() => handleEditPaciente()}>Salvar</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Pacientes;
