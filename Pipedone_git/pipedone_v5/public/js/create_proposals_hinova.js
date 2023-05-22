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

    // //console.log(metadata);

    axios.post(`/api/models/create`, {
        title: title,
        metadata: metadata,
        text: '',
        type: type,
    }).then((sucess) => {
        // //console.log(sucess.data);

        if (sucess.status == 200) {
            $('#new_proposals').siblings().css('filter', 'none');
            $('#new_proposals').remove();
            $('#new_photos').siblings().css('filter', 'blur(4px)');

            setModelsPhotos();
        }

    }).catch((error) => {
        //console.log(error);
    })

}

function addLine() {
    var id = newId();
    var linha = "";
    linha += `<tr id="${id}">`;
    linha += `<td style="max-width: 100px;"><input onchange="somaItem('${id}')" name="qtd" type="text" onkeypress="$(this).mask('0000000')"/></td>`;
    linha += `<td style="max-width: 360px;"><input onchange="somaItem('${id}')" name="descricao" type="text" /></td>`;
    linha += `<td style="max-width: 120px;"><input onchange="somaItem('${id}')" name="valor" placeholder="0.00" type="text" onkeypress="$(this).mask('#0.0#', {reverse: true})"/></td>`;
    linha += `<td style="max-width: 120px;"><input name="valortotal" type="text" placeholder="0.00" onchange="$(this).mask('#0.0#', {reverse: true})" disabled/></td>`;
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
        valortotal.val(qtd * valor);
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
    $(`#valordesconto`).text(`R$ ${((desconto / 100) * total)}`)
    $(`#totalfinal`).text(`R$ ${valorComDesconto}`)
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
            qtd: 1,
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
        //console.log(error);
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

const contacao = {};

const items = [];

$('#newProposals aside input, #newProposals aside textarea').attr('disabled', true);

async function setMarcas() {
    var tipo = $('input[name="tipo_veiculo"]:checked').val();

    $(`#marcas`).html('<option value="" id="aguarde">Aguarde...</option>')

    var getMarcas = await axios.get(`/busca-veiculo/marcas/${tipo}`);
    var marcas = getMarcas.data;

    var elementos_marcas = "";
    elementos_marcas += `<option value="">Selecione uma opção</option>`;

    for (marca of marcas) {
        elementos_marcas += `<option value="${marca.Value}">${marca.Label}</option>`;
    }

    $(`#marcas`).html(elementos_marcas)
    $(`option#aguarde`).remove()

}

async function setAnos() {

    $(`#anos`).html('<option value="" id="aguarde">Aguarde...</option>')

    var data = new Date();
    var ano = data.getFullYear();
    var anos = "";
    anos += `<option value="">Selecione uma opção</option>`;
    anos += `<option value="32000">Zero quilômetro</option>`;
    anos += `<option value="${parseInt(ano) + 1}">${parseInt(ano) + 1}</option>`;
    for (var i = 0; i < 60; i++) {
        anos += `<option value="${parseInt(ano) - i}">${parseInt(ano) - i}</option>`;
    }
    $(`#anos`).html(anos)
    $(`option#aguarde`).remove()
}

async function setModelos() {
    $(`#modelos`).html('<option value="" id="aguarde">Aguarde...</option>');
    var tipo = $('input[name="tipo_veiculo"]:checked').val();
    var tipoCombustivel = $('input[name="tipo_combustivel"]:checked').val();
    var codigoMarca = $('#marcas').val();
    var ano = $('#anos').val();

    var getModelos = await axios.get(`/busca-veiculo/modeloPorAno/${tipo}/${tipoCombustivel}/${codigoMarca}/${ano}`);

    var modelos = getModelos.data;

    if (!modelos.codigo) {

        // //console.log(modelos)

        var elementos = "";
        elementos += `<option value="">Selecione uma opção</option>`;

        for (modelo of modelos) {
            elementos += `<option value="${modelo.Value}">${modelo.Label}</option>`;
        }

        $(`#modelos`).html(elementos)
        $(`option#aguarde`).remove()

    } else {
        alert('Veículo não encontrado.')
        $(`#modelos`).html('<option value="" id="aguarde">Não encontramos!</option>');
    }
}

async function setTiposHinova() {

    $(`#tipos_hinova`).html('<option value="" id="aguarde">Aguarde...</option>');

    var getModelos = await axios.get(`/hinova-api/TiposDeVeiculosHinova`);

    if (getModelos.status != 200) {
        alert("Por favor, verifique se você está autenticado na Hinova ou se tem autorização para usar esse serviço.");
        console.error('Erro na função setTiposHinova() ' + getModelos.data);
        return;
    }

    var modelos = getModelos.data;

    var elementos = "";
    elementos += `<option value="">Selecione uma opção</option>`;

    for (modelo of modelos) {
        elementos += `<option value="${modelo.codigo_tipo}">${modelo.descricao_tipo}</option>`;
    }

    $(`#tipos_hinova`).html(elementos)
    $(`option#aguarde`).remove()


}

async function setCategoriasHinova() {

    $(`.lista_categorias`).html('<option value="" id="aguarde">Aguarde...</option>');

    var codigo_tipo = $(`#tipos_hinova`).val()
    var getModelos = await axios.get(`/hinova-api/CategoriasDeVeiculosHinova/${codigo_tipo}`);

    var modelos = getModelos.data;

    contacao.codigo_tipo = codigo_tipo;

    var elementos = "";

    for (modelo of modelos) {

        var porcentagem_fipe = modelo.porcentagem_fipe;
        var preco_fipe = $('#valor_fipe').val().replace('R$ ', '').replace('.', '').replace(',', '.')
        var participacao_minima = modelo.participacao_minima;

        if (porcentagem_fipe > 0) {

            let participacao = (parseFloat(porcentagem_fipe) / 100) * parseFloat(preco_fipe)

            if (participacao > participacao_minima) {
                var partic = participacao;
            } else {
                var partic = participacao_minima;
            }

        } else {

            var partic = participacao_minima;

        }

        elementos += `<label class="categorias" value="${modelo.codigo_categoria}" onclick="setCategoria('${(modelo.valor_adesao)}','${(modelo.codigo_categoria)}','${(partic)}', '${(modelo.descricao_categoria)}')">${modelo.descricao_categoria}</label>`;
    }

    $(`.lista_categorias`).html(elementos)
    $(`option#aguarde`).remove()

}

setTiposHinova();

function setCategoria(valor_adesao, codigo_categoria, participacao_minima, descricao_categoria) {

    contacao.codigo_categoria = codigo_categoria;

    $(`.lista_categorias`).fadeOut(200)
    $(`#div_adesao_hinova, #btm_hinova_settings`).fadeIn(200)
    $(`#categoria_hinova`).val(descricao_categoria)
    $(`#adesao_hinova`).val(valor_adesao);

    $(`#participacao_hinova`).val(participacao_minima);

}

async function setProdutosHinova() {

    $(`.produtos`).html('<option value="" id="aguarde">Aguarde...</option>');

    var codigo_tipo = $(`#tipos_hinova`).val()
    var preco_fipe = parseFloat($(`#valor_fipe`).val().replace('R$ ', '').replace('.', ''))
    var tipo_veiculo = $(`#tipos_hinova`).val()

    var getProdutos = await axios.get(`/hinova-api/listaProdutosAtivosHinova/${codigo_tipo}`);
    var produtos = getProdutos.data;
    // //console.log(produtos)

    var elementos = "";

    for (produto of produtos) {

        if (produto.tipo_veiculo == tipo_veiculo || produto.tipo_veiculo == "0") {

            if (produto.formato_cobranca == 'R$') {
                var valor = parseFloat(produto.valor_produto);
            }

            if (produto.formato_cobranca == '%') {
                var valor = (parseFloat(produto.valor_produto) / 100) * preco_fipe;
            }

            elementos += `<label for="${produto.codigo_produto}"><input type="checkbox" id="${produto.codigo_produto}" value="${valor}" name="produto" onclick="addProduct('${produto.codigo_produto}',$(this),'${valor}', '${produto.decricao_produto}')"/> ${produto.decricao_produto} - R$ ${valor.toFixed(2)}</label>`;

        }

    }

    $(`.produtos`).html(elementos)
    $(`option#aguarde`).remove()

}



function addProduct(codigo, input, valor, descricao) {

    var produto = {
        codigo: codigo,
        value: parseFloat(valor),
        description: descricao,
    }


    if (input[0].checked == true) {
        //console.log("True:")
        items.push(produto);
        //console.log(items)
    } else {
        //console.log("False:")

        var newItems = items.filter(item => item.codigo !== codigo);

        while (items.length) {
            items.pop();
        }

        for (newItem of newItems) {
            items.push(newItem)
        }

        console.log(items)

    }


    var total = 0;
    for (item of items) {
        total += parseFloat(item.value);
    }

    $('#valor_total').text(`R$ ${total.toFixed(2)}`);

}

async function setVeiculo() {
    var tipo = $('input[name="tipo_veiculo"]:checked').val();
    var tipoCombustivel = $('input[name="tipo_combustivel"]:checked').val();
    var codigoMarca = $('#marcas').val();
    var ano = $('#anos').val();
    var codigoModelo = $('#modelos').val();

    var getModelos = await axios.get(`/busca-veiculo/veiculo-completo/${tipo}/${tipoCombustivel}/${codigoMarca}/${ano}/${codigoModelo}`);

    var veiculo = getModelos.data;

    var fipe_veiculo = veiculo.Modelo;
    var valor_fipe = veiculo.Valor;
    var codigo_fipe = veiculo.CodigoFipe;

    contacao.valor_fipe = valor_fipe;
    contacao.codigo_fipe = codigo_fipe;

    $('#fipe_veiculo').val(fipe_veiculo);
    $('#valor_fipe').val(valor_fipe);
    $('#codigo_fipe').val(codigo_fipe);

    $('#titulo').html(`<i class="fi fi-rr-star"></i> ${fipe_veiculo}`);


}

function gerarProposta() {

    var proposals = {
        payment: $('input[name="payment"]:checked').val(),
        card_id: card.id,
        pipe_id: card.pipe_id,
        type: "hinova",
        budget: {
            items: [],
            veiculo: $('#fipe_veiculo').val(),
            finalValue: $('#valor_total').text(),
            valor_fipe: $('#valor_fipe').val(),
            adesao: $('#adesao_hinova').val(),
            participacao: $('#participacao_hinova').val(),
        }
    }

    for (item of items) {
        var produto = {
            qtd: 1,
            description: item.description,
            value: item.value,
            totalValue: item.value,
        }
        proposals.budget.items.push(produto)
    }
    axios.post(`/api/proposals/create`, {
        proposals: JSON.stringify(proposals)
    }).then((resposta) => {
        if (resposta.status == 200) {
            $('#new_models_proposals').siblings().css('filter', 'none');
            $('#new_models_proposals').remove();

            $('#new_proposals').siblings().css('filter', 'none');
            $('#new_proposals').remove();

            while (items.length) {
                items.pop();
            }

            setProposals();
            sucess('Link Criado!');
        }
    }).catch((error) => {
        alert(error);
    })
}