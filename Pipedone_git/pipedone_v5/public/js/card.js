$('title').text(meta.title + ' - Pipedone');

$('#idcard').text('#' + card.id);

function setDateAndHours(createdAt) {

    var date = new Date(createdAt);

    var mes = [];
    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            const numMes = '0' + i;
            mes.push(numMes);
        } else {
            const numMes = i;
            mes.push(numMes);
        }
    }

    if (date.getDate() < 10) {
        var dia = '0' + date.getDate();
    } else {
        var dia = date.getDate();
    }

    var d = dia + '/' + mes[date.getMonth()] + '/' + date.getFullYear();
    var t = date.getHours() + ':' + date.getMinutes() + 'h';

    var data = d + ' às ' + t;

    return data;
}

async function setCreatedBy() {

    var user = await getUserById(card.creator_id);

    $('#criado_em').text(setDateAndHours(card.createdAt));

    if (user != null) {
        $('#criado_por').text(user.name);
    }

}

setCreatedBy();


function saveTitleCard() {
    var novoTitulo = $('#title').text();
    meta.title = novoTitulo;
    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card.id
    }).then((resposta) => {
        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            // parte visual
            $(`#card_${card.id} h4`).text(novoTitulo);
            $('title').text(novoTitulo + ' - Pipedone');
            //sucess('Alterado!')

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}

$('#title')
    .text(meta.title)
    .blur(() => {
        saveTitleCard()
    })
    .keypress((e) => {
        if (e.keyCode == 13) {
            // saveTitleCard();
            e.preventDefault();
            $('#title').blur();
        }
    })



function avisodeleteCardFromNewStep(card, step) {

    $('.openCard').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja ARQUIVAR esse card?</h1>`
    modal += `<p>Ele será listado em Arquivo neste pipe!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteCardFromNewStep('${card}', '${step}')">Arquivar</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('.openCard').css('filter', 'none');
        $('#modal_aviso').remove();
    })

}


if (meta.coments) {
    $(`#menu_coments`).html(`<i class="fi fi-rr-comments"></i> Comentários (${meta.coments.length})`);
}

if (meta.tasks) {

    var tComplete = 0;

    for (let i = 0; i < meta.tasks.length; i++) {
        const element = meta.tasks[i];
        if (element.checked == true) {
            tComplete++;
        }
    }

    $(`#menu_tasks`).html(`<i class="fi fi-rr-check"></i> Tarefas (${tComplete}/${meta.tasks.length})`);
}



function activeMenu(elemento) {
    $(`.menu03 .btmCircular`).removeClass('ativo')
    $(`#${elemento}`).addClass('ativo')
}

function activeMenu02(elemento) {
    $(`.menu02 .btmCircular`).removeClass('ativo')
    $(`#${elemento}`).addClass('ativo')
}
/*
async function setComents() {
    let clicks = 0;
    activeMenu("menu_coments");
    $(`.exibi_comentarios`).html("");
    $(`.history .container`).addClass("oculto");
    $(`#comentarios`).removeClass("oculto");
  
    $(`textarea#comentario`)
      .on("focus", () => {
        $(`textarea#comentario`).css("background-color", "white");
      })
      .keypress(function (event) {    
        // $(this).height(0)
        // $(this).height(this.scrollHeight);
        if (event.keyCode == 64) {
          // // //console.log('Digitou @... pesquisa os usuário se houver mais de um!');
        }
        if (event.keyCode == 13) {
          event.preventDefault();
          clicks++;
          if (clicks === 1) {
            addComent(card.id);
            setTimeout(() => {
              clicks = 0;
            }, 2000); 
          }
        }
      })
    .on("blur", () => {
      $(`textarea#comentario`).css("background-color", "var(--offblue)");
    });

    if (meta.coments) {

        var comentario = "";
        var coments = meta.coments.sort(function(a, b) {
            if (a.date > b.date) {
                return -1;
            }
            if (a.date < b.date) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });

        for (let i = 0; i < coments.length; i++) {
            const element = coments[i];
            // console.log(element)
            comentario += "<div class='comentario'>";
            comentario += "<i class='fi fi-rr-comment-alt'></i>";
            comentario += "<div class='texts'>";
            comentario += `<h4>${element.user.split(' ')[0]}</h4>`;
            comentario += `<span>${element.date}</span>`;
            comentario += `<div class='texto'>${element.text}</div>`;
            comentario += "</div>";
            comentario += "</div>";
        }

        $(`.exibi_comentarios`).append(comentario);

    }

}
*/

// async function listStepsFromConections(pipe_id) {
//     $(`#div_${pipe_id}`).html('');
//     var buscaSteps = await axios.get(`/api/step/listar/${pipe_id}`);
//     if (buscaSteps.status != 200) {
//         error(buscaSteps.data);
//         return;
//     }
//     var steps = buscaSteps.data;
//     var listaSteps = "";
//     for (let i = 0; i < steps.length; i++) {
//         var element = steps[i];
//         var pipeConect = await getPipeById(element.id);
//         if(pipeConect != null){
//             listaSteps += `<button id="btmStep${pipeConect.id}" class="step" onclick="moveCardToNewStepAndNewPipe(${card.id}, ${element.id}, ${pipe_id})" style="color:${pipeConect.color};background-color:${pipeConect.color}11">${pipeConect.title}<i class="fi fi-rr-arrow-small-right"></i></button>`;
//         }
//     }

//     $(`#div_${pipe_id}`).html(listaSteps).slideToggle(200)
//         // // //console.log(buscaSteps);
// }

async function listStepsFromConections(pipe_id) {
    $(`#div_${pipe_id}`).html("");
    var buscaSteps = await axios.get(`/api/step/listar/${pipe_id}`);
    if (buscaSteps.status != 200) {
      error(buscaSteps.data);
      return;
    }
    var steps = buscaSteps.data;
    var listaSteps = "";
    for (let i = 0; i < steps.length; i++) {
      var element = steps[i];
      listaSteps += `<button id="btmStep${element.id}" class="step" onclick="moveCardToNewStepAndNewPipe(${card.id}, ${element.id}, ${pipe_id})" style="color:${element.color};background-color:${element.color}11">${element.title}<i class="fi fi-rr-arrow-small-right"></i></button>`;
    }
  
    $(`#div_${pipe_id}`).html(listaSteps).slideToggle(200);
    // // //console.log(buscaSteps);
  }

async function getPipeById(pipe_id){
    var getPipe = await axios.get(`/pipe/view/${pipe_id}`);
    if(getPipe.status != 200){
        return null;
    }
    return getPipe.data;
}
/*
async function addComent(card_id) {

    var text = $(`#comentario`).val();

    if (!meta.coments) {
        meta['coments'] = [];
    }

    var meses = [];

    for (let i = 0; i < 12; i++) {
        meses.push(i + 1);
    }

    var date = new Date();
    var dataCompleta = 'às ' + date.getHours() + ':' + date.getMinutes() + ' no dia ' + date.getDate() + '/' + meses[date.getMonth()] + '/' + date.getFullYear();

    var newComentario = {
        user_id: usuario.id,
        user: usuario.name,
        date: dataCompleta,
        text: text
    }

    meta.coments.push(newComentario);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {
        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            // parte visual
            var comentario = "<div class='comentario'>";
            comentario += "<i class='fi fi-rr-comment-alt'></i>";
            comentario += "<div class='texts'>";
            comentario += `<h4>${usuario.name.split(' ')[0]}</h4>`;
            comentario += `<span>${dataCompleta}</span>`;
            comentario += `<div class='texto'>${text}</div>`;
            comentario += "</div>";
            comentario += "</div>";

            $(`.exibi_comentarios`).prepend(comentario);
            $(`#comentario`).val('');

            $(`#coment_${card_id}`).html(`<i class="fi fi-rr-comment-alt"></i> ${meta.coments.length}`);
            $(`#menu_coments`).html(`<i class="fi fi-rr-comments"></i> Comentários (${meta.coments.length})`);

            sucess('Comentário adicionado!')

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}
*/
async function setTasks() {

    activeMenu('menu_tasks');
    $(`.exibi_taks`).html('')
    $(`.history .container`).addClass('oculto')
    $(`#tasks`).removeClass('oculto')

    if (meta.tasks) {

        var tasks = meta.tasks.sort(function(a, b) {

            if (a.order) {
                if (a.order > b.order) {
                    return 1;
                }
                if (a.order < b.order) {
                    return -1;
                }
            } else {
                if (a.id > b.id) {
                    return -1;
                }
                if (a.id < b.id) {
                    return 1;
                }
            }

            // a must be equal to b
            return 0;

        });

        var count = 0;
        var countCompletes = 0;

        $(`.exibi_taks`).append("<div class='pendentes'></div>");
        $(`.exibi_taks`).append("<div class='concluidas'></div>");
        $(`.exibi_taks .concluidas`).append("<div class='slide oculto'></div>");

        for (let i = 0; i < tasks.length; i++) {
            var campoTask = "";
            const element = tasks[i];
            if (element.checked == true) {
                var sts = "checked";
                count++;
            } else {
                var sts = "";
            }
            campoTask += `<div class="newTask"  id="divtask_${element.id}">`;
            campoTask += `<input type="checkbox" id="task_${element.id}" onclick="doneTask('${element.id}', '${card.id}')" ${sts}>`;
            campoTask += `<label class="labelTask" onblur="editTask('${element.id}', '${card.id}');" contenteditable="true">${element.tarefa}</label>`;
            campoTask += `<i onclick="delTask('${element.id}', '${card.id}')" class="fi fi-rr-cross"></i>`;
            campoTask += `</div>`;

            if (element.checked == true) {
                $(`.exibi_taks .concluidas .slide`).append(campoTask);
                countCompletes++;
            } else {
                $(`.exibi_taks .pendentes`).append(campoTask);
            }

        }

        if (countCompletes > 0) {
            if (countCompletes > 1) {
                $(`.exibi_taks .concluidas`).prepend(`<h4 onclick="openTasksCompletes()"><i class="fi fi-rr-angle-right"></i> ${countCompletes} completas</h4>`);
            } else {
                $(`.exibi_taks .concluidas`).prepend(`<h4 onclick="openTasksCompletes()"><i class="fi fi-rr-angle-right"></i> ${countCompletes} completa</h4>`);
            }
        }

        $(`#tasks h2`).html(`Tarefas (${count}/${tasks.length})`);

    }

}

function openTasksCompletes() {

    if ($(`.exibi_taks .concluidas .slide`).hasClass('oculto')) {
        $(`.exibi_taks .concluidas .slide`).removeClass('oculto');
        $(`.exibi_taks .concluidas h4 i`).css('transform', 'rotate(90deg)');
    } else {
        $(`.exibi_taks .concluidas .slide`).addClass('oculto');
        $(`.exibi_taks .concluidas h4 i`).css('transform', 'rotate(0deg)');

    }

}

function addTask(card_id) {

    let tarefa = $('#novaTask').text();
    var campoTask = "";

    if (!meta.tasks) {
        // // //console.log('existe');
        meta['tasks'] = [];
    }

    var idTask = newId();

    var task = {
        created_by: usuario.id,
        tarefa: tarefa,
        id: idTask,
        order: meta.tasks.length + 1,
        checked: false
    }

    meta.tasks.push(task);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {
        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            // parte visual

            campoTask += `<div class="newTask" id="divtask_${idTask}">`;
            campoTask += `<input type="checkbox" id="task_${idTask}" onclick="doneTask('${idTask}', '${card_id}')">`;
            campoTask += `<label onblur="editTask('${idTask}', '${card_id}');" class="labelTask" contenteditable="true">${tarefa}</label>`;
            campoTask += `<i onclick="delTask('${idTask}', '${card_id}')" class="fi fi-rr-cross"></i>`;
            campoTask += `</div>`;

            $(`.exibi_taks .pendentes`).append(campoTask);
            $('#novaTask').text('');

            var tComplete = 0;

            for (let i = 0; i < meta.tasks.length; i++) {
                const element = meta.tasks[i];
                if (element.checked == true) {
                    tComplete++;
                }
            }

            $(`#card_${card_id} .icones #task_${card_id}`).html(`<i class="fi fi-rr-check"></i> ${tComplete}/${meta.tasks.length}`);

            $(`#menu_tasks`).html(`<i class="fi fi-rr-check"></i> Tarefas (${tComplete}/${meta.tasks.length})`);
            $(`#tasks h2`).text(`Tarefas (${tComplete}/${meta.tasks.length})`);

            addHistory(card_id, `adicionou a tarefa "${tarefa}" nesse cartão.`);

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })

}

