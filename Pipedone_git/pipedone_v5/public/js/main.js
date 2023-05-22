function verifyErroAxios(result) {
    if (result.status != 200) {
        error(result.data);
        return;
    }
}

function error(mensagem) {

    var div = "";

    div += `<div class="error">${mensagem}</div>`;

    $(`body`).append(div)

    setTimeout(() => {
        $(`.error`).remove();
    }, 3000);

    $(`.error`).on('click', () => {
        $(`.error`).remove();
    })

}

function sucess(mensagem) {

    var div = "";

    div += `<div class="sucess">${mensagem}</div>`;

    $(`body`).append(div)

    setTimeout(() => {
        $(`.sucess`).remove();
    }, 3000);

    $(`.sucess`).on('click', () => {
        $(`.sucess`).remove();
    })

}

function onCarrossel(elemento) {
    $(elemento).slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToScroll: 2,
        centerMode: false,
        variableWidth: true
    });
}

function novaLista() {
    $('body').append(`<div class="modal" id="criar_lista"></div>`);
    $('#criar_lista').siblings().css('filter', 'blur(4px)');
    $('#criar_lista').load(`/html/nova_lista.html`);
}

function sizeOfThings() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var screenWidth = screen.width;
    var screenHeight = screen.height;

    // console.log(windowWidth + 'x' + windowHeight)
    // console.log(screenWidth + 'x' + screenHeight)

};

// window.addEventListener('resize', function() {
//     sizeOfThings();
// });

function mudaTextoEspera(texto) {
    $('#espera #text').text(texto);
}

function espera(status, text) {
    if (status == "on") {
        $('body').append('<div id="espera"></div>')
        $('#espera').load('/html/espera.html', (res, sts, xhr) => {
            if (text != "" && text != undefined) {
                $('#espera #text').text(text)
                setInterval(() => {

                    setTimeout(() => {
                        $('#espera #text').text('Aguarde...')
                    }, 5000);
                    setTimeout(() => {
                        $('#espera #text').text('Estamos quase lá...')
                    }, 10000);
                    setTimeout(() => {
                        $('#espera #text').text('Está demorando um pouco, mas vai valer a pena!')
                    }, 15000);
                    setTimeout(() => {
                        $('#espera #text').text('Aguarde...')
                    }, 20000);

                }, 25000);
            }
        })
    } else {
        $('#espera #text').text('Finalizado!')
        setTimeout(() => {
            $('#espera').remove();
        }, 1000);
    }
}


// função de busca para exibir o usuário buscado da lista de usuários
function busca(divInput, classItems) {

    let inputString = divInput.val();
    let items = document.querySelectorAll(classItems);

    for (let item of items) {

        if (item.innerText.toLowerCase().includes(inputString.toLowerCase())) {
            //coloca o texto do input e o texto do elemento selecionado para tudo minúsculo

            $(item).css('display', 'block');

        } else {

            $(item).css('display', 'none');

        }
    }
}

function buscaFlex(divInput, classItems) {

    let inputString = divInput.val();
    let items = document.querySelectorAll(classItems);

    for (let item of items) {

        if (item.innerText.toLowerCase().includes(inputString.toLowerCase())) {
            //coloca o texto do input e o texto do elemento selecionado para tudo minúsculo

            $(item).css('display', 'flex');

        } else {

            $(item).css('display', 'none');

        }
    }
}

async function clonarPipe(modelo) {

    espera('on', 'Iniciando clonagem...');

    var clone = await axios.post(`/api/pipe/clone`, {
        pipe: modelo
    })

    if (clone.status == 200) {
        location.href = './pipe/' + clone.data;
    } else {
        espera('off');
        error(clone.data)
    }

}

async function criarLista(lista) {

    espera('on', 'Criando sua lista...');

    var criar = await axios.post(`/api/list/criar`, {
        list: lista
    })

    if (criar.status == 200) {
        listarListas();

        $('#criar_lista').siblings().css('filter', 'none');
        $('#criar_lista').remove();

        espera('off');

        return 200;
    } else {
        espera('off');
        error(criar.data)
    }

}

function aviso(mensagem) {

    $('.content').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#modal_aviso').append(`<div id="aviso"><div class="aviso">${mensagem}</div><button id="fechar_aviso">Ok</button></div>`);

    $(`#fechar_aviso`).on(`click`, () => {
        $('.content').css('filter', 'none');
        $('#modal_aviso').remove();
    })

    document.querySelector('body').addEventListener('keydown', function(event) {
        if (event.code == "Enter") {
            $('.content').css('filter', 'none');
            $('#modal_aviso').remove();
        }
    });

}

