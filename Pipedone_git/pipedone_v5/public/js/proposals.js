function openCreatModelProposals() {
    $('body').append(`<div class="modal" id="new_models_proposals"></div>`);
    $('#new_models_proposals').siblings().css('filter', 'blur(4px)');
    $('#new_models_proposals').load(`/html/create_proposals.html`);
}

async function creatLinkProposals() {

    var idModels = $(`input[name="model"]:checked`).val();

    if (!meta.Proposals) {
        meta['Proposals'] = [];
    }

    var idPhoto = await axios.post(`/api/Proposals/create`, {
        model_id: idModels,
        card_id: card.id,
    })

    meta.Proposals.push(idPhoto.id);

    axios.put(`/api/card/update/metadata`, {
        metadata: meta,
        id: card.id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));
            sucess('Link criado!');
            addHistory(card.id, 'adicionou um link de Proposals.');
            closeSetProposals();

            setTimeout(() => {
                openCard(card.id);
            }, 50);

        } else {
            error('Houve um erro ao salvar.')
        }

    }).catch((text) => {
        error(text)
    })

}

async function setModelsProposals() {

    var getModels = await axios.get(`/api/models/listar/proposals`);
    var models = getModels.data;
    var proposalsmodels = $(`#proposalsmodels`);

    if (models.length > 0) {

        var listaModels = ``;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            listaModels += `<label>`;
            listaModels += `<input type="radio" name="model" value="${model.id}">`;
            listaModels += `${model.title}`;
            listaModels += `</label>`;
        }

        proposalsmodels.html(listaModels);
    }
}
async function setModelsApps() {

    var getOrg = await axios.get(`/api/organization`);
    var org = getOrg.data;
    // console.log(org)
    var proposalsmodels = $(`#proposalsmodels`);

    if (org.metadata.apps && org.metadata.apps.includes("hinova_cotacao")) {

        var listaModels = `<label onclick="openCreateHinovaProposals()"><i class="fi fi-rr-star"></i>Cotação Hinova</label>`;

        proposalsmodels.append(listaModels);

    }
}

function closeSetProposals() {
    $('#new_proposals').siblings().css('filter', 'none');
    $('#new_proposals').remove();
}