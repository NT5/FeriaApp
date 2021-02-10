// Cargar despues de app.js

var hookapi = {
    request: Framework7.request,
    base_url: "https://hook.app.nt5.pw",

    get: function (_path) {
        return hookapi.request.promise.json(`${hookapi.base_url}/api/${_path}`);
    },

    post: function (_path, _data) {
        return hookapi.request.promise.post(`${hookapi.base_url}/api/${_path}`, _data, 'json');
    },

    getInfo: function () {
        return hookapi.get('info');
    },

    getMeUiid: function () {
        return hookapi.get('registre_uuid');
    },

    Categorias: {
        getList: function () {
            return hookapi.get('categorias/getList');
        },
        getFromId: function (_id) {
            return hookapi.post('categorias/getFromId', {
                id: _id
            });
        },
        getFromUserId: function (_user_id) {
            return hookapi.post('categorias/getListFromUserId', {
                user_id: _user_id
            });
        }
    },

    Notificaciones: {
        sendToAll: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.title = data.title || "Title";
            data.text = data.text || "Text";

            return hookapi.post('push/sendToAll', {
                session_token: data.session_token,
                title: data.title,
                text: data.text
            });
        }
    },

    Carreras: {
        getList: function () {
            return hookapi.get('carreras/getList');
        },
        getFromId: function (_id) {
            return hookapi.post('carreras/getFromId', {
                id: _id
            });
        }
    },

    Asignaturas: {
        getList: function () {
            return hookapi.get('asignaturas/getList');
        },
        getFromId: function (_id) {
            return hookapi.post('asignaturas/getFromId', {
                id: _id
            });
        },
        getFromCarreraNivel: function (_carrera_id, _carrera_nivel) {
            return hookapi.post('asignaturas/getFromCarreraNivel', {
                carrera_id: _carrera_id,
                carrera_nivel: _carrera_nivel
            });
        }
    },

    ProyectosIdeas: {
        registreIdea: function (data) {
            data = (typeof data !== "object") ? {} : data;

            return hookapi.post('ideas/registerIdea', data);
        }
    },

    Valoraciones: {
        registreValoracion: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.score = data.score || 0;
            data.uuid = data.uuid || device.uuid || device.platform;

            return hookapi.post('valoraciones/registerValoracion', {
                uuid: data.uuid,
                score: data.score
            });
        }
    },

    Proyectos: {
        getList: function () {
            return hookapi.get('proyectos/getList');
        },
        getListFromUserId: function (_user_id) {
            return hookapi.post('proyectos/getListFromUserId', {
                user_id: _user_id
            });
        },
        getFromId: function (_id) {
            return hookapi.post('proyectos/getFromId', {
                id: _id
            });
        },
        getListFromCategoriaId: function (_categoria_id) {
            return hookapi.post('proyectos/getListFromCategoriaId', {
                categoria_id: _categoria_id
            });
        },
        getListFromCategoriaAndUser: function (_categoria_id, _user_id) {
            return hookapi.post('proyectos/getListFromCategoriaAndUser', {
                categoria_id: _categoria_id,
                user_id: _user_id
            });
        },
        registreProyecto: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.nombreProyecto = data.nombreProyecto || 'No definido';
            data.descripcionProyecto = data.descripcionProyecto || 'No definido';
            data.requiereInternet = data.requiereInternet || 0;
            data.requiereElectricidad = data.requiereElectricidad || 0;
            data.esInvestigacion = data.esInvestigacion || 0;
            data.idCarrera = data.idCarrera || 1;
            data.idAsignatura = data.idAsignatura || 1;
            data.idCategoria = data.idCategoria || 1;

            return hookapi.post('proyectos/registerProyecto', {
                session_token: data.session_token,
                nombreProyecto: data.nombreProyecto,
                descripcionProyecto: data.descripcionProyecto,
                requiereInternet: data.requiereInternet,
                requiereElectricidad: data.requiereElectricidad,
                esInvestigacion: data.esInvestigacion,
                idCarrera: data.idCarrera,
                idAsignatura: data.idAsignatura,
                idCategoria: data.idCategoria
            });
        },
        likeProyecto: function (id) {
            var device_uuid = device.uuid || device.platform;
            return hookapi.post('proyectos/likeProyecto', {
                id: id,
                device_uuid: device_uuid
            });
        },
        dislikeProyecto: function (id) {
            return hookapi.post('proyectos/dislikeProyecto', {
                id: id
            });
        },
        updateProyecto: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.IdProyecto = data.IdProyecto || 0;
            data.nombreProyecto = data.nombreProyecto || 'No definido';
            data.descripcionProyecto = data.descripcionProyecto || 'No definido';
            data.requiereInternet = data.requiereInternet || 0;
            data.requiereElectricidad = data.requiereElectricidad || 0;
            data.esInvestigacion = data.esInvestigacion || 0;
            data.idCarrera = data.idCarrera || 1;
            data.idAsignatura = data.idAsignatura || 1;

            return hookapi.post('proyectos/updateProyecto', {
                session_token: data.session_token,
                idProyecto: data.IdProyecto,
                nombreProyecto: data.nombreProyecto,
                descripcionProyecto: data.descripcionProyecto,
                requiereInternet: data.requiereInternet,
                requiereElectricidad: data.requiereElectricidad,
                esInvestigacion: data.esInvestigacion,
                idCarrera: data.idCarrera,
                idAsignatura: data.idAsignatura,
            });
        },
        removeFromId: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.id = data.id || 0;

            return hookapi.post('proyectos/removeFromId', {
                session_token: data.session_token,
                id: data.id,
            });
        }
    },

    Votacion: {
        getFromId: function (_id) {
            return hookapi.post('votacion/getFromId', {
                id: _id
            });
        },
        removeFromProyectoAndUserId: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.user_id = data.user_id || (app.data.user.id || 0);
            data.proyecto_id = data.proyecto_id || 0;

            return hookapi.post('votacion/removeFromProyectoAndUserId', {
                session_token: data.session_token,
                user_id: data.user_id,
                proyecto_id: data.proyecto_id
            });
        },
        getState: function () {
            return hookapi.get('votacion/getState');
        },
        setState: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.state = data.state || false;

            switch (data.state) {
                case true:
                    data.state = "enable";
                    break;
                default:
                    data.state = "disable";
                    break;
            }
            return hookapi.post('votacion/setState', {
                session_token: data.session_token,
                state: data.state
            });
        },
        getListFromUserId: function (_user_id) {
            return hookapi.post('votacion/getListFromUserId', {
                user_id: _user_id
            });
        },
        getFromProyectoAndUserId: function (_proyecto_id, _user_id) {
            return hookapi.post('votacion/getFromProyectoAndUserId', {
                proyecto_id: _proyecto_id,
                user_id: _user_id
            });
        },
        getListFromProyectoId: function (_proyecto_id) {
            return hookapi.post('votacion/getListFromProyectoId', {
                proyecto_id: _proyecto_id
            });
        },
        getResultado: function () {
            return hookapi.get('votacion/getResultados');
        },
        registerVotacion: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.id_proyecto = data.id_proyecto || 0;
            data.documento_score_1 = data.documento_score_1 || 0;
            data.documento_score_2 = data.documento_score_2 || 0;
            data.documento_score_3 = data.documento_score_3 || 0;
            data.documento_score_4 = data.documento_score_4 || 0;
            data.pertinencia_score_1 = data.pertinencia_score_1 || 0;
            data.pertinencia_score_2 = data.pertinencia_score_2 || 0;
            data.pertinencia_score_3 = data.pertinencia_score_3 || 0;
            data.pertinencia_score_4 = data.pertinencia_score_4 || 0;
            data.creativad_innovacion_score_1 = data.creativad_innovacion_score_1 || 0;
            data.creativad_innovacion_score_2 = data.creativad_innovacion_score_2 || 0;
            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);

            return hookapi.post('votacion/registerVotacion', {
                session_token: data.session_token,
                id_proyecto: data.id_proyecto,
                documento_score_1: data.documento_score_1,
                documento_score_2: data.documento_score_2,
                documento_score_3: data.documento_score_3,
                documento_score_4: data.documento_score_4,
                pertinencia_score_1: data.pertinencia_score_1,
                pertinencia_score_2: data.pertinencia_score_2,
                pertinencia_score_3: data.pertinencia_score_3,
                pertinencia_score_4: data.pertinencia_score_4,
                creativad_innovacion_score_1: data.creativad_innovacion_score_1,
                creativad_innovacion_score_2: data.creativad_innovacion_score_2
            });
        }
    },

    Users: {
        USER_TYPES: {
            JURADO: 1,
            TUTOR: 2,
            ADMIN: 3,
            INVITADO: 0
        },
        getFromToken: function (_token) {
            return hookapi.post('users/getFromToken', {
                token: _token
            });
        },
        getLogin: function (_token) {
            return hookapi.post('users/getLogin', {
                token: _token
            });
        },
        getSession: function (_session_token) {
            return hookapi.post('users/getSession', {
                session_token: _session_token
            });
        },
        getListFromType: function (_user_type) {
            return hookapi.post('users/getListFromType', {
                user_type: _user_type
            });
        },
        getTokenList: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);

            return hookapi.post('users/getTokenList', {
                session_token: data.session_token,
            });
        },
        registerUser: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.name = data.name || 'No definido';
            data.phone = data.phone || 0;
            data.make_token = data.make_token || 0;

            return hookapi.post('users/registerUser', data);
        },
        removeUser: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.user_id = data.user_id || 0;

            return hookapi.post('users/removeFromId', {
                session_token: data.session_token,
                user_id: data.user_id,
            });
        },
        updateUserName: function (data) {
            data = (typeof data !== "object") ? {} : data;

            data.session_token = data.session_token || (app.data.appDataStore.config.sessionToken || 0);
            data.user_id = data.user_id || 0;
            data.user_name = data.user_name || 'No definido';

            return hookapi.post('users/updateFullName', {
                session_token: data.session_token,
                user_id: data.user_id,
                name: data.user_name
            });
        },
        defineUserType: function (_type) {
            var userEnum = hookapi.Users.USER_TYPES;
            switch (_type) {
                case userEnum.JURADO:
                    return 'Jurado';
                case userEnum.TUTOR:
                    return 'Tutor';
                case userEnum.ADMIN:
                    return 'Super Admin';
                default:
                    return 'No defino';
            }
        }
    }

}