function delTask(idTask, card_id) {

    var newArray = meta.tasks.filter((item) => item.id !== idTask);
    var task = meta.tasks.filter((item) => item.id === idTask)[0];
    meta.tasks = newArray;
    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {
        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            // parte visual

            var tarefa = $(`#divtask_${idTask} label`).text()
            addHistory(card_id, `deletou a tarefa "${tarefa}" nesse cartão.`);

            $(`#divtask_${idTask}`).remove()

            var tComplete = 0;

            for (let i = 0; i < meta.tasks.length; i++) {
                const element = meta.tasks[i];
                if (element.checked == true) {
                    tComplete++;
                }
            }

            $(`#card_${card_id} .icones #task_${card_id}`).html(`<i class="fi fi-rr-check"></i> ${tComplete}/${meta.tasks.length}`);
            $(`#menu_tasks`).html(`<i class="fi fi-rr-check"></i> Tarefas (${tComplete}/${meta.tasks.length})`);
            $(`#tasks h2`).html(`Tarefas (${tComplete}/${meta.tasks.length})`);

            addHistory(card_id, `excluiu a tarefa "${task.tarefa}"`);

            setTasks();

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })

}

function doneTask(task_id, card_id) {

    var sts = $(`#task_${task_id}`)
    var checked = sts[0].checked;
    var tasks = meta.tasks.filter((item) => item.id !== task_id);
    var task = meta.tasks.filter((item) => item.id === task_id)[0];

    task.checked = checked;

    tasks.push(task);

    meta.tasks = tasks;

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {

        localStorage.setItem('card', JSON.stringify(card));

        if (resposta.status == 200) {

            let metadata = {
                task_id: task_id,
                card_id: card_id,
                task: task.tarefa
            }

            setAnalisys('task_done', metadata, pipe.id, card_id);

            var tComplete = 0;

            for (let i = 0; i < meta.tasks.length; i++) {
                const element = meta.tasks[i];
                if (element.checked == true) {
                    tComplete++;
                }
            }

            if (pipe.metadata.powerups) {

                var powers = pipe.metadata.powerups.filter(item => item.condition.id == "tarefas_concluidas");

                if (powers.length > 0) {

                    for (power of powers) {
                        activePowerUp(card_id, power);
                    }

                }

            }

            $(`#card_${card_id} .icones #task_${card_id}`).html(`<i class="fi fi-rr-check"></i> ${tComplete}/${meta.tasks.length}`);
            $(`#menu_tasks`).html(`<i class="fi fi-rr-check"></i> Tarefas (${tComplete}/${meta.tasks.length})`)
            $(`#tasks h2`).html(`Tarefas (${tComplete}/${meta.tasks.length})`);

            if (checked == true) {
                var music = new Audio('/mp3/plim.mp3');
                music.play();
                addHistory(card_id, `completou a tarefa "${task.tarefa}"`);

                setTasks();
                $(`.exibi_taks .concluidas .slide`).addClass('oculto');
                $(`.exibi_taks .concluidas h4 i`).css('transform', 'rotate(0deg)');

            } else {

                setTasks();
                $(`.exibi_taks .concluidas .slide`).removeClass('oculto');
                $(`.exibi_taks .concluidas h4 i`).css('transform', 'rotate(90deg)');
                addHistory(card_id, `reativou a tarefa "${task.tarefa}"`);
            }


        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}

function editTask(task_id, card_id) {
    var text = $(`#divtask_${task_id} label`).text()
    var task = meta.tasks.filter((item) => item.id === task_id)[0];
    var newArray = meta.tasks.filter((item) => item.id !== task_id);

    task.tarefa = text;
    newArray.push(task);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            addHistory(card_id, `editou a tarefa "${text}"`);

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text);
    })
}

$('#novaTask').focus(() => {
    $('#novaTask').text('')
}).blur(() => {
    let campo = $('#novaTask').text()
    if (campo.length == 0) {
        $('#novaTask').text('Item da lista')
    }
}).keypress(function(event) {
    if (event.keyCode == 64) {
        // // //console.log('Digitou @... pesquisa os usuário se houver mais de um!');
    }
    if (event.keyCode == 13) {
        event.preventDefault();
        addTask(card.id);
    }
})

async function setNotes() {
    activeMenu('menu_notes');
    $(`.history .container`).addClass('oculto')
    $(`#notes`).removeClass('oculto')

    if (meta.notes) {
        // CKEDITOR.instances['texNotes'].setData(meta.notes);
        // var textos = await returnTextUrl(meta.notes);
        $(`#texNotes`).val(meta.notes);
    }
}


function returnTextUrl(text) {
    var reURL = /((?:http(s)?:\/\/)?(?:www(\d)?\.)?([\w\-]+\.\w{2,})\/?((?:\?(?:[\w\-]+(?:=[\w\-]+)?)?(?:&[\w\-]+(?:=[\w\-]+)?)?))?(#(?:[^\s]+)?)?)/g;

    return text.replace(reURL, '<a target="_blank" href="http$2://www$3.$4$5$6">$1</a>');
}

function saveNotes(card_id) {
    // var text = CKEDITOR.instances['texNotes'].getData();
    var text = $(`#texNotes`).val();

    if (!meta.notes) {
        meta['notes'] = "";
    }

    meta.notes = text;

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            sucess('Nota salva!');
            addHistory(card_id, 'modificou as anotações desse card.');

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}

$(`#texNotes`).blur(() => {
    saveNotes(card.id);
})


function setHistory() {

    activeMenu('menu_history');
    $(`.historico`).html('')
    $(`.history .container`).addClass('oculto')
    $(`#history`).removeClass('oculto')

    // console.log(meta.history)

    var actions = meta.history.actions.sort(function(a, b) {
        if (a.date < b.date) {
            return 1;
        }
        if (a.date > b.date) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    var conteudo = "";

    for (let i = 0; i < actions.length; i++) {
        const element = actions[i];

        // console.log(element)

        conteudo += "<div class='comentario'>";
        conteudo += "<i class='fi fi-rr-time-past'></i>";
        conteudo += "<div class='texts'>";
        conteudo += `<h4>${element.user} ${element.action}</h4>`;
        conteudo += `<span>no dia ${element.date} às ${element.time}</span>`;
        conteudo += "</div>";
        conteudo += "</div>";
    }

    $(`.historico`).html(conteudo)

    $(`#menu_history`).html(`<i class="fi fi-rr-time-past"></i> Atividades (${actions.length})`)

}

async function setForms() {

    activeMenu02('forms');
    $(`.dados .container`).addClass('oculto');
    $(`#divforms`).removeClass('oculto');
    var dados = "";

    if (!meta.form && !meta.form.fields || meta.form.fields == undefined || meta.form.fields.length == 0) {
        $(`#novoCampoInCard`).removeClass("oculto");
        return;
    }

    var empresa = await getOrgById(card.organization_id);

    if (empresa.metadata.apps) {
        if (empresa.metadata.apps.includes("hinova_sincronismo_associado")) {
            $(`#sincronizarHinova`).removeClass("oculto");
        }
    }

    for (element of meta.form.fields) {
        dados += `<div class="elemento" id="${element.id}">`;
        dados += generatorElementByType(element);
        dados += `</div>`;
    }

    $(`#setForms`).html(dados);

}

function setFormsHinova() {

    var dados = "";

    for (element of meta.form.fields) {
        dados += generatorElementByType(element);
    }

    $(`aside`).html(dados);

}

function generatorElementByType(element) {

    switch (element.type) {
        case 'title':
            var elemento = `<h1>${element.description}</h1>`;
            break;

        case 'subTitle':
            var elemento = `<p>${element.description}</p>`;
            break;

        case 'breakLine':
            var elemento = `<hr>`;
            break;

        case 'text':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="text" value="${valor}" name="${element.description}" placeholder="Digite aqui..." id="${element.id}">`;
            break;

        case 'file':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<a class="file" target="_blank" href="/anexos/${valor}" id="file_${element.id}"><i class="fi fi-rr-clip"></i> ${valor}</a>`;
            elemento += `<input onchange="editCampForm($(this),'${element.position}')" type="file" id="${element.id}">`;
            break;

        case 'year':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="tel" value="${valor}" onkeypress="$(this).mask('0000')" placeholder="0000" id="${element.id}">`;
            break;


        case 'cpf':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="text" onkeypress="$(this).mask('000.000.000-00')" placeholder="000.000.000-00" style="width: 150px;" value="${valor}" id="${element.id}">`;
            break;

            case 'cnpj':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="text" onkeypress="$(this).mask('00.000.000/0000-00')" placeholder="00.000.000/0000-00" style="width: 200px;" value="${valor}" id="${element.id}">`;
            break;


        case 'placa':

            var valor = "";

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="text" onkeypress="$(this).mask('AAA-0A00')" placeholder="aaa-0a00" style="width: 150px;" value="${valor}" id="${element.id}">`;
            break;

        case 'phone':

            var valor = "";

            // // //console.log(meta.form.values);

            if (meta.form.values) {

                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }

            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampForm($(this),'${element.position}')" type="tel" value="${valor}" onkeypress="$(this).mask('(00) 0 0000-0000')"  style="width: 150px;"  placeholder="(00) 0 0000-0000" id="${element.id}">`;
            break;

        case 'date':

            var valor = "";
            if (meta.form.values) {
                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }
            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampForm($(this),'${element.position}')"  value="${valor}" type="date" id="${element.id}">`;
            break;

        case 'data':

            var valor = "";
            if (meta.form.values) {
                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }
            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampForm($(this),'${element.position}')" onkeypress="$(this).mask('00/00/0000')" value="${valor}"  style="width: 150px;"  type="text" id="${element.id}">`;
            break;

        case 'cep':

            var valor = "";
            if (meta.form.values) {
                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }
            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampForm($(this),'${element.position}')" onkeypress="$(this).mask('00.000-000')" value="${valor}"  style="width: 150px;"  type="text" id="${element.id}">`;
            break;

        case 'time':

            var valor = "";
            if (meta.form.values) {
                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }
            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampForm($(this),'${element.position}')" value="${valor}" type="time" id="${element.id}">`;
            break;

        case 'button':
            var elemento = ``;
            break;

        case 'textarea':
            var valor = "";
            if (meta.form.values) {
                for (let i = 0; i < meta.form.values.length; i++) {
                    const otherElement = meta.form.values[i];

                    if (otherElement.id == element.id) {
                        var valor = otherElement.value;
                    }

                }
            }
            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<textarea  onblur="editCampForm($(this),'${element.position}')"  placeholder="Digite aqui..." id="${element.id}">${valor}</textarea>`;
            break;

        case 'radio':
            var elemento = `<h4 class="titulo">${element.description}</h4>`;

            if (meta.form.values) {
                var values = meta.form.values;
            } else {
                var values = [{
                    id: "",
                    value: "",
                }];
            }

            for (let i = 0; i < element.meta.campos.length; i++) {
                var campo = element.meta.campos[i];

                var newArray = values.filter((item) => item.id === element.id);

                if (newArray.length > 0) {
                    if (newArray[0].value != campo.id) {
                        var stsRadio = ""
                    } else {
                        var stsRadio = "checked"
                    }
                } else {
                    var stsRadio = ""
                }


                elemento += `<label for="${campo.id}" id="label_${campo.id}">`;
                elemento += `<input type="radio" ${stsRadio} onchange="editCampForm($(this),'${element.position}')"  name="${element.id}" id="${campo.id}" value="${campo.id}"><span class="titleCampo">${campo.option}</span>`;
                elemento += `</label>`;

            }



            break;

        case 'checkbox':

            if (meta.form.values) {
                var values = meta.form.values;
            } else {
                var values = [];
            }

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            for (let i = 0; i < element.meta.campos.length; i++) {
                var campo = element.meta.campos[i];

                var newArray = values.filter((item) => item.id === campo.id);

                if (newArray.length == 0) {
                    var stsCheckbox = ""
                } else {
                    var stsCheckbox = "checked"
                }

                elemento += `<label for="${campo.id}" id="label_${campo.id}">`;
                elemento += `<input type="checkbox" ${stsCheckbox} onchange="editCampForm($(this),'${element.position}')" id="${campo.id}" value="${campo.id}"><span class="titleCampo">${campo.option}</span>`;
                elemento += `</label>`;

            }

            break;

    }
    return elemento;
}

async function editCampForm(campo, position) {

    if (!meta.form.values) {
        meta.form.values = [];
    }

    var dado = campo.val()
    var idCamp = campo.attr('id')
    var type = campo.attr('type')
    var sts = campo.is(':checked')

    if (card.item_id != null && card.item_id != "" && card.item_id != undefined) {
        editCampoListInCard(dado, position, card.item_id, idCamp);
    }

    if (type == 'radio') {
        var name = campo.attr('name')
        var dados = {
            id: name,
            value: dado
        }

        var newArray = meta.form.values.filter((item) => item.id !== name);
        meta.form.values = newArray;
        meta.form.values.push(dados);

    } else if (type == 'checkbox') {

        var dados = {
            id: idCamp,
            value: dado
        }
        var newArray = meta.form.values.filter((item) => item.id !== idCamp);
        if (sts == true) {

            meta.form.values = newArray;
            meta.form.values.push(dados);

        } else {
            meta.form.values = newArray;
        }
    } else if (type == 'file') {

        var dado = await uploadFile(`#${idCamp}`);

        var dados = {
            id: idCamp,
            value: dado
        }
        var newArray = meta.form.values.filter((item) => item.id !== idCamp);

        meta.form.values = newArray;
        meta.form.values.push(dados);

        $(`#file_${idCamp}`).html('<i class="fi fi-rr-clip"></i> ' + dado).attr('href', `/anexos/${dado}`)


    } else {
        var dados = {
            id: idCamp,
            value: dado
        }
        var newArray = meta.form.values.filter((item) => item.id !== idCamp);
        meta.form.values = newArray;
        meta.form.values.push(dados);
    }

    // meta.form.values = [];

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card.id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));

            addHistory(card.id, `Àdcionou a informação "${dado}" nos dados do card.`)

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}


async function uploadFile(fileSelector) {

    var id = newId();
    var img = document.querySelector(fileSelector).files[0];
    var base = await getBase64(img);

    var ty = img.type.split('/');
    var tipo = ty[0];
    var form = ty[1];

    if (!meta.anexos) {
        meta.anexos = [];
    }

    if (form == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        var form = 'xls';
    }

    if (form == 'svg+xml') {
        var form = 'svg';
    }

    var anexo = {
        id: id,
        type: tipo,
        format: form,
        name: img.name
    }

    var arquivo = "";

    if (anexo.format != undefined) {
        var formato = anexo.format.substr(0, 4);
    } else {
        var formato = 'desc';
    }

    var nomeArquivo = id + '.' + formato;

    var nome = await axios.post(`/api/upload/form`, {
        name: nomeArquivo,
        base64: base,
    })

    if (nome.status == 200) {

        return nome.data;

    } else {
        alert(nome.data)
    }

}

async function addFormInCard() {
    $('body').append(`<div class="modal" id="modelos_forms"></div>`);
    $('#modelos_forms').siblings().css('filter', 'blur(4px)');
    $('#modelos_forms').html(`<div class="lista-de-forms">Olá mundo</div>`);

    var elementos = "<h2>Qual formulário deseja adicionar?</h2>";

    var buscaForms = await axios.get('/api/form/listar');

    if (buscaForms.status != 200) {
        error(buscaForms.data);
        return;
    }

    var forms = buscaForms.data;

    elementos += `<i onclick="closeAddFormInCard()" class="fi fi-rr-cross"></i>`;
    elementos += `<button class="gost" onclick="openCreaterForm()">+ Criar novo formulário</button>`;

    $('#modelos_forms .lista-de-forms').html(elementos);
}

function closeAddFormInCard() {
    $('#new_form').siblings().css('filter', 'none');
    $('#new_form').remove();
}

function openCreaterForm() {
    $('body').append(`<div class="modal" id="new_form"></div>`);
    $('#new_form').siblings().css('filter', 'blur(4px)');
    $('#new_form').load(`/html/newform.html`);
}

function editFormInCard() {

    var fields = meta.form;

    var formulario = {
        fields: []
    }

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];
        var field = {
            id: element.id,
            position: element.position,
            type: element.type,
            description: element.description,
            meta: element.meta
        }
        formulario.fields.push(field);
    }

    openCreaterForm();

    setTimeout(() => {
        //localStorage.setItem('formulario', JSON.stringify(formulario));
        setEditForm(formulario);
    }, 1000);

}


