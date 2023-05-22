var pessoas = pipe.users;

$('title').text(`${pipe.title} - Pipedone | Controle seus fluxos de trabalho, atomatize processos...`)

var header = "";
header += `<div class="headPipe">`;
header += `<input type="text" id="titlePipe" value="${pipe.title}"/>`;
header += `</div>`;

const pai = document.getElementById("logotop");
const filho = pai.querySelector(".headPipe");

if (filho !== null) {
  console.log("O elemento #filho existe em #pai");
} else {
    $('.logotop').append(header);
}

$(`#titlePipe`).blur(async() => {

    var newText = $(`#titlePipe`).val()

    var result = await axios.put(`/api/pipe/update/title`, {
        title: newText,
        id: pipe.id
    })

    if (result.status == 200) {
        $('title').text(`${newText} - Pipedone | Controle seus fluxos de trabalho, atomatize processos...`)
    } else {
        error(result.data)
    }

})

async function countSteps(pipe_id) {
    var getNumbersPipe = await axios.get(`/api/steps/count/${pipe_id}`);
    var numbersPipe = getNumbersPipe.data;

    return numbersPipe;
}

function editTitleStep(step_id, newTitle) {
    // var newTitle = $(`#step_${step_id} h4`).text()

    axios.put(`/api/step/update/title`, {
        title: newTitle,
        id: step_id
    }).then((sucess) => {
        if (sucess.status != 200) {
            error(sucess.data);
            return;
        }
    }).catch((erro) => {
        error(erro)
    })
}

function addStep() {

    var novoStep = JSON.parse(localStorage.getItem('novoStep'));

    if (novoStep.title == "") {
        error('Por favor, escolha um título para essa Step.')
        return;
    }

    axios.post(`/api/step/create`, { step: novoStep }).then((newStep) => {
        // //console.log(newStep)
        if (newStep.status != 200) {
            error(newStep.data);
            return;
        }

        var stepCriado = newStep.data;
        var alturaTela = window.innerHeight;
        var alturaColumn = alturaTela - 130;
        var step = "";

        // step += `<div class="column" id="step_${stepCriado.id}" style="height: ${alturaColumn}px;">`;
        // step += `<div class="head" style="color: ${stepCriado.color};">`;
        // step += `<h4 contentEditable="true" maxlength="26" style="color: ${stepCriado.color};">${stepCriado.title}</h4>`;
        // step += `<i class="more fi fi-rr-add" onclick="novoCard('${stepCriado.id}')"></i>`;
        // step += `</div>`;
        // step += `<div class="body" style="background-color: ${stepCriado.color}11;">`;
        // step += `</div>`;
        // step += `</div>`;

        // A partir daqui

        step += `<div class="column" id="step_${stepCriado.id}" style="height: ${alturaColumn}px;">`;
        step += `<div class="head" style="color: ${stepCriado.color};">`;

        step += `<input max="10" class="titleStep" onkeypress="editStepWithEnter(event, '${stepCriado.id}')" onblur="editTitleStep('${stepCriado.id}', $(this).val());$(this).removeClass('editing')" style="max-width: 160px;min-width: 40px;color: ${stepCriado.color};" value="${stepCriado.title}" onfocus="$(this).addClass('editing')" />`;

        step += `<div class="botoesHeadStep">`;
        step += `<label id="numberCard_${stepCriado.id}" class="numberCards"><i class="fi fi-rr-hastag"></i>0</label>`;
        step += `<button class="more" style="color: ${stepCriado.color};background-color: ${stepCriado.color}11;" onclick="novoCard(${stepCriado.id})">+ Card</button>`;
        step += `<i onclick="openMenuStep('${stepCriado.id}')" class="fi fi-rr-menu-dots-vertical" style="color: ${stepCriado.color};"></i>`;
        step += `</div>`;
        step += `</div>`;
        // step += `<div class="valor_total"></div>`;
        step += `<div class="body" style="background-color: ${stepCriado.color}11;">`;
        step += `</div>`;
        step += `</div>`;

        $(`#nova_step h4`).fadeIn(200)
        $(`#new_step`).remove()

        $(`#nova_step`).before(step);
    }).catch((ops) => {
        error(ops);
    })

}

async function newStep(pipe_id) {

    var numbersSteps = await countSteps(pipe_id);


    var novoStep = {
            title: '',
            pipe_id: pipe_id,
            color: '#c68de0',
            metadata: '',
            position: numbersSteps + 1,
        }
        //console.log(novoStep);

    localStorage.setItem('novoStep', JSON.stringify(novoStep))

    $(`#nova_step h4`).fadeOut(200)

    var card = `<div class='card' id="new_step">`;
    card += `<input type="text" maxlength="26" placeholder="Titulo"/>`;
    card += `<label>Cor:</label>`;
    card += `<div class="colors">`;
    card += `<div onclick="setColor('#c68de0', 'roxo')" style="background-color: #c68de0;" class="color roxo selected"></div>`;
    card += `<div onclick="setColor('#f91e1e', 'easyred')" style="background-color: #f91e1e;" class="color easyred"></div>`;
    card += `<div onclick="setColor('#febc1f', 'yellow')" style="background-color: #febc1f;" class="color yellow"></div>`;
    card += `<div onclick="setColor('#7DB87B', 'verde')" style="background-color: #7DB87B;" class="color verde"></div>`;
    card += `<div onclick="setColor('#335fff', 'blue')" style="background-color: #335fff;" class="color blue"></div>`;
    card += `<div onclick="setColor('#5f98e3', 'ciano')" style="background-color: #5f98e3;" class="color ciano"></div>`;
    card += `<div onclick="setColor('#8be35f', 'verdeclaro')" style="background-color: #8be35f;" class="color verdeclaro"></div>`;
    card += `<div onclick="setColor('#F27457', 'rosaairbnb')" style="background-color: #F27457;" class="color rosaairbnb"></div>`;
    card += `<div onclick="setColor('#04BF9D', 'rosagula')" style="background-color: #04BF9D;" class="color rosagula"></div>`;
    card += `<div onclick="setColor('#F28705', 'laranja')" style="background-color: #F28705;" class="color laranja"></div>`;
    card += `</div>`;
    card += `<button onclick="addStep('${pipe_id}')">Adicionar</button>`;
    card += `</div>`;

    $(`#nova_step .head`).before(card);


    $(`#new_step input`).blur(() => {
        var novoStep = JSON.parse(localStorage.getItem('novoStep'));
        novoStep.title = $(`#new_step input`).val();
        // //console.log(novoStep)
        localStorage.setItem('novoStep', JSON.stringify(novoStep))
    })

}

