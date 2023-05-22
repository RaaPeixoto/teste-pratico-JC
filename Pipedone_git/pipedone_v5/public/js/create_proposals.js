function countText(campo, span, limit) {
    var count = $(`${campo}`).val().length;
    $(`${span}`).text(`${count}/${limit}`);
}

function newId() {
    return Math.floor(Date.now() * Math.random()).toString(36);
}

async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

$("#file_exemplo").on("change", () => {

    var file = document.getElementById('file_exemplo').files[0];

    if (file.type != "image/jpeg" && file.type != "image/svg+xml" && file.type != "image/svg+xml" && file.type != "image/png") {
        error('Formato de arquivo não permitido.')
        return;
    }

    getBase64(file).then(
        data => $('#photo_exemplo').attr('src', data)
    );

});

$("#cancelar_modelo").on("click", () => {

    $('#new_proposals').siblings().css('filter', 'none');
    $('#new_proposals').remove();
    $('#new_photos').siblings().css('filter', 'blur(4px)');

});


function removePhoto(photo_id) {
    $(`#${photo_id}`).remove();
    var newArray = model.photos.filter((item) => item.id !== photo_id);
}

function updatePhoto(photo_id) {

    var newArray = model.photos.filter((item) => item.id !== photo_id);
    var photo = model.photos.filter((item) => item.id === photo_id)[0];

    var titulo = $(`#${photo_id} .titulo`).val()
    var descricao = $(`#${photo_id} .descricao`).val()

    photo.title = titulo;
    photo.instruction = descricao;

    newArray.push(photo);

    model.photos = newArray;

}

function addPhoto() {

    var photo = $(`#photo_exemplo`).attr('src');
    var title = $(`#title_photo`).val();
    var instruction = $(`#description_photo`).val();
    var type = $(`input[name="tipoDeFoto"]:checked`).val();

    if (photo == "/img/mockup-foto.svg") {
        var photo = "";
    }

    if (title == "") {
        error('Por favor, preencha o título antes de adicionar uma nova foto.');
        return;
    }

    var photo = {
        id: newId(),
        photo: photo,
        type: type,
        title: title,
        instruction: instruction
    }

    model.photos.push(photo);

    seeNewAddPhoto(photo);

    $(`.modelo`).slideUp(200);

    $(`#file_exemplo`).val('');
    $(`#photo_exemplo`).attr('src', '');
    $(`#title_photo`).val('');
    $(`#description_photo`).val('');

}

function seeNewAddPhoto(photo) {

    var elemento = "";
    elemento += `<div class="fotoCriada" id="${photo.id}">`;
    elemento += `<i class="closeModels fi fi-rr-trash" onclick="removePhoto('${photo.id}')"></i>`;

    if (photo.photo != "") {
        elemento += `<img src="${photo.photo}">`;
    }

    if (photo.type == 'environment') {
        var type = `<i class="fi fi-rr-mode-landscape"></i> Ambiente`
    }

    if (photo.type == 'self') {
        var type = `<i class="fi fi-rr-mode-portrait"></i> Self`
    }

    elemento += `<div class="text">`;
    elemento += `<span class="typePhoto">${type}</span>`;
    elemento += `<input onblur="updatePhoto('${photo.id}')" class="titulo" maxlength="36" value="${photo.title}"/>`;
    elemento += `<textarea onblur="updatePhoto('${photo.id}')" class="descricao" maxlength="200">${photo.instruction}</textarea>`;
    elemento += `</div>`;
    elemento += `</div>`;

    $(`#photos`).append(elemento)
}

function saveModels() {

    var title = $(`#title_model`).val();
    model.instructions = $(`#instrutions_model`).val();
    model.finally = $(`#despedida_model`).val();
    model.permitirMaisFotos = $(`input[name="permitirMaisFotos"]:checked`).val();
    model.captarGeo = $(`input[name="captarGeo"]:checked`).val();
    var type = 'photo';

    if (title == '') {
        error('Por favor, preenche um título para esse modelo.');
        return;
    }

    var metadata = model;

    console.log(metadata);

    axios.post(`/api/models/create`, {
        title: title,
        metadata: metadata,
        text: '',
        type: type,
    }).then((sucess) => {
        console.log(sucess.data);

        if (sucess.status == 200) {
            $('#new_proposals').siblings().css('filter', 'none');
            $('#new_proposals').remove();
            $('#new_photos').siblings().css('filter', 'blur(4px)');

            setModelsPhotos();
        }

    }).catch((error) => {
        console.log(error);
    })

}

