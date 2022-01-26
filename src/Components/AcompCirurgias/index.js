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

import acompCirurgiasService from "../../services/acompCirurgias.service";
import pacientesService from "../../services/pacientes.service";
import conveniosService from "../../services/convenios.service";
import cirurgiasService from "../../services/cirurgias.service";
import hospitaisService from "../../services/hospitais.service";

import SearchPaciente from "../SearchPaciente";
import SearchConvenio from "../SearchConvenio";
import SearchCirurgia from "../SearchCirurgia";
import SearchHospital from "../SearchHospital";

function AcompCirurgias() {
  const [updateTable, setUpdateTable] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [datasDetail, setDatasDetail] = useState({});
  const [dataId, setDataId] = useState(0);
  const [dataName, setDataName] = useState("");
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
  const [popupConvenio, setPopupConvenio] = useState(false);
  const [convenios, setConvenios] = useState([]);
  const [convenioDetail, setConvenioDetail] = useState({});
  const [popupCirurgia, setPopupCirurgia] = useState(false);
  const [cirurgias, setCirurgias] = useState([]);
  const [cirurgiaDetail, setCirurgiaDetail] = useState({});
  const [popupHospital, setPopupHospital] = useState(false);
  const [hospitais, setHospitais] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState({});

  useEffect(() => {
    apiRequestAcompCirurgias();
    apiRequestPacientes();
    apiRequestConvenios();
    apiRequestCirurgias();
    apiRequestHospitais();
    setUpdateTable(false);
  }, [updateTable]);

  useEffect(() => {
    if (pacienteDetail) {
      loadDetail("pacienteName", pacienteDetail.nome);
      loadDetail("pacienteCPF", pacienteDetail.CPF);
      loadDetail("pacienteDataNasc", pacienteDetail.dataNasc);

      !convenioDetail.nome &&
        pacienteDetail.convenio &&
        setConvenioDetail(
          convenios.find(({ id }) => id == pacienteDetail.convenio.id)
        );

      !hospitalDetail.nome &&
        pacienteDetail.convenio &&
        pacienteDetail.convenio.hospitais &&
        pacienteDetail.convenio.hospitais.length > 0 &&
        setHospitalDetail(
          hospitais.find(
            ({ id }) => id == pacienteDetail.convenio.hospitais[0].id
          )
        );
    }
    if (convenioDetail) {
      loadDetail("convenioNome", convenioDetail.nome);
      loadDetail("convenioPlano", convenioDetail.plano);
      loadDetail("convenioAcomodacao", convenioDetail.acomodacao);
    }
    if (cirurgiaDetail) {
      loadDetail("cirurgiaNome", cirurgiaDetail.nome);
      loadDetail("cirurgiaCID", cirurgiaDetail.CID);
      loadDetail("cirurgiaTUSS", cirurgiaDetail.TUSS);
    }
    if (hospitalDetail) {
      loadDetail("hospitalNome", hospitalDetail.nome);
      loadDetail("hospitalUnidade", hospitalDetail.unidade);
      loadDetail("hospitalCNPJ", hospitalDetail.CNPJ);
    }

    setUpdateForm(false);
  }, [
    updateForm,
    pacienteDetail,
    convenioDetail,
    cirurgiaDetail,
    hospitalDetail,
  ]);

  useEffect(() => {
    if (datasDetail) {
      for (const detail in datasDetail) {
        loadDetail(detail, datasDetail[detail]);
      }
      setPacienteDetail(datasDetail.paciente);
      setConvenioDetail(datasDetail.convenio);
      setCirurgiaDetail(datasDetail.cirurgia);
      setHospitalDetail(datasDetail.hospital);
    }
  }, [datasDetail]);

  const apiRequestAcompCirurgias = async () => {
    try {
      setLoading(true);

      const response = await acompCirurgiasService.findAll();

      switch (response.status) {
        case 200:
          setDatas(response.data);
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

  const selectConvenio = (e) => {
    setConvenioDetail(convenios.find(({ id }) => id == e.target.id));
    setPopupConvenio(false);
    setUpdateForm(true);
  };

  const selectCirurgia = (e) => {
    setCirurgiaDetail(cirurgias.find(({ id }) => id == e.target.id));
    setPopupCirurgia(false);
    setUpdateForm(true);
  };

  const selectHospital = (e) => {
    setHospitalDetail(hospitais.find(({ id }) => id == e.target.id));
    setPopupHospital(false);
    setUpdateTable(true);
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

  const handleSaveCirurgia = async () => {
    const body = getBody();

    try {
      setLoadingNew(true);

      const response = await acompCirurgiasService.create(body);

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

      const response = await acompCirurgiasService.findOne(id);

      switch (response.status) {
        case 200:
          setDatasDetail(response.data);
          break;

        default:
          setViewFailure(true);
          alert("Falha ao buscar as informações da cirurgia, tente novamente");
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
    setDataId(id);

    try {
      setLoadingEdit(true);

      const response = await acompCirurgiasService.findOne(id);

      switch (response.status) {
        case 200:
          setDatasDetail(response.data);
          break;

        default:
          setEditFailure(true);
          alert(
            "Falha ao buscar as informações da cirurgia, tente novamente mais tarde"
          );
      }
    } catch (e) {
      setEditFailure(true);
      e.response?.data ? alert(e.response.data) : alert(e);
    } finally {
      setLoadingEdit(false);
    }
  };

  const editCirurgia = async () => {
    const body = getBody();

    try {
      setLoadingEdit(true);

      const response = await acompCirurgiasService.update(dataId, body);

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
    setDataId(id);
    setDataName(name);
    setPopupDelete(true);
  };

  const deleteCirurgia = async () => {
    try {
      setLoadingDelete(true);

      const response = await acompCirurgiasService.delete(dataId);

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
      convenioId: convenioDetail.id,
      cirurgiaId: cirurgiaDetail.id,
      hospitalId: hospitalDetail.id,
      dataPrevista: getValue("dataPrevista"),
      reserva: getValue("reserva"),
      dataAprovacao: getValue("dataAprovacao"),
      dataCirurgia: getValue("dataCirurgia"),
      status: getValue("status"),
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
          <label for="hospitalNome">Hospital</label>
          <input
            type="text"
            class="form-control"
            id="hospitalNome"
            placeholder="Nome do hospital"
            readOnly={true}
          />
          {(popupNew || popupEdit) && (
            <SearchIcon
              style={{ cursor: "pointer" }}
              onClick={() => setPopupHospital(true)}
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
            <label for="dataPrevista">Data Prevista</label>
            <input
              type="date"
              class="form-control"
              id="dataPrevista"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="reservas">Reserva</label>
            <input
              type="number"
              class="form-control"
              id="reserva"
              placeholder="Reserva"
              readOnly={readOnly}
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="dataAprovacao">Data Aprovação</label>
            <input
              type="date"
              class="form-control"
              id="dataAprovacao"
              readOnly={readOnly}
            />
          </div>
          <div class="col">
            <label for="dataCirurgia">Data Cirurgia</label>
            <input
              type="date"
              class="form-control"
              id="dataCirurgia"
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
    setConvenioDetail({});
    setCirurgiaDetail({});
    setHospitalDetail({});
  };

  return (
    <>
      <div className="Medicos-Title">
        <h1>Acomp. Cirurgias</h1>
        {loading && <CircularProgress color="secondary" />}
        <p>
          Novo Acomp. Cirurgia{" "}
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
            <th scope="col">Convênio</th>
            <th scope="col">Plano</th>
            <th scope="col">Cirurgia</th>
            <th scope="col">Hospital</th>
            <th scope="col">Funções</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((item) => (
            <tr>
              <th scope="row">{item.id}</th>
              <td>{item.paciente?.nome}</td>
              <td>{item.convenio?.nome}</td>
              <td>{item.convenio?.plano}</td>
              <td>{item.cirurgia?.nome}</td>
              <td>{item.hospital?.nome}</td>
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
        <DialogTitle>Cadastrar Nova Cirurgia</DialogTitle>
        <DialogContent>
          {newSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Cirurgia cadastrada com sucesso!!!
            </DialogContentText>
          )}
          {newFailure && (
            <DialogContentText>
              <WarningOutlinedIcon /> Falha ao tentar cadastrar cirurgia,
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
            <Button onClick={() => handleSaveCirurgia()}>Salvar</Button>
          )}
        </DialogActions>
      </Dialog>
      <SearchPaciente
        open={popupPaciente}
        pacientes={pacientes}
        selectPaciente={selectPaciente}
      />
      <SearchConvenio
        open={popupConvenio}
        convenios={convenios}
        selectConvenio={selectConvenio}
      />
      <SearchCirurgia
        open={popupCirurgia}
        cirurgias={cirurgias}
        selectCirurgia={selectCirurgia}
      />
      <SearchHospital
        open={popupHospital}
        hospitais={hospitais}
        selectHospital={selectHospital}
      />
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
          {loadingView && <CircularProgress color="secondary" />}
          <Button onClick={() => closePopup()}>Sair</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupEdit} fullWidth={true} maxWidth={"md"}>
        <DialogTitle>Editar Dados da Cirurgia</DialogTitle>
        <DialogContent>
          {editSucessfull && (
            <DialogContentText>
              <CheckOutlinedIcon /> Cirurgia editado com sucesso!!!
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
          Você realmente deseja deletar a cirurgia do(a) {dataName} ({dataId}
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

export default AcompCirurgias;
