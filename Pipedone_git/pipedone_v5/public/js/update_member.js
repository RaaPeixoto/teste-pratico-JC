function closeMember() {
    $('#open_member').siblings().css('filter', 'none');
    $('#open_member').remove();
}

function updateDadosMember() {
    $(`#atualizarMembro`).text('Atualizando...');

    var id = $('#member_id').val();
    var name = $('#nome').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var cpf = $('#cpf').val();
    var type = $('#tipo').val();
    var status = $('#status').val();

    if (id == "" || name == "" || email == "" || type == "" || status == "") {
        espera('off');
        error('Por favor, preencha o todos campos!');
        $(`#atualizarMembro`).text('Atualizar');
        return;
    }

    axios.put(`/api/users/update/dados`, {
        id: id,
        name: name,
        email: email,
        phone: phone,
        cpf: cpf,
        type: type,
        status: status,
    }).then((sucess) => {
        if (sucess.status == 200) {
            setTabela('active', '1');
            setTimeout(() => {
                $(`#atualizarMembro`).text('Atualizar');
            }, 1000);
        } else {
            error(sucess.data);

            setTimeout(() => {
                $(`#atualizarMembro`).text('Atualizar');
            }, 1000);
        }
    }).catch((error) => {
        console.log(error);
    })

}

function updatePermissionsMember() {

    $(`#atualizarPermissions`).text('Atualizando...');

    var id = $('#member_id').val();
    var inputpipes = $('input[name="pipes"]:checked');
    var inputsteps = $('input[name="steps"]:checked');
    var inputforms = $('input[name="forms"]:checked');

    var inputlistas = $('input[name="listas"]:checked');
    var inputitens = $('input[name="itens"]:checked');

    var inputfotos = $('input[name="fotos"]:checked');
    var inputtimes = $('input[name="times"]:checked');
    var inputpagamentos = $('input[name="pagamentos"]:checked');
    var inputcards = $('input[name="cards"]:checked');
    var inputpropostas = $('input[name="propostas"]:checked');
    var inputassinatura = $('input[name="assinatura"]:checked');
    var inputanexos = $('input[name="anexos"]:checked');
    var inputtarefas = $('input[name="tarefas"]:checked');
    var inputmodels = $('input[name="models"]:checked');

    var pipes = [];
    var steps = [];
    var forms = [];
    var fotos = [];
    var listas = [];
    var itens = [];
    var times = [];
    var pagamentos = [];
    var cards = [];
    var propostas = [];
    var models = [];
    var assinatura = [];
    var anexos = [];
    var tarefas = [];

    for (var i = 0; i < inputpipes.length; i++) {
        var element = inputpipes[i];
        pipes.push(element.value)
    }

    for (var i = 0; i < inputsteps.length; i++) {
        var element = inputsteps[i];
        steps.push(element.value)
    }

    for (var i = 0; i < inputtimes.length; i++) {
        var element = inputtimes[i];
        times.push(element.value)
    }

    for (var i = 0; i < inputpagamentos.length; i++) {
        var element = inputpagamentos[i];
        pagamentos.push(element.value)
    }

    for (var i = 0; i < inputcards.length; i++) {
        var element = inputcards[i];
        cards.push(element.value)
    }

    for (var i = 0; i < inputpropostas.length; i++) {
        var element = inputpropostas[i];
        propostas.push(element.value)
    }

    for (var i = 0; i < inputassinatura.length; i++) {
        var element = inputassinatura[i];
        assinatura.push(element.value)
    }

    for (var i = 0; i < inputanexos.length; i++) {
        var element = inputanexos[i];
        anexos.push(element.value)
    }

    for (var i = 0; i < inputtarefas.length; i++) {
        var element = inputtarefas[i];
        tarefas.push(element.value)
    }

    for (var i = 0; i < inputforms.length; i++) {
        var element = inputforms[i];
        forms.push(element.value)
    }

    for (var i = 0; i < inputfotos.length; i++) {
        var element = inputfotos[i];
        fotos.push(element.value)
    }

    for (var i = 0; i < inputlistas.length; i++) {
        var element = inputlistas[i];
        listas.push(element.value)
    }

    for (var i = 0; i < inputitens.length; i++) {
        var element = inputitens[i];
        itens.push(element.value)
    }

    for (var i = 0; i < inputmodels.length; i++) {
        var element = inputmodels[i];
        itens.push(element.value)
    }

    var permissions = {
        pipes: pipes,
        steps: steps,
        formulario: forms,
        times: times,
        pagamentos: pagamentos,
        cards: cards,
        listas: listas,
        itens: itens,
        models: models,
        propostas: propostas,
        assinatura: assinatura,
        anexos: anexos,
        tarefas: tarefas,
        fotos: fotos,
    }

    axios.put(`/api/users/update/permissions`, {
        id: id,
        permissions: permissions
    }).then((sucess) => {
        if (sucess.status == 200) {
            setTabela('active', '1');
        } else {
            error(sucess.data);
        }
        setTimeout(() => {
            $(`#atualizarPermissions`).text('Atualizar');
        }, 1000);
    }).catch((error) => {
        console.log(error);
    })

}

function avisodeleteMember() {

    var id = $('#member_id').val()
    var name = $('#nome').val();
    $('body').append(`<div class="modal" id="modal_aviso"></div>`);
    $('#open_member').css('filter', 'blur(4px)');

    var modal = "";

    modal += `<div id="aviso">`
    modal += `<div class="aviso">`
    modal += `<h1>Tem certeza que deseja EXCLUIR <b>${name}</b> do seu time?</h1>`
    modal += `<p>Essa ação não poderá ser desfeita!</p>`
    modal += `</div>`
    modal += `<div class="botoes">`
    modal += `<button id="prosseguir">Cancelar</button>`
    modal += `<button id="fechar_aviso" onclick="deleteMember('${id}')">Deletar</button>`
    modal += `</div>`
    modal += `</div>`

    $('#modal_aviso').append(modal);

    $(`#prosseguir`).on(`click`, () => {
        $('#open_member').css('filter', 'none');
        $('#modal_aviso').remove();
    })

}

function deleteMember(id) {
    espera('on', 'Removendo...');
    axios.put(`/api/users/update/status`, {
        id: id,
        status: 'deleted'
    }).then((sucess) => {
        if (sucess.status == 200) {
            setTabela('active', '1');
            closeMember()
            espera('off');
        } else {
            error(sucess.data);
            espera('off');
        }
    }).catch((error) => {
        console.log(error);
    })
}