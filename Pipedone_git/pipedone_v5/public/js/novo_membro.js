function closeNewMember() {
    $('#new_member').siblings().css('filter', 'none');
    $('#new_member').remove();
}

function addNewMember() {
    espera('on', 'Criando membro...');

    var name = $('#nome').val()
    var email = $('#email').val()
    var type = $('#tipo').val()

    if (name == "" || email == "" || type == "") {
        espera('off');
        error('Por favor, preencha o todos campos!');
        return;
    }

    axios.post(`/api/users/create`, {
        name: name,
        email: email,
        type: type,
    }).then((sucess) => {
        console.log(sucess.data);
        if (sucess.status == 200) {
            closeNewMember();
            setTabela('active', '1');
            espera('off');
        } else {
            alert(sucess.data);
            espera('off');
        }
    }).catch((error) => {
        alert(error);
        espera('off');
    })
}