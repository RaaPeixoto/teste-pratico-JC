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

    $('#new_models_photos').siblings().css('filter', 'none');
    $('#new_models_photos').remove();
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
            $('#new_models_photos').siblings().css('filter', 'none');
            $('#new_models_photos').remove();
            $('#new_photos').siblings().css('filter', 'blur(4px)');

            setModelsPhotos();
        }

    }).catch((error) => {
        console.log(error);
    })

}