function setEditForm(formulario) {

    var fields = formulario.fields;

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];
        const element_id = fields[i].id;

        var newCard = generatorElementSave('el_' + element.type, element_id, element.description);
        $(`.elementsForms`).append(newCard);

        setTimeout(() => {
            $(`div#${element_id} .title`).text(`${element.description}`);

        }, 50);

        if (element.type == 'radio' || element.type == 'checkbox') {

            for (let j = 0; j < element.meta.campos.length; j++) {
                const option = element.meta.campos[j];
                addElementExistent(`${element.id}`, `${element.type}`, `${option.id}`, `${option.option}`);
                setTimeout(() => {
                    $(`div#${option.id} .text`).text(option.option);
                    $(`div#${option.id} input`).val(option.option);
                }, 50)
            }

        }

    }

}

async function setSignatures() {
    activeMenu02('signs');
    $(`.dados .container`).addClass('oculto');
    $(`#divsigns`).removeClass('oculto');
    $(`#setSignatures`).html('')

    var signatures = await axios.get(`/api/signatures/listar/${card.id}`);

    if (signatures.status != 200) {
        error(signatures.data);
        return;
    }

    if (signatures.data.length > 0) {

        var docsForSign = signatures.data;

        for (let i = 0; i < docsForSign.length; i++) {

            const element = docsForSign[i];

            ////console.log(element);

            var signatures = 0;

            for (let j = 0; j < element.signers.length; j++) {
                let sign = element.signers[j];
                if (sign.faceId != "") {
                    signatures++;
                }
            }

            var docForSign = "";

            docForSign += `<div class="signatures" id="${element.id}">`;
            docForSign += `<div class="first" onclick="openSignature('${element.id}')">`;
            docForSign += `<canvas id="mini_pdf_${element.id}"></canvas>`;
            docForSign += `<div class="texts">`;
            docForSign += `<span>#${element.id}</span>`;
            docForSign += `<h3 class="title">${element.metadata.title.replace('.pdf', '')}</h3>`;
            docForSign += `<div class="numberSignes">`;
            docForSign += `<div class="number">`;
            docForSign += `<i class="fi fi-rr-user"></i>`;
            docForSign += `<span id="numberSigns${element.id}">${element.signers.length}</span>`;
            docForSign += `</div>`;
            docForSign += `<div class="number">`;
            docForSign += `<i class="fi fi-rr-fingerprint"></i>`;
            docForSign += `<span>${signatures}</span>`;
            docForSign += `</div>`;
            docForSign += `</div>`;
            docForSign += `</div>`;
            docForSign += `</div>`;
            docForSign += `<button class="arquivarSignature" onclick="avisdoDeleteArquivoSigner(${element.id})">Excluir</button>`;
            docForSign += `</div>`;

            $(`#setSignatures`).append(docForSign);

            if (!element.metadata.model_id) {
                renderPdf(element.document, 1, `mini_pdf_${element.id}`);
            } else {
                $(`#mini_pdf_${element.id}`).remove();
            }

        }

    }
}

function copy(elemento) {

    /* Get the text field */
    var copyText = document.getElementById(elemento);
    // var copyText = text;

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    var statusCopy = document.execCommand("copy");

    if (statusCopy) {
        sucess('Copiado!');
    } else {
        error('Nada feito!')
    };

}

async function openSetDocumentForSign() {

    var limit = await verifySingnaturesDisponible();

    if (limit == 0) {
        error(`Você já atingiu o limite de assinaturas esse mês.`);
        return;
    }

    $('body').append(`<div class="modal" id="new_signature"></div>`);
    $('#new_signature').siblings().css('filter', 'blur(4px)');
    $('#new_signature').load(`/html/sign.html`);
}

async function openSignature(sign_id) {

    $('body').append(`<div class="modal" id="open_signature"></div>`);
    $('#open_signature').siblings().css('filter', 'blur(4px)');

    const signature = await axios.get(`/api/signature/${sign_id}`);

    if (signature.status != 200) {
        error(signature.data);
        return;
    }

    const assinatura = signature.data;

    //console.log('=== assinatura ===');
    //console.log(assinatura);

    var elementos = ""

    elementos += `<div id="div_open_document">`
    elementos += `<div class="preview">`
    elementos += `<div class="menutop">`
    elementos += `<h3>#${sign_id} - ${assinatura.metadata.title}</h3>`
    elementos += `</div>`
    elementos += `<div class="paginas"></div>`
    elementos += `</div>`
    elementos += `<div class="aside">`
    elementos += `<i id="close" onclick="closeSignature()" class="fi fi-rr-cross-small"></i>`
    elementos += `<div class="history">`
    elementos += `<h3>Assinantes:</h3>`
    elementos += `<div class='signers'></div>`
    elementos += `<button id="novoAssinador" onclick="$('.addEmail').slideToggle(200)">+ Novo assinante</button>`

    elementos += `<div class="addEmail">`
    elementos += `<input type="email" placeholder="Digite o email do signatário..." id="email">`
    elementos += `<button id="addSignatario" onclick="addSigner(${sign_id})">+ Adicionar</button>`
    elementos += `</div>`

    elementos += `</div>`
    elementos += `<div class="botoes">`
    elementos += `<button id="baixarCopia" onclick="downloadDocSigned('${sign_id}')">Baixar cópia assinada</button>`
    elementos += `</div>`
    elementos += `</div>`
    elementos += `</div>`

    $('#open_signature').html(elementos);

    var numSigners = assinatura.signers.length;
    var docSigner = 0;

    for (let i = 0; i < assinatura.signers.length; i++) {
        const element = assinatura.signers[i];
        if (element.hash != "") {
            docSigner++;
        }
    }

    if (docSigner == 0) {
        $('#baixarCopia').css('background-color', '#e3e3e3').attr('disabled', true)
    }

    renderListSigners(assinatura, sign_id);

    if (!assinatura.metadata.model_id || assinatura.metadata.model_id.length == 0) {
        renderAllPdf(assinatura.document, '.paginas');
    } else {
        $('.paginas').append('<div class="pagina"></div>');
        $('.paginas .pagina').html(assinatura.document);
    }

}

// async function downloadDocSigned(sign_id) {

//     $(`#baixarCopia`).text('Baixando...');

//     const signature = await axios.get(`/api/signature/${sign_id}`);
//     if (signature.status != 200) {
//         error(signature.data);
//         return;
//     }
//     const assinatura = signature.data;



//     var paginas = $(`.paginas canvas`);
//     var imgs = [];
//     for (let i = 0; i < paginas.length; i++) {

//         const canvas = paginas[i];
//         var img = canvas.toDataURL("image/jpeg");
//         var h = canvas.height / 2;
//         var w = canvas.width / 2;

//         var objImg = {
//             img: img,
//             height: h,
//             width: w
//         }

//         imgs[i] = objImg;

//     }

//     downPdf(assinatura, imgs);

// }

function closeSignature() {
    $('#open_signature').siblings().css('filter', 'none');
    $('#open_signature').remove();
}

function renderListSigners(assinatura, sign_id) {
    var sign = ""

    for (let i = 0; i < assinatura.signers.length; i++) {

        const signer = assinatura.signers[i];
        var fileExist = checkFileExist(`/img/faceid/${signer.foto}`);

        if (signer.hash == "") {
            var cor = 'shadeYellow';
        } else if (fileExist != 200) {
            var cor = 'shadeRed';
        } else {
            var cor = 'shadeBlue';
        }

        sign += `<div class="sign ${cor}" onmouseleave="$('#body_sign_${i}').slideUp(200)" id="${signer.email}">`
        sign += `<div class="head" onclick="$('#body_sign_${i}').slideToggle(200)">`;


        if (signer.foto && signer.foto != "") {

            if (fileExist == 200) {
                sign += `<img src="/img/faceid/${signer.foto}">`;
            } else {
                sign += `<img src="/img/perfil.png">`;
            }
        } else {
            sign += `<img src="/img/perfil.png">`;
        }

        sign += `<div class="text">`

        if (signer.cpf != "") {
            sign += `<span>CPF: ${signer.cpf}</span>`
        } else {
            sign += `<span>CPF: 000.000.000-00</span>`
        }

        if (signer.nome != "") {
            sign += `<h3>${signer.nome}</h3>`
        } else {
            sign += `<h3>Nome do assinante</h3>`
        }

        sign += `<span>${signer.email}</span>`

        var conca = sign_id + '/' + signer.email;
        var base = utf8_to_b64(conca);
        var url = window.location.host + "/aceite-digital/" + base;

        sign += `</div>`
        sign += `</div>`
        sign += `<div class="body" id="body_sign_${i}">`
        sign += `<input type="url" value="${url}" id="url_${i}" onclick="copy('url_${i}')">`
        sign += `<button onclick="avisoRevoke('${signer.email}', '${sign_id}')"><i class="fi fi-rr-ban"></i> Revogar assinatura</button>`
        sign += `<button onclick="avisoDelete('${signer.email}', '${sign_id}')"><i class="fi fi-rr-trash"></i> Excluir assinante</button>`
        sign += `</div>`
        sign += `<div class="foot">`
        if (signer.hash && signer.hash != "") {
            sign += signer.hash
        } else {
            sign += `Assinatura pendente`
        }
        sign += `</div>`
        sign += `</div>`

    }

    $('.signers').html(sign);
}


function utf8_to_b64(str) {
    return btoa(str);
}

