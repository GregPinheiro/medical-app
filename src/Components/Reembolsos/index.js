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

import SearchPaciente from "../SearchPaciente";
import SearchCirurgia from "../SearchCirurgia";
import SearchMedico from "../SearchMedico";
import SearchHospital from "../SearchHospital";
import SearchConvenio from "../SearchConvenio";
import SearchFornecedor from "../SearchFornecedor";

import pacientesService from "../../services/pacientes.service";
import cirurgiasService from "../../services/cirurgias.service";
import medicosService from "../../services/medicos.service";
import hospitaisService from "../../services/hospitais.service";
import conveniosService from "../../services/convenios.service";
import fornecedoresService from "../../services/fornecedores.service";
import { toDateString } from "../../commom/dateHelper";
import reembolsosService from "../../services/reembolsosService";

function Reembolsos() {
  const [updateTable, setUpdateTable] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reembolsos, setReembolsos] = useState([]);
  const [reembolsoDetail, setReembolsoDetail] = useState({});
  const [reembolsoId, setReembolsoId] = useState(0);
  const [reembolsoName, setReembolsoName] = useState("");
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
  const [popupCirurgia, setPopupCirurgia] = useState(false);
  const [cirurgias, setCirurgias] = useState([]);
  const [cirurgiaDetail, setCirurgiaDetail] = useState({});
  const [medicos, setMedicos] = useState([]);
  const [medicoDetail, setMedicoDetail] = useState({});
  const [popupMedico, setPopupMedico] = useState(false);
  const [popupHospitais, setPopupHospitais] = useState(false);
  const [hospitais, setHospitais] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState({});
  const [popupConvenio, setPopupConvenio] = useState(false);
  const [convenios, setConvenios] = useState([]);
  const [convenioDetail, setConvenioDetail] = useState({});
  const [popupFornecedor, setPopupFornecedor] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorDetail, setFornecedorDetail] = useState({});

  useEffect(() => {
    if (!updateTable) {
      apiRequestPacientes();
      apiRequestCirurgias();
      apiRequestMedicos();
      apiRequestHospitais();
      apiRequestConvenios();
      apiRequestFornecedores();
    }

    apiRequestReembolsos();

    setUpdateTable(false);
  }, [updateTable]);

  useEffect(() => {
    if (pacienteDetail?.nome) {
      loadDetail("pacienteName", pacienteDetail.nome);
      loadDetail("pacienteCPF", pacienteDetail.CPF);
      loadDetail("pacienteDataNasc", pacienteDetail.dataNasc);
    }

    if (cirurgiaDetail?.nome) {
      loadDetail("cirurgiaNome", cirurgiaDetail.nome);
      loadDetail("cirurgiaCID", cirurgiaDetail.CID);
      loadDetail("cirurgiaTUSS", cirurgiaDetail.TUSS);
    }

    if (medicoDetail?.nome) {
      loadDetail("medicoName", medicoDetail.nome);
      loadDetail("medicoEspecialidade", medicoDetail.especialidade);
      loadDetail("medicoCROCRM", medicoDetail.CRO_CRM);
    }

    if (hospitalDetail?.nome) {
      loadDetail("hospitalName", hospitalDetail.nome);
      loadDetail("hospitalUnidade", hospitalDetail.unidade);
      loadDetail("hospitalCNPJ", hospitalDetail.CNPJ);
    }

    if (convenioDetail?.nome) {
      loadDetail("convenioNome", convenioDetail.nome);
      loadDetail("convenioPlano", convenioDetail.plano);
      loadDetail("convenioAcomodacao", convenioDetail.acomodacao);
    }

    if (fornecedorDetail?.nome) {
      loadDetail("fornecedorNome", fornecedorDetail.nome);
      loadDetail("fornecedorCNPJ", fornecedorDetail.CNPJ);
    }

    setUpdateForm(false);
  }, [
    updateForm,
    pacienteDetail,
    cirurgiaDetail,
    medicoDetail,
    hospitalDetail,
    convenioDetail,
    fornecedorDetail,
  ]);

  useEffect(() => {
    if (reembolsoDetail?.id) {
      for (const detail in reembolsoDetail)
        loadDetail(detail, reembolsoDetail[detail]);

      reembolsoDetail.paciente && setPacienteDetail(reembolsoDetail.paciente);

      reembolsoDetail.cirurgia && setCirurgiaDetail(reembolsoDetail.cirurgia);

      reembolsoDetail.medico && setMedicoDetail(reembolsoDetail.medico);

      reembolsoDetail.hospital && setHospitalDetail(reembolsoDetail.hospital);

      reembolsoDetail.convenio && setConvenioDetail(reembolsoDetail.convenio);

      reembolsoDetail.fornecedor &&
        setFornecedorDetail(reembolsoDetail.fornecedor);
    }
  }, [reembolsoDetail]);

  const apiRequestReembolsos = async () => {
    try {
      setLoading(true);

      const response = await reembolsosService.findAll();

      switch (response.status) {
        case 200:
          setReembolsos(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos reembolsos");
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

  const apiRequestCirurgias = async () => {
    try {
      const response = await cirurgiasService.findAll();

      switch (response.status) {
        case 200:
          setCirurgias(response.data);
          break;

        default:
          alert("Falha ao buscar as informações das cirurgias");
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

  const apiRequestConvenios = async () => {
    try {
      const response = await conveniosService.findAll();

      switch (response.status) {
        case 200:
          setConvenios(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos convênios");
      }
    } catch (e) {
      e.response?.data ? alert(e.response.data) : alert(e);
    }
  };

  const apiRequestFornecedores = async () => {
    try {
      const response = await fornecedoresService.findAll();

      switch (response.status) {
        case 200:
          setFornecedores(response.data);
          break;

        default:
          alert("Falha ao buscar as informações dos forncedores");
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

  const selectCirurgia = (e) => {
    setCirurgiaDetail(cirurgias.find(({ id }) => id == e.target.id));
    setPopupCirurgia(false);
    setUpdateForm(true);
  };

  const selectMedico = (e) => {
    setMedicoDetail(medicos.find(({ id }) => id == e.target.id));
    setPopupMedico(false);
    setUpdateForm(true);
  };

  const selectHospital = (e) => {
    setHospitalDetail(hospitais.find(({ id }) => id == e.target.id));
    setPopupHospitais(false);
    setUpdateForm(true);
  };

  const selectConvenio = (e) => {
    setConvenioDetail(convenios.find(({ id }) => id == e.target.id));
    setPopupConvenio(false);
    setUpdateForm(true);
  };

  const selectFornecedor = (e) => {
    setFornecedorDetail(fornecedores.find(({ id }) => id == e.target.id));
    setPopupFornecedor(false);
    setUpdateForm(true);
  };

  const handleSave = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      setNewFailure(true);

      const response = await reembolsosService.create(body);

      switch (response.status) {
        case 201:
          setNewSucessfull(true);
          setUpdateTable(true);
          break;

        default:
          setNewFailure(true);
      }
    } catch (e) {
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

      const response = await reembolsosService.findOne(id);

      switch (response.status) {
        case 200:
          setReembolsoDetail(response.data);
          break;

        default:
          setViewFailure(true);
          alert("Falha ao buscar as informações do reembolso, tente novamente");
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
    setReembolsoId(id);

    try {
      setLoadingEdit(true);

      const response = await reembolsosService.findOne(id);

      switch (response.status) {
        case 200:
          setReembolsoDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar as informações do reembolso, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editReembolso = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await reembolsosService.update(reembolsoId, body);

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
    setReembolsoId(id);
    setReembolsoName(name);
    setPopupDelete(true);
  };

  const deleteReembolso = async () => {
    try {
      setLoadingDelete(true);

      const response = await reembolsosService.delete(reembolsoId);

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
      procedimentoId: cirurgiaDetail.id,
      medicoId: medicoDetail.id,
      hospitalId: hospitalDetail.id,
      convenioId: convenioDetail.id,
      fornecedorId: fornecedorDetail.id,
      dataPedido: getValue("dataPedido"),
      dataCirurgia: getValue("dataCirurgia"),
      valor: getValue("valor"),
      nf: getValue("nf"),
      dataRecebimento: getValue("dataRecebimento"),
      statusId: getValue("statusId"),
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
        <div class="row">
          <div class="col">
            <label for="dataPedido">Data do Pedido</label>
            <input
              type="date"
              class="form-control"
              id="dataPedido"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="statusId">Status</label>
            <select id="statusId" class="form-control" readOnly={readOnly}>
              <option value={1} selected="selected">
                CONTATAR PACIENTE
              </option>
              <option value={2}>ACEITE PACIENTE</option>
              <option value={3}>SOLICITAÇÃO DE PREVIA</option>
              <option value={4}>PREVIA RECEBIDA</option>
              <option value={5}>AGUARDANDO NOTA FISCAL </option>
              <option value={6}>AGUARDANDO DEPOSITO CONVENIO</option>
              <option value={7}>AGUARDANDO DEPOSITO PACIENTE</option>
              <option value={8}>RECEBIDO</option>
              <option value={9}>RECUSADO</option>
            </select>
          </div>
        </div>
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
              placeholder="CPF do paciente"
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
          <label for="cirurgiaNome">Procedimento Cirurgico</label>
          <input
            type="text"
            class="form-control"
            id="cirurgiaNome"
            placeholder="Nome do procedimento cirurgico"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupCirurgia(true)}
            />
          )}
        </div>
        <div class="row">
          <div class="col">
            <label for="cirurgiaCID">CID</label>
            <input
              type="text"
              class="form-control"
              id="cirurgiaCID"
              placeholder="CID"
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="cirurgiaTUSS">TUSS</label>
            <input
              type="text"
              class="form-control"
              id="cirurgiaTUSS"
              placeholder="TUSS"
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
              onClick={() => setPopupMedico(true)}
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
        <div class="form-group" style={{ margin: "30px 0 0" }}>
          <label for="convenioNome">Convênio</label>
          <input
            type="text"
            class="form-control"
            id="convenioNome"
            placeholder="Nome do convênio"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupConvenio(true)}
            />
          )}
        </div>
        <div class="row">
          <div class="col">
            <label for="convenioPlano">Plano</label>
            <input
              type="text"
              class="form-control"
              id="convenioPlano"
              placeholder="Plano"
              readOnly={true}
            />
          </div>
          <div class="col">
            <label for="convenioAcomodacao">Acomodação</label>
            <input
              type="text"
              class="form-control"
              id="convenioAcomodacao"
              placeholder="Acomodação"
              readOnly={true}
            />
          </div>
        </div>
        <div class="form-group" style={{ margin: "30px 0 0" }}>
          <label for="fornecedorNome">Fornecedor</label>
          <input
            type="text"
            class="form-control"
            id="fornecedorNome"
            placeholder="Nome do fornecedor"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupFornecedor(true)}
            />
          )}
        </div>
        <div class="form-group">
          <label for="fornecedorCNPJ">CNPJ do Fornecedor</label>
          <input
            type="text"
            class="form-control"
            id="fornecedorCNPJ"
            placeholder="CNPJ do fornecedor"
            readOnly={true}
          />
        </div>
        <div class="row">
          <div class="col">
            <label for="dataCirurgia">Data da Cirurgia</label>
            <input
              type="date"
              class="form-control"
              id="dataCirurgia"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="valor">Valor do Reembolo (R$)</label>
            <input
              type="number"
              step="0.01"
              class="form-control"
              id="valor"
              placeholder="Valor do Reembolso"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="dataRecebimento">Data de Recebimento</label>
            <input
              type="date"
              class="form-control"
              id="dataRecebimento"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="nf">Número da Nota Fiscal</label>
            <input
              type="number"
              step="1"
              class="form-control"
              id="nf"
              placeholder="Número da Not Fiscal"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <textarea
            class="form-control"
            id="status"
            placeholder="Status"
            rows="6"
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
    setCirurgiaDetail({});
    setMedicoDetail({});
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Reembolsos</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Novo Reembolso{" "}
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
            <th scope="col">Data Pedido</th>
            <th scope="col">Status</th>
            <th scope="col">Paciente</th>
            <th scope="col">Procedimento</th>
            <th scope="col">Médico</th>
            <th scope="col">Hospital</th>
            <th scope="col">Convênio</th>
            <th scope="col">Fornecedor</th>
            <th scope="col">Valor</th>
            <th scope="col">Função</th>
          </tr>
        </thead>
        <tbody>
          {reembolsos.map((item) => (
            <tr>
              <th scope="row">{item.id}</th>
              <td>{toDateString(item.dataPedido)}</td>
              <td>{item.statusDetail?.description}</td>
              <td>{item.paciente?.nome}</td>
              <td>{item.cirurgia?.nome}</td>
              <td>{item.medico?.nome}</td>
              <td>{item.hospital?.nome}</td>
              <td>{item.convenio?.nome}</td>
              <td>{item.fornecedor?.nome}</td>
              <td>{`R$ ${parseFloat(item.valor).toFixed(2)}`}</td>
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
                  onClick={() => handleDelete(item.id, item.paciente?.nome)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={popupNew} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Cadastrar Novo Reembolso</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Reembolso cadastrada com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar reembolso,
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
      <SearchPaciente
        open={popupPaciente}
        pacientes={pacientes}
        selectPaciente={selectPaciente}
      />
      <SearchCirurgia
        open={popupCirurgia}
        cirurgias={cirurgias}
        selectCirurgia={selectCirurgia}
      />
      <SearchMedico
        open={popupMedico}
        medicos={medicos}
        selectMedico={selectMedico}
      />
      <SearchHospital
        open={popupHospitais}
        hospitais={hospitais}
        selectHospital={selectHospital}
      />
      <SearchConvenio
        open={popupConvenio}
        convenios={convenios}
        selectConvenio={selectConvenio}
      />
      <SearchFornecedor
        open={popupFornecedor}
        fornecedores={fornecedores}
        selectFornecedor={selectFornecedor}
      />
      <Dialog open={popupView} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Dados do Reembolso</DialogTitle>
        <DialogContent>
          {viewFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao carregar os dados do reembolso
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
        <DialogTitle>Editar Dados do Reembolso</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Reembolso editado com sucesso!!!
            </DialogContentText>
          )}
          {editFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar editar reembolso,
              verifique os dados e tente novamente!!!
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
            <Button onClick={() => editReembolso()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={popupDelete} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Deletar Reembolso</DialogTitle>
        <DialogContent>
          {deleteSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Reembolso deletada com sucesso!!!
            </DialogContentText>
          )}
          {deleteFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar deletar reembolso,
              verifique os dados e tente novamente!!!
            </DialogContentText>
          )}
          Você realmente deseja deletar o reembolso do(a) {reembolsoName} (
          {reembolsoId}
          )?
        </DialogContent>
        <DialogActions>
          {loadingDelete && <CircularProgress color="secondary" />}
          {deleteSucessfull && (
            <Button onClick={() => closePopup()}>Sair</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => deleteReembolso()}>Sim</Button>
          )}
          {!deleteSucessfull && (
            <Button onClick={() => closePopup()}>Não</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Reembolsos;
