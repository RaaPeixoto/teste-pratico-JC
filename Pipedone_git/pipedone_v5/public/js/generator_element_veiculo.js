function generatorElementVeiculo(element, valor, car_id, card_id) {

    switch (element.type) {

        case 'disabled':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input type="text" value="${valor}" name="${element.description}" placeholder="Digite aqui..." id="${element.id}" disabled>`;
            break;

        case 'text':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" type="text" value="${valor}" name="${element.description}" placeholder="Digite aqui..." id="${element.id}">`;
            break;

        case 'year':


            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" type="tel" value="${valor}" onkeypress="$(this).mask('0000')" placeholder="0000" id="${element.id}">`;
            break;


        case 'cpf':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" type="text" onkeypress="$(this).mask('000.000.000-00')" placeholder="000.000.000-00" style="width: 150px;" value="${valor}" id="${element.id}">`;
            break;


        case 'placa':


            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" type="text" onkeypress="$(this).mask('AAA-0A00')" onkeyup="$('#${car_id}').html($(this).val())" placeholder="aaa-0a00" style="width: 150px;text-transform: uppercase;" value="${valor}" id="${element.id}">`;
            break;

        case 'phone':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" type="tel" value="${valor}" onkeypress="$(this).mask('(00) 0 0000-0000')"  style="width: 150px;"  placeholder="(00) 0 0000-0000" id="${element.id}">`;
            break;

        case 'date':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')"  value="${valor}" type="date" id="${element.id}">`;
            break;

        case 'data':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" onkeypress="$(this).mask('00/00/0000')" value="${valor}"  style="width: 150px;"  type="text" id="${element.id}">`;
            break;

        case 'cep':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" onkeypress="$(this).mask('00.000-000')" value="${valor}"  style="width: 150px;"  type="text" id="${element.id}">`;
            break;

        case 'time':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<input  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" value="${valor}" type="time" id="${element.id}">`;
            break;

        case 'textarea':

            var elemento = `<h4 class="titulo">${element.description}</h4>`;
            elemento += `<textarea  onblur="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')"  placeholder="Digite aqui..." id="${element.id}">${valor}</textarea>`;
            break;

    }
    return elemento;
}


async function editCampCar(campo, campo_id, car_id, card_id) {

    var getCard = await getCardById(card_id);
    var metaCard = JSON.parse(getCard.metadata);
    var cars = metaCard.cars;
    var car = cars.filter(item => item.id == car_id)[0];
    var value = car.values.filter(item => item.id == campo_id)[0];

    value.value = campo.val();

    if (campo_id == 'veiculo_id') {
        car.placa = campo.val();
    }

    axios.put(`/api/card/update/metadata`, {
        metadata: metaCard,
        id: card_id
    }).then((resposta) => {

        if (resposta.status == 200) {

            localStorage.setItem('card', JSON.stringify(card));

            setBtmCars(metaCard.cars);

            addHistory(card_id, `Alterou o veículo de placa ${car.placa}.`);

        } else {
            error(resposta.data)
        }
    }).catch((text) => {
        error(text)
    })
}

// case 'radio':
//     var elemento = `<h4 class="titulo">${element.description}</h4>`;

//     if (meta.form.values) {
//         var values = meta.form.values;
//     } else {
//         var values = [{
//             id: "",
//             value: "",
//         }];
//     }

//     for (let i = 0; i < element.meta.campos.length; i++) {
//         var campo = element.meta.campos[i];

//         var newArray = values.filter((item) => item.id === element.id);

//         if (newArray.length > 0) {
//             if (newArray[0].value != campo.id) {
//                 var stsRadio = ""
//             } else {
//                 var stsRadio = "checked"
//             }
//         } else {
//             var stsRadio = ""
//         }


//         elemento += `<label for="${campo.id}" id="label_${campo.id}">`;
//         elemento += `<input type="radio" ${stsRadio} onchange="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')"  name="${element.id}" id="${campo.id}" value="${campo.id}"><span class="titleCampo">${campo.option}</span>`;
//         elemento += `</label>`;

//     }



//     break;

// case 'checkbox':

//     if (meta.form.values) {
//         var values = meta.form.values;
//     } else {
//         var values = [];
//     }

//     var elemento = `<h4 class="titulo">${element.description}</h4>`;
//     for (let i = 0; i < element.meta.campos.length; i++) {
//         var campo = element.meta.campos[i];

//         var newArray = values.filter((item) => item.id === campo.id);

//         if (newArray.length == 0) {
//             var stsCheckbox = ""
//         } else {
//             var stsCheckbox = "checked"
//         }

//         elemento += `<label for="${campo.id}" id="label_${campo.id}">`;
//         elemento += `<input type="checkbox" ${stsCheckbox} onchange="editCampCar($(this), '${element.id}', '${car_id}', '${card_id}')" id="${campo.id}" value="${campo.id}"><span class="titleCampo">${campo.option}</span>`;
//         elemento += `</label>`;

//     }

//     break;