async function deleteSigner(email, sign_id) {

    const signature = await axios.get(`/api/signature/${sign_id}`);
    if (signature.status != 200) {
        error(signature.data);
        return;
    }
    const assinatura = signature.data;

    var newArray = assinatura.signers.filter((item) => item.email !== email);

    assinatura.signers = newArray;

    var update = await axios.put(`/api/signature/update/signers`, {
        signers: newArray,
        id: sign_id
    })

    if (update.status == 200) {
        renderListSigners(assinatura, sign_id)
        $(`#numberSigns${sign_id}`).text(assinatura.signers.length)

        $('#open_signature').css('filter', 'none');
        $('#modal_aviso').remove();
    } else {
        error(update.data);
    }


}

async function revokeSigner(email, sign_id) {

    const signature = await axios.get(`/api/signature/${sign_id}`);
    if (signature.status != 200) {
        error(signature.data);
        return;
    }
    const assinatura = signature.data;

    var signerRevoke = assinatura.signers.filter((item) => item.email === email);
    // //console.log(signerRevoke[0].foto)

    if (signerRevoke[0].foto == "") {
        error('Assinatura não realizada ou não disponível para revogar.');
        $('#open_signature').css('filter', 'none');
        $('#modal_aviso').remove();
        return;
    }

    var revoke = await axios.put(`/api/signature/revoke`, {
        email: email,
        id: sign_id
    })

    if (revoke.status == 200) {

        renderListSigners(assinatura, sign_id)
        $(`#numberSigns${sign_id}`).text(assinatura.signers.length)

        $('#open_signature').css('filter', 'none');
        $('#modal_aviso').remove();
    } else {
        error(update.data);
    }

}

