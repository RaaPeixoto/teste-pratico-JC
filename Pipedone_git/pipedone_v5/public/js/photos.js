function openCreatModelPhotos() {
    $('body').append(`<div class="modal" id="new_models_photos"></div>`);
    $('#new_models_photos').siblings().css('filter', 'blur(4px)');
    $('#new_models_photos').load(`/html/create_models_photos.html`);
}

async function setModelsPhotos() {

    var getModels = await axios.get(`/api/models/listar/photo`);
    verifyErroAxios(getModels)
    var models = getModels.data;
    var photosmodels = $(`#photosmodels`);
    var listaModels = "";

    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        listaModels += `<label>`;
        listaModels += `<input type="radio" name="model" value="${model.id}">`;
        listaModels += `${model.title}`;
        listaModels += `</label>`;
    }

    photosmodels.html(listaModels);
}

async function creatLinkPhotos() {

    var idModels = $(`input[name="model"]:checked`).val();

    if (!meta.photos) {
        meta['photos'] = [];
    }

    var idPhoto = await axios.post(`/api/photos/create`, {
        model_id: idModels,
        card_id: card.id,
    })

    verifyErroAxios(idPhoto);

    meta.photos.push(idPhoto.id);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card.id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            sucess('Link criado!');
            addHistory(card.id, 'adicionou um link de photos.');
            closeSetFotos();

            setTimeout(() => {
                openCard(card.id);
            }, 50);

        } else {
            error(resposta.data)
        }

    }).catch((text) => {
        error(text)
    })

}