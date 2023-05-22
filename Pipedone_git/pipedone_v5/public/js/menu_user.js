var temaAtual = metadata.preferences.theme;

if (temaAtual == 'dark') {
    $(`#tema`).text('Selene')
} else {
    $(`#tema`).text('Apolo')
}

$(`.tema`).click(async() => {

    var temaAtual = $(`body`).attr('class');

    if (temaAtual.includes('dark')) {
        $(`#tema`).text('Apolo')
        var novoTema = 'light'
    } else {
        $(`#tema`).text('Selene')
        var novoTema = 'dark'
    }

    $(`.tema`).removeClass(`t_${temaAtual}`).addClass(`t_${novoTema}`);
    $(`body`).removeClass(`${temaAtual}`).addClass(`${novoTema}`);

    var teste = await axios.put(`/api/user/update/metadata/theme`, {
        theme: novoTema
    });

    if (teste.status == 200) {
        let metaAtual = JSON.parse(usuario.metadata)
        metaAtual.preferences.theme = novoTema;

        let newMeta = JSON.stringify(metaAtual)
        usuario.metadata = newMeta
        localStorage.setItem('usuario', JSON.stringify(usuario))

    }

})