function avisoRevoke(email, sign_id) {

    $('#open_signature').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja REVOGAR essa assinatura?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="revokeSigner('${email}', '${sign_id}')">Revogar agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#open_signature').css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

function avisoDelete(email, sign_id) {

    $('#open_signature').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR este assinante?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteSigner('${email}', '${sign_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#open_signature').css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

function avisdoDeleteArquivoSigner(sign_id) {

    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR este arquivo?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteArquivoSigner('${sign_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

function avisoDeleteLinkPhoto(photo_id) {

    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR este link?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteLinkPhoto('${photo_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

async function deleteLinkPhoto(photo_id) {

    $('#prosseguir').text('Removendo...');

    var del = await axios.put(`/api/photo/delete`, {
        id: photo_id
    })

    if (del.status == 200) {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
        $(`#${photo_id}`).remove();
    } else {
        error(del.data)
    }

}
async function deleteArquivoSigner(sign_id) {
    $('#prosseguir').text('Removendo...');

    var del = await axios.put(`/api/signature/delete`, {
        id: sign_id
    })

    // //console.log(del);

    if (del.status == 200) {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
        $(`#${sign_id}`).remove();
    }

}

async function addSigner(sign_id) {

    const signature = await axios.get(`/api/signature/${sign_id}`);
    if (signature.status != 200) {
        error(signature.data);
        return;
    }
    const assinatura = signature.data;
    var email = $('#email').val()

    var newArray = assinatura.signers.filter((item) => item.email === email);

    if (newArray.length > 0) {
        error('Assinante já adicionado!');
        return;
    }

    var signer = {
        nome: "",
        cpf: "",
        email: email,
        faceId: "",
        hash: "",
        ipAdress: ""
    }

    assinatura.signers.push(signer);

    var update = await axios.put(`/api/signature/update/signers`, {
        signers: assinatura.signers,
        id: sign_id
    })

    if (update.status == 200) {
        renderListSigners(assinatura, sign_id)
        $('#email').val('')
        $('.addEmail').fadeOut(200)
        $(`#numberSigns${sign_id}`).text(assinatura.signers.length)
    } else {
        error(update.data);
    }

}

async function downPdf(signature, pdfImages) {

    var selo = "data:image/png;base64,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"

    var url = "https://" + window.location.host + "/auditor/" + signature.id;

    var qr = await setQrCode(url);

    var page1 = pdfImages[0];
    var h = 210 + 20;
    var w = regraDeTres(page1.height, page1.width, 210);
    var tamanho = [w, h];

    const doc = new jsPDF({
        format: tamanho,
        compress: true,
    });

    for (let i = 0; i < pdfImages.length; i++) {

        var foto = pdfImages[i];

        if (i > 0) {
            doc.addPage(tamanho);
        }
        doc.addImage(foto.img, 'JPEG', 0, 0, w, 210);

        doc.addImage(qr, 'JPEG', 5, 215, 10, 10);

        doc.setTextColor(100)
        doc.setFontSize(6)
        doc.text(18, 219, 'Esse documento foi assinado digitalmente:')
        doc.text(18, 222, url)

    }

    doc.addPage(tamanho);
    doc.setFillColor(243, 243, 243);
    doc.setDrawColor(243, 243, 243);
    doc.rect(0, 0, w, h, 'F');

    doc.setTextColor(100)
    doc.setFontSize(16)
    doc.text(5, 10, 'Assinaturas:')

    var poW = 5;
    var poH = 15;

    for (let j = 0; j < signature.signers.length; j++) {

        const element = signature.signers[j];

        doc.setTextColor(255, 255, 255)

        doc.addImage(selo, 'JPEG', poW, poH, 110, 30);

        doc.setFont('sans-serif', 'normal')
        doc.setFontSize(8)
        doc.text(poW + 3, poH + 4, `CPF: ${element.cpf}`)

        doc.setFont('sans-serif', 'bold')
        doc.setFontSize(12)
        doc.text(poW + 3, poH + 10, `${element.nome}`)

        doc.setFont('sans-serif', 'normal')
        doc.setFontSize(8)
        doc.text(poW + 3, poH + 15, `Ip do aparelho: ${element.ipAdress}`)

        doc.setFontSize(8)
        doc.text(poW + 3, poH + 20, `${element.date}`)

        doc.setFont('sans-serif', 'bold')
        doc.setTextColor(0, 147, 233)
        doc.setFontSize(9)
        doc.text(poW + 5, poH + 26, `${element.hash}`)

        var poH = poH + 31;

    }

    doc.save(signature.metadata.title);

    $(`#baixarCopia`).text('Baixar cópia assinada');

}

function regraDeTres(a, b, c) {
    return (b * c) / a;
}

async function convertImgToBase64(urlImg) {

    let img = await fetch(`/img/faceid/noowrnubrbdq.jpeg`).then(r => r.blob());
    let imgBase = await blobToBase64(img);

    return imgBase;

}

async function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function setQrCode(text) {

    var elemento = document.createElement('div');

    elemento.id = 'qrcode';

    // Clear Previous QR Code
    $('#qrcode').empty();

    // Set Size to Match User Input
    $('#qrcode').css({
        'width': "300",
        'height': "300"
    })

    // Generate and Output QR Code
    $('#qrcode').qrcode({
        width: "150",
        height: "150",
        text: text
    });

    var c = $('#qrcode canvas')[0];
    var base = c.toDataURL("image/jpeg");

    // $('#qrcode').remove();

    return base;

}

async function openSetFotos() {

    var limit = await verifyPhotosDisponible();

    if (limit == 0) {
        error(`Você já atingiu o limite de fotos este mês.`);
        return;
    }

    $('body').append(`<div class="modal" id="new_photos"></div>`);
    $('#new_photos').siblings().css('filter', 'blur(4px)');
    $('#new_photos').load(`/html/photos.html`);
}

async function closeSetFotos() {
    $('#new_photos').siblings().css('filter', 'none');
    $('#new_photos').remove();
}

async function setFotos() {

    activeMenu02('fotos');
    $(`.dados .container`).addClass('oculto');
    $(`#divfotos`).removeClass('oculto');
    $(`#setPhotos`).html('Carregando...');

    var getPhotos = await axios.get(`/api/photos/list/${card.id}`);
    if (getPhotos.status != 200) {
        error(getPhotos.data);
        return;
    }
    var photos = getPhotos.data;
    var conteudo = "";

    var url = window.location.host + "/registro-de-foto";

    for (let i = 0; i < photos.length; i++) {

        const element = photos[i];

        conteudo += `<div class="foto" id="${element.id}">`;
        conteudo += `<span>#${element.id}</span>`;
        conteudo += `<h6 onclick="openPhotos('${element.id}')">${element.stepsForPhotos.title}</h6>`;
        conteudo += `<input type="url" id="url_photo_${element.id}" onclick="copy('url_photo_${element.id}')" value="${url}/${element.id}">`;
        conteudo += `<button class="arquivarSignature" onclick="avisoDeleteLinkPhoto(${element.id})">Excluir</button>`;
        conteudo += `</div>`;

    }

    $(`#setPhotos`).html(conteudo);


}

async function openPhotos(photo_id) {

    $('body').append(`<div class="modal" id="fotos_criadas"></div>`);
    $('#fotos_criadas').siblings().css('filter', 'blur(4px)');
    $('#fotos_criadas').load(`/html/fotos_criadas.html`, () => {
        const id_photo = photo_id;
        $(`#idPhoto`).val(photo_id);
    });
}

async function setProposals() {

    activeMenu02('proposals');
    $(`.dados .container`).addClass('oculto');
    $(`#divproposals`).removeClass('oculto');
    $(`#setProposals`).html('Carregando...');

    var getProposals = await axios.get(`/api/proposals/listar/${card.id}`);
    if (getProposals.status != 200) {
        error(getProposals.data);
        return;
    }
    var proposals = getProposals.data;
    var conteudo = "";

    var url = window.location.host + "/proposta";

    for (let i = 0; i < proposals.length; i++) {

        const element = proposals[i];

        // console.log(element);

        var idEnconde = btoa(element.id);

        conteudo += `<div class="foto" id="${element.id}">`;
        
        // conteudo += `<span>#${element.id}</span>`;
        if(element.metadata.budget.veiculo){
            conteudo += `<h6 onclick="$('#${element.id} .corpo').slideToggle(50);">${element.metadata.budget.veiculo}</h6>`;
        }else{
            conteudo += `<h6 onclick="$('#${element.id} .corpo').slideToggle(50);"> Proposta #${element.id}</h6>`;
        }
        

        if (element.status == "pending") {
            conteudo += `<div class="status" style="background-color:#febc1f">${element.status}</div>`;
        } else if (element.status == "rejected") {
            conteudo += `<div class="status" style="background-color:#f91e1e;color:white;">${element.status}</div>`;
        } else {
            conteudo += `<div class="status" style="background-color:#5fae85">${element.status}</div>`;
        }

        if (element.metadata.biometria == 'yes') {
            conteudo += `<div class="status icon"><i class="fi fi-rr-mode-portrait"></i></div>`;
        }

        if (element.metadata.payment == 'yes') {
            conteudo += `<div class="status icon"><i class="fi fi-rr-usd-circle"></i></div>`;
        }

        conteudo += `<input type="url" id="url_photo_${element.id}" onclick="copy('url_photo_${element.id}')" value="${url}/${idEnconde}">`;

        conteudo += `<div class="corpo" style="display:none;">`;

        if (element.metadata.photoBiometry && element.metadata.photoBiometry != '') {
            conteudo += "<div class='biometria'>";
            conteudo += `<img src='/img/faceid/${element.metadata.photoBiometry}'>`;
            conteudo += "<div class='texts'>";
            conteudo += `<span>Aceito por:</span>`;
            conteudo += `<h4>${element.metadata.client}</h4>`;
            conteudo += "</div>";
            conteudo += "</div>";
        }

        conteudo += `<table>`;

        conteudo += `<tr>`;
        conteudo += `<th style="max-width: 50px;">Qtd</th>`;
        conteudo += `<th style="max-width: 360px;">Description</th>`;
        if (element.type != 'hinova') {
            conteudo += `<th style="max-width: 120px;">Valor</th>`;
        } else {
            conteudo += `<th style="max-width: 120px;"></th>`;
        }
        conteudo += `<th style="max-width: 120px;">Total</th>`;
        conteudo += `</tr>`;

        for (let j = 0; j < element.metadata.budget.items.length; j++) {
            const item = element.metadata.budget.items[j];
            // //console.log(item)
            conteudo += `<tr>`;
            conteudo += `<td style="max-width: 50px;">${item.qtd}</td>`;
            conteudo += `<td style="max-width: 360px;">${item.description}</td>`;
            if (element.type != 'hinova') {
                conteudo += `<td style="max-width: 120px;">${item.value}</td>`;
            } else {
                conteudo += `<td style="max-width: 120px;"></td>`;
            }
            conteudo += `<td style="max-width: 120px;">${item.totalValue}</td>`;
            conteudo += `</tr>`;
        }

        if (element.type != 'hinova') {

            conteudo += `<tr class="trTotal">`;
            conteudo += `<td></td>`;
            conteudo += `<td></td>`;
            conteudo += `<td>Total</td>`;
            conteudo += `<td>${element.metadata.budget.totalValue}</td>`;
            conteudo += `</tr>`;


            conteudo += `<tr>`;
            conteudo += `<td></td>`;
            conteudo += `<td></td>`;
            conteudo += `<td>Desconto (-${element.metadata.budget.percentDiscount}%):</td>`;
            conteudo += `<td>-${element.metadata.budget.discountValue}</td>`;
            conteudo += `</tr>`;

        }
        conteudo += `<tr>`;
        conteudo += `<td></td>`;
        conteudo += `<td></td>`;
        conteudo += `<td>Valor final:</td>`;
        conteudo += `<td>${element.metadata.budget.finalValue}</td>`;
        conteudo += `</tr>`;
        if (element.metadata.obs) {
            conteudo += `<tr><td>${element.metadata.obs}</td></tr>`;
        }
        conteudo += `</table>`;


        conteudo += `<button class="arquivarSignature" onclick="avisoDeleteLinkProposals(${element.id})">Excluir</button>`;

        if (element.metadata.history && element.metadata.history.length > 0) {
            conteudo += `<br><h2>Histórico:</h2>`;

            for (let j = 0; j < element.metadata.history.length; j++) {
                const historico = element.metadata.history[j];

                conteudo += "<div class='comentario'>";
                conteudo += "<i class='fi fi-rr-time-past'></i>";
                conteudo += "<div class='texts'>";
                conteudo += `<h4>O cliente ${historico.action}</h4>`;
                conteudo += `<span>no dia ${historico.data} às ${historico.hora}</span>`;
                conteudo += "</div>";
                conteudo += "</div>";
            }
        }


        conteudo += `</div>`;
        if (element.metadata.validity) {
            conteudo += `<br><br><span>Validade: ${element.metadata.validity}</span>`;
        }
        conteudo += `</div>`;

    }

    $(`#setProposals`).html(conteudo);

}

async function openSetProposals() {
    $('body').append(`<div class="modal" id="new_proposals"></div>`);
    $('#new_proposals').siblings().css('filter', 'blur(4px)');
    $('#new_proposals').load(`/html/proposals.html`);
}

function avisoDeleteLinkProposals(photo_id) {

    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR este link?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteLinkProposals('${photo_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

async function deleteLinkProposals(photo_id) {

    $('#prosseguir').text('Removendo...');

    var del = await axios.put(`/api/proposals/delete`, {
        id: photo_id
    })

    if (del.status == 200) {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
        $(`#${photo_id}`).remove();
    } else {
        error(del.data)
    }

}

async function setAnexos() {

    activeMenu02('anexos');
    $(`.dados .container`).addClass('oculto');
    $(`#divanexos`).removeClass('oculto');
    $(`#setAnexos`).html('Carregando...');

    var getcard = await axios.get(`/api/card/${card.id}`);

    var meta = JSON.parse(getcard.data.metadata);

    if (!meta.anexos) {
        meta.anexos = [];
    }
    var anexos = meta.anexos;

    //console.log(anexos);

    var arquivo = "";

    var url = window.location.host + "/anexos";

    for (let i = 0; i < anexos.length; i++) {

        const anexo = anexos[i];

        if (anexo.format != undefined) {
            var formato = anexo.format.substr(0, 4);
        } else {
            var formato = 'desc';
        }

        arquivo += `<div id="${anexo.id}" class="capsula" title="${anexo.name.split('.')[0]}">`;
        arquivo += `<i onclick="avisoDeleteAnexo('${card.id}', '${anexo.id}', '${anexo.name.split('.')[0]}','${anexo.filename}')" class="close fi fi-rr-cross-circle"></i>`;
        arquivo += `<a href="/anexos/${anexo.filename}" target="_blank">`;

        if (anexo.type == 'image') {
            arquivo += `<div class="arquivo" style="background-image:url(/anexos/${anexo.filename});">`;
            arquivo += `</div>`;
        } else {
            arquivo += `<div class="arquivo">`;
            arquivo += `${formato}`;
            arquivo += `</div>`;
        }

        arquivo += `<label>${anexo.name.split('.')[0].substr(0, 10)}...</label>`;
        arquivo += `</a>`;
        arquivo += `</div>`;

    }

    $(`#setAnexos`).html(arquivo);

}

function getBase64(file) {

    return new Promise((resolve, reject) => {

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            // // //console.log(reader.result);
            return resolve(reader.result);
        };
        reader.onerror = function(error) {
            // //console.log('Error: ', error);
            return reject('erro');
        };
    })
}


$(`#new_file`).on('change', async() => {
    var id = newId();
    var img = document.querySelector('#new_file').files[0];
    var base = await getBase64(img);

    // console.log(base)

    var ty = img.type.split('/');
    var tipo = ty[0];
    var form = ty[1];

    var getcard = await axios.get(`/api/card/${card.id}`);
    var meta = JSON.parse(getcard.data.metadata);

    if (!meta.anexos) {
        meta.anexos = [];
    }

    if (form == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        var form = 'xls';
    }

    if (form == 'svg+xml') {
        var form = 'svg';
    }

    var anexo = {
        id: id,
        type: tipo,
        format: form,
        name: img.name
    }

    var arquivo = "";

    if (anexo.format != undefined) {
        var formato = anexo.format.substr(0, 4);
    } else {
        var formato = "undefined";
    }

    arquivo += `<div id="${anexo.id}" class="capsula" title="${anexo.name.split('.')[0]}">`;
    arquivo += `<i onclick="avisoDeleteAnexo('${card.id}', '${anexo.id}', '${anexo.name.split('.')[0]}', '${anexo.id}.${anexo.format}')" class="close fi fi-rr-cross-circle"></i>`;
    arquivo += `<a href="/anexos/${anexo.id}.${anexo.format}" target="_blank">`;

    if (anexo.type == 'image') {
        arquivo += `<div class="arquivo" style="background-image:url(${base})">`;
        arquivo += `</div>`;
    } else {
        arquivo += `<div class="arquivo">`;
        arquivo += `${formato}`;
        arquivo += `</div>`;
    }

    arquivo += `<label>${anexo.name.split('.')[0].substr(0, 10)}...</label>`;
    arquivo += `</a>`;
    arquivo += `<h4 class="carregando">Carregando...</h4>`;
    arquivo += `</div>`;

    $(`#setAnexos`).prepend(arquivo);

    axios.put(`/api/card/update/metadata/anexo`, {
        anexo: anexo,
        base64: base,
        card_id: card.id,
        meta: meta,
    }).then((sucess) => {

        if (sucess.status == 200) {

            // //console.log(anexo)
            $(`#${anexo.id} .carregando`).remove();
            $(`#${anexo.id} a`).removeClass(`pending`);

            card.metadata = JSON.stringify(meta);

            $(`#new_file`).val('');

            setTimeout(() => {
                // setAnexos();
                localStorage.setItem('card', JSON.stringify(card));
            }, 200);

        } else {
            $(`#${anexo.id} h4.carregando`).text('Error').css('color', 'red');
            error(sucess.data)
            alert(sucess.data)
        }

    }).catch((error) => {
        //console.log(error);
        alert(error)
    })


})


function avisoDeleteAnexo(card_id, anexo_id, arquivo, filename) {

    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR o arquivo "${arquivo}"?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso">Cancelar</button>`
    modal += `<button id="prosseguir" onclick="deleteAnexo('${card_id}', '${anexo_id}', '${filename}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#fechar_aviso`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

async function deleteAnexo(card_id, anexo_id, filename) {

    var getcard = await axios.get(`/api/card/${card.id}`);

    var meta = JSON.parse(getcard.data.metadata);

    var newAnexos = meta.anexos.filter(item => item.id !== anexo_id);

    meta.anexos = newAnexos;

    axios.put(`/api/card/delete/metadata/anexo`, {
        filename: filename,
        card_id: card_id,
        meta: meta,
    }).then((sucess) => {

        if (sucess.status == 200) {

            card.metadata = JSON.stringify(meta);

            localStorage.setItem('card', JSON.stringify(card));

            $(`#${anexo_id}`).remove();

            $('#modal_aviso').siblings().css('filter', 'none');
            $('#modal_aviso').remove();

            // openCard(card_id);
            setTimeout(() => {
                // setAnexos();
            }, 200)

        } else {
            error(sucess.data);
        }

    }).catch((error) => {

        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
        // //console.log(error);
    })

}

if (meta.cardValue) {
    $(`#valorCard`).html(`<i class="fi fi-rr-badge-dollar"></i> ${meta.cardValue}`);
    $(`#valorDoCard`).val(`${meta.cardValue}`);
}

if (meta.tags) {
    for (let i = 0; i < meta.tags.length; i++) {
        const element = meta.tags[i];
        addTag(element.id, element.name, element.color, card.id);
    }
}


function setListColorTags() {

    var cores = ['#fcba03', '#fc8003', '#03fcf0', '#03fc4e', '#038cfc', '#be03fc', '#fc0356', '#bfa6ff', '#333'];
    var cor = ""
    for (let i = 0; i < cores.length; i++) {
        const element = cores[i];
        cor += `<label style="background-color: ${element};"><input value="${element}" type="radio" name="corTag" checked></label>`;
    }
    $(`.cores`).html(cor)
}

function setCardValue(valor) {

    // // //console.log(valor);

    if (!meta.cardValue) {
        meta.cardValue = "";
    }

    meta.cardValue = valor;

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card.id
    }).then((sucess) => {
        if (sucess.status == 200) {

            if (valor != "") {
                $(`#valorCard`).html(`<i class="fi fi-rr-badge-dollar"></i> ${valor}`);

                $(`#card_${card.id} .icones #cardValue_${card.id}`).remove();

                $(`#card_${card.id} .icones`).append(`<div id="cardValue_${card.id}"><i class="fi fi-rr-badge-dollar"></i> <span class="cardValue">${valor}</span></div>`);

            } else {
                $(`#valorCard`).html(`<i class="fi fi-rr-badge-dollar"></i> Valor`);

                $(`#card_${card.id} .icones #cardValue_${card.id}`).remove();
            }

            console.log(card)

            setTimeout(()=>{
                setTotalValuesSteps(card.step_id);
            },200)



            $('#valor').slideUp(200);

        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log(erro);
    })
}

function setListPersons() {
    axios.get(`/api/users/listar`).then(async(nomes) => {

        var buscaCard = await axios.get(`/api/card/${card.id}`);
        let cardHere = buscaCard.data;
        let metaHere = JSON.parse(cardHere.metadata)

        if (metaHere.persons && metaHere.persons.length > 0) {
            var lista = nomes.data.filter(item => item.id == metaHere.persons.id);

            $(`#abrePessoas`).html(`<i class="fi fi-rr-user-add"></i> Responsáveis (${metaHere.persons.length})`);
        } else {
            var lista = nomes.data;
        }

        var listaNomes = "";
        for (element of lista) {

            var pessoa = {
                id: element.id,
                name: element.name
            }

            listaNomes += `<button id="btm${pessoa.id}" class="personsList" onclick="savePeopleInCard('${pessoa.id}', '${pessoa.name}',${card.id})">${pessoa.name}</button>`;

        }

        $(`.resultSearch`).html(listaNomes)

    }).catch((resultado) => {
        console.error(resultado);
        alert(resultado);

    });
}

async function savePeopleInCard(idPerson, namePerson, card_id) {

    var buscaCard = await axios.get(`/api/card/${card.id}`);
    let cardHere = buscaCard.data;
    let metaHere = JSON.parse(cardHere.metadata)

    if (!metaHere.persons) {
        metaHere.persons = [];
    } else {

    }

    var person = {
        id: idPerson,
        nome: namePerson
    }

    metaHere.persons.push(person);

    axios.put(`/api/card/update/metadata`, {
        metadata: metaHere,
        id: card_id
    }).then((sucess) => {
        if (sucess.status == 200) {
            addPerson(idPerson, namePerson, card_id);
            $(`#btm${idPerson}`).remove();
            // setListPersons();
            $(`#abrePessoas`).html(`<i class="fi fi-rr-user-add"></i> Responsáveis (${metaHere.persons.length})`);
        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log(erro);
    })


}

function saveTagInCard(tagText, card_id) {

    if (!meta.tags) {
        meta.tags = [];
    }

    if (tagText == "") {
        return;
    }

    var cor = $(`input[name="corTag"]:checked`).val();
    var id = newId();

    var tag = {
        id: id,
        name: tagText,
        color: cor
    }

    meta.tags.push(tag);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((sucess) => {
        if (sucess.status == 200) {
            saveTagInPipe(tag);
            addTag(tag.id, tagText, tag.color, card_id);
            addTagInMiniCard(tag.id, tag.color, tagText, card_id);
            $(`#newTag`).val('');
        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log('erro na linha 324 ' + erro);
    })

}

function saveTagInCardFromList(tagId, tagText, card_id, color) {

    if (!meta.tags) {
        meta.tags = [];
    }

    if (tagText == "") {
        return;
    }

    var cor = color;
    var id = tagId;

    var tag = {
        id: id,
        name: tagText,
        color: cor
    }

    meta.tags.push(tag);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((sucess) => {
        if (sucess.status == 200) {
            addTag(tag.id, tagText, tag.color, card_id);
            $(`#newTag`).val('')

            addTagInMiniCard(tag.id, tag.color, tagText, card_id);
        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log('erro na linha 324 ' + erro);
    })

}

function removeTagInMiniCard(tagId, card_id) {
    $(`#card_${card_id} .tags #cardTag${tagId}`).remove();
}

function addTagInList(tagId, tagName, color) {

    var tag = `<div class="person" id="${tagId}" onclick="saveTagInCardFromList('${tagId}','${tagName}', '${card.id}', '${color}')" style="background-color:${color}">`;
    tag += `<label>${tagName}</label>`;
    tag += `</div>`;

    $('#tags .list').append(tag);

}

async function listStepsFromPipeConect(atualStep) {
    $('.movements').html('')
    axios.get(`/api/step/listar/${card.pipe_id}`).then(async(res) => {

        const steps = res.data
        var listaSteps = "";

        for (let i = 0; i < steps.length; i++) {
            const element = steps[i];

            var pipeConect = await getPipeById(element.id);
            if(element.id != atualStep && pipeConect != null){
                listaSteps += `<button id="btmStep${pipeConect.id}" class="step" onclick="moveCardToNewStepAndNewPipe(${card.id}, ${element.id}, ${pipe_id})" style="color:${pipeConect.color};background-color:${pipeConect.color}11">${pipeConect.title}<i class="fi fi-rr-arrow-small-right"></i></button>`;
                // listaSteps += `<button id="btmStep${element.id}" class="step" onclick="moveCardToNewStep(${card.id}, ${element.id})" style="color:${element.color};background-color:${element.color}11">${element.title}<i class="fi fi-rr-arrow-small-right"></i></button>`;
            }
        }

        $('.movements').append(listaSteps)

    }).catch((error) => {
        // //console.log(error);
    })
}

async function saveTagInPipe(tag) {

    // var pipe = await axios.get(`/pipe/view/${pipe.id}`);

    if (!pipe.metadata.tags) {
        pipe.metadata['tags'] = [];
    }

    pipe.metadata.tags.push(tag);

    axios.put(`/api/pipe/update/metadata`, {
        metadata: pipe.metadata,
        id: pipe.id
    }).then((sucess) => {
        if (sucess.status == 200) {
            // // //console.log('Tag salva no pipe...');
        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log('erro na linha 371' + erro);
    })

}

function keyCodePressed(evt) {
    evt = evt;
    var key = evt.keyCode;
    return String.fromCharCode(key);
}

$(`#valorDoCard`).on(`keydown`, (e) => {
    if (e.keyCode == 13) {
        setCardValue($(`#valorDoCard`).val());
    }
})

async function removePeople(idPerson, idCard) {

    var buscaCard = await axios.get(`/api/card/${idCard}`);
    let cardHere = buscaCard.data;
    let metaHere = JSON.parse(cardHere.metadata)

    var newPersons = metaHere.persons.filter(item => item.id !== idPerson);

    metaHere.persons = newPersons;

    axios.put(`/api/card/update/metadata`, {
        metadata: metaHere,
        id: idCard
    }).then(async(sucess) => {

        if (sucess.status == 200) {
            $(`#${idPerson}`).remove();
            setListPersons();

            var getUser = await axios.get(`/api/users/get/${idPerson}`);
            if (getUser.status != 200) {
                alert(getUser.data);
                return;
            }
            var user = getUser.data;

            var getCard = await axios.get(`/api/card/${idCard}`);
            if (getCard.status != 200) {
                alert(getCard.data);
                return;
            }
            var card = getCard.data;
            var metaCard = JSON.parse(card.metadata);

            var subject = `Você foi removido do Card "${metaCard.title}" no Pipedone!`
            var msg = "";
            msg += `Olá ${user.name.split(" ")[0]}!`;
            msg += `<br><br>`;
            msg += `Você foi removido do Card ${metaCard.title}.`;
            msg += `<br><br>`;
            msg += `Caso acredite que tenha ocorrido algum engano, entre em contato com o administrador da sua conta.`;
            msg += `<br><br>`;
            msg += `Equipe Pipedone`;

            sentMail(msg, user.email, subject);

        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log(erro);
    })
}

async function removeTag(idTag, idCard) {

    //console.log(idTag)
    //console.log(idCard)
    $(`div#${idTag}`).remove();
    removeTagInMiniCard(idTag, idCard);

    var newTags = meta.tags.filter(item => item.id !== idTag);

    meta.tags = newTags;

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: idCard
    }).then((sucess) => {
        if (sucess.status == 200) {

        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log(erro);
    })
}

async function setPeople(card_id) {

    var getCard = await axios.get(`/api/card/${card_id}`);
    if (getCard.status != 200) {
        error(getCard.data);
        return;
    }
    var metaCard = JSON.parse(getCard.data.metadata);

    if (metaCard.persons) {
        for (let i = 0; i < metaCard.persons.length; i++) {
            const element = metaCard.persons[i];
            addPerson(element.id, element.nome, card_id);
        }
    }

}

async function setTags() {

    var busca = await axios.get(`/pipe/view/${card.pipe_id}`);
    if (busca.status != 200) {
        error(busca.data);
        return;
    }

    var pipe = busca.data;

    if (pipe.metadata != null && pipe.metadata.tags) {
        for (let i = 0; i < pipe.metadata.tags.length; i++) {
            const element = pipe.metadata.tags[i];
            addTagInList(element.id, element.name, element.color)
        }
    }

}

// function setCalendar(numberDay, calendar_id) {

//     // variaveis globais

//     let nav = numberDay;
//     let clicked = null
//     let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []


//     // variavel do modal:
//     const newEvent = document.getElementById('newEventModal')
//     const deleteEventModal = document.getElementById('deleteEventModal')
//     const backDrop = document.getElementById('modalBackDrop')
//     const eventTitleInput = document.getElementById('eventTitleInput')
//         // --------
//     const calendar = document.getElementById(calendar_id) // div calendar:
//     const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'] //array with weekdays:

//     //funções
//     //função load() será chamada quando a pagina carregar:

//     function load() {
//         const date = new Date()

//         //mudar titulo do mês:
//         if (nav !== 0) {
//             date.setMonth(new Date().getMonth() + nav)
//         }

//         const day = date.getDate()
//         const month = date.getMonth()
//         const year = date.getFullYear()

//         const daysMonth = new Date(year, month + 1, 0).getDate()
//         const firstDayMonth = new Date(year, month, 1)

//         const dateString = firstDayMonth.toLocaleDateString('pt-br', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'numeric',
//             day: 'numeric',
//         })

//         const paddinDays = weekdays.indexOf(dateString.split(', ')[0])

//         //mostrar mês e ano:

//         $(`#${calendar_id}`).siblings('.monthDisplay').html(`${date.toLocaleDateString('pt-br',{month: 'long'})}, ${year}`);

//         var anterior = `<button onclick="setCalendar(${nav-1},'${calendar_id}')"><i class="fi fi-rr-angle-left"></i></button>`;
//         $(`#${calendar_id}`).siblings('.monthDisplay').prepend(anterior);

//         var proximo = `<button onclick="setCalendar(${nav+1},'${calendar_id}')"><i class="fi fi-rr-angle-right"></i></button>`;
//         $(`#${calendar_id}`).siblings('.monthDisplay').append(proximo);

//         calendar.innerHTML = ''

//         // criando uma div com os dias:

//         for (let i = 1; i <= paddinDays + daysMonth; i++) {
//             const dayS = document.createElement('div')
//             dayS.classList.add('day')

//             const dayString = `${month + 1}/${i - paddinDays}/${year}`;

//             var dia = i - paddinDays;
//             if (dia < 10) {
//                 var dia = "0" + dia;
//             }
//             var mes = month + 1;
//             if (mes < 10) {
//                 var mes = "0" + mes;
//             }
//             const diaEscolhido = `${year}-${mes}-${dia}`;
//             dayS.id = `day-${diaEscolhido}`;

//             //condicional para criar os dias de um mês:

//             if (i > paddinDays) {
//                 dayS.innerText = i - paddinDays


//                 const eventDay = events.find(event => event.date === dayString)

//                 if (i - paddinDays === day && nav === 0) {
//                     dayS.id = `currentDay`
//                 }


//                 if (eventDay) {
//                     const eventDiv = document.createElement('div')
//                     eventDiv.classList.add('event')
//                     eventDiv.innerText = eventDay.title
//                     dayS.appendChild(eventDiv)

//                 }

//                 dayS.addEventListener('click', () => selDay(card.createdAt, diaEscolhido))


//             } else {
//                 dayS.classList.add('padding')
//             }

//             calendar.appendChild(dayS)
//         }

//     }

//     load();

// }

function setCalendar(numberDay, calendar_id) {
    // variaveis globais

    let nav = numberDay;
    let clicked = null;
    let events = localStorage.getItem("events") ?
        JSON.parse(localStorage.getItem("events")) : [];

    // variavel do modal:
    const newEvent = document.getElementById("newEventModal");
    const deleteEventModal = document.getElementById("deleteEventModal");
    const backDrop = document.getElementById("modalBackDrop");
    const eventTitleInput = document.getElementById("eventTitleInput");
    // --------
    const calendar = document.getElementById(calendar_id); // div calendar:
    const weekdays = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
    ]; //array with weekdays:

    //funções
    //função load() será chamada quando a pagina carregar:

    function load() {
        const date = new Date();

        //mudar titulo do mês:

        if (nav !== 0) {
            date.setMonth(nav);
        }

        const day = date.getDate();
        const month = nav;
        const year = date.getFullYear();
        console.log(year);
        /* nav > 0 ? nav <12 ? nav : nav - (12*Math.ceil(nav/12)) : nav + (12*Math.ceil(nav/12)) */
        const daysMonth = new Date(year, month + 1, 0).getDate();
        const firstDayMonth = new Date(year, month, 1);

        const dateString = firstDayMonth.toLocaleDateString("pt-br", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        const monthString = firstDayMonth.toLocaleString("pt-br", {
            month: "long",
        });

        const paddinDays = weekdays.indexOf(dateString.split(", ")[0]);

        //mostrar mês e ano:

        $(`#${calendar_id}`)
            .siblings(".monthDisplay")
            .html(`${monthString}, ${year}`);

        var anterior = `<button onclick="setCalendar(${nav - 1
            },'${calendar_id}')"><i class="fi fi-rr-angle-left"></i></button>`;
        $(`#${calendar_id}`).siblings(".monthDisplay").prepend(anterior);

        var proximo = `<button onclick="setCalendar(${nav + 1
            },'${calendar_id}')"><i class="fi fi-rr-angle-right"></i></button>`;
        $(`#${calendar_id}`).siblings(".monthDisplay").append(proximo);

        calendar.innerHTML = "";

        // criando uma div com os dias:

        for (let i = 1; i <= paddinDays + daysMonth; i++) {
            const dayS = document.createElement("div");
            dayS.classList.add("day");

            const dayString = `${(((nav % 12) + 12) % 12) + 1}/${i - paddinDays
                }/${year}`;

            var dia = i - paddinDays;
            if (dia < 10) {
                var dia = "0" + dia;
            }
            var calculoMes = ((nav % 12) + 12) % 12;
            var mes = calculoMes + 1;
            if (mes < 10) {
                var mes = "0" + mes;
            }
            const diaEscolhido = `${year}-${mes}-${dia}`;
            dayS.id = `day-${diaEscolhido}`;

            //condicional para criar os dias de um mês:

            if (i > paddinDays) {
                dayS.innerText = i - paddinDays;

                const eventDay = events.find((event) => event.date === dayString);

                if (i - paddinDays === day && nav === 0) {
                    dayS.id = `currentDay`;
                }

                if (eventDay) {
                    const eventDiv = document.createElement("div");
                    eventDiv.classList.add("event");
                    eventDiv.innerText = eventDay.title;
                    dayS.appendChild(eventDiv);
                }

                dayS.addEventListener("click", () =>
                    selDay(card.createdAt, diaEscolhido)
                );
            } else {
                dayS.classList.add("padding");
            }

            calendar.appendChild(dayS);
        }
    }

    load();
}

var date = new Date();
var mes = date.getMonth();

setCalendar(mes, "calendar");


if (card.deadline != null && card.deadline != "" && card.deadline != '0000-00-00') {

    var d = card.deadline.split('T')[0].split('-');
    var data = d[2] + '/' + d[1] + '/' + d[0];
    $(`#dataDoCard`).html(`<i class="fi fi-rr-calendar"></i> ${data}`);

    $(`#day-${card.deadline}`).addClass('selected');

}

// if (meta && meta.period != null && meta.period != "") {

//     $(`#inicio_card`).val(meta.period.inicio);
//     $(`#fim_card`).val(meta.period.fim).attr('disabled', false);

//     var d1 = meta.period.inicio.split('-');
//     var data1 = d1[2] + '/' + d1[1] + '/' + d1[0];

//     var d2 = meta.period.fim.split('-');
//     var data2 = d2[2] + '/' + d2[1] + '/' + d2[0];

//     $(`#dataDoCard`).html(`${data1} <i class="fi fi-rr-angle-right"></i> ${data2}`);

// }

$('.openCard').append(`<button id="deleteCard"  title="Arquivar" onclick="avisodeleteCardFromNewStep(${card.id}, ${card.step_id})"><i class="fi fi-rr-archive"></i> Arquivar</button>`);

setForms()

setTasks();

$('#menu-card-01').click(() => {
    $('.circle').removeClass('ativo');
    $('#menu-card-01').addClass('ativo');

    $('.history, .movements').animate({
        right: '-100%'
    }, 200)

    $('.dados').animate({
        right: '0px'
    }, 200)
})

$('#menu-card-02').click(() => {
    $('.circle').removeClass('ativo');
    $('#menu-card-02').addClass('ativo');

    $('.dados, .movements').animate({
        right: '-100%'
    }, 200)

    $('.history').animate({
        right: '0px'
    }, 200)
})

$('#menu-card-03').click(() => {
    $('.circle').removeClass('ativo');
    $('#menu-card-03').addClass('ativo');

    $('.dados, .history').animate({
        right: '-100%'
    }, 200)

    $('.movements').animate({
        right: '0px'
    }, 200)
})


function selDay(createdAt, prazo) {

    if (!meta.period) {
        meta['period'] = {};
    }

    var datas = {
        inicio: createdAt.split('T')[0],
        fim: prazo
    }

    meta.period = datas;

    axios.put(`/api/card/update/deadline`, {
        deadline: prazo,
        metadata: meta,
        id: card.id
    }).then((sucess) => {
        if (sucess.status == 200) {

            if (datas.fim == null) {

                $(`#dataDoCard`).html(`<i class="fi fi-rr-calendar"></i> Prazo`);
                $(`#deadline_${card.id}`).remove();

            } else {

                var d = datas.fim.split('-');
                var diaEscolhido = d[2] + '/' + d[1] + '/' + d[0];

                $(`#dataDoCard`).html(`<i class="fi fi-rr-calendar"></i> ${diaEscolhido}`);

                if ($(`#deadline_${card.id}`)) {
                    $(`#deadline_${card.id}`).html(`<i class="fi fi-rr-calendar"></i> ${diaEscolhido}`);
                } else {
                    $(`#card_${card.id} .icones`).append(`<div id="deadline_${card.id}"><i class="fi fi-rr-calendar"></i> ${diaEscolhido}</div>`);
                }


            }

            addHistory(card.id, `Mudou o prazo do cartão para ${diaEscolhido}`);

            $('#datas-calendar').slideUp(200);

            $(`.day`).removeClass('selected');
            $(`#day-${prazo}`).addClass('selected');

        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        // //console.log(erro);
    })
}


function eraseDay() {

    var datas = {
        inicio: "",
        fim: "",
    }

    if (!meta.period) {
        meta['period'] = {};
    }

    meta.period = datas;

    axios.put(`/api/card/update/deadline`, {
        deadline: null,
        metadata: meta,
        id: card.id
    }).then((sucess) => {
        if (sucess.status == 200) {

            $(`#dataDoCard`).html(`<i class="fi fi-rr-calendar"></i> Prazo`);
            $(`#deadline_${card.id}`).remove();

            $('#datas-calendar').slideUp(200);

            addHistory(card.id, `Removeu as datas deste cartão.`);

        } else {
            error(sucess.data)
        }
    }).catch((erro) => {
        //console.log(erro);
    })
}


$(`#inicio_card`).change(() => {

    $(`#fim_card`)
        .attr('min', $(`#inicio_card`).val())
        .attr('disabled', false)

    if (new Date($(`#inicio_card`).val()) > new Date($(`#fim_card`).val())) {
        $(`#fim_card`).val('')
    } else {

        // // //console.log($(`#fim_card`).val())

        if ($(`#fim_card`).val() != "") {
            var datas = {
                inicio: $(`#inicio_card`).val(),
                fim: $(`#fim_card`).val(),
            }

            selDay(datas);
            $('#datas-calendar').slideUp(200);

        }

    }
})

$(`#fim_card`).change(() => {

    var datas = {
        inicio: $(`#inicio_card`).val(),
        fim: $(`#fim_card`).val(),
    }

    selDay(datas);
    $('#datas-calendar').slideUp(200);

})

function addElement(idElement, tipo) {

    switch (tipo) {
        case 'radio':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="radio" disabled>`;
            elemento += `<label onblur="ediSubTitle('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElement('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);


            var fields = newCampoFormCard;

            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;

        case 'checkbox':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="checkbox" disabled>`;
            elemento += `<label onblur="ediSubTitle('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElement('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);

            var fields = newCampoFormCard;

            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;
        default:
            break;
    }
}

function addElementEdit(idElement, tipo) {

    switch (tipo) {
        case 'radio':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="radio" disabled>`;
            elemento += `<label onblur="ediSubTitleEdit('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElementEdit('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);


            var fields = meta.form.fields;

            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;

        case 'checkbox':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="checkbox" disabled>`;
            elemento += `<label onblur="ediSubTitleEdit('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElementEdit('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);

            var fields = meta.form.fields;

            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;
        default:
            break;
    }
}

function ediSubTitleEdit(idElement, idSubElement) {

    var formulario = meta.form.fields;
    var fields = meta.form.fields;
    var newText = $(`#label_${idSubElement} span.titleCampo`).text()
        // $(`div#${idSubElement} input`).val(newText)

    // //console.log(fields);
    // //console.log(newText);

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var campos = element.meta.campos;

            for (let j = 0; j < campos.length; j++) {
                const element = campos[j];

                if (element.id == idSubElement) {

                    element.option = newText;

                }

            }
        }

    }

}

function generatorElement(key) {

    switch (key) {

        case 'el_title':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;
            strHTML += `<h2 onblur="ediTitle('${id}')" contentEditable="true" class="title">Título</h2>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'title',
                description: 'Título',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_subTitle':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<p onblur="ediTitle('${id}')" contentEditable="true" class="title">Título</p>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'subTitle',
                description: 'Subtítulo',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_break':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<hr>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'breakLine',
                description: '',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_text':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Titulo do campo</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'text',
                description: 'Titulo do campo',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_file':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Titulo do campo</h4>`;
            strHTML += `<input type="file" disabled>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'file',
                description: 'Titulo do campo',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_placa':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Placa</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'placa',
                description: 'Placa',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_data':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Data</h4>`;
            strHTML += `<input type="date" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'date',
                description: 'Data',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_year':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Data</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'year',
                description: 'Ano',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_phone':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Telefone</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'phone',
                description: 'Telefone',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_cpf':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">CPF</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'cpf',
                description: 'CPF',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_hora':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Hora</h4>`;
            strHTML += `<input type="time" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'time',
                description: 'Hora',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_textarea':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var strHTML = `<div class="divElemento" id="${id}">`;
            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Titulo do campo</h4>`;
            strHTML += `<textarea disabled></textarea>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'textarea',
                description: 'Titulo do campo',
                meta: {}
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_radio':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Titulo do campo</h4>`;

            strHTML += `<div class="label" id="${id2}">`;
            strHTML += `<input name="${id}" value="Opção 01" type="radio" disabled>`;
            strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            strHTML += `</div>`;

            strHTML += `<label onclick="addElement('${id}', 'radio')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'radio',
                description: 'Titulo do campo',
                meta: {
                    campos: [{
                        option: 'Opção',
                        id: id2
                    }]
                }
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

        case 'el_checkbox':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Titulo do campo</h4>`;

            strHTML += `<div class="label" id="${id2}">`;
            strHTML += `<input name="${id}" value="Opção 01" type="checkbox" disabled>`;
            strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">Opção</label>`
            strHTML += `</div>`;

            strHTML += `<label onclick="addElement('${id}', 'checkbox')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += '</div>';

            var posit = newCampoFormCard.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'checkbox',
                description: 'Titulo do campo',
                meta: {
                    campos: [{
                        option: 'Opção',
                        id: id2
                    }]
                }
            }

            newCampoFormCard.push(field)

            var elemento = strHTML;
            break;

    }

    elemento += `<button class="btmCircular btmNovoCampo" onclick="addNovoCampo()">Adicionar</button>`;

    return elemento;
}

function ediTitleEdit(idElement) {

    var newText = $(`#${idElement} h4`).text()
        //console.log(newText)

    var arrayEdit = meta.form.fields.filter(item => item.id == idElement)[0];
    var arrayNew = meta.form.fields.filter(item => item.id != idElement);

    arrayEdit.description = newText;

    arrayNew.push(arrayEdit);
    meta.form.fields.length = 0;

    for (array of arrayNew) {
        meta.form.fields.push(array)
    }

}

function ediTitle(idElement) {

    var newText = $(`div#${idElement} .title`).text()

    var arrayEdit = newCampoFormCard.filter(item => item.id == idElement)[0];
    var arrayNew = newCampoFormCard.filter(item => item.id != idElement);

    arrayEdit.description = newText;

    arrayNew.push(arrayEdit);
    newCampoFormCard.length = 0;

    for (array of arrayNew) {
        newCampoFormCard.push(array)
    }

}

function ediSubTitle(idElement, idSubElement) {

    var formulario = newCampoFormCard;
    var fields = newCampoFormCard;
    var newText = $(`div#${idSubElement} .text`).text()
    $(`div#${idSubElement} input`).val(newText)

    // //console.log(fields);
    // //console.log(newText);

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var campos = element.meta.campos;

            for (let j = 0; j < campos.length; j++) {
                const element = campos[j];

                if (element.id == idSubElement) {

                    element.option = newText;

                }

            }
        }

    }

}

function delElement(idElement) {

    var newArray = newCampoFormCard.filter(item => item.id !== idElement);

    newCampoFormCard.length = 0;

    for (array of newArray) {
        newCampoFormCard.push(array)
    }

    $(`#${idElement}`).remove();

}

function delElementEdit(idElement) {

    var newArray = meta.form.fields.filter(item => item.id !== idElement);

    meta.form.fields.length = 0;

    for (array of newArray) {
        meta.form.fields.push(array)
    }

    $(`#${idElement}`).remove();

}

function delSubElementEdit(idSubElement, idElement) {

    var formulario = meta.form.fields;
    var fields = meta.form.fields;

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var newArray = element.meta.campos.filter((item) => item.id !== idSubElement);
            element.meta.campos = newArray;
        }

    }

    $(`#${idSubElement}`).remove();

}

function delSubElement(idSubElement, idElement) {

    var formulario = newCampoFormCard;
    var fields = newCampoFormCard;

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var newArray = element.meta.campos.filter((item) => item.id !== idSubElement);
            element.meta.campos = newArray;
        }

    }

    $(`#${idSubElement}`).remove();

}

async function saveMetaCard(novoMeta, card_id) {

    var saveCard = await axios.put(`/api/card/update/metadata`, {
        metadata: novoMeta,
        id: card_id
    })

    return saveCard;
}

async function addNovoCampo() {

    if (!meta.form.fields || meta.form.fields == undefined || meta.form.fields == null) {
        meta.form.fields = [];
    }

    var posi = meta.form.fields.length;

    newCampoFormCard[0].position = posi + 1;

    meta.form.fields.push(newCampoFormCard[0]);

    //console.log(meta)

    var metaSave = await saveMetaCard(meta, card.id);

    if (metaSave.status == 200) {

        $('#divNovoCampo').slideToggle(200);
        $(`#${newCampoFormCard[0].id}`).remove();

        while (newCampoFormCard.length) {
            newCampoFormCard.pop('')
        }

        setForms();

    }

}

async function novoCampo(element) {

    while (newCampoFormCard.length) {
        newCampoFormCard.pop('')
    }

    var campo = await generatorElement(`el_${element}`);

    $('#novocampo_type').addClass(element);
    $('.setNovoCampo').html(campo);

}

function activeEditFormInCard() {

    $('.elemento').addClass('editing');

    $('#editCamposFormInCard').fadeOut(200);
    $('#saveEditFormInCard').fadeIn(200);
    $('#novoCampoInCard').fadeIn(200);
    $('#desactiveEditFormInCard').fadeIn(200);

    for (field of meta.form.fields) {

        const id = field.id;

        $(`#${id} input, #${id} textarea`).attr('disabled', true);

        if (field.type == "radio" || field.type == "checkbox") {
            $(`#${id}`).append(`<label onclick="addElementEdit('${id}', '${field.type}')" class="new">+ Adicionar opção</label>`);

            for (subCampo of field.meta.campos) {

                $(`#label_${subCampo.id} span.titleCampo`)
                    .attr(`contentEditable`, 'true')
                    .attr('onblur', `ediSubTitleEdit('${id}', '${subCampo.id}')`)
                    .keypress((e) => {
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            ediSubTitleEdit(`${id}`, `${subCampo.id}`);
                        }
                    })

            }

        }

        $(`#${id}`).append(`<h6 onclick="delElementEdit('${id}')">Excluir</h6>`);

        $(`#${id} h4`)
            .attr(`contentEditable`, 'true')
            .attr('onblur', `ediTitleEdit('${id}')`)
            .keypress((e) => {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    ediTitleEdit(`${id}`);
                }
            })
    }
}

function desactiveEditFormInCard() {

    $('.elemento').removeClass('editing');

    $('#editCamposFormInCard').fadeIn(200);
    $('#saveEditFormInCard').fadeOut(200);
    $('#novoCampoInCard').fadeOut(200);
    $('#desactiveEditFormInCard').fadeOut(200);

    for (field of meta.form.fields) {

        const id = field.id;

        $(`#${id} input, #${id} textarea`).attr('disabled', false);

        if (field.type == "radio" || field.type == "checkbox") {
            $(`#${id} .new`).remove();

            for (subCampo of field.meta.campos) {

                $(`#label_${subCampo.id} span.titleCampo`)
                    .attr(`contentEditable`, false)
                    .attr('onblur', ``)
                    .keypress((e) => {
                        if (e.keyCode == 13) {

                        }
                    })

            }

        }

        $(`#${id} h6`).remove();

        $(`#${id} h4`)
            .attr(`contentEditable`, false)
            .attr('onblur', ``)
            .keypress((e) => {
                if (e.keyCode == 13) {

                }
            })
    }
}

async function saveEditFormInCard() {
    var save = await saveMetaCard(meta, card.id);

    if (save.status == 200) {
        setForms();
        desactiveEditFormInCard();
    }
}

async function setBmtNewCar() {

    var apps = await getAppsInstall();

    if (apps.includes('hinova_sincronismo_associado')) {
        $('nav.menu02').append(`<button class="btmCircular" onclick="openNewCar()" id="newCar"><i class="fi fi-rr-car-side"></i> Novo Veículo</button>`);
    }

}

async function openCar(car_id, card_id) {

    var getCard = await getCardById(card_id);
    var metaCard = JSON.parse(getCard.metadata);
    var cars = metaCard.cars;
    var car = cars.filter(item => item.id == car_id)[0];

    // console.log(car)
    activeMenu02(car_id);

    $(`.dados .container`).addClass('oculto');
    $(`#divcar`).removeClass('oculto');
    var dados = "";

    for (element of car.campos) {

        var valor = car.values.filter(item => item.id == element.id)[0];

        dados += `<div class="elemento" id="${element.id}">`;
        dados += generatorElementVeiculo(element, valor.value, `${car_id}`, card_id);
        dados += `</div>`;

    }
    dados += `<hr>`;

    dados += `<button class="excluir" onclick="avisoDeleteCar('${car_id}', card_id)"><i class="fi fi-rr-trash"></i> Excluir veículo</button>`;
    // dados += `<button class="gerar" onclick=""><i class="fi fi-rr-usd-circle"></i> Criar proposta</button>`;

    $(`#setCars`).html(dados);
}

function avisoDeleteCar(car_id, card_id) {
    $('.openCard').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR esse VEÍCULO?</h1>`
    modal += `<p>Essa ação é definitiva e não poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="fechar_aviso" onclick="deleteCar('${car_id}', '${card_id}')">EXCLUIR</button>`
    modal += `<button id="prosseguir">Cancelar</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#prosseguir`).on(`click`, () => {
        $('.openCard').css('filter', 'none');
        $('#modal_aviso').remove();
    })
}

async function deleteCar(car_id, card_id) {
    var getCard = await getCardById(card_id);
    var metaCard = JSON.parse(getCard.metadata);

    var novoMetaCars = metaCard.cars.filter(item => item.id != car_id);

    metaCard.cars = novoMetaCars;

    axios.put(`/api/card/update/metadata`, {
        metadata: metaCard,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));

            setBmtNewCar();

            addHistory(card_id, `Adcionou um veículo no card.`)

            $('.openCard').css('filter', 'none');
            $('#modal_aviso').remove();

            $(`#setCars`).html("Veículo deletado!");

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}

function setBtmCars(cars) {

    $('.carsBtm, #newCar').remove();

    for (car of cars) {
        $('nav.menu02').append(`<button class="btmCircular carsBtm" onclick="openCar('${car.id}', '${card.id}')" id="${car.id}"><i class="fi fi-rr-car-side"></i> ${car.placa}</button>`);
    }

    //$('nav.menu02').append(`<button class="btmCircular" onclick="openNewCar()" id="newCar">+ <i class="fi fi-rr-car-side"></i></button>`);

}

async function openNewCar() {
    $('body').append(`<div class="modal" id="novo_veiculo"></div>`);
    $('#novo_veiculo').load('/html/novo_veiculo.html');
    $('#novo_veiculo').siblings().css('filter', 'blur(4px)');
}

async function closeNewCar() {
    $('#novo_veiculo').siblings().css('filter', 'none');
    $('#novo_veiculo').remove();
}

// openNewCar();

async function addNewCar(card_id) {

    var getCard = await getCardById(card_id);
    var metaCard = JSON.parse(getCard.metadata);

    if (!metaCard.cars) {
        metaCard['cars'] = []
    }

    const listaApps = await axios.get(`/json/lists/new_lista_veiculos_hinova.json`);
    const apps = listaApps.data;

    var newCar = {
        id: newId(),
        placa: $('#fipe_veiculo').val(),
        campos: apps.meta,
        values: []
    }

    for (campo of apps.meta) {
        var campoIden = {
            id: campo.id,
            value: ""
        }

        if (campo.description == "Veículo") {
            campoIden.value = $('#fipe_veiculo').val();
        }

        if (campo.description == "placa") {
            campoIden.value = $('#nova_placa').val();
        }

        if (campo.description == "marca") {
            campoIden.value = $('#marcas option:selected').text();
        }

        if (campo.description == "ano_modelo") {
            campoIden.value = $('#anos').val();
        }

        if (campo.description == "modelo") {
            campoIden.value = $('#modelos option:selected').text();
        }

        if (campo.description == "valor_fipe") {
            campoIden.value = $('#valor_fipe').val();
        }

        if (campo.description == "codigo_fipe") {
            campoIden.value = $('#codigo_fipe').val();
        }

        newCar.values.push(campoIden);
    }

    metaCard.cars.push(newCar);

    axios.put(`/api/card/update/metadata`, {
        metadata: metaCard,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));

            setBtmCars(metaCard.cars);

            addHistory(card_id, `Adcionou um veículo no card.`);

            closeNewCar();

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })

}

