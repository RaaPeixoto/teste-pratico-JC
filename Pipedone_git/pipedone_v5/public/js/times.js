async function setTabela(status, page) {
    var getTabela = await axios.get(`/api/users/listar-existentes/${page}`);
    var resultTabela = getTabela.data;
    var tabela = resultTabela.rows;
    var count = resultTabela.count;
    var linhas = "";
    var nav_pages = "";

    if (count > 0) {

        linhas += `<tr class="linha head">`;
        linhas += `<th style="width: 10%">ID</th>`;
        linhas += `<th style="width: 35%">NOME</th>`;
        linhas += `<th style="width: 30%">EMAIL</th>`;
        linhas += `<th style="width: 15%">TIPO</th>`;
        linhas += `<th style="width: 10%">STATUS</th>`;
        linhas += `</tr>`;

        for (var i = 0; i < count; i++) {
            const element = tabela[i];


            var tipoNumberLoop = i % 2 === 0 ? 'par' : 'impar';

            if (tipoNumberLoop == 'par') {
                var cor = "var(--branco)";
            } else {
                var cor = "var(--cinza)";
            }

            linhas += `<tr class="linha" onclick="openMember(${element.id})" style="background-color: ${cor}">`;
            linhas += `<td style="width: 10%">${element.id}</td>`;
            linhas += `<td style="width: 35%">${element.name}</td>`;
            linhas += `<td style="width: 30%">${element.email}</td>`;
            linhas += `<td style="width: 15%">${element.type}</td>`;
            linhas += `<td style="width: 10%">${element.status}</td>`;
            linhas += `</tr>`;


        }

        var pages = Math.ceil(count / 15);

        for (var i = 0; i < pages; i++) {

            nav_pages += `<button class="circulo" onclick="setTabela(${status}, page)">${i+1}</button>`;
        }

        $(`.nav_tabela_time`).html(nav_pages);

    } else {
        linhas += `<div class="time_vazio"></div>`;
    }
    $(`.tabela_time`).html(linhas);
}

async function openAddNewMember() {

    var limit = await verifyMembersDisponible();

    if (limit == 0) {
        error(`Você já atingiu o limite de membros da sua conta.`);
        return;
    }

    $('body').append(`<div class="modal" id="new_member"></div>`);
    $('#new_member').siblings().css('filter', 'blur(4px)');
    $('#new_member').load(`/html/novo_membro.html`);
}

async function openMember(id) {

    $('body').append(`<div class="modal" id="open_member"></div>`);
    $('#open_member').siblings().css('filter', 'blur(4px)');
    $('#open_member').load(`/html/update_member.html`, async() => {

        var getMember = await axios.get(`/api/users/get/${id}`);
        var member = getMember.data;
        var name = member.name;
        var email = member.email;
        var type = member.type;
        var status = member.status;

        $('h2').text(name);
        $('#member_id').val(id);
        $('#nome').val(name);
        $('#email').val(email);
        $(`#status option[value="${status}"]`).attr('selected', true);
        $(`#tipo option[value="${type}"]`).attr('selected', true);

        console.log("==== member ====")
        console.log(member)
        console.log("==== member ====")

        var pipes = member.permissions.pipes;
        var steps = member.permissions.steps;
        var listas = member.permissions.listas;
        var itensLists = member.permissions.itens;
        var times = member.permissions.times;
        var pagamentos = member.permissions.pagamentos;
        var cards = member.permissions.cards;
        var propostas = member.permissions.propostas;
        var assinatura = member.permissions.assinatura;
        var anexos = member.permissions.anexos;
        var tarefas = member.permissions.tarefas;
        var formulario = member.permissions.formulario;
        var fotos = member.permissions.fotos;

        for (var i = 0; i < pipes.length; i++) {
            var element = pipes[i]
            $(`input[name="pipes"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < steps.length; i++) {
            var element = steps[i]
            $(`input[name="steps"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < times.length; i++) {
            var element = times[i]
            $(`input[name="times"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < pagamentos.length; i++) {
            var element = pagamentos[i]
            $(`input[name="pagamentos"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < cards.length; i++) {
            var element = cards[i]
            $(`input[name="cards"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < propostas.length; i++) {
            var element = propostas[i]
            $(`input[name="propostas"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < assinatura.length; i++) {
            var element = assinatura[i]
            $(`input[name="assinatura"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < anexos.length; i++) {
            var element = anexos[i]
            $(`input[name="anexos"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < tarefas.length; i++) {
            var element = tarefas[i]
            $(`input[name="tarefas"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < formulario.length; i++) {
            var element = formulario[i]
            $(`input[name="forms"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < fotos.length; i++) {
            var element = fotos[i]
            $(`input[name="fotos"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < listas.length; i++) {
            var element = listas[i]
            $(`input[name="listas"][value="${element}"]`).attr('checked', true);
        }

        for (var i = 0; i < itensLists.length; i++) {
            var element = itensLists[i]
            $(`input[name="itens"][value="${element}"]`).attr('checked', true);
        }

    });
}

setTabela('active', '1');

$('.pipes_conectados').remove();
$('.menu button').removeClass('ativo');
$('#menu_Times').addClass('ativo');