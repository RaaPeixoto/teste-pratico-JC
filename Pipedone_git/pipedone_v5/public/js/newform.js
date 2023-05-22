var form = [];

if (pipe.metadata.form) {

    for (formula of pipe.metadata.form) {
        generatorOfElementExistent(formula);
        form.push(formula);
    }

}

function generatorOfElement(key) {

    switch (key) {

        case 'el_title':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<h2 onblur="ediTitle('${id}')" contentEditable="true" class="title">Título</h2>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'title',
                description: 'Título',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_subTitle':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<p onblur="ediTitle('${id}')" contentEditable="true" class="title">Título</p>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'subTitle',
                description: 'Subtítulo',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_break':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<hr>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'breakLine',
                description: '',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_text':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Descrição</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'text',
                description: 'Descrição',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_file':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Descrição</h4>`;
            strHTML += `<input type="file" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'file',
                description: 'Descrição',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_placa':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Placa</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'placa',
                description: 'Placa',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_data':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Data</h4>`;
            strHTML += `<input type="date" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'date',
                description: 'Data',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_year':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Data</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'year',
                description: 'Ano',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_phone':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Telefone</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'phone',
                description: 'Telefone',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_cpf':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">CPF</h4>`;
            strHTML += `<input type="number" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'cpf',
                description: 'CPF',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_hora':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Hora</h4>`;
            strHTML += `<input type="time" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'time',
                description: 'Hora',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_textarea':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var strHTML = `<div class="divElemento" id="${id}">`;
            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Descrição</h4>`;
            strHTML += `<textarea disabled></textarea>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'textarea',
                description: 'Descrição',
                meta: {}
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_radio':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Descrição</h4>`;

            strHTML += `<div class="label" id="${id2}">`;
            strHTML += `<input name="${id}" value="Opção 01" type="radio" disabled>`;
            strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">Opção</label>`
            strHTML += `</div>`;

            strHTML += `<label onclick="addElement('${id}', 'radio')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'radio',
                description: 'Descrição',
                meta: {
                    campos: [{
                        option: 'Opção',
                        id: id2
                    }]
                }
            }

            form.push(field)

            var elemento = strHTML;
            break;

        case 'el_checkbox':

            var id = Math.floor(Date.now() * Math.random()).toString(36);
            var id2 = Math.floor(Date.now() * Math.random()).toString(36);
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">Descrição</h4>`;

            strHTML += `<div class="label" id="${id2}">`;
            strHTML += `<input name="${id}" value="Opção 01" type="checkbox" disabled>`;
            strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">Opção</label>`
            strHTML += `</div>`;

            strHTML += `<label onclick="addElement('${id}', 'checkbox')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var posit = form.length + 1;

            var field = {
                id: id,
                position: posit,
                type: 'checkbox',
                description: 'Descrição',
                meta: {
                    campos: [{
                        option: 'Opção',
                        id: id2
                    }]
                }
            }

            form.push(field)

            var elemento = strHTML;
            break;

    }

    return elemento;
}


function generatorOfElementExistent(formula) {

    var key = `el_${formula.type}`;

    switch (key) {

        case 'el_title':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<h2 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h2>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);
            break;

        case 'el_subTitle':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<p onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</p>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);
            break;

        case 'el_break':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<hr>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);
            break;

        case 'el_text':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_file':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="file" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_placa':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="text" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_year':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="number" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;


        case 'el_cpf':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="number" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_phone':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="number" disabled>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_date':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="date" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_time':

            var id = formula.id;
            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<input type="time" disabled style="max-width: 130px">`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_textarea':

            var id = formula.id;

            var strHTML = `<div class="divElemento" id="${id}">`;
            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;
            strHTML += `<textarea disabled></textarea>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_radio':

            var id = formula.id;

            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;

            for (campo of formula.meta.campos) {
                var id2 = campo.id;

                strHTML += `<div class="label" id="${id2}">`;
                strHTML += `<input name="${id}" value="${campo.option}" type="radio" disabled>`;
                strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">${campo.option}</label>`;
                strHTML += `</div>`;

            }

            strHTML += `<label onclick="addElement('${id}', 'radio')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

        case 'el_checkbox':

            var id = formula.id;

            var strHTML = `<div class="divElemento" id="${id}">`;

            strHTML += `<div>`;
            strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${formula.description}</h4>`;

            for (campo of formula.meta.campos) {
                var id2 = campo.id;

                strHTML += `<div class="label" id="${id2}">`;
                strHTML += `<input name="${id}" value="${campo.option}" type="checkbox" disabled>`;
                strHTML += `<label onblur="ediSubTitle('${id}', '${id2}')" contentEditable="true" class="text">${campo.option}</label>`;
                strHTML += `</div>`;

            }

            strHTML += `<label onclick="addElement('${id}', 'checkbox')" class="new">+ Adicionar opção</label>`;
            strHTML += `</div>`;
            strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
            strHTML += '</div>';

            var elemento = strHTML;
            $(`.elementsForms`).append(elemento);

            break;

    }

}