async function downloadDocSigned(sign_id) {

    $(`#baixarCopia`).text('Baixando...');

    const signature = await axios.get(`/api/signature/${sign_id}`);
    if (signature.status != 200) {
        error(signature.data);
        return;
    }
    const assinatura = signature.data;

    if (!assinatura.metadata.model_id || assinatura.metadata.model_id.length == 0) {

        console.log('Existe um PDF!')

        var paginas = $(`.paginas canvas`);
        var imgs = [];
        for (let i = 0; i < paginas.length; i++) {

            const canvas = paginas[i];
            var img = canvas.toDataURL("image/jpeg");
            var h = canvas.height / 2;
            var w = canvas.width / 2;

            var objImg = {
                img: img,
                height: h,
                width: w
            }

            imgs.push(objImg);
        }

        downPdf(assinatura, imgs);

    } else {

        console.log('Não existe um PDF!')

        var url = "https://" + window.location.host + "/auditor/" + assinatura.id;

        var qr = await setQrCode(url);

        var addQr = ``;

        addQr += `<hr>`;
        addQr += `<div style="">`;
        addQr += `<img src="${qr}" style="width: 120px">`;
        addQr += `<div class="text">`;
        addQr += `<span>Esse documento foi assinado digitalmente:</span><br>`;
        addQr += `<span id="url">${url}</span>`;
        addQr += `</div>`;
        addQr += `</div>`;

        $(".pagina").append(addQr)

        var innerHTML = $(".pagina").html();
        CriaPDF(innerHTML);

    }

}