function setColor(cor, classe) {
    var novoStep = JSON.parse(localStorage.getItem('novoStep'));
    novoStep.color = cor;
    // //console.log(novoStep)
    localStorage.setItem('novoStep', JSON.stringify(novoStep))

    $(`.color`).removeClass('selected');
    $(`.color.${classe}`).addClass('selected');
}

function openMenuStep(step_id) {

    var card = `<div class='menuStep' id="del_step">`;
    card += `<button onclick="confirmDelStep('${step_id}')"><i class="fi fi-rr-trash"></i> Excluir esta Step</button>`;
    card += `</div>`;

    $(`#step_${step_id} .head`).append(card);

    $('.menuStep').mouseleave(() => {
        $('.menuStep').remove()
    })
}

function delStep(step_id) {
    $('.content').css('filter', 'none');
    $('#modal_aviso').remove();
    // //console.log(`#step_${step_id}`)
    axios.put(`/api/step/update/status`, {
        status: 'erase',
        id: step_id
    }).then((sucess) => {

        if (sucess.status != 200) {
            error(sucess.data);
            return;
        }

        $(`#step_${step_id}`).fadeOut(200);

    }).catch((erro) => {
        error(erro)
    })
}

function confirmDelStep(step_id) {

    var numCards = $('#step_' + step_id + ' .body .card').length;
    if (numCards > 0) {
        aviso('Você precisa retirar todos os cards dessa Step antes de apagá-la.');
        return;
    }

    var msg = `Deseja realmente deletar a Step <strong>${$('#step_'+step_id+ ' .head h4').text()}</strong>?`;

    $('.content').css('filter', 'blur(4px)');
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);

    var mensagem = `<div id="aviso">`
    mensagem += `<div class="aviso">${msg}</div>`
    mensagem += `<div class="botoes">`
    mensagem += `<button id="rejeitar_aviso">Não</button>`
    mensagem += `<button id="aceitar_aviso"  onclick="delStep('${step_id}')">Sim</button>`
    mensagem += `</div>`
    mensagem += `</div>`

    $('#modal_aviso').append(mensagem);

    $(`#rejeitar_aviso`).on(`click`, () => {
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


function editStepWithEnter(e, step_id) {

    if (e.keyCode == 13) {
        $(`#step_${step_id} input.titleStep`).blur();
    }

}

async function listarSteps(pipe_id) {

    $(`.conteudo`).html(``);

    const listaSteps = await axios.get(`/api/step/listar/${pipe_id}`)

    if (listaSteps.status != 200) {
        console.error(listaSteps.data);
        error('Desculpe, houve um erro ao carregar os steps');
        return;
    }

    const steps = listaSteps.data;

    var alturaTela = window.innerHeight;
    var larguraTela = window.innerWidth;

    if (larguraTela < 600) {
        var alturaColumn = 80 + '%';

        $('.ferramentas').fadeOut(200);
        $('#menu_agendas').fadeOut(200);
        $('#btm_pessoas').fadeOut(200);

    } else {
        var alturaColumn = (alturaTela - 110) + 'px';
    }

    //Imagens
    var powerups = `<i class="fi fi-rr-bolt"></i>`;
    var signer = `<i class="fi fi-rr-fingerprint"></i>`;
    var arquivamento = `<i class="fi fi-rr-box"></i>`;
    var requerimento = `<i class="fi fi-rr-ballot"></i>`;

    var step = "";

    steps.sort(function (a, b) {
        if (a.position > b.position) {
            return 1;
        }
        if (a.position < b.position) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    for (var i = 0; i < steps.length; i++) {

        var getCountCards = await axios.get(`/api/pipe/count-cards/${steps[i].id}`)

        if (getCountCards.status != 200) {
            error(getCountCards.data);
            return;
        }

        var countCards = getCountCards.data

        step += `<div class="column" id="step_${steps[i].id}" style="height: ${alturaColumn}px;">`;
        step += `<div class="head" style="color: ${steps[i].color};">`;

        step += `<input max="10" class="titleStep" onkeypress="editStepWithEnter(event, '${steps[i].id}')" onblur="editTitleStep('${steps[i].id}', $(this).val());$(this).removeClass('editing')" style="max-width: 160px;min-width: 40px;color: ${steps[i].color};" value="${steps[i].title}" onfocus="$(this).addClass('editing')" />`;

        step += `<div class="botoesHeadStep">`;
        step += `<label id="numberCard_${steps[i].id}" class="numberCards">${countCards}</label>`;

        step += `<button class="more" style="color: ${steps[i].color};background-color: ${steps[i].color}11;" onclick="novoCard(${steps[i].id})">+ Card</button>`;

        step += `<i onclick="openMenuStep('${steps[i].id}')" class="fi fi-rr-menu-dots-vertical" style="color: ${steps[i].color};"></i>`;
        step += `</div>`;
        step += `</div>`;
        // step += `<div class="valor_total"></div>`;
        step += `<div class="body" style="background-color: ${steps[i].color}11;">`;
        step += `</div>`;
        step += `</div>`;

    }

    step += `<div class="column" id="nova_step" style="height: ${alturaColumn}px;">`;
    step += `<div class="head" style="color: var(--blackgray);background-color:transparent;">`;
    step += `<h4 style="color: var(--blackgray);cursor:pointer;font-size: 12px" onclick="newStep('${pipe.id}')"><i class="fi fi-rr-add"></i> Add Step</h4>`;
    step += `</div>`;
    step += `</div>`;

    var windowWidth = window.innerWidth;

    $(`.conteudo`).html(`<div class="carrossel">${step}</div>`);
    if (windowWidth > 500) {
        $('#filtrosDoPipe, #busca_in_pipe').show()
    } else {

        $('#busca_in_pipe').show()
    }

    exibirCards(pipe_id);

};

async function setCountCardsInSteps(pipe_id) {

    const listaSteps = await axios.get(`/api/step/listar/${pipe_id}`)

    if (listaSteps.status != 200) {
        error(listaSteps.data);
        return;
    }

    var status = listaSteps.status
    const steps = listaSteps.data

    for (var i = 0; i < steps.length; i++) {

        var getCountCards = await axios.get(`/api/pipe/count-cards/${steps[i].id}`);

        if (getCountCards.status != 200) {
            error(getCountCards.data);
            return;
        }

        setTotalValuesSteps(steps[i].id);

        var countCards = getCountCards.data;
        $(`#numberCard_${steps[i].id}`).html(countCards)

    }
}


async function setTotalValuesSteps(step_id){

    var valores = $(`#step_${step_id} .cardValue`);
    var valorTotal = 0;
    for(valor of valores){
        valorTotal += parseFloat(valor.innerText.replace('.', ''));
    }

    $(`#step_${step_id} .valor_total`).text(valorTotal.toFixed(2).replace('.',','));

}


function notifyMe(msg) {

    var notification = `<div class="notification" title="Clique para fechar" onclick="$(this).slideUp(200)">${msg}</div>`;

    playSound();

    $('.notify')
        .append(notification)
        .slideDown(200);

}

async function deleteCardFromNewStep(card, step) {

    // var verify = await verifyRequisitsStep(card, step);

    // if (verify != 'ok') {
    //     return;
    // }

    //console.log('Aqui')

    axios.put(`/api/card/update/step`, {
        step_id: 0,
        id: card,
    }).then((sucess) => {
        if (sucess.status == 200) {

            $(`#card_${card}`).remove();
            $('.openCard').css('filter', 'none');
            $('#modal_aviso').remove();

            setCountCardsInSteps(pipe.id);

            closeCard();

            var metadata = {
                stepAnterior: step,
                pipe: pipe.id,
            }

            setAnalisys('arquived_card', metadata, pipe.id, card);

        } else {
            error(sucess.data)
        }

    }).catch((error) => {
        console.error(error)
    })
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

async function addPerson(idPerson, namePerson, card_id) {
    var cores = ['#fcba03', '#fc8003', '#03fcf0', '#03fc4e', '#038cfc', '#be03fc', '#fc0356', '#bfa6ff'];
    var rand = getRandomNumber(0, cores.length);

    var person = `<div class="person" id="${idPerson}" style="background-color:${cores[rand]}">`;
    person += `<label>${namePerson}</label>`;
    person += `<img src="/img/close.svg" onclick="removePeople('${idPerson}', '${card_id}')">`;
    person += `</div>`;

    $('#pessoas .list').append(person);

    // $(`#card_${card_id} .persons`).append(`<label id="label_${idPerson}"><i class="fi fi-rr-user"></i> ${namePerson}</label>`);

    var getUser = await axios.get(`/api/users/get/${idPerson}`);
    if (getUser.status != 200) {
        alert(getUser.data);
        return;
    }
    var user = getUser.data;

    var getCard = await axios.get(`/api/card/${card_id}`);
    if (getCard.status != 200) {
        alert(getCard.data);
        return;
    }
    var card = getCard.data;
    var metaCard = JSON.parse(card.metadata);

    var subject = `Você foi adicionado ao Card "${metaCard.title}" no Pipedone!`
    var msg = "";
    msg += `Olá ${user.name.split(" ")[0]}!`;
    msg += `<br><br>`;
    msg += `Você foi adicionado ao Card ${metaCard.title}.`;
    msg += `<br><br>`;
    msg += `Clique no link abaixo ou entre na sua conta para acessar:`;
    msg += `<br>`;
    msg += `https://pipedone.com/pipe/${card.pipe_id}/card/${card.id}`;
    msg += `<br><br>`;
    msg += `Equipe Pipedone`;


    sentMail(msg, user.email, subject);

}

async function addTag(tagId, tagName, color, card_id) {


    if (pipe.metadata.powerups) {

        var powers = pipe.metadata.powerups.filter(item => item.condition.id == "tag_added");

        if (powers.length > 0) {

            for (power of powers) {
                activePowerUp(card_id, power);
            }

        }

    }

    var person = `<div class="person" id="${tagId}" style="background-color:${color}">`;
    person += `<label>${tagName}</label>`;
    person += `<img src="/img/close.svg" onclick="removeTag('${tagId}', '${card_id}')">`;
    person += `</div>`;

    $('.tagsDoCard').append(person);

    var card = await getCardById(card_id);

    var metadata = {
        tag: {
            name: tagName,
            id: tagId,
        },
        where: {
            pipe_id: card.pipe_id,
            step_id: card.step_id,
        }
    }

    setAnalisys('tag_add', metadata, card.pipe_id, card_id);


}

async function listSteps(card_id, atualStep, pipe_id) {

    var buscaSteps = await axios.get(`/api/step/listar/${pipe_id}`);
    if (buscaSteps.status != 200) {
        error(buscaSteps.data);
        return;
    }

    var steps = buscaSteps.data;
    var listaSteps = "";

    console.log(steps)
    console.log(atualStep)

    var stepAtual = steps.find(item => item.id == atualStep);

    console.log(stepAtual);

    var getPipe = await axios.get(`/pipe/view/${pipe_id}`);
    if (getPipe.status != 200) {
        error(getPipe.data);
        return;
    }

    var conectionsForPipe = getPipe.data.conections;

    listaSteps += `<h4>Mover para</h4>`;

    listaSteps += `<h6>Etapas:</h6>`;

    steps.sort(function (a, b) {
        if (a.position > b.position) {
            return 1;
        }
        if (a.position < b.position) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    for (let i = 0; i < steps.length; i++) {
        var element = steps[i];

        if (stepAtual != undefined) {

            if (i < stepAtual.position) {
                var classePosition = "back";
            } else {
                var classePosition = "next";
            }

        } else {
            var classePosition = "";
        }

        if (element.id != atualStep) {
            listaSteps += `<button id="btmStep${element.id}" class="step" onclick="moveCardToNewStep(${card_id}, ${element.id}, ${pipe_id})" style="color:${element.color};background-color:${element.color}11">${element.title}<i style="color:${element.color}" class="fi fi-rr-arrow-small-right ${classePosition}"></i></button>`;
        } else {
            listaSteps += `<hr>`;
        }
    }

    if (conectionsForPipe.length > 0) {
        listaSteps += `<h6>Pipes conectados:</h6>`;

        for (let i = 0; i < conectionsForPipe.length; i++) {
            const element2 = conectionsForPipe[i];
            if (element2.id != atualStep) {
                listaSteps += `<button id="btmStep${element2.id}" class="step" onclick="listStepsFromConections(${element2.id})" style="color:${element2.color};background-color:${element2.color}11">${element2.title}<i class="fi fi-rr-angle-small-down"></i></button>`;
                listaSteps += `<div class="sanfona" id="div_${element2.id}" onmouseleave="$(this).slideUp(200)" style="display:none"></div>`;
            }
        }

    }
    $('.movements').html(listaSteps)

}


async function moveCardToNewStep(card, step, pipe_id) {

    espera('on', 'Movendo...');
    var verify = await verifyRequisitsStep(card, step);

    if (verify == 'ok') {
        alterStepCard(card, step);
    } else {
        return;
    }

    axios.put(`/api/card/update/step`, {
        step_id: step,
        id: card,
    }).then((sucess) => {
        if (sucess.status == 200) {

            if (pipe_id == pipe.id) {

                var mCard = $(`#card_${card}`);
                var dropable = $(`#step_${step} .body`);
                dropable.prepend(mCard);

            } else {
                $(`#card_${card}`).css('border', '1px solid red');
            }


            let metadata = {
                to: {
                    step: step,
                    card: card,
                    pipe: pipe_id,
                },
                usuario: usuario.id,
            }

            if (pipe.metadata.powerups) {

                var powers = pipe.metadata.powerups.filter(item => item.condition.id == "card_movido");

                if (powers.length > 0) {

                    for (power of powers) {
                        activePowerUp(card, power);
                    }

                }

            }

            var nomeColuna = $(`#step_${step} .head .titleStep`).val();
            addHistory(card, `Moveu o card para a coluna ${nomeColuna}`);

            setAnalisys('card_moved', metadata, pipe_id, card);
            espera('off');
            setStepAtual(step);
            listSteps(card, step, pipe_id);
            emitCard(metadata);

            setTimeout(() => {
                openCard(card);
            }, 1000);

        } else {
            error(sucess.data);
            espera('off');
        }

    }).catch((error) => {
        console.error(error)
    })
}

async function moveCardToNewStepAndNewPipe(card, step, pipe_id) {

    var verify = await verifyRequisitsStep(card, step);

    if (verify == 'ok') {
        alterStepCard(card, step);
    } else {
        return;
    }

    axios.put(`/api/card/update/step/pipe`, {
        step_id: step,
        pipe_id: pipe_id,
        id: card,
    }).then((sucess) => {
        if (sucess.status == 200) {
            // //console.log('Moveu!');
            $(`#card_${card}`).remove();

            let metadata = {
                to: {
                    step: step,
                    card: card,
                    pipe: pipe_id,
                },
                usuario: usuario.id,
            }

            setAnalisys('card_moved', metadata, pipe_id, card);

            emitCard(metadata);

            if (pipe.metadata.powerups) {

                var powers = pipe.metadata.powerups.filter(item => item.condition.id == "card_movido");

                if (powers.length > 0) {

                    for (power of powers) {
                        activePowerUp(card, power);
                    }

                }

            }

            var nomeColuna = $(`#step_${step} .head .titleStep`).val();
            addHistory(card, `Moveu o card para a coluna ${nomeColuna}`);

            closeCard();
            listSteps(step);
        }

    }).catch((error) => {
        console.error(error)
    })
}

async function setStepAtual(step_id) {

    if (step_id != 0) {

        var GetEtapa = await axios.get(`/api/step/get/${step_id}`);
        if (GetEtapa.status != 200) {
            error(GetEtapa.data);
            return;
        }
        var etapa = GetEtapa.data;

        // //console.log(etapa.title);

        var colorEtapa = etapa.color;
        $('#faseAtual').text(etapa.title).css('background-color', `#${colorEtapa}11`).css('color', `#${colorEtapa}`)

    } else {
        var etapa = "Arquivado";
        var colorEtapa = "#3333"
        $('#faseAtual').text(etapa).css('background-color', `#${colorEtapa}11`).css('color', `#${colorEtapa}`)
    }

}

function moveCard(card_id, step_id, pipe_id) {

    // //console.log('Moveu!');

    axios.put(`/api/card/update/step/pipe`, {
        step_id: step_id,
        pipe_id: pipe_id,
        id: card_id,
    }).then((sucess) => {
        if (sucess.status == 200) {
            // $(`#card_${card}`).remove();

            let metadata = {
                to: {
                    step: step_id,
                    card: card_id,
                    pipe: pipe_id,
                },
                usuario: usuario.id,
            }

            setAnalisys('card_moved', metadata, pipe_id, card_id);


            // closeCard();
            listSteps(card_id, step_id, pipe_id);

            // //console.log('Card moved');

            emitCard(metadata);
        } else {
            error(sucess.data)
        }

    }).catch((error) => {
        console.error(error)
    })
}

function addTagInMiniCard(tagId, tagColor, tagText, card_id) {
    var elementoTag = `<div class="person" id="cardTag${tagId}" style="background-color:${tagColor}">`;
    elementoTag += `<label>${tagText}</label>`;
    elementoTag += `</div>`;

    $(`#card_${card_id} .tags`).append(elementoTag);

    //console.log('addTagInMiniCard')
}

async function criarCard(card) {

    if (!card.form) {
        var formulario = {
            fields: pipe.metadata.form
        }
    } else {
        var formulario = card.form;
    }

    if (!card.list_id) {
        var list_id = "";
    } else {
        var list_id = card.list_id;
    }

    if (!card.item_id) {
        var item_id = "";
    } else {
        var item_id = card.item_id;
    }

    var meta = {
        title: card.title,
        history: {
            drops: [],
            responsables: [],
            actions: []
        },
        tasks: [],
        form: formulario
    }

    var criar = await axios.post(`/api/card/create`, {
        title: card.title,
        pipe_id: card.pipe_id,
        list_id: list_id,
        item_id: item_id,
        meta: meta,
        step_id: card.step_id
    })

    if (criar.status == 200) {

        if (pipe.metadata.powerups) {

            var powers = pipe.metadata.powerups.filter(item => item.condition.id == "card_criado");

            if (powers.length > 0) {

                for (power of powers) {
                    activePowerUp(criar.data.id, power);
                }

            }

        }

        setCountCardsInSteps(card.pipe_id);

        var cardCadastrado = criar.data

        var meta = JSON.parse(cardCadastrado.metadata);

        var data = new Date(cardCadastrado.updatedAt);

        var dia = data.getDate() + '/' + (data.getMonth() + 1)+ '/' + data.getFullYear()
        var hora = data.getHours() + ':' + data.getMinutes();

    

        var ultimaAtualizacao = `Atualizado em ${dia} às ${hora}`;
  
        var cartao = `<div class='card cardItem' onclick="openCard(${cardCadastrado.id})" draggable="true" id="card_${cardCadastrado.id}"><div class="tags"></div><h4>${meta.title}</h4><div class="icones"></div><div class="persons"></div><span class="ultima">${ultimaAtualizacao}</span></div>`;

        $(`#new_card`).remove();
        $(`#step_${card.step_id} .body`).prepend(cartao);

        let metadata = {
            to: {
                step: card.step_id,
                card: cardCadastrado.id,
                pipe: card.pipe_id,
            },
            card: cardCadastrado,
            usuario: usuario.id,
        }

        setAnalisys('card_created', metadata, card.pipe_id, cardCadastrado.id);

        emitCard(metadata);

    } else {
        espera('off');
        error(criar.data)
    }

    let cardDrop = document.querySelectorAll('.card');
    cardDrop.forEach(function(item) {
        item.addEventListener('dragstart', DragStart);
        item.addEventListener('dragend', DragEnd);
        item.addEventListener('dragover', DragOver);
        item.addEventListener('dragenter', DragEnter);
    });

}

async function updateItemIdCard(card_id, item_id) {

}

async function exibirCards(pipe_id) {

    var busca = await axios.get(`/api/card/listar/${pipe_id}`);
    if (busca.status != 200) {
        error(busca.data);
        return;
    }
    var cards = busca.data;

    // //console.log(cards)

    // $(`.body`).html('')

    for (let i = 0; i < cards.length; i++) {

        // if(cards.creator_id == usuario.id){

            const element = cards[i];
            const meta = JSON.parse(element.metadata);
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

            var data = new Date(cards[i].updatedAt);
            var dia = data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear()
            var hora = data.getHours() + ':' + data.getMinutes();
            var ultimaAtualizacao = `Atualizado em ${dia} às ${hora}`;

            const cartao = `<div class='card cardItem' onclick="openCard(${element.id})" draggable="true" id="card_${element.id}"><div class="tags"></div><h4>${meta.title}</h4><div class="icones"></div><div class="persons"></div><span class="ultima">${ultimaAtualizacao}</span></div>`;

            $(`#step_${element.step_id} .body`).prepend(cartao);

            if (meta.coments) {
                $(`#card_${element.id} .icones`).append(`<div id="coment_${element.id}"><i class="fi fi-rr-comment-alt"></i> ${meta.coments.length}</div>`);
            }

            if (meta.persons) {
                setPersonsInCard(meta.persons, element.id);
            }

            if (meta.cardValue && meta.cardValue != "") {
                $(`#card_${element.id} .icones`).append(`<div id="cardValue_${element.id}"><i class="fi fi-rr-badge-dollar"></i> ${meta.cardValue}</div>`);
            }

            if (element.deadline && element.deadline != "" && element.deadline != "0000-00-00") {

                var hoje = new Date();
                var dataFim = new Date(element.deadline);
                if (hoje >= dataFim) {

                    $(`#step_${element.step_id} .head .botoes`).prepend('<i title="Você tem cards atrasados nessa coluna." class="fi fi-rr-time-delete"></i>')

                    $(`#card_${element.id}`)
                        .css('border-left', '3px solid red')
                        .css('border-right', '3px solid red')

                }

                var d = element.deadline.split('T')[0].split('-');
                var data = d[2] + '/' + d[1] + '/' + d[0];

                $(`#card_${element.id} .icones`).append(`<div id="deadline_${element.id}"><i class="fi fi-rr-calendar"></i> ${data}</div>`);
            }

            if (meta.tags && meta.tags.length > 0) {

                for (let i = 0; i < meta.tags.length; i++) {
                    const tag = meta.tags[i];

                    var elementoTag = `<div class="person" id="${tag.id}" style="background-color:${tag.color}">`;
                    elementoTag += `<label class="filterableItem" id="${tag.name}">${tag.name}</label>`;
                    elementoTag += `</div>`;

                    $(`#card_${element.id} .tags`).append(elementoTag);
                }

            }

            if (meta.tasks) {

                var tComplete = 0;

                for (let i = 0; i < meta.tasks.length; i++) {
                    const element = meta.tasks[i];
                    if (element.checked == true) {
                        tComplete++;
                    }
                }

                $(`#card_${element.id} .icones`).append(`<div id="task_${element.id}"><i class="fi fi-rr-check"></i> ${tComplete}/${meta.tasks.length}</div>`);


            }
            
        // }

    }

    let cardDrop = document.querySelectorAll('.card');
    cardDrop.forEach(function(item) {
        item.addEventListener('dragstart', DragStart);
        item.addEventListener('dragenter', DragEnter);
        item.addEventListener('dragover', DragOver);
        item.addEventListener('dragend', DragEnd);
    });

    let colunmDrop = document.querySelectorAll('.column .body');
    colunmDrop.forEach(function(item) {
        // item.addEventListener('dragenter', DragEnter);
        item.addEventListener('dragover', DragOver);
        item.addEventListener('drop', DropColumn);
    });

}

function setPersonsInCard(persons, card_id) {
    $(`#card_${card_id} .persons`).html('')
    for (var j = 0; j < persons.length; j++) {
        $(`#card_${card_id} .persons`).append(
            `<label ><i class="fi fi-rr-user"></i> <span class="filterableItem"  id="${persons[j].nome}">${persons[j].nome}</span></label>`
        );
    }
}

function hoje(data) {

    if (data != null && data != "" && data != undefined) {
        var date = new Date(data);
    } else {
        var date = new Date();
    }



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

    return d;

}

function hora(data) {

    if (data != null && data != "" && data != undefined) {
        var date = new Date(data);
    } else {
        var date = new Date();
    }

    var t = date.getHours() + ':' + date.getMinutes() + 'h';

    return t;
}


async function addHistory(card_id, action) {


    var buscaCard = await axios.get(`/api/card/${card_id}`);
    var card = buscaCard.data;
    var meta = JSON.parse(card.metadata);

    if (!meta.history.actions) {
        meta['history']['actions'] = "";
    }

    var regist = {
        user: usuario.name,
        user_id: usuario.id,
        date: hoje(),
        time: hora(),
        action: action
    }

    meta.history.actions.push(regist);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));

            $(`#menu_history`).html(`<i class="fi fi-rr-time-past"></i> Atividades (${meta.history.actions.length})`)

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}


function alterStepCard(card, step) {
    axios.put(`/api/card/update/step`, {
        step_id: step,
        id: card,
    }).then((sucess) => {
        //alert('Card alterado!')

        if (sucess.status != 200) {
            error(sucess.data);
            return;
        }
        setCountCardsInSteps(pipe.id);

        // Verificar powerups

        if (pipe.metadata.powerups) {

            var powers = pipe.metadata.powerups.filter(item => item.condition.id == "card_movido");

            if (powers.length > 0) {

                for (power of powers) {
                    activePowerUp(card, power);
                }

            }

        }

    }).catch((error) => {
        console.error(error)
    })
}

async function getMetaStep(step_id) {
    var busca = await axios.get(`/api/step/get/${step_id}`);
    if (busca.status != 200) {
        error(busca.data);
        return;
    }

    if (!busca.data || !busca.data.metadata) {
        // error(busca.data);
        return [];
    }

    var meta = busca.data.metadata;
    if (meta.requirements) {
        return meta.requirements;
    } else {
        return [];
    }
}

function getTitleStep(step_id) {
    return $(`#step_${step_id} .head h4`).text()
}

function arayInAray(reu, lei) {
    // retorna um array com elementos comuns
    const newArray = [];

    for (let i = 0; i < lei.length; i++) {
        const element = lei[i];

        const incEleInArr = reu.indexOf(element)
        if (incEleInArr == -1) {
            var tituloStep = getTitleStep(element);
            newArray.push(tituloStep)
        }
    }

    return newArray;

}

async function verifyRequisitsStep(card_id, step_id) {

    const requires = await getMetaStep(step_id);

    if (requires && requires.length > 0) {

        const buscaCard = await axios.get(`/api/card/${card_id}`)
        if (buscaCard.status != 200) {
            error(buscaCard.data);
            return;
        }
        const MetaCard = JSON.parse(buscaCard.data.metadata)
        const DropsCard = MetaCard.history.drops

        // Verificar em cada etapa se o card cumpre os requisitos.

        var avisos = "<h4>Complete as seguintes ações antes de continuar:</h4>";
        var count = 0;
        for (let i = 0; i < requires.length; i++) {

            const require = requires[i];

            // Drops
            if (require.drops) {

                const drops = require.drops
                var array = arayInAray(DropsCard, drops);

                if (array.length > 0) {
                    count++;

                    for (let j = 0; j < array.length; j++) {
                        const element = array[j];
                        avisos += `<li>Passar pela etapa <b>${element}</b></li>`;
                    }

                }

            }

        }

        if (count > 0) {

            aviso(avisos);

            $(`#card_${card_id}`)
                .css('background-color', 'var(--offred)')
                .click(() => {
                    $(`#card_${card_id}`).css('background-color', 'var(--branco)')
                })

            var sts = 'Não autorizado!';

        } else {

            var sts = 'ok';

        }

    } else {
        var sts = 'ok';
    }

    return sts;
}

function contaCards(stepId) {

    var body = $(`#step_${stepId} .body .card`).length;

    // //console.log(body);
    return body;
    //$(`#step_${stepId} .head h4`).append(` (${cards.length})`);
}



function DragStart(e) {
    //e.preventDefault();
    this.style.opacity = '0.2';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text", e.target.id);
    $(`#${e.target.id}`).css('background-color', 'var(--branco)')

}

function DragEnter(e) {

    $(`.card`).css(`margin-top`, '0px');

    e.preventDefault();
    var classe = e.target.className

    if (classe.includes("cardItem")) {
        var card = e.target;

        //console.log(card.id)

        $(`#${card.id}`).css(`margin-top`, '120px');

    }

}

function DragEnd(e) {
    e.preventDefault();
    this.style.opacity = '1';
    $('#dropHere').hide();
    $(`.card`).css(`margin-top`, '0px');
}

function DragOver(e) {
    e.preventDefault();

    if (e.target.className == 'body') {
        return;
    }
}

async function DropColumn(e) {

    // //console.log(e)

    e.stopPropagation(); // stops the browser from redirecting.
    e.preventDefault();

    var coluna = e.target;
    var card = document.getElementById(e.dataTransfer.getData("text"));

    var classe = e.target.className

    if (classe == "body") {

        var idCard = card.id.split('card_')[1];
        // if (e.path != undefined) {
        //     var idColumn = e.path[1].id.split('step_')[1];
        // } else {
        //     var idColumn = coluna.id.split('step_')[1];
        // }
        var idColumn = coluna.parentNode.id.split('step_')[1];

        var verify = await verifyRequisitsStep(idCard, idColumn);

        if (verify == 'ok') {
            alterStepCard(idCard, idColumn);
            coluna.prepend(card);

            let metadata = {
                to: {
                    step: idColumn,
                    card: idCard,
                    pipe: pipe.id,
                },
                usuario: usuario.id,
            }

            setAnalisys('card_moved', metadata, pipe.id, idCard);
            var nomeColuna = $(`#step_${idColumn} .head .titleStep`).val();
            addHistory(idCard, `Moveu o card para a coluna ${nomeColuna}`);

            emitCard(metadata);
        }

    }
}

async function DropCard(e) {

    e.stopPropagation(); // stops the browser from redirecting.
    e.preventDefault();
    var id = e.target.id;

    //console.log(e)

    if (id == "dropHere") {
        var newCard = document.getElementById(e.dataTransfer.getData("text"));

        var card_id = newCard.id.split('card_')[1]

        if (e.path != undefined) {
            var colum = e.path[1];
            var step_id = colum.id.split('step_')[1];
        } else {
            var colum = e.target.parentElement.parentElement;
            var step_id = colum.id.split('step_')[1];
        }

        var verify = await verifyRequisitsStep(card_id, step_id);

        if (verify == 'ok') {
            var child = e.target;
            var father = e.path[1];
            father.replaceChild(newCard, child);
            alterStepCard(card_id, step_id);

            let metadata = {
                to: {
                    step: step_id,
                    card: card_id,
                    pipe: pipe.id,
                },
                usuario: usuario.id,
            }

            setAnalisys('card_moved', metadata, pipe.id, card_id);

            emitCard(metadata);
        }

    }

}

async function openCard(card_id) {

    $('#card_escolhido').remove()

    const buscaCard = await axios.get(`/api/card/${card_id}`);

    const card = buscaCard.data;

    if (buscaCard.status != 200) {
        error(card);
        espera('off');
        return;
    }
    
    if (card.pipe_id != pipe.id) {
        error(`Esse card não pertence a este pipe!`);
        closeCard();
        return;
    }

    if (card.item_id != null && card.item_id != "" && card.item_id != undefined) {
        updateFormOfCardInList(card_id, card.list_id, card.item_id);
    }

    alterar_url(`/pipe/${pipe.id}/card/${card_id}`);

    localStorage.setItem('card', JSON.stringify(card))

    $('.content').css('filter', 'blur(4px)')
    $('body').append(`<div class="modal" id="card_escolhido"></div>`);
    $('#card_escolhido').load(`/html/card.html`, (done, sts, xhr) => {
        espera('off');
    });

}

function buscaItem(divInput, classItems) {

    let inputString = $(divInput).val();
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

async function setTagsFilters(pipe_id) {
    var getPipe = await axios.get(`/pipe/view/${pipe_id}`);

    if (getPipe.status != 200) {
        error(getPipe.data);
        return;
    }

    var pipe = getPipe.data;

    if (pipe.metadata.tags) {
        $(`.filtro_etiquetas`).html('')
        for (var i = 0; i < pipe.metadata.tags.length; i++) {
            const element = pipe.metadata.tags[i];
            var label = `<label class="filter" id="${element.name}" class="" onclick="setFilter($(this))"><i class="fi fi-rr-tags" style="color: ${element.color}"></i> ${element.name}</label>`;
            $(`.filtro_etiquetas`).append(label)
        }
    }
}

async function setPersonsFilters(pipe_id) {
    var getPipe = await axios.get(`/pipe/view/${pipe_id}`);

    if (getPipe.status != 200) {
        error(getPipe.data);
        return;
    }

    var obj = JSON.parse(getPipe.data.users);

    $(`.filtro_pessoas`).html('')
    for (var i = 0; i < obj.length; i++) {

        const element = obj[i];
        var getPerson = await axios.get(`/api/users/get/${element}`);
        var person = getPerson.data;
        var label = `<label class="filter" id="${person.name}" onclick="setFilter($(this))"><img src="/img/smile.svg"> ${person.name}</label>`;

        $(`.filtro_pessoas`).append(label);
    }
}

function setFilter(campo) {
    console.log(campo)
    var items = document.querySelectorAll(".cardItem");
    $(`.cardItem`).removeClass("ocultar").removeClass("exibindo");
    if (!campo.hasClass("active")) {
        campo.addClass("active");
    } else {
        campo.removeClass("active");
    }
    var camposSelecionados = $(`.active`);
    if (camposSelecionados.length > 0) {
        for (let item of items) {
            if ($(item).hasClass("filtrado")) {
                continue;
            }
            var tagsEncontradas = 0;
            var itemsToFilter = item.querySelectorAll(".filterableItem"); // agora filtra apenas tags e perssoas ( antes filtrava texto)
            console.log(itemsToFilter)
            for (let j = 0; j < camposSelecionados.length; j++) {
                var tag = camposSelecionados[j].id;
                var tagEncontrada = false;
                for (let itemToFilter of itemsToFilter) {
                    console.log("tag", tag, itemToFilter)
                    if (
                        tag === itemToFilter.id
                    ) {
                        tagEncontrada = true;
                        break; // sai do loop de tags ao encontrar uma correspondência para evitar contar a mesma tag mais de uma vez
                    }
                }
                if (tagEncontrada) {
                    tagsEncontradas++;
                }
            }
            console.log("comparar", tagsEncontradas, camposSelecionados.length)

            if (tagsEncontradas >= camposSelecionados.length) {
                $(item).removeClass("ocultar");
            } else {
                $(item).addClass("ocultar");
            }
        }
    } else {
        clearFilter();
    }
}


//FILTRA SE POSSUIR QUALQUER UMA DAS TAGS
/* function setFilter(campo, termos, filter_element) {
  var items = document.querySelectorAll(".cardItem");
  $(".cardItem").removeClass("ocultar").removeClass("exibindo");
  if (!campo.hasClass("active")) {
    campo.addClass("active");
  } else {
    campo.removeClass("active");
  }
  var camposSelecionados = $(".active");
  if (camposSelecionados.length > 0) {
    for (let item of items) {
      var encontrou = false;
      if ($(item).hasClass("filtrado")) {
        continue;
      }
      var itemsToFilter = item.querySelectorAll(".filterableItem");
      for (let itemToFilter of itemsToFilter) {
        for (let j = 0; j < camposSelecionados.length; j++) {
          var tag = camposSelecionados[j].id;
          if (itemToFilter.id=== tag) {
            encontrou = true;
          }
        }
      }
      if (encontrou) {
        $(item).removeClass("ocultar");
      } else {
        $(item).addClass("ocultar");
      }
    }
  } else {
    clearFilter();
  }
} */

// function setFilter(campo, termos, filter_element) {

//     var filtrados = $('.card').hasClass('filtrado');
//     var items = document.querySelectorAll('.card');


//     if (!campo.hasClass('active')) {

//         // //console.log('Não Tem')
//         campo.addClass('active');

//         for (let item of items) {

//             var elemento = item.innerText.toLowerCase().includes(termos.toLowerCase());

//             if (!elemento) {
//                 $(item).addClass('ocultar')
//             }
//         }

//     } else {

//         campo.removeClass('active');

//         var camposSelecionados = $(`.filter.active`)

//         // //console.log(camposSelecionados)

//         if (camposSelecionados.length > 0) {
//             for (let j = 0; j < camposSelecionados.length; j++) {

//                 var termo = camposSelecionados[j].id;

//                 // //console.log(termo)

//                 for (let item of items) {

//                     var elemento = item.innerText.toLowerCase().includes(termo.toLowerCase());

//                     if (elemento) {
//                         $(item).removeClass('ocultar')
//                     }

//                 }

//             }
//         } else {
//             clearFilter()
//         }

//     }

// }


function clearFilter() {
    $(`.filtros label`).removeClass('active');
    $(`.card`).removeClass('ocultar').removeClass('exibindo');
}


function openPowerUps() {
    $(`.powerups`).siblings().css('filter', 'blur(4px)')
    $(`.powerups`).load(`/html/powerups.html`)
    $(`.powerups`).fadeIn(200)
}

function closePowerUps() {
    $(`.powerups`).siblings().css('filter', 'none')
    $(`.powerups`).fadeOut(200)
}


function openNewCard() {
    $(`.novo_card`).siblings().css('filter', 'blur(4px)');
    $(`.novo_card`).load(`/html/create_card.html`);
    $(`.novo_card`).fadeIn(200);
}



// listarSteps(pipe.id);
setTagsFilters(pipe.id);
setPersonsFilters(pipe.id);