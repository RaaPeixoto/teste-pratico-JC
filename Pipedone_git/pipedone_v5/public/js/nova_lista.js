$('#closeLista, #cancelar').click(() => {
    $('.content').css('filter', 'none');
    $('#criar_lista').remove();
})

$('#criar').click(() => {

    const titulo = $('#nome_lista').val();

    var lista = {
        title: titulo,
        meta: campos
    }

    console.log(lista)

    criarLista(lista);

})