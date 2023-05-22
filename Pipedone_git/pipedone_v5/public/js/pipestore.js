async function setPipeModel(categoria) {

    const listaPipes = await fetch(`/json/${categoria}.json`);
    const pipes = await listaPipes.json();
    var conteudo = "";

    for (let i = 0; i < pipes.length; i++) {

        var element = pipes[i];

        var pipe = JSON.stringify(element);

        conteudo += `<div class="elemento" onclick='clonarPipe(${pipe})'>`;
        conteudo += `<img src="${element.icon}" class="icone">`;
        conteudo += `<img src="${element.image}" class="destaque">`;
        conteudo += `<h3>${element.title}</h3>`;
        conteudo += `<p>${element.description}</p>`;
        conteudo += `<div class="usar">Instalar com um clique</div>`;
        conteudo += `</div>`;

    }

    $('.conteudo').html(conteudo);

    $('#closeAll').on(`click`, () => {
        $('.content').css('filter', 'none');
        $('.modal').remove();
    })

    $('.categorias button').removeClass('active')
    $(`.${categoria}`).addClass('active')

}

setPipeModel('produtividade');

$(`#criar_do_zero`).on(`click`, () => {

    $('#modelos_pipe').css('filter', 'blur(4px)');

    $('body').append(`<div class="modal" id="pipe_do_zero"></div>`);

    $('#pipe_do_zero').html('').load(`/html/pipe_do_zero.html`).show();

})