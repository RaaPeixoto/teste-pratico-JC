async function setTabela(pipe_id, page) {
    var getTabela = await axios.get(`/api/card/arquivo/${pipe_id}/${page}`);
    var resultTabela = getTabela.data;
    var tabela = resultTabela.rows;
    var count = resultTabela.count;
    var linhas = "";
    var nav_pages = "";

    if (count > 0) {

        for (var i = 0; i < tabela.length; i++) {

            const element = tabela[i];

            var meta = JSON.parse(element.metadata);

            var tipoNumberLoop = i % 2 === 0 ? 'par' : 'impar';

            if (tipoNumberLoop == 'par') {
                var cor = "var(--branco)";
            } else {
                var cor = "var(--cinza)";
            }

            if (meta.tags) {
                var tags = `<div class="icone"><i class="fi fi-rr-tags"></i> ${meta.tags.length}</div>`;
            } else {
                var tags = "";
            }

            if (meta.persons) {
                var persons = `<div class="icone"><i class="fi fi-rr-users-alt"></i> ${meta.persons.length}</div>`;
            } else {
                var persons = "";
            }

            if (meta.tasks) {
                var tasks = `<div class="icone"><i class="fi fi-rr-list-check"></i> ${meta.tasks.length}</div>`;
            } else {
                var tasks = "";
            }

            linhas += `<tr class="linha" onclick="openCard(${element.id})" style="background-color: ${cor}">`;
            linhas += `<td style="width: 10%">${element.id}</td>`;
            linhas += `<td style="width: 50%">${meta.title}</td>`;
            linhas += `<td style="width: 40%">${tags}${persons}${tasks}</td>`;
            linhas += `</tr>`;


        }

        var pages = Math.ceil(count / 50);

        for (var i = 0; i < pages; i++) {
            var p = i + 1;
            if (page == p) {
                var sts = 'ativo';
            } else {
                var sts = '';
            }
            nav_pages += `<button class="circulo ${sts}" onclick="setTabela(${pipe_id}, ${p})">${p}</button>`;
        }

        $(`.nav_tabela_time`).html(nav_pages);
        $('.contentArquivo').show();
        $('.waiting').hide();

    } else {
        linhas += `<div class="time_vazio"></div>`;
    }
    $(`.tabela_time`).html(linhas);
}


$('.menu button').removeClass('ativo');
$('#menu_Times').addClass('ativo');