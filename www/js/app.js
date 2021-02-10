// Dom7
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}
moment.locale("es");

// Init App
var app = new Framework7({
  id: 'pw.nt5.feriaapp',
  root: '#app',
  theme: theme,
  toast: {
    closeTimeout: 3000,
    closeButton: true,
  },
  dialog: {
    title: 'Feria UML 2019',
    buttonOk: 'Aceptar',
    buttonCancel: 'Cancelar'
  },
  data: function () {
    return {
      user: {
        id: 0,
        name: "Invitado",
        phone: "+000 12345678",
        type: 0
      },
      appDataStore: {
        version: 2,
        config: {
          blackMode: false,
          valorar: false,
          sessionToken: 0
        },
      }
    };
  },
  on: {
    init: function () {
      console.log(`Framework7 init`);
      if (window.FirebasePlugin) {
        window.FirebasePlugin.subscribe("all");
        console.log(`Firebase push init`);
      }
    },
  },
  methods: {
    notification(data) {
      data = (typeof data !== "object") ? {} : data;

      data.title = data.title || 'Feria 2019';
      data.subtitle = data.subtitle || 'Bienvenido';
      data.text = data.text || `Bienvenido de nuevo`;

      var notificationWithButton = app.notification.create({
        title: data.title,
        subtitle: data.subtitle,
        text: data.text,
        closeButton: true,
        closeOnClick: true,
        closeTimeout: 5000,
      });
      notificationWithButton.open();
    },
    loadUser(data) {
      data = (typeof data !== "object") ? {} : data;

      data.callback = data.callback || function (res) { console.log("User loaded!", res); };
      data.error_callback = data.error_callback || function (res) { console.log("loadUser error", res); };

      console.log('Preparando usuario...');
      var user_types = hookapi.Users.USER_TYPES;
      var sessionToken = app.data.appDataStore.config.sessionToken;

      if (sessionToken !== 0) {
        console.log(`Cargando usuario token [${sessionToken}] desde la API...`);
        hookapi.Users.getSession(sessionToken).then(function (res) {
          var user = res.user;
          if (user.type === user_types.JURADO) {
            console.log(`El usuario id ${user.id} es jurado!, cargando categoria asignada...`);
            hookapi.Categorias.getFromUserId(user.id).then(function (res) {
              var categoriaDefault = {
                id: 0,
                nombre: 'No definido',
                createat: 0
              };
              var categoria = (res.categorias.length > 0 ? res.categorias[0].categoria : categoriaDefault);
              user.categoria = categoria;
              app.data.user = user;
              app.methods.notification({
                title: 'Feria 2019',
                subtitle: 'Bienvenido',
                text: `Bienvenido de nuevo ${user.name} eres jurado en la feria, puedes votar en los proyectos de ${categoria.nombre}`,
              });
              console.log(`La categoria asignada para este jurado (${user.id}) es ${categoria.nombre}!`);
              data.callback(res);
            }, function (err) {
              app.dialog.alert('Categorias.getFromUserId error', 'Oh... :(');
              console.log(err);
            });
          } else {
            app.data.user = user;
            app.methods.notification({
              title: 'Feria 2019',
              subtitle: 'Bienvenido',
              text: `Bienvenido de nuevo ${user.name}`,
            });
            data.callback(res);
          }
          console.log('Users.getSession', res);
        }, function (err) {
          app.dialog.alert('Users.getSession error', 'Oh... :(');
          console.log(err);
        });
      } else {
        data.callback({});
        console.log('No se encontro un token de sesion.');
      }
    },
    getRandomColor() {
      var colors = ["red", "green", "blue", "pink", "yellow", "orange", "purple", "deeppurple", "lightblue", "teal", "lime", "deeporange", "gray", "black"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  },
  routes: routes,
  popup: {
    closeOnEscape: true,
  },
  sheet: {
    closeOnEscape: true,
  },
  popover: {
    closeOnEscape: true,
  },
  actions: {
    closeOnEscape: true,
  }
});

app.views.create('.view-main', {
  url: '/',
  mdSwipeBack: false,
  // pushState: (Framework7.device.desktop ? true : false),
});

// Dom load
$(document).on('deviceready', function () {
  console.log('deviceready');

  var storedData_config = app.form.getFormData('feriaApp_config') || {};
  if (storedData_config.version !== app.data.appDataStore.version) {
    storedData_config = null;
  }
  app.data.appDataStore = (storedData_config ? storedData_config : app.data.appDataStore);
  app.form.storeFormData('feriaApp_config', app.data.appDataStore);
  console.log('Datos de usuarios guardados: ', app.data.appDataStore);
  // app.methods.loadUser();

  $(document).on("offline", function () {
    console.log("Phone goes offline");
    app.views.main.router.navigate({ name: 'offline' })
    // app.dialog.alert("No tienes conexion a internet :(", 'Offline');
  }, false);

  $(document).on("online", function () {
    window.location.reload(true);
    console.log("Phone goes online");
  }, false);

  if (app.data.appDataStore.config.blackMode == true) {
    $('html').addClass('theme-dark');
    $('input#enableblackmode').prop("checked", true);
    console.log('Black mode on config, enable');
    app.toast.show({ text: 'Modo oscuro activado' });
  }

  app.on('panelOpen', function (panel) {
    console.log('Panel ' + panel.side + ': open');
    //Black mode check
    if (app.data.appDataStore.config.blackMode == true) {
      $('input#enableblackmode').prop("checked", true);
    }

    $('input#enableblackmode').click(function () {
      if ($(this).prop("checked") == true) {
        $('html').addClass('theme-dark');
        app.data.appDataStore.config.blackMode = true;
        console.log("Enable black mode");
        app.toast.show({ text: 'Modo oscuro activado' });
      } else {
        $('html').removeClass('theme-dark');
        app.data.appDataStore.config.blackMode = false;
        console.log("Disable black mode");
        app.toast.show({ text: 'Modo oscuro desactivado' });
      }
      app.form.storeFormData('feriaApp_config', app.data.appDataStore);
    });
  });

  app.on('cardOpen', function (el) {
    $('div.upscroller').hide();
  });
  app.on('cardClosed', function (el) {
    $('div.upscroller').show();
  });

  document.addEventListener("backbutton", onBackKeyDown, false);
});

app.on('pageInit', function (page) {
  console.log("page init", page);
  var $$btn = $('<div class="upscroller"><i class="material-icons">keyboard_arrow_up</i></div>');
  $(page.el).prepend($$btn);

  $$btn.click(function (event) {
    event.stopPropagation();
    event.preventDefault();
    var curpage = $(".page-content", page.el);
    $(curpage).scrollTop(0, Math.round($(curpage).scrollTop() / 4));
    app.card.close();
  });

  $(".page-content", page.el).scroll(function (event) {
    var e = $(event.target).scrollTop();
    if (e > 300) $$btn.addClass('show');
    else $$btn.removeClass('show');
  });
});

function onBackKeyDown() {
  var popover = app.popover;
  var panel = app.panel;
  var dialog = app.dialog;
  var currentRoute = app.view.current.router;
  var card = $('.card-expandable.card-opened');

  var closeApp = function () {
    app.dialog.confirm('¿Quiere salir del programa?', 'Cerrar App', function () {
      navigator.app.clearHistory();
      navigator.app.exitApp();
    });
  }

  QRScanner.getStatus(function (status) {
    if (status.showing || status.scanning || status.previewing) {
      $('body').show();
      QRScanner.destroy(function (status) {
        alert('No se encontro ningun QR :(');
        console.log(status);
      });
    }
  });

  if (card.length > 0) {
    app.card.close();
    return false;
  }
  else if (app.sheet.get()) {
    app.sheet.close();
    return false;
  }
  else if (popover.get()) {
    popover.close();
    return false;
  }
  else if (panel.get() && panel.get().opened) {
    panel.close();
    return false;
  }
  else if (dialog.get()) {
    dialog.close()
    return false;
  }
  else if (currentRoute.url === "/") {
    closeApp();
  }
  else {
    var routeName = currentRoute.currentRoute.name;
    switch (routeName) {
      case 'votar':
      case 'addProyecto':
        currentRoute.back({
          force: true,
          ignoreCache: true
        });
        break;
      case 'offline':
        closeApp();
        break;
      default:
        currentRoute.back();
        break;
    }
  }
  return false;
}