// function generatorElementSave(form) {
//     for (formula of form) {
//         var key = `el_${formula.type}`;
//         var element_id = formula.
//         var description = formula.

//         switch(key) {

//             case 'el_title':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<h2 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h2>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'title',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_subTitle':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<p onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</p>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'subTitle',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_break':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<hr>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'breakLine',
//                     description: '',
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_text':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;
//                 strHTML += `<input type="text" disabled>`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'text',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_date':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;
//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;
//                 strHTML += `<input type="date" disabled style="max-width: 130px">`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'date',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_hora':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;
//                 strHTML += `<input type="time" disabled style="max-width: 130px">`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'time',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_textarea':

//                 var id = element_id;

//                 var strHTML = `<div class="divElemento" id="${id}">`;
//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;
//                 strHTML += `<textarea disabled></textarea>`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'textarea',
//                     description: `${description}`,
//                     meta: {}
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_radio':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;

//                 strHTML += `<label onclick="addElement('${id}', 'radio')" class="new">+ Adicionar opção</label>`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'radio',
//                     description: `${description}`,
//                     meta: {
//                         campos: []
//                     }
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             case 'el_checkbox':

//                 var id = element_id;
//                 var strHTML = `<div class="divElemento" id="${id}">`;

//                 strHTML += `<div>`;
//                 strHTML += `<h4 onblur="ediTitle('${id}')" contentEditable="true" class="title">${description}</h4>`;

//                 strHTML += `<label onclick="addElement('${id}', 'checkbox')" class="new">+ Adicionar opção</label>`;
//                 strHTML += `</div>`;
//                 strHTML += `<i onclick="delElement('${id}')" class="fi fi-rr-cross"></i>`;
//                 strHTML += '</div>';

//                 var posit = form.length + 1;

//                 var field = {
//                     id: id,
//                     position: posit,
//                     type: 'checkbox',
//                     description: `${description}`,
//                     meta: {
//                         campos: []
//                     }
//                 }

//                 form.push(field)

//                 var elemento = strHTML;
//                 break;

//             default:
//                 var elemento = ''
//                 break;
//         }

//         console.log(form);
//         $(`.elementsForms`).append(elemento);
//     }
// }

function addElement(idElement, tipo) {

    switch (tipo) {
        case 'radio':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="radio" disabled>`;
            elemento += `<label onblur="ediSubTitle('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElement('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);


            var fields = form;


            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;

        case 'checkbox':

            var id2 = Math.floor(Date.now() * Math.random()).toString(36);

            var elemento = `<div class="label" id="${id2}">`;
            elemento += `<input value="Opção" name="${idElement}" type="checkbox" disabled>`;
            elemento += `<label onblur="ediSubTitle('${idElement}', '${id2}')" contentEditable="true" class="text">Opção</label>`;
            elemento += `<i onclick="delSubElement('${id2}', '${idElement}')" class="fi fi-rr-cross"></i>`;
            elemento += `</div>`;

            $(`div#${idElement} label.new`).before(elemento);

            var fields = form;


            var newText = {
                option: 'Opção',
                id: id2
            };

            for (let i = 0; i < fields.length; i++) {
                const element = fields[i];

                if (element.id == idElement) {
                    element.meta.campos.push(newText);
                }

            };

            break;
        default:
            break;
    }
}

function ediTitle(idElement) {

    var newText = $(`div#${idElement} .title`).text()

    var arrayEdit = form.filter(item => item.id == idElement)[0];
    var arrayNew = form.filter(item => item.id != idElement);

    arrayEdit.description = newText;

    arrayNew.push(arrayEdit);
    form.length = 0;

    for (array of arrayNew) {
        form.push(array)
    }

}

function ediSubTitle(idElement, idSubElement) {

    var formulario = form;
    var fields = form;
    var newText = $(`div#${idSubElement} .text`).text()
    $(`div#${idSubElement} input`).val(newText)

    // console.log(fields);
    // console.log(newText);

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var campos = element.meta.campos;

            for (let j = 0; j < campos.length; j++) {
                const element = campos[j];

                if (element.id == idSubElement) {

                    element.option = newText;

                }

            }
        }

    }

}

