localStorage.clear();
$(`header`).remove()
$(`#pipe_cadastrar`).on(`click`, async() => {

    const nome = $(`#pipe_nome`).val();
    const email = $(`#pipe_email`).val();
    const senha = $(`#pipe_senha`).val();
    const empresa = $(`#pipe_empresa`).val();

    $(`#pipe_cadastrar`).text('Entrando...')

    var login = await axios.post(`/api/user/register`, {
        name: nome,
        email: email,
        pass: senha,
        organization: empresa,
        type: 'master',
    });

    if (login.status == 200) {
        sucess(`Bem vindo ${nome.split(' ')[0]}!!`);

        $(`#pipe_cadastrar`).text('Sucesso!')

        localStorage.setItem('usuario', JSON.stringify(login.data))

        setTimeout(() => {
            location.href = '/pipes';
        }, 1000);
    } else {

        $(`#pipe_cadastrar`).text('cadastrar')
        error(login.data);
    }

})