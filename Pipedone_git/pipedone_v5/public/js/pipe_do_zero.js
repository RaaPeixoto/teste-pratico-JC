$('#closeZero, #cancelar').click(() => {
    $('#modelos_pipe').css('filter', 'none');
    $('#pipe_do_zero').remove();
})

$('#criar').click(async() => {
    const listaPipe = await fetch(`/json/pipe_em_branco.json`);
    const pipe = await listaPipe.json();
    const titulo = $('#nome_pipe').val();

    pipe.title = titulo;

    clonarPipe(pipe);
})