async function downPdf(signature, pdfImages) {

    var selo = "data:image/png;base64,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"

    var url = "https://" + window.location.host + "/auditor/" + signature.id;

    var qr = await setQrCode(url);

    var page1 = pdfImages[0];

    var h = page1.height / 10;
    var w = page1.width / 10;
    var hPlus = h + 20;
    var tamanho = [w, hPlus];

    const doc = new jsPDF({
        format: tamanho,
        compress: true,
    });

    var qrW = 5;
    var qrH = h + 3;


    for (let i = 0; i < pdfImages.length; i++) {

        var foto = pdfImages[i];

        if (i > 0) {
            doc.addPage(tamanho);
        }

        doc.addImage(foto.img, 'JPEG', 0, 0, w, h);

        doc.addImage(qr, 'JPEG', qrW, qrH, 10, 10);

        doc.setTextColor(100)
        doc.setFontSize(8)
        doc.text(18, h + 6, 'Esse documento foi assinado digitalmente:')
        doc.text(18, h + 10, url)

    }

    doc.addPage(tamanho);
    doc.setFillColor(243, 243, 243);
    doc.setDrawColor(243, 243, 243);
    doc.rect(0, 0, w, hPlus, 'F');

    doc.setTextColor(100)
    doc.setFontSize(16)
    doc.text(5, 10, 'Assinaturas:')

    var poW = 5;
    var poH = 15;

    for (let j = 0; j < signature.signers.length; j++) {

        const element = signature.signers[j];

        doc.setTextColor(255, 255, 255)

        doc.addImage(selo, 'JPEG', poW, poH, 110, 30);

        doc.setFont('sans-serif', 'normal')
        doc.setFontSize(8)
        doc.text(poW + 3, poH + 4, `CPF: ${element.cpf}`)

        doc.setFont('sans-serif', 'bold')
        doc.setFontSize(12)
        doc.text(poW + 3, poH + 10, `${element.nome}`)

        doc.setFont('sans-serif', 'normal')
        doc.setFontSize(8)
        doc.text(poW + 3, poH + 15, `Ip do aparelho: ${element.ipAdress}`)

        doc.setFontSize(8)
        doc.text(poW + 3, poH + 20, `${element.date}`)

        doc.setFont('sans-serif', 'bold')
        doc.setTextColor(0, 147, 233)
        doc.setFontSize(9)
        doc.text(poW + 5, poH + 26, `${element.hash}`)

        var poH = poH + 31;

    }

    doc.save(signature.metadata.title);

    $(`#baixarCopia`).text('Baixar cópia assinada');

}

