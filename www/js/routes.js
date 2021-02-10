var routes = [
  {
    path: '/',
    name: 'home',
    keepAlive: true,
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      console.log('Cargando proyectos desde el API...');
      hookapi.Proyectos.getList().then(function (res) {
        var apiProyectos = res.proyectos;
        app.methods.loadUser({
          callback: function (res) {
            resolve(
              {
                componentUrl: './pages/home.html'
              },
              {
                context: {
                  listaProyectos: apiProyectos,
                  user: app.data.user,
                  userEnum: hookapi.Users.USER_TYPES
                }
              }
            );
            app.preloader.hide();
          }
        });
        console.log(`[${apiProyectos.length}] Proyectos cargados!`);
      }, function (err) {
        app.toast.show({ text: 'Proyectos.getList error' });
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/offline.html'
          }
        );
        console.log(err);
      });
    },
    on: {
      pageInit: function (page) {
        console.log("Home page init");
        var searchbar = app.searchbar.create({
          el: '.searchbar',
          searchContainer: '.searchbar-found',
          searchIn: '.card-content',
          on: {
            search(sb, query, previousQuery) {
              console.log(query, previousQuery);
            }
          }
        });
      }
    }
  },
  {
    path: '/panel-component/',
    panel: {
      async(routeTo, routeFrom, resolve, reject) {
        var user = app.data.user;
        if (app.data.categorias) {
          resolve(
            {
              componentUrl: './pages/panel-component.html'
            },
            {
              context: {
                listaCategorias: app.data.categorias,
                user: user,
                userEnum: hookapi.Users.USER_TYPES
              }
            }
          );
        } else {
          app.preloader.show();
          console.log('Cargando categorias desde el API...');
          hookapi.Categorias.getList().then(function (res) {
            var apiCategorias = res.categorias;
            resolve(
              {
                componentUrl: './pages/panel-component.html'
              },
              {
                context: {
                  listaCategorias: apiCategorias,
                  user: user,
                  userEnum: hookapi.Users.USER_TYPES
                }
              }
            );
            app.preloader.hide();
            app.data.categorias = apiCategorias;
            console.log(`[${apiCategorias.length}] Categorias cargadas!`);
          }, function (err) {
            app.dialog.alert('Categorias.getList error', 'Oh... :(');
            console.log(err);
          });
        }
      }
    }
  },
  {
    path: '/pin/',
    componentUrl: './pages/pin.html',
  },
  {
    path: '/notificar/',
    componentUrl: './pages/notificar.html',
  },
  {
    path: '/updateProyecto/:id/',
    async(routeTo, routeFrom, resolve, reject) {
      var proyectoId = routeTo.params.id;
      app.preloader.show();
      hookapi.Proyectos.getFromId(proyectoId).then(function (res) {
        var proyecto = res.proyecto;
        resolve(
          {
            componentUrl: './pages/updateProyecto.html',
          },
          {
            context: {
              proyecto: proyecto
            }
          }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/mapa/',
    componentUrl: './pages/mapa.html',
  },
  {
    path: '/valorar/',
    componentUrl: './pages/valorar.html',
  },
  {
    path: '/votar/:idproyecto',
    name: 'votar',
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      var user = app.data.user;
      var proyectoId = routeTo.params.idproyecto;
      console.log(`Preprando proyecto ${proyectoId}...`);
      hookapi.Proyectos.getFromId(proyectoId).then(function (res) {
        console.log(`Proyecto id: ${proyectoId}. Res:`, res);
        var proyecto = res.proyecto;
        var userId = user.id;
        console.log(`Cargando votacion para proyecto: ${proyectoId} usuario: ${userId}...`);
        hookapi.Votacion.getFromProyectoAndUserId(proyectoId, userId).then(function (res) {
          var votacion = res.votacion;
          resolve(
            {
              componentUrl: './pages/votar.html',
            },
            {
              context: {
                proyecto: proyecto,
                user: user,
                votacion: votacion
              }
            }
          );
          console.log(`Votacion cargada`, res);
          app.preloader.hide();
        });
      });
    }
  },
  {
    path: '/resultados/',
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      console.log(`Cargando resultados desde el API....`);
      hookapi.Votacion.getResultado().then(function (res) {
        hookapi.Votacion.getState().then(function (state) {
          if (app.data.user.type === hookapi.Users.USER_TYPES.ADMIN) {
            app.methods.notification({
              subtitle: 'Votacion',
              text: 'Los resultados estan actualmente ' + (state.votacion.release ? "publicos" : "privados")
            });
          }
          resolve(
            {
              componentUrl: './pages/resultados.html',
            },
            {
              context: {
                resultados: res.resultados,
                votaciones: res.votaciones,
                votacionState: state.votacion,
                user: app.data.user,
                userEnum: hookapi.Users.USER_TYPES
              }
            }
          );
          console.log(`Resultados cargados!`, res);
          app.preloader.hide();
        }, function (err) {
          app.dialog.alert('Votacion.getState error', 'Oh... :(');
          app.preloader.hide();
          console.log(err);
          resolve({
            componentUrl: './pages/404.html'
          });
        });
      }, function (err) {
        app.dialog.alert('Votacion.getResultado error', 'Oh... :(');
        app.preloader.hide();
        console.log(err);
        resolve({
          componentUrl: './pages/404.html'
        });
      })
    }
  },
  {
    path: '/normativa/',
    url: './pages/normativa.html',
  },
  {
    path: '/jurado/',
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      var jurados_type = 1;
      hookapi.Users.getListFromType(jurados_type).then(function (res) {
        app.preloader.hide();
        console.log("Lista de jurados cargada ", res);
        resolve(
          {
            componentUrl: './pages/juradosList.html'
          },
          {
            context: {
              userList: res.users
            }
          }
        );
      });
    }
  },
  {
    path: '/estadistica/',
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      hookapi.getInfo().then(function (res) {
        console.log(`Preparando estadisticas...`);
        resolve(
          {
            componentUrl: './pages/estadisticas.html',
          },
          {
            context: {
              Categorias: res.categorias,
              ProyectosUsuarios: res.tutores,
              Stats: res.stats
            }
          }
        );
        console.log(res);
        app.preloader.hide();
      });

    }
  },
  {
    path: '/proyectos/:idcat/:nombrecat',
    async(routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      var categoriaId = routeTo.params.idcat;
      var categoriaNombre = routeTo.params.nombrecat;
      var user = app.data.user;
      var userEnum = hookapi.Users.USER_TYPES;

      console.log(`Preparando proyectos para el usuario ${user.name} en ${categoriaNombre}...`);

      hookapi.Proyectos.getListFromCategoriaAndUser(categoriaId, user.id).then(function (res) {
        console.log(`Proyectos cargados para ${user.name}, ${res.proyectos.length} listos para ${categoriaNombre}`);
        var MisProyectos = res.proyectos;

        console.log(`Preparando proyectos para la categoria ${categoriaNombre}...`);
        hookapi.Proyectos.getListFromCategoriaId(categoriaId).then(function (res) {
          var Proyectos = res.proyectos;
          if (user.type === userEnum.JURADO) {
            hookapi.Votacion.getListFromUserId(user.id).then(function (res) {
              var misVotaciones = res.votaciones;
              var misVotosIds = misVotaciones.map(function (arr) {
                return arr.id_proyecto
              });
              resolve(
                {
                  componentUrl: './pages/proyectosLista.html',
                },
                {
                  context: {
                    Proyectos: Proyectos,
                    misProyectos: MisProyectos,
                    misVotaciones: misVotaciones,
                    misVotosIds: misVotosIds,
                    Categoria: categoriaNombre,
                    CategoriaId: categoriaId,
                    user: user,
                    userEnum: userEnum
                  }
                }
              );
              console.log(`Proyectos y votaciones cargados para ${categoriaNombre}`);
              app.preloader.hide();
            });
          } else {
            resolve(
              {
                componentUrl: './pages/proyectosLista.html',
              },
              {
                context: {
                  Proyectos: Proyectos,
                  misProyectos: MisProyectos,
                  Categoria: categoriaNombre,
                  CategoriaId: categoriaId,
                  user: user,
                  userEnum: userEnum
                }
              }
            );
            console.log(`Proyectos cargados para ${categoriaNombre}, ${res.proyectos.length} listos`);
            app.preloader.hide();
          }
        });

      });
    }
  },
  {
    path: '/addProyectos/:idcat/',
    componentUrl: './pages/addProyectos.html',
    name: 'addProyecto',
  },
  {
    path: '/newIdea/',
    componentUrl: './pages/newIdea.html',
    name: 'newIdea',
  },
  {
    path: '/newuser/',
    name: 'newuser',
    async(routeTo, routeFrom, resolve, reject) {
      console.log('Cargando categorias desde el API para newuser...');
      app.preloader.show();
      hookapi.Categorias.getList().then(function (res) {
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/newUser.html',
          },
          {
            context: {
              listaCategorias: res.categorias
            }
          }
        );
        console.log(`[${res.categorias.length}] Categorias cargadas!`);
      });
    }
  },
  {
    path: '/userlist/',
    async(routeTo, routeFrom, resolve, reject) {
      console.log('Cargando usuarios...');
      app.preloader.show();
      hookapi.Users.getTokenList().then(function (res) {
        var users = res.users;
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/userlist.html',
          },
          {
            context: {
              users: users,
              userEnum: hookapi.Users.USER_TYPES
            }
          }
        );
        console.log(`Usuarios cargados!`, res);
      });
    }
  },
  {
    path: '/offline/',
    url: './pages/offline.html',
    name: 'offline'
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    componentUrl: './pages/404.html',
  },
];