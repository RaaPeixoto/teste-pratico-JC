radom = (max, min) => {
    let valor = Math.random() * (max - min) + min
    return Math.floor(valor)
}

$(`header .menu button`).removeClass('active')
$(`#menu_inicio`).addClass('active')

var mensagens = [
    "vamos desbravar coisas novas hoje?",
    "para frente e para cima, sempre!",
    "que seu dia seja lindo e cheio de vida!",
    "lembre-se: você sempre colhe o que planta.",
    "sua limitação é apenas sua imaginação.",
    "se você cansar, aprenda a descansar e não a desistir.",
    "se é difícil, é porque vale a pena.",
    "que o seu cansaço não vença as suas metas.",
    "toda conquista começa com a decisão de tentar.",
    "plante aquilo que gostaria de colher.",
    "Seja positivo, trabalhe duro e faça acontecer. ❤️",
    "Seja o seu próprio incentivo.    ",
    "Não tenha medo de errar, mas sim de não tentar.    ",
    "Trace metas e conquiste o que sempre sonhou.    ",
    "Para realizar coisas grandes, comece pequeno.    ",
    "Seja mais forte do que a sua melhor desculpa.    ",
    "Defina metas altas e não pare até chegar lá. 👊🏽    ",
    "Às vezes, mais tarde torna-se nunca. Faça isso agora.    ",
    "Para vencer é preciso tentar, lutar e não desistir nunca.    ",
    "Use todos os dias para fazer a diferença.    ",
    "Não espere a motivação chegar. Corra atrás de algo que te motive.    ",
    "Motivação faz você começar, hábito faz você continuar.",
    "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Vá o mais longe que consegue ver. Quando chegar lá, conseguirá ver mais adiante.",
    "Seu sucesso cresce na mesma proporção que a sua mente cresce.",
    "O segredo de começar a ter sucesso é, simplesmente, começar.",
    "Trabalhe duro em silêncio. Deixe que o sucesso faça barulho.",
    "Ter sucesso é falhar repetidamente, mas sem perder o entusiasmo.",
    "O sucesso não vai simplesmente te encontrar. Você precisa sair e ir atrás dele.",
    "Sorte é apelido, o verdadeiro nome do sucesso chama-se dedicação",
];

var sort = mensagens.length;
var mensagem = mensagens[radom(sort, 0)];

if (usuario.name != undefined) {
    $(`#nome_usuario`).text(usuario.name.split(' ')[0])
}

$(`#mensagem_motivacional`).text(mensagem)


async function openNewPipe() {

    var countPipesDisponibles = await verifyPipesDisponible();

    if (countPipesDisponibles == 0) {
        error('Você não tem mais pipes disponíveis no seu plano.');
        return;
    }

    $('.content').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modelos_pipe"></div>`);
    $('#modelos_pipe').load(`/html/pipestore.html`);
}

async function listarPipes() {


    const listaPipes = await axios.get(`/api/pipe/listar`)

    if (listaPipes.status != 200) {
        error('Ops! Não conseguimos encontrar pipes cadastrados')
        return;
    }

    const pipes = listaPipes.data;

    // console.log(pipes)

    $(`.head h1`).text(`Pipes (${pipes.length})`)

    $('#lista_pipes').html('Carregando...')

    var divspipes = "";
    for (let i = 0; i < pipes.length; i++) {

        var count = await axios.get(`/api/card/count/${pipes[i].id}`);

        if (count.data <= 1) {
            var cardPlural = 'card';
        } else {
            var cardPlural = 'cards';
        }

        divspipes += `<div class="pipe" id="pipe_${pipes[i].id}" >`
        divspipes += `<a class="notification_1" href="/pipe/${pipes[i].id}">`
        divspipes += `<i id="menuPipe${pipes[i].id}" onmouseenter="activeMenuPipe(${pipes[i].id})" class="fi fi-rr-menu-dots-vertical"></i>`;
        divspipes += `<i  class="fi fi-rr-apps"></i>`
        divspipes += `<div class="texto">`;
        divspipes += `<h4 >${pipes[i].title}</h4>`
        divspipes += `<span >${count.data} ${cardPlural}</sp>`
        divspipes += `</div>`;
        divspipes += `</a>`
        divspipes += `<div id="modalPipe${pipes[i].id}" class="modalPipe" style="display:none">`
        divspipes += `<button onclick="avisoClonarPipe('${pipes[i].id}', '${pipes[i].title}')"><i class="fi fi-rr-duplicate"></i> Clonar Pipe</button>`
        divspipes += `<button onclick="avisoDelPipe('${pipes[i].id}', '${pipes[i].title}')"><i class="fi fi-rr-trash"></i> Excluir Pipe</button>`
        divspipes += `</div>`
        divspipes += `</div>`

    }
    $('#lista_pipes').html(divspipes);

    var novo = "";
    novo += `<div onclick="openNewPipe()" class="pipe" id="novo_pipe">`;
    novo += `<div class="notification_1">`;
    novo += `<i class="fi fi-rr-add"></i>`;
    novo += `<h4>Novo Pipe</h4>`;
    novo += `</div>`;
    novo += `</div>`;
    $('#lista_pipes').prepend(novo);
    // onCarrossel('#lista_pipes');
}