function playSound() {
    var music = new Audio('/mp3/run.mp3');
    music.play();
}

function alterar_url(nova) {
    history.pushState({}, null, nova);
}

function newId() {
    return Math.floor(Date.now() * Math.random()).toString(36);
}

function newIdABC(tamanho) {
    var stringAleatoria = '';
    var caracteres = 'abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

function newId123(tamanho) {
    var stringAleatoria = '';
    var caracteres = '0123456789';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

function checkFileExist(imageUrl) {
    var http = jQuery.ajax({
        type: "HEAD",
        url: imageUrl,
        async: false
    })
    return http.status;
}

async function renderPdf(doc, numPage, elemento) {

    // var pdfjs = await import('pdfjs-dist/build/pdf');
    // var pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js";
    var loadingTask = await pdfjsLib.getDocument(`/pdfs/${doc}`);

    loadingTask.promise.then(async function(pdf) {

        var page = await pdf.getPage(numPage);

        var scale = 1.5;

        var viewport = page.getViewport({
            scale: scale,
        });

        //ID do elemento HTML onde vou imprimir a pagina

        var canvas = document.getElementById(elemento);

        var context = canvas.getContext('2d');

        canvas.height = viewport.height;

        canvas.width = viewport.width;

        var renderContext = {

            canvasContext: context,

            viewport: viewport

        };

        page.render(renderContext);

    });

}

async function renderAllPdf(doc, elemento) {

    $(elemento).html('Carregando...')
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js";
    var loadingTask = await pdfjsLib.getDocument(`/pdfs/${doc}`);

    loadingTask.promise.then(async function(pdf) {

        var numPages = pdf._pdfInfo.numPages;

        $(elemento).html('')

        for (let i = 0; i < numPages; i++) {

            var page = await pdf.getPage(i + 1);

            var scale = 5;

            var viewport = page.getViewport({
                scale: scale,
            });

            //ID do elemento HTML onde vou imprimir a pagina

            var id = newId();

            var canvas = $("<canvas />", {
                class: 'preview_pdf',
                id: id,
            });

            $(elemento).append(canvas);

            var canvas = document.getElementById(id);

            var context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {

                canvasContext: context,

                viewport: viewport

            };

            page.render(renderContext);


        }

    });
}

function formData(data) {
    // 2022-10-12T17:13:25.000Z
    var d = data.split('T');

    var date = d[0].split('-');
    var time = d[1].split('.')[0];

    var dia = date[2];
    var mes = date[1];
    var ano = date[0];

    return dia + '/' + mes + '/' + ano + ' ' + time;
}

function setAnalisys(action, metadata, pipe_id, card_id) {
    axios.post(`/api/analisys`, {
        action: action,
        pipe_id: pipe_id,
        card_id: card_id,
        metadata: metadata,
    }).then((res) => {
        verifyErroAxios(res);
        console.log(res);
    }).catch((error) => {
        console.log(error);
    })
}

function CriaPDF(innerHTML) {
    var minhaTabela = innerHTML;
    var style = "<style>";
    style = style + "table {width: 100%;font: 20px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";
    // CRIA UM OBJETO WINDOW
    var win = window.open('', '', 'height=700,width=700');
    win.document.write('<html><head>');
    win.document.write('<title>Empregados</title>'); // <title> CABEÇALHO DO PDF.
    win.document.write(style); // INCLUI UM ESTILO NA TAB HEAD
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(minhaTabela); // O CONTEUDO DA TABELA DENTRO DA TAG BODY
    win.document.write('</body></html>');
    win.document.close(); // FECHA A JANELA
    win.print(); // IMPRIME O CONTEUDO
}

// Tipos de Ação:
// // - Card criado - card_created
// // - Movimentos de card - card_moved
// // - Conclusão de tarefas - task_done
// // - Propostas aceitas - proposals_acepted
// // - Documentos assinados - doc_signed
// // - Fotos registradas - photo_registry


async function limitsPlan(plan) {

    switch (plan) {

        case 'Free':
            return limits = {
                num_pipes: 3,
                num_users: 1,
                num_signs: 3,
                num_photos: 3,
            };

        case 'Individual':
            return limits = {
                num_pipes: 5,
                num_users: 1,
                num_signs: 20,
                num_photos: 20,
            };

        case 'Start-up':
            return limits = {
                num_pipes: 10,
                num_users: 5,
                num_signs: 75,
                num_photos: 75,
            };

        case 'Empresarial':
            return limits = {
                num_pipes: 20,
                num_users: 15,
                num_signs: 200,
                num_photos: 200,
            };

        case 'Personalizado':

            var valores = await axios.get(`/api/subscriptions`);
            var plano = valores.data[valores.data.length - 1];

            return limits = {
                num_pipes: plano.invoiceJson.pipes,
                num_users: plano.invoiceJson.usuarios,
                num_signs: plano.invoiceJson.assinaturas,
                num_photos: plano.invoiceJson.fotos,
            };

        case 'Super Business':
            return limits = {
                num_pipes: Infinity,
                num_users: Infinity,
                num_signs: Infinity,
                num_photos: Infinity,
            };

    }

}

async function verifySingnaturesDisponible() {

    var plan = await axios.get(`/api/subscriptions`);
    var planoAtual = plan.data[plan.data.length - 1];
    var sings = await axios.get(`/api/signature/count/${planoAtual.createdAt.split('T')[0]}`);

    var limits = await limitsPlan(planoAtual.plan);

    var disponible = parseFloat(limits.num_signs) - parseFloat(sings.data);

    return disponible;

}

async function verifyMembersDisponible() {

    var plan = await axios.get(`/api/subscriptions`);
    var planoAtual = plan.data[plan.data.length - 1];
    var sings = await axios.get(`/api/users/count`);

    var limits = await limitsPlan(planoAtual.plan);

    var disponible = parseFloat(limits.num_users) - parseFloat(sings.data);

    return disponible;

}

async function verifyPipesDisponible() {

    var plan = await axios.get(`/api/subscriptions`);
    var planoAtual = plan.data[plan.data.length - 1];
    var sings = await axios.get(`/api/pipes/count`);

    var limits = await limitsPlan(planoAtual.plan);

    var disponible = parseFloat(limits.num_pipes) - parseFloat(sings.data);

    return disponible;

}

async function verifyPhotosDisponible() {

    var plan = await axios.get(`/api/subscriptions`);
    var planoAtual = plan.data[plan.data.length - 1];

    var sings = await axios.get(`/api/photo/count/${planoAtual.createdAt.split('T')[0]}`);

    var limits = await limitsPlan(planoAtual.plan);

    var disponible = parseFloat(limits.num_photos) - parseFloat(sings.data);

    return disponible;

}

async function sentMail(msg, to, subject) {

    var status = await axios.post('/api/email/sent', {
        msg: msg,
        to: to,
        subject: subject,
    })

    if (status.status == 200) {
        return 'ok';
    } else {
        return 'error';
    }

}

async function getAppsInstall() {
    var appsInstaled = await axios.get('/api/organization');
    var apps = appsInstaled.data;
    // console.log(apps);
    if (apps.metadata.apps) {
        // console.log(apps.metadata.apps)
        return apps.metadata.apps;
    } else {
        return [];
    }
}

function closeCard(card_id, meta) {

    $('title').text(pipe.title + ' - Pipedone');
    $('.content').css('filter', 'none')
    $('#card_escolhido').html('').remove()

    alterar_url(`/pipe/${pipe.id}`);

    // location.href = `/pipe/${pipe.id}`;
}

function editCampo(position, item_id, campo_id) {
    var value = $(`#line_${item_id} #${campo_id}`).text();
    axios.put(`/api/item`, {
        item_id: item_id,
        campo_id: campo_id,
        value: value,
        position: position,
    }).then((sucess) => {
        console.log(sucess.data)
    }).catch((error) => {
        alert(error)
    })
}

function editCampoListInCard(value, position, item_id, campo_id) {
    axios.put(`/api/item`, {
        item_id: item_id,
        campo_id: campo_id,
        value: value,
        position: position,
    }).then((sucess) => {
        console.log(sucess.data)
    }).catch((error) => {
        alert(error)
    })
}

async function activePowerUp(card_id, power) {

    if (power.status == "desactived") {
        return;
    }

    var GetCard = await axios.get(`/api/card/public/${card_id}`);


    if (GetCard.status != 200) {
        error(GetCard.data);
        return;
    }

    var card = GetCard.data;

    var GetPipe = await axios.get(`/api/pipe/${card.pipe_id}`);

    if (GetPipe.status != 200) {
        error(GetPipe.data);
        return;
    }

    var pipe = GetPipe.data;

    // console.log("========pipe==========")
    // console.log(pipe)
    // console.log("========pipe==========")


    if (!card.metadata) {
        card.metadata = {};
    }

    var metaCard = JSON.parse(card.metadata);

    // console.log("========metaCard==========")
    // console.log(metaCard)
    // console.log("========metaCard==========")

    switch (power.condition.id) {

        case 'card_criado':

            if (power.condition.meta[0].id.toString() != card.step_id.toString()) {
                // console.log('Não condiz!');
                return;
            }

            break;

        case 'card_movido':

            var stepData = power.condition.meta.filter(item => item.type == 'step')[0];
            var pipeData = power.condition.meta.filter(item => item.type == 'pipe')[0];

            if (stepData.id.toString() !== card.step_id.toString()) {
                // console.log('Não condiz a Step!');
                return;
            }

            if (pipeData.id.toString() !== card.pipe_id.toString()) {
                // console.log('Não condiz o Pipe!');
                return;
            }

            break;

        case 'tarefas_concluidas':

            var doneTasks = metaCard.tasks.filter(item => item.checked == false);
            if (doneTasks.length > 0) {
                // console.log('Ainda tem tarefas para completar!');
                return;
            }

            break;

        case 'documento_assinado':

            break;
        case 'proposta_aceita':

            break;
        case 'fotos_registradas':

            break;
        case 'tag_added':

            var verifyTag = metaCard.tags.filter(item => item.id == power.condition.meta[0].id);

            if (verifyTag.length == 0) {
                return;
            }
            break;

        default:
            return 'Desconhecido';

    }

    switch (power.action.id) {

        case 'add_tasks':

            if (!metaCard.tasks) {
                metaCard['tasks'] = [];
            }

            var conditionNumber = 0;

            for (taskObj of power.action.meta) {

                var verifyTask = metaCard.tasks.filter(item => item.id == taskObj.id);

                if (verifyTask.length == 0) {

                    var task = {
                        created_by: usuario.id,
                        tarefa: taskObj.task,
                        id: taskObj.id,
                        order: metaCard.tasks.length + 1,
                        checked: false
                    }

                    metaCard.tasks.push(task);
                    conditionNumber++;

                }

            }

            if (conditionNumber > 0) {

                setTimeout(() => {

                    axios.put(`/api/public/card/update/metadata`, {
                        metadata: metaCard,
                        id: card_id
                    }).then((resposta) => {
                        if (resposta.status == 200) {

                            var tComplete = 0;

                            for (let i = 0; i < metaCard.tasks.length; i++) {
                                const element = metaCard.tasks[i];
                                if (element.checked == true) {
                                    tComplete++;
                                }
                            }

                            $(`#card_${card_id} .icones #task_${card_id}`).html(`<i class="fi fi-rr-check"></i> ${tComplete}/${metaCard.tasks.length}`);
                        } else {
                            error(resposta.data);
                        }
                    }).catch((text) => {
                        error(text);
                    })

                }, 500);

            }


            break;

        case 'add_tag':

            if (!metaCard.tags) {
                metaCard['tags'] = [];
            }

            var verifyTag = metaCard.tags.filter(item => item.id == power.action.meta[0].id);

            if (verifyTag.length == 0) {

                var tag = {
                    id: power.action.meta[0].id,
                    name: power.action.meta[0].name,
                    color: power.action.meta[0].color
                }

                metaCard.tags.push(tag);

                axios.put(`/api/public/card/update/metadata`, {
                    metadata: metaCard,
                    id: card_id
                }).then((sucess) => {
                    if (sucess.status == 200) {

                        // AddTag
                        if (pipe.metadata.powerups) {

                            var powers = pipe.metadata.powerups.filter(item => item.condition.id == "tag_added");

                            if (powers.length > 0) {

                                for (power of powers) {
                                    activePowerUp(card_id, power);
                                }

                            }

                        }

                        var person = `<div class="person" id="${tag.id}" style="background-color:${tag.color}">`;
                        person += `<label>${tag.name}</label>`;
                        person += `<img src="/img/close.svg" onclick="removeTag('${tag.id}', '${card_id}')">`;
                        person += `</div>`;

                        $('.tagsDoCard').append(person);

                        //AddTagInMiniCard

                        var elementoTag = `<div class="person" id="cardTag${tag.id}" style="background-color:${tag.color}">`;
                        elementoTag += `<label>${tag.name}</label>`;
                        elementoTag += `</div>`;

                        $(`#card_${card_id} .tags`).append(elementoTag);

                        var stepData = power.condition.meta.filter(item => item.type == 'step')[0];
                        var pipeData = power.condition.meta.filter(item => item.type == 'pipe')[0];

                        var metadata = {
                            tag: {
                                name: tag.name,
                                id: tag.id,
                            },
                            where: {
                                pipe_id: pipeData,
                                step_id: stepData,
                            }
                        }

                        setAnalisys('tag_add', metadata, pipeData, card_id);

                    } else {
                        error(sucess.data)
                    }
                }).catch((erro) => {
                    console.log(erro);
                })

            }
            break;

        case 'add_person':

            if (!metaCard.persons) {
                metaCard['persons'] = [];
            }

            for (person_id of power.action.meta) {

                var verifyPerson = metaCard.persons.filter(item => item.id == person_id);

                if (verifyPerson.length == 0) {

                    var getPerson = await axios.get(`/api/user/get/${person_id}`);


                    if (getPerson.status != 200) {
                        error(getPerson.data);
                        return;
                    }


                    var person = {
                        id: getPerson.data.id.toString(),
                        nome: getPerson.data.name.toString()
                    }

                    metaCard.persons.push(person);

                    $(`#card_${card_id} .persons`).append(`<label><i class="fi fi-rr-user"></i> ${person.nome}</label>`);


                    // addPerson

                    var cores = ['#fcba03', '#fc8003', '#03fcf0', '#03fc4e', '#038cfc', '#be03fc', '#fc0356', '#bfa6ff'];
                    var rand = getRandomNumber(0, cores.length);

                    var personHtml = `<div class="person" id="${person.id}" style="background-color:${cores[rand]}">`;
                    personHtml += `<label>${person.nome}</label>`;
                    personHtml += `<img src="/img/close.svg" onclick="removePeople('${person.id}', '${card_id}')">`;
                    personHtml += `</div>`;

                    $('#pessoas .list').append(personHtml);


                }

            }

            axios.put(`/api/public/card/update/metadata`, {
                metadata: metaCard,
                id: card_id
            }).then((sucess) => {
                if (sucess.status != 200) {
                    error(sucess.data);
                    return;
                }
            }).catch((erro) => {
                console.log(erro);
            })


            break;


        case "envie_email":
            // 1. Pegar destinatário
            if (power.action.meta[0].receiver_type == "customizado") {
                var destinatario = metaCard.form.values.find(
                    (item) => item.id == power.action.meta[0].receiver
                ).value;
            }

            if (power.action.meta[0].receiver_type == "fixo") {
                var destinatario = power.action.meta[0].receiver;
            }
            try {
                // 2. Pegar texto do email
                var texto = await getModelDocById(power.action.meta[0].model_id);

                // 3. Pegar texto do email Substituir campos personalizados por informações do card
                var textoFinal = await configTagsInDocs(
                    power.action.meta[0].model_id,
                    card.list_id,
                    card.item_id,
                    card_id
                );

                // 4. Enviar email para destinatário
                var enviar = await sentMail(textoFinal, destinatario, texto.title);

                if (enviar == "ok") {
                    sucess("Email enviado!");
                } else {
                    error("Erro ao enviar email.");
                }
            } catch (err) {
                console.log(err);
            }

            break;

        case 'arquived':
            deleteCardFromNewStep(card_id, card.step_id);
            break;

        case 'move_card':
            var stepData = power.action.meta.filter(item => item.type == 'step')[0];
            var pipeData = power.action.meta.filter(item => item.type == 'pipe')[0];

            // moveCardToNewStepAndNewPipe(card_id, stepData.id, pipeData.id)
            axios.put(`/api/public/card/update/step/pipe`, {
                step_id: stepData.id,
                pipe_id: pipeData.id,
                id: card_id,
            }).then((sucess) => {
                if (sucess.status == 200) {
                    // console.log('Moveu!');
                    $(`#card_${card_id}`).remove();

                    if (!usuario) {
                        var usuario = {
                            id: 'empty'
                        };
                    }

                    let metadata = {
                        to: {
                            step: stepData.id,
                            card: card_id,
                            pipe: pipeData.id,
                        },
                        usuario: usuario.id,
                    }

                    setAnalisys('card_moved', metadata, pipeData.id, card_id)

                    // emitCard(metadata);

                    if (pipe.metadata.powerups) {

                        var powers = pipe.metadata.powerups.filter(item => item.condition.id == "card_movido");

                        if (powers.length > 0) {

                            for (power of powers) {
                                activePowerUp(card_id, power);
                            }

                        }

                    }
                }

            }).catch((error) => {
                console.error(error)
            })


            break;

        default:
            return 'Desconhecido';

    }

}

async function getUserById(person_id) {
    var getPerson = await axios.get(`/api/user/get/${person_id}`);
    if (getPerson.status != 200) {
        alert(`Não localizamos o usário de id ${person_id}`)
        return;
    }
    var usuario = getPerson.data;
    return usuario;
}


async function getOrgById(id) {
    var getPerson = await axios.get(`/api/organization/${id}`);
    if (getPerson.status != 200) {
        alert(`Não localizamos a empresa de id ${id}`)
        return;
    }
    var usuario = getPerson.data;
    return usuario;
}


async function getListById(list_id) {
    var getList = await axios.get(`/api/list/${list_id}`);
    return getList.data;
}

async function getMensagensWorkChat(member_id) {
    var get = await axios.get(`/api/chats/conversations/${member_id}`);
    return get.data;
}

async function getCardById(card_id) {
    var get = await axios.get(`/api/card/${card_id}`);
    return get.data;
}

async function getCardByPipeIdAndDate(pipe_id, inicio, fim) {
    var get = await axios.get(`/api/card/listar/${pipe_id}/${inicio}/${fim}`);
    return get.data;
}

async function getItemsByListIdAndDate(list_id, inicio, fim) {
    var get = await axios.get(`/api/list/listar/${list_id}/${inicio}/${fim}`);
    return get.data;
}

async function getCardByPipeId(pipe_id) {
    var get = await axios.get(`/api/card/listar/${pipe_id}`);
    return get.data;
}

async function getStepsByPipeId(pipe_id) {
    var get = await axios.get(`/api/step/listar/${pipe_id}`);
    return get.data;
}

async function getModelDocById(model_id) {
    var getList = await axios.get(`/api/models/${model_id}`);
    return getList.data;
}

async function getItemById(item_id) {
    var getList = await axios.get(`/api/item/${item_id}`);
    return getList.data;
}

async function getDocForSignById(sign_id) {
    var getList = await axios.get(`/api/signature/${sign_id}`);
    return getList.data;
}

async function getAnalisysByCardIdAndAction(card_id, action) {
    var getList = await axios.get(`/api/analisys-by-action-and-card/${card_id}/${action}`);
    return getList.data;
}

async function getAnalisysByPipeIdAndData(pipe_id, inicio, fim) {
    var getList = await axios.get(`/api/analisys/pipe/${pipe_id}/${inicio}/${fim}`);
    return getList.data;
}

async function configTagsInDocs(model_id, list_id, item_id, card_id) {
    var doc = await getModelDocById(model_id);
    var lists = await getListById(list_id);
    var itens = await getItemById(item_id);

    console.log("doc");
    console.log(doc);
    console.log("doc");

    if (itens == null || doc == null || lists == null) {
        throw error("Este ou o card não está conectado a uma lista.");

    }

    var text = doc.text;
    console.log("doc text", text);
    var tags = 0;

    var textFinal = "";

    for (campo of lists.metadata) {
        if (tags > 0) {
            var text = textFinal;
        }

        var tag = `*${campo.campo.split(" ")[0]}@${campo.id}*`;
        var idCampo = tag.split("@")[1].replace("*", "");
        var item = itens.metadata.filter((item) => item.campo_id == idCampo)[0];

        if (text.includes(tag) == true) {
            tags++;
            var textFinal = text.replaceAll(tag, item.value);
        } else {
            var textFinal = text;
        }
    }

    var tagProposta = "*proposta*";

    if (textFinal.includes(tagProposta) == true) {
        var proposals = await getProposalsByCardId(card_id);

        console.log("=== proposals ===");
        console.log(proposals);
        console.log("=== proposals ===");

        if (
            proposals == "" ||
            proposals == null ||
            proposals == undefined ||
            proposals.length == 0
        ) {
            error("Por favor, crie uma Proposta para seu cliente e tente novamente.");
            return;
        }

        var tabela = await setTextProposals(proposals);
        var textFinal = textFinal.replaceAll(tagProposta, tabela);
    }

    return textFinal;
}

// async function configTagsInDocs(model_id, list_id, item_id, card_id) {

//     var doc = await getModelDocById(model_id);
//     var lists = await getListById(list_id);
//     var itens = await getItemById(item_id);

//     console.log("doc")
//     console.log(doc)
//     console.log("doc")

//     if (itens == null || doc == null || lists == null) {
//         error('Este ou o card não está conectado a uma lista.');
//         return;
//     }

//     var text = doc.text;
//     var tags = 0;

//     var textFinal = "";

//     for (campo of lists.metadata) {

//         if (tags > 0) {
//             var text = textFinal;
//         }

//         var tag = `*${campo.campo.split(' ')[0]}@${campo.id}*`;
//         var idCampo = tag.split('@')[1].replace('*', '');
//         var item = itens.metadata.filter(item => item.campo_id == idCampo)[0];

//         if (text.includes(tag) == true) {
//             tags++;
//             var textFinal = text.replaceAll(tag, item.value);
//         } else {
//             var textFinal = text;
//         }
//     }

//     var tagProposta = '*proposta*';

//     if (textFinal.includes(tagProposta) == true) {
//         var proposals = await getProposalsByCardId(card_id);

//         console.log("=== proposals ===");
//         console.log(proposals);
//         console.log("=== proposals ===");

//         if (proposals == "" || proposals == null || proposals == undefined || proposals.length == 0) {
//             error('Por favor, crie uma Proposta para seu cliente e tente novamente.');
//             return;
//         }

//         var tabela = await setTextProposals(proposals);
//         var textFinal = textFinal.replaceAll(tagProposta, tabela);

//     }

//     return textFinal;

// }

async function getProposalsByCardId(card_id) {
    var getList = await axios.get(`/api/proposals/listar/${card_id}`);
    return getList.data;
}


async function setTextProposals(proposals) {


    var conteudo = "";

    const element = proposals[0];

    conteudo += `<table style="width: 100%; position: relative;" border="1" cellpanding="1" cellspacing="0">`;

    conteudo += `<tr>`;
    conteudo += `<th style="text-align: left;max-width: 50px;">Qtd</th>`;
    conteudo += `<th style="text-align: left;max-width: 360px;">Description</th>`;
    if (element.type != 'hinova') {
        conteudo += `<th style="text-align: left;max-width: 120px;">Valor</th>`;
    } else {
        conteudo += `<th style="text-align: left;max-width: 120px;"></th>`;
    }
    conteudo += `<th style="text-align: left;max-width: 120px;">Total</th>`;
    conteudo += `</tr>`;

    for (let j = 0; j < element.metadata.budget.items.length; j++) {
        const item = element.metadata.budget.items[j];
        // console.log(item)
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
        conteudo += `<tr><td>Observações: ${element.metadata.obs}</td></tr>`;
    }
    conteudo += `</table>`;

    return conteudo;

}


async function createNotification(type, textNotification, userId, metadata) {
    if (type === "workchat") {
      var cadastroNotification = await axios.post(`/api/notifications`, {
        user_id: userId,
        organization_id: usuario.organization_id,
        text: `${textNotification}`,
        type: `${type}`,
        metadata: {senderId:metadata}, 
        status: "pending",
      });
      socket.emit("newNotification", {
        user_id: userId,
        organization_id: usuario.organization_id,
        text: `${textNotification}`,
        type: `${type}`,
        metadata: {senderId:metadata}, 
        status: "pending",
      }, () => {
        console.log('notificação enviada!');
      });
    }
  
    if (cadastroNotification.status != 201) {
      error("Erro ao cadastrar notificação!");
      return;
    }
  }
  
  async function updateWorkchatNotifications(senderId) {
    var updateWorkchatNotifications = await axios.put(
      `/api/notifications/workchat/${senderId}`
    );
    listNotifications();
    if (updateWorkchatNotifications.status != 200) {
      error("Erro ao cadastrar notificação!");
      return;
    }
  }