localStorage.clear();
$(`header`).remove()

async function login() {
    let email = $(`#pipe_email`).val()
    let senha = $(`#pipe_senha`).val()

    $(`#pipe_entrar`).text('Entrando...')

    var login = await axios.post(`/api/user/authenticate`, {
        email: email,
        senha: senha
    });

    if (login.status == 200) {
        sucess('Bem vindo!')

        $(`#pipe_entrar`).text('Sucesso!')

        localStorage.setItem('usuario', JSON.stringify(login.data))

        location.href = "/pipes";

        var usuario = {
            user_id: login.data.id,
            organization_id: login.data.organization_id,
        }

        var socket = io.connect("http:///");

        socket.emit("logar", usuario, (usuario) => {
            console.log("==========socket===========");
            console.log(usuario);
            console.log("==========socket===========");
        });


    } else {

        $(`#pipe_entrar`).text('Entrar')
        error(login.data);
    }
}

$(`#pipe_entrar`).on(`click`, () => {
    login()
})

$(document).keypress((key) => {
    if (key.key == 'Enter') {
        login();
    }
})