function addLine() {
    var id = newId();
    var linha = "";
    linha += `<tr id="${id}">`;
    linha += `<td style="max-width: 100px;"><input onchange="somaItem('${id}')" name="qtd" type="tel" onkeypress="$(this).mask('###0.00', {reverse: true})"/></td>`;
    linha += `<td style="max-width: 360px;"><input onchange="somaItem('${id}')" name="descricao" type="text" /></td>`;
    linha += `<td style="max-width: 120px;"><input onchange="somaItem('${id}')" name="valor" placeholder="0.00" type="tel" onkeypress="$(this).mask('###0.00', {reverse: true})"/></td>`;
    linha += `<td style="max-width: 120px;"><input name="valortotal" type="tel" placeholder="0.00" onchange="$(this).mask('###0.00', {reverse: true})" disabled/></td>`;
    linha += `<td style="max-width: 20px;"><i onclick="removeLine('${id}')" class="fi fi-rr-trash"></i></td>`;
    linha += `</tr>`;

    $('tbody#linhas').append(linha);
}

addLine();

function somaItem(idLinha) {
    var qtd = $(`#${idLinha} input[name="qtd"]`).val();
    var descricao = $(`#${idLinha} input[name="descricao"]`).val();
    var valor = $(`#${idLinha} input[name="valor"]`).val();
    var valortotal = $(`#${idLinha} input[name="valortotal"]`);

    if (
        qtd != "" &&
        descricao != "" &&
        valor != ""
    ) {
        valortotal.val(parseFloat(qtd * valor).toFixed(2));
        refreshTotal();
    }

}

function refreshTotal() {
    var desconto = $(`#desconto`).val();
    var total = 0;
    var listaValores = $(`input[name="valortotal"]`);
    for (let i = 0; i < listaValores.length; i++) {
        const element = listaValores[i];
        total += parseFloat(element.value);
    }

    var valorComDesconto = total - ((desconto / 100) * total);

    $(`#total`).text(`R$ ${total}`)
    $(`#valordesconto`).text(`R$ ${parseFloat((desconto / 100) * total).toFixed(2)}`)
    $(`#totalfinal`).text(`R$ ${parseFloat(valorComDesconto).toFixed(2)}`)
}

function createProposals() {

    var linhas = $('tbody#linhas tr')
    var biometria = $('input[name="biometria"]:checked').val()
    var payment = $('input[name="payment"]:checked').val()

    if (linhas.length > 0) {
        $(`#adicionar_modelo`).text('Criando...');
    } else {
        $(`#adicionar_modelo`).text('Criar proposta');
        return;
    }

    var proposals = {
        client: "",
        biometria: biometria,
        payment: payment,
        card_id: card.id,
        pipe_id: card.pipe_id,
        validity: "",
        type: "personal",
        budget: {
            items: [],
            percentDiscount: "",
            totalValue: "",
            discountValue: "",
            finalValue: "",
        },
        obs: "",
    }

    proposals.client = $('#title_model').val();
    proposals.validity = $('#validate_model').val();
    proposals.budget.percentDiscount = $('#desconto').val();
    proposals.budget.totalValue = $('#total').text();
    proposals.budget.discountValue = $('#valordesconto').text();
    proposals.budget.finalValue = $('#totalfinal').text();
    proposals.obs = $('#pagamentos_e_condicoes').val();

    for (let i = 0; i < linhas.length; i++) {
        const element = linhas[i];
        var item = {
            qtd: $(`#${element.id} input[name="qtd"]`).val(),
            description: $(`#${element.id} input[name="descricao"]`).val(),
            value: $(`#${element.id} input[name="valor"]`).val(),
            totalValue: $(`#${element.id} input[name="valortotal"]`).val(),
        }
        proposals.budget.items.push(item);
    }

    axios.post(`/api/proposals/create`, {
        proposals: JSON.stringify(proposals)
    }).then((resposta) => {
        if (resposta.status == 200) {
            $('#new_models_proposals').siblings().css('filter', 'none');
            $('#new_models_proposals').remove();

            $('#new_proposals').siblings().css('filter', 'none');
            $('#new_proposals').remove();

            setProposals();
            sucess('Link Criado!')
        }
    }).catch((error) => {
        console.log(error);
    })

}

function closeCreateProposals() {
    $('#new_proposals').css('filter', 'none');
    $('#new_models_proposals').remove();
}

function removeLine(idLinha) {
    $(`#${idLinha}`).remove();
    setTimeout(() => {
        refreshTotal();
    }, 200);
}