const usuario = JSON.parse(localStorage.getItem("usuario"));
const metadata = JSON.parse(usuario.metadata);

if (!metadata.preferences) {
  metadata = {
    preferences: {
      theme: "light",
      language: "pt-br",
    },
  };

  axios
    .put(`/api/users/update/metadata`, {
      metadata: metadata,
      id: usuario.id,
    })
    .then((sucess) => {
      if (sucess.status == 200) {
        $("body").addClass(metadata.preferences.theme);
      } else {
        error(sucess.data);
      }
    })
    .catch((error) => {
      alert(error);
    });
} else {
  // +++++++++++++++++++++++++

  var temaAtual = metadata.preferences.theme;

  if (temaAtual == "dark") {
    var novoTema = "light";
  } else {
    var novoTema = "dark";
  }

  $("body").addClass(temaAtual).removeClass(novoTema);
}

if (usuario != undefined && usuario != null) {
  var nome = usuario.name.split(" ")[0];
  $(`button.usuario`).text(nome);
} else {
  location.href = "/sair";
}

$(`.usuario`).click(async () => {
  $(".slideRight").remove();

  $("body").append(`<div class="menu_user" id="menu_user"></div>`);

  $("#menu_user")
    .load(`/html/menu_user.html`, () => {
      $("#menu_user").animate(
        {
          right: "10px",
        },
        200
      );
    })
    .mouseleave(() => {
      $("#menu_user").animate(
        {
          right: "-100%",
        },
        200
      );

      setTimeout(() => {
        $("#menu_user").remove();
      }, 300);
    });
});

async function listNotifications() {

    var notificationNumber = 0;
    $(`#notificationsNumber`).remove();
    $(".notificationsContainer").html("");
    var html = "";
    var notificationsList = await axios.get(`/api/notifications`)
    if (notificationsList.status == 200) {
      console.log(notificationsList.data)
      if(notificationsList.data.length === 0 || notificationsList.data.every((message) => message.status === "disable")){
        html += `
        <div class="notificationItem" >
        <i class="fi fi-rr-check" style="color: var(--blue);   font-size: 20px;"></i>
        <p style="color: var(--blue);"> Tudo em dia!</p>
        <p style="color: var(--blue);">Nenhuma notificação por enquanto</p>
        </div>
        `
        $(`.notificationsContainer`).html(html);
      }
      const notificationTimes = await Promise.all(notificationsList.data.map((notification) => getTime(notification.createdAt)));
      notificationsList.data.forEach((notification, index) => {
        if (notification.status === "pending") {
          html +=`
          <div id="not_${notification.id}" style="background-image:url(/img/notifications/${notification.type}.png);" class="notificationItem pending" >
          <h1>${notification.type}</h1> 
          <a href=/${notification.type}> 
          <p onclick="redirectToWorkChat(${notification.metadata.senderId})">${notification.text}</p> 
          </a>
          <div onclick="setNotificationViewed(${notification.id})">ok</div>
          <span>${notificationTimes[index]}</span>
          <i class="fi fi-rr-cross" onclick="deleteNotificationWarning(${notification.id})"></i>
          </div>`;
  
          notificationNumber++;
        } else if (notification.status === "viewed"){
          html += `
          <div id="not_${notification.id}" style="background-image:url(/img/notifications/${notification.type}.png);" class="notificationItem" >
          <h1>${notification.type}</h1>
          
          <p onclick="redirectToWorkChat(${notification.metadata.senderId})">${notification.text}</p> 
          <span>${notificationTimes[index]}</span>
          
          <i class="fi fi-rr-cross" onclick="deleteNotificationWarning(${notification.id})"></i>
          </div>`;
        }
      });
      $(`.notificationsContainer`).html(html);
      if (notificationNumber) {
        $(`#notifications`).append(`<div id="notificationsNumber">
              ${notificationNumber}
              </div>`);
      }
    } else {
      error(notificationsList.data);
    }
  }

async function getTime(notificationTime) {

   
    const now = moment();
    const createdAt= moment(notificationTime);
  
    const seconds = now.diff(createdAt, 'seconds');
    const minutes = now.diff(createdAt, 'minutes');
    const hours = now.diff(createdAt, 'hours');
    const days = now.diff(createdAt, 'days');
  
    if (seconds < 60) {
      return (`${seconds} segundo(s)`);
    } else if (minutes < 60) {
      return (`${minutes } minuto(s)`);
    } else if (hours < 24) {
      return (`${hours} hora(s)`);
    } else {
      return(`${days} dia(s)`);
    }
  
}
async function deleteNotificationWarning(notificationId){
    deleteNotification(`${notificationId}`);
    // $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    // $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    // var modal = "";

    // modal += `<div id="aviso">`
    // modal += `<div class="aviso">`
    // modal += `<h1>Tem certeza que deseja EXCLUIR a notificação?</h1>`
    // modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    // modal += `</div>`
    // modal += `<div class="botoes">`
    // modal += `<button id="prosseguir">Cancelar</button>`
    // modal += `<button id="fechar_aviso" onclick="deleteNotification(${notificationId})">Excluir agora</button>`
    // modal += `</div>`
    // modal += `</div>`

    // $('#modal_aviso').append(modal);

    // $(`#prosseguir`).on(`click`, () => {
    //     $('#modal_aviso').siblings().css('filter', 'none');
    //     $('#modal_aviso').remove();
    // })
}
async function deleteNotification(notificationId){
   
    axios.put(`/api/notifications/delete/${notificationId}`).then((res) => {
        if (res.status == 200) {
            $('#modal_aviso').siblings().css('filter', 'none');
            $('#modal_aviso').remove();
            $(`#not_${notificationId}`).remove();
            // listNotifications();
            //sucess('Notificação excluída com sucesso!')
        } else {
            alert(res.data)
            $('#modal_aviso').siblings().css('filter', 'none');
            $('#modal_aviso').remove();
        }
    }).catch((error) => {
        alert(error)
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })
}   
async function setNotificationViewed(notificationId,event){
    axios.put(`/api/notifications/viewed/${notificationId}`).then((res) => {
        if (res.status == 200) {
          var notificationElement = $(`#not_${notificationId}`);
          notificationElement.removeClass("pending");
          notificationElement.find("div[onclick='setNotificationViewed(" + notificationId + ")']").remove();
          /*   listNotifications(); */
        } else {
            alert(res.data)
        }
    }).catch((error) => {
        alert(error)
    })
}

function redirectToWorkChat(member_id) {

    window.location.assign(`/workchat?member_id=${member_id}`);
  }
listNotifications();