function regraDeTres(a, b, c) {
    return (b * c) / a;
}

function downPdfFromText(assinatura, paginas) {
    var doc = new jsPDF('p', 'in', 'letter'),
        sizes = [12],
        fonts = [
            ['Arial']
        ],
        font, size, lines,
        margin = 0.5, // inches on a 8.5 x 11 inch sheet.
        verticalOffset = margin

    // / the 3 blocks of text
    for (var i = 0; i < paginas.length; i++) {

        font = fonts[0]
        size = sizes[0]

        lines = doc.setFont(font[0])
            .setFontSize(size)
            .splitTextToSize(paginas[i], 7.5)
            // Don't want to preset font, size to calculate the lines?
            // .splitTextToSize(text, maxsize, options)
            // allows you to pass an object with any of the following:
            // {
            // 	'fontSize': 12
            // 	, 'fontStyle': 'Italic'
            // 	, 'fontName': 'Times'
            // }
            // Without these, .splitTextToSize will use current / default
            // font Family, Style, Size.
        doc.text(0.5, verticalOffset + size / 72, lines);

        verticalOffset += (lines.length + 0.5) * size / 72;

        doc.addPage();

    }

    doc.save('text.pdf');

};

function regraDeTres(a, b, c) {
    var x = (a * c) / b;
    return parseFloat(x.toFixed(0));
}

// downloadDocSigned(20062);


addHistory(card.id, `Abriu este cartão.`);
setStepAtual(card.step_id);
listSteps(card.id, card.step_id, card.pipe_id);
setListColorTags();
setListPersons();
setPeople(card.id);
setTags();


// onCarrossel('.menu03');
// onCarrossel('.menu02');