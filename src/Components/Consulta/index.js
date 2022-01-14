import React, { useState, useEffect } from "react";
import {
  Pageview as PageviewIcon,
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
  WarningOutlined as WarningOutlinedIcon,
  CheckOutlined as CheckOutlinedIcon,
  PostAdd as PostAddIcon,
  DeviceHub as DeviceHubIcon,
  Search as SearchIcon,
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

import PacienteTable from "./Pacientes";
import MedicoTable from "./Medicos";
import HospitalTable from "./Hospitais";

import consultasService from "../../services/consultas.service";
import pacientesService from "../../services/pacientes.service";
import medicosService from "../../services/medicos.service";
import hospitaisService from "../../services/hospitais.service";
import { toDateString } from "../../commom/dateHelper";

function Consultas() {
  const [updateTable, setUpdateTable] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [consultaDetail, setConsultaDetail] = useState({});
  const [consultaId, setConsultaId] = useState(0);
  const [consultaName, setConsultaName] = useState("");
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
  const [popupPaciente, setPopupPaciente] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteDetail, setPacienteDetail] = useState({});
  const [popupMedicos, setPopupMedicos] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [medicoDetail, setMedicoDetail] = useState({});
  const [popupHospitais, setPopupHospitais] = useState(false);
  const [hospitais, setHospitais] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState({});

  useEffect(() => {
    apiRequestConsultas();
    apiRequestPacientes();
    apiRequestMedicos();
    apiRequestHospitais();
    setUpdateTable(false);
  }, [updateTable]);

  useEffect(() => {
    if (pacienteDetail) {
      loadDetail("pacienteName", pacienteDetail.nome);
      loadDetail("pacienteCPF", pacienteDetail.CPF);
      loadDetail("pacienteDataNasc", pacienteDetail.dataNasc);
    }

    if (medicoDetail) {
      loadDetail("medicoName", medicoDetail.nome);
      loadDetail("medicoEspecialidade", medicoDetail.especialidade);
      loadDetail("medicoCROCRM", medicoDetail.CRO_CRM);
    }

    if (hospitalDetail) {
      loadDetail("hospitalName", hospitalDetail.nome);
      loadDetail("hospitalUnidade", hospitalDetail.unidade);
      loadDetail("hospitalCNPJ", hospitalDetail.CNPJ);
    }

    setUpdateForm(false);
  }, [updateForm, pacienteDetail, medicoDetail, hospitalDetail]);

  useEffect(() => {
    if (consultaDetail) {
      for (const detail in consultaDetail) {
        loadDetail(detail, consultaDetail[detail]);
      }
      setPacienteDetail(consultaDetail.paciente);
      setMedicoDetail(consultaDetail.medico);
      setHospitalDetail(consultaDetail.hospital);
    }
  }, [consultaDetail]);

  const apiRequestConsultas = async () => {
    try {
      setLoading(true);
      const response = await consultasService.findAll();

      switch (response.status) {
        case 200:
          setConsultas(response.data);
          break;

        default:
          alert(
            "Não foi possível carregar os dados, tente novamente mais tarde"
          );
      }
    } catch (e) {
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoading(false);
    }
  };

  const apiRequestPacientes = async () => {
    try {
      const response = await pacientesService.findAll();

      switch (response.status) {
        case 200:
          setPacientes(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos pacientes");
      }
    } catch (e) {
      e.response?.data ? alert(e.response.data) : alert(e);
    }
  };

  const apiRequestMedicos = async () => {
    try {
      const response = await medicosService.findAll();

      switch (response.status) {
        case 200:
          setMedicos(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos médicos");
      }
    } catch (e) {
      e.response?.data ? alert(e.response.data) : alert(e);
    }
  };

  const apiRequestHospitais = async () => {
    try {
      const response = await hospitaisService.findAll();

      switch (response.status) {
        case 200:
          setHospitais(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos hospitais");
      }
    } catch (e) {
      e.response?.data ? alert(e.response.data) : alert(e);
    }
  };

  const selectPaciente = (e) => {
    setPacienteDetail(pacientes.find(({ id }) => id == e.target.id));
    setPopupPaciente(false);
    setUpdateForm(true);
  };

  const selectMedico = (e) => {
    setMedicoDetail(medicos.find(({ id }) => id == e.target.id));
    setPopupMedicos(false);
    setUpdateForm(true);
  };

  const selectHospital = (e) => {
    setHospitalDetail(hospitais.find(({ id }) => id == e.target.id));
    setPopupHospitais(false);
    setUpdateForm(true);
  };

  const handleSaveConsulta = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await consultasService.create(body);

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

      const response = await consultasService.findOne(id);

      switch (response.status) {
        case 200:
          setConsultaDetail(response.data);
          break;

        default:
          setViewFailure(true);
          alert("Falha ao buscar as informações da consulta, tente novamente");
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
    setConsultaId(id);

    try {
      setLoadingEdit(true);

      const response = await consultasService.findOne(id);

      switch (response.status) {
        case 200:
          setConsultaDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar as informações da consulta, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editConsulta = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await consultasService.update(consultaId, body);

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
    setConsultaId(id);
    setConsultaName(name);
    setPopupDelete(true);
  };

  const deleteConsulta = async () => {
    try {
      setLoadingDelete(true);

      const response = await consultasService.delete(consultaId);

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
      pacienteId: pacienteDetail.id,
      medicoId: medicoDetail.id,
      hospitalId: hospitalDetail.id,
      dataConsulta: getValue("dataConsulta"),
      historicoDoenca: getValue("historicoDoenca"),
      historicoSaude: getValue("historicoSaude"),
      exameFisico: getValue("exameFisico"),
      diagnostico: getValue("diagnostico"),
      exames: getValue("exames"),
      status: getValue("status"),
    };
  };

  const getValue = (id) => {
    const { value } = document.getElementById(id);
    return value.length > 0 ? value : null;
  };

  const loadDetail = (element, newValue) => {
    const item = document.getElementById(element);

    if (item) {
      if (item.type === "date" && newValue) {
        const date = new Date(newValue);
        item.value = date.toISOString().substr(0, 10);
      } else {
        item.value = newValue ? newValue : "";
      }
    }
  };

  const form = () => {
    return (
      <form id="Form-Add-Paciente">
        <div class="form-group">
          <label for="pacienteName">Nome do Paciente</label>
          <input
            type="text"
            class="form-control"
            id="pacienteName"
            placeholder="Nome do paciente"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupPaciente(true)}
            />
          )}
        </div>
        <div class="row">
          <div class="col">
            <label for="pacienteCPF">CPF</label>
            <input
              type="text"
              class="form-control"
              id="pacienteCPF"
              placeholder="CPF"
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="pacienteDataNasc">Data de Nascimento</label>
            <input
              type="date"
              class="form-control"
              id="pacienteDataNasc"
              readOnly={true}
            />
          </div>
        </div>
        <div class="form-group" style={{ margin: "30px 0 0" }}>
          <label for="medicoName">Nome do Médico</label>
          <input
            type="text"
            class="form-control"
            id="medicoName"
            placeholder="Nome do médico"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupMedicos(true)}
            />
          )}
        </div>
        <div class="row">
          <div class="col">
            <label for="medicoEspecialidade">Especialidade</label>
            <input
              type="text"
              class="form-control"
              id="medicoEspecialidade"
              placeholder="Especialidade"
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="medicoCROCRM">CRO|CRM</label>
            <input
              type="text"
              class="form-control"
              id="medicoCROCRM"
              placeholder="CRO|CRM"
              readOnly={true}
            />
          </div>
        </div>
        <div class="form-group" style={{ margin: "30px 0 0" }}>
          <label for="hospitalName">Nome do Hospital</label>
          <input
            type="text"
            class="form-control"
            id="hospitalName"
            placeholder="Nome do hospital"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupHospitais(true)}
            />
          )}
        </div>
        <div class="row">
          <div class="col">
            <label for="hospitalUnidade">Unidade</label>
            <input
              type="text"
              class="form-control"
              id="hospitalUnidade"
              placeholder="Unidade"
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="hospitalCNPJ">CNPJ</label>
            <input
              type="text"
              class="form-control"
              id="hospitalCNPJ"
              placeholder="CNPJ"
              readOnly={true}
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="dataConsulta">Data da Consulta</label>
            <input
              type="date"
              class="form-control"
              id="dataConsulta"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="historicoDoenca">Histórico da Doença</label>
          <textarea
            class="form-control"
            id="historicoDoenca"
            placeholder="Histórico da Doença"
            rows="3"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="historicoSaude">Histórico de Saúde</label>
          <textarea
            class="form-control"
            id="historicoSaude"
            placeholder="Histórico de Saúde"
            rows="3"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="exameFisico">Exame Físico</label>
          <textarea
            class="form-control"
            id="exameFisico"
            placeholder="Exame Físico"
            rows="3"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="diagnostico">Diagnótico</label>
          <textarea
            class="form-control"
            id="diagnostico"
            placeholder="Diagnótico"
            rows="3"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="exames">Exames</label>
          <textarea
            class="form-control"
            id="exames"
            placeholder="Exames"
            rows="3"
            cols="50"
            readOnly={readOnly}
          />
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <textarea
            class="form-control"
            id="status"
            placeholder="Status"
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

    setPacienteDetail({});
    setMedicoDetail({});
    setHospitalDetail({});
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Consultas</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Nova Consulta{" "}
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
            <th scope="col">Paciente</th>
            <th scope="col">Médico</th>
            <th scope="col">Hospital</th>
            <th scope="col">Data Consulta</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((item) => (
            <tr>
              <th scope="row">{item.id}</th>
              <td>{item.paciente.nome}</td>
              <td>{item.medico.nome}</td>
              <td>{item.hospital.nome}</td>
              <td>{toDateString(item.dataConsulta)}</td>
              <td className="td-funcoes">
                <PageviewIcon
                  titleAccess="Visualizar"
                  onClick={() => handleView(item.id)}
                />
                <EditIcon
                  titleAccess="Editar"
                  onClick={() => handleEdit(item.id)}
                />
                <DeleteForeverIcon
                  titleAccess="Deletar"
                  onClick={() => handleDelete(item.id, item.paciente.nome)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={popupNew} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Cadastrar Nova Consulta</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Consulta cadastrada com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar consulta,
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
            <Button onClick={() => handleSaveConsulta()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <PacienteTable
        open={popupPaciente}
        pacientes={pacientes}
        selectPaciente={selectPaciente}
      />
      <MedicoTable
        open={popupMedicos}
        medicos={medicos}
        selectMedico={selectMedico}
      />
      <HospitalTable
        open={popupHospitais}
        hospitais={hospitais}
        selectHospital={selectHospital}
      />
      <Dialog open={popupView} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Dados da Consulta</DialogTitle>
        <DialogContent>
          {viewFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao carregar os dados da consulta
            </DialogContentText>
          )}
          {form()}
        </DialogContent>
        <DialogActions>
          {loadingView && <CircularProgress color="secondary" />}
          <Button onClick={() => closePopup()}>Sair</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupEdit} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Editar Dados da Consulta</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Consulta editado com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar consulta, verifique
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
            <Button onClick={() => editConsulta()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Deletar Consulta</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Consulta deletada com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar consulta,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar a consulta do(a) {consultaName} (
          {consultaId}
          )?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => deleteConsulta()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Consultas;