function activeMenuPipe(pipe_id) {
    $(`#modalPipe${pipe_id}`).slideDown(200).mouseleave(() => {
        $(`#modalPipe${pipe_id}`).slideUp(200);
    });
}

function avisoDelPipe(pipe_id, title) {
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR o pipe "${title}"?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="prosseguir">Cancelar</button>`
    modal += `<button id="fechar_aviso" onclick="deletePipe('${pipe_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#prosseguir`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })
}

function avisoClonarPipe(pipe_id, title) {
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Deseja fazer uma cória do pipe "${title}"?</h1>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="prosseguir">Cancelar</button>`
    modal += `<button id="fechar_aviso" onclick="clonarPipeById('${pipe_id}')">Sim, Clonar!</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#prosseguir`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })
}

function deletePipe(pipe_id) {
    axios.put(`/api/pipe/excluir`, {
        id: pipe_id
    }).then((res) => {
        if (res.status == 200) {
            $(`#pipe_${pipe_id}`).remove();
            $('#modal_aviso').siblings().css('filter', 'none');
            $('#modal_aviso').remove();
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

async function clonarPipeById(pipe_id) {

    espera('on', 'Iniciando clonagem...');

    var GetPipe = await axios.get(`/pipe/view/${pipe_id}`);
    var pipe = GetPipe.data;

    var GetSteps = await axios.get(`/api/step/listar/${pipe_id}`);
    var steps = GetSteps.data;

    var arrSteps = [];
    for (step of steps) {


        var steping = {
            "title": step.title,
            "powerups": {},
            "color": step.color,
            "position": step.position,
            "metadata": []
        };

        arrSteps.push(steping);
    }


    var novopipe = {
        "title": pipe.title,
        "description": "",
        "category": "Personalizado",
        "image": "/img/fotos/sprint.png ",
        "icon": "/img/svg/fi-rr-clipboard-list-check.svg",
        "color": pipe.color,
        "steps": arrSteps,
        "metadata": pipe.metadata,
        "conections": pipe.conections,
    }


    var clone = await axios.post(`/api/pipe/clonar`, {
        pipe: novopipe
    })

    if (clone.status == 200) {
        location.href = './pipe/' + clone.data;
    } else {
        espera('off');
        error(clone.data)
    }

}

function newId() {
    return Math.floor(Date.now() * Math.random()).toString(36);
}

async function listarListas() {

    $('#lista_listas').html('Carregando...');

    var novaListabtm = "";
    novaListabtm += `<div class="notification_1 novo" onclick="novaLista()" id="nova_lista">`;
    novaListabtm += `<i class="fi fi-rr-add"></i>`;
    novaListabtm += `<h4>Criar lista</h4>`;
    novaListabtm += `</div>`;

    const listaPipes = await axios.get(`/api/list/listar`)

    if (listaPipes.status != 200) {
        error('Ops! Não conseguimos encontrar pipes cadastrados')
        return;
    }

    const lists = listaPipes.data

    $(`.listas h1`).text(`Listas (${lists.length})`)
    var listas = "";
    for (let i = 0; i < lists.length; i++) {

        var count = await axios.get(`/api/list/count/${lists[i].id}`);

        if (count.data <= 1) {
            var cardPlural = 'registro';
        } else {
            var cardPlural = 'registros';
        }

        listas += `<div class="notification_1 lista" id="list_${lists[i].id}">`;
        listas += `<i style="color:var(--black);" id="menuList${lists[i].id}" onmouseenter="activeMenuLista(${lists[i].id})" class="fi fi-rr-menu-dots-vertical"></i>`;
        listas += `<a href="/list/${lists[i].id}">`;
        listas += `<i style="color:var(--black);" class="fi fi-rr-list"></i>`;
        listas += `<h4 style="color:var(--black);">${lists[i].title}</h4>`;
        listas += `<span style="color:var(--black)">${count.data} ${cardPlural}</sp>`
        listas += `</a>`;
        listas += `<div id="modalList${lists[i].id}" class="modalPipe" style="display:none">`
        listas += `<button onclick="avisoDelLista('${lists[i].id}', '${lists[i].title}')"><i class="fi fi-rr-trash"></i> Excluir lista</button>`
        listas += `</div>`
        listas += `</div>`;


    }
    $('#lista_listas').html(listas);
    $('#lista_listas').prepend(novaListabtm);

    // onCarrossel('#lista_listas');

}

function activeMenuLista(lista_id) {
    $(`#modalList${lista_id}`).slideDown(200).mouseleave(() => {
        $(`#modalList${lista_id}`).slideUp(200);
    });
}

function avisoDelLista(list_id, title) {
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').siblings().css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR a lista "${title}"?</h1>`
    modal += `<p>Esta ação NÃO poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="prosseguir">Cancelar</button>`
    modal += `<button id="fechar_aviso" onclick="deleteLista('${list_id}')">Excluir agora</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#prosseguir`).on(`click`, () => {
        $('#modal_aviso').siblings().css('filter', 'none');
        $('#modal_aviso').remove();
    })
}

function deleteLista(list_id) {
    axios.put(`/api/list/excluir`, {
        id: list_id
    }).then((res) => {
        if (res.status == 200) {
            $(`#list_${list_id}`).remove();
            $('#modal_aviso').siblings().css('filter', 'none');
            $('#modal_aviso').remove();
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

listarPipes();