function delElement(idElement) {

    var newArray = form.filter(item => item.id !== idElement);

    form.length = 0;

    for (array of newArray) {
        form.push(array)
    }

    $(`#${idElement}`).remove();

}

function delSubElement(idSubElement, idElement) {

    var formulario = form;
    var fields = form;

    for (let i = 0; i < fields.length; i++) {
        const element = fields[i];

        if (element.id == idElement) {
            var newArray = element.meta.campos.filter((item) => item.id !== idSubElement);
            element.meta.campos = newArray;
        }

    }

    console.log(form);

    $(`#${idSubElement}`).remove();

}

function DragStart(e) {
    this.style.opacity = '0.2';
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData("text", e.target.id);
}

function DragEnd(e) {
    e.preventDefault();
    this.style.opacity = '1';
    $(`.drop`).css('background-color', 'transparent');
}

function DragEnter(e) {

    e.preventDefault();
    $(`.drop`).css('background-color', 'var(--offblue)');

    // // console.log('Em cima!')

    // var classe = e.target.className

    // console.log(classe);

    // if (classe == "divElemento") {

    //     var card = e.target;

    //     const parser = new DOMParser();
    //     const htmlString = "<div id='dropHere'>Solte Aqui</div>";
    //     const doc3 = parser.parseFromString(htmlString, "text/html");
    //     const dropHere = doc3.body.firstChild

    //     card.before(dropHere)

    //     let DropHere = document.querySelectorAll('#dropHere');
    //     DropHere.forEach(function(item) {
    //         item.addEventListener('dragover', DragOver);
    //         item.addEventListener('drop', DropCard);
    //     });

    // }
}

function DragOver(e) {
    e.preventDefault();
    $(`.drop`).css('background-color', 'transparent');
    $(`#dropHere`).remove();
    if (e.target.className == 'drop') {
        return;
    }
}

async function Drop(e) {

    e.stopPropagation(); // stops the browser from redirecting.52
    e.preventDefault();
    $(`#dropHere`).remove();
    var copyCard = document.getElementById(e.dataTransfer.getData("text"));
    var newCard = generatorOfElement(copyCard.id);
    $(`.elementsForms`).append(newCard);

    // let cardDrop = document.querySelectorAll('.divElemento');
    // cardDrop.forEach(function(item) {
    //     item.addEventListener('dragstart', DragStart);
    //     item.addEventListener('dragend', DragEnd);
    //     item.addEventListener('dragover', DragOver);
    //     item.addEventListener('dragenter', DragEnter);
    // });

}

function test() {
    console.log('teste');
}

function closeNewForm() {
    var formulario = {
        fields: []
    }

    console.log(form);
    $('#new_form').siblings().css('filter', 'none');
    $('#new_form').remove();
}

function setDropsNewForms() {

    var cardDrop = document.querySelectorAll('.elemento');
    cardDrop.forEach(function(item) {
        item.addEventListener('dragstart', DragStart);
        item.addEventListener('dragend', DragEnd);
        item.addEventListener('dragover', DragOver);
    });

    var colunmDrop = document.querySelectorAll('.drop');
    colunmDrop.forEach(function(item) {
        item.addEventListener('dragenter', DragEnter);
        item.addEventListener('dragend', DragEnd);
        item.addEventListener('dragover', DragOver);
        item.addEventListener('drop', Drop);
    });

    var colunmDrop = document.querySelectorAll('.divElemento');
    colunmDrop.forEach(function(item) {
        item.addEventListener('dragenter', DragEnter);
        item.addEventListener('dragend', DragEnd);
        item.addEventListener('dragover', DragOver);
        item.addEventListener('drop', Drop);
    });
}

function salvarModelo() {

    $(`#salvarForm`).text('Salvando...')

    if (!pipe.metadata.form) {
        pipe.metadata['form'] = {};
    }

    pipe.metadata.form = form;

    console.log(pipe.metadata);

    axios.put(`/api/pipe/update/metadata`, {
        metadata: pipe.metadata,
        id: pipe.id
    }).then((sucess) => {
        if (sucess.status == 200) {
            $(`#salvarForm`).text('Salvo!')
            setTimeout(() => {
                $(`#salvarForm`).text('Salvar formulário')
            }, 1000);
        }
    }).catch((erro) => {
        console.log(erro);
    })

}