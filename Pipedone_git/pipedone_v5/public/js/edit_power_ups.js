function ativaAcao() {

    $('.dislabled').fadeOut(200);

}

function setStepInCondition(type, value) {

    var elemento = {
        type: type,
        id: value,
    };

    var meta = automation.condition.meta.filter(item => item.type != type);

    meta.push(elemento);

    automation.condition.meta = meta;

    //console.log(automation);;
}


function setStepInAction(type, value) {

    var elemento = {
        type: type,
        id: value,
    };

    var meta = automation.action.meta.filter(item => item.type != type);

    meta.push(elemento);

    automation.action.meta = meta;

    //console.log(automation);;

}


function setTagInCondition(id, color, name) {

    var tag = {
        id: id,
        color: color,
        name: name,
    }

    automation.condition.meta = [];

    automation.condition.meta.push(tag);

    //console.log(automation);;
}

function setPersonInAction(id) {

    var persons = document.getElementById(`${id}`);

    if (persons.checked == true) {

        var meta = automation.action.meta.filter(item => item != id);

        meta.push(id);

        automation.action.meta = meta;

        //console.log(automation);;

    } else {

        var meta = automation.action.meta.filter(item => item != id);

        automation.action.meta = meta;

        //console.log(automation);;

    }

}

function setTagInAction(id, color, name) {

    var tag = {
        id: id,
        color: color,
        name: name,
    }

    automation.action.meta = [];

    automation.action.meta.push(tag);

    //console.log(automation);;
}

async function saveTagInPipe(idTag) {

    var cor = $(`input[name="corTag"]:checked`).val();
    var id = newId();
    var tagText = $(`#${idTag}`).val();

    var tag = {
        id: id,
        name: tagText,
        color: cor
    }

    if (pipe.metadata == null || !pipe.metadata.tags) {
        pipe.metadata = {};
        pipe.metadata.tags = [];
    }

    pipe.metadata.tags.push(tag);

    axios.put(`/api/pipe/update/metadata`, {
        metadata: pipe.metadata,
        id: pipe.id
    }).then((sucess) => {
        if (sucess.status == 200) {
            //console.log('Tag salva no pipe...');
            $('.addTag').fadeOut(200);
            addTag(tag);
        }
    }).catch((erro) => {
        console.log('erro na linha 371' + erro);
    })
}

function closeCondicao() {

    $(`.menu button`).removeClass('ativo');
    $('.dislabled').fadeIn(200);
    $('.condicao .menu').fadeIn(200);
    seeBtm(false);
}

function closeAcao(elemento) {
    $(`.menu button`).removeClass('ativo');
    elemento.parent().fadeOut(200);
    $('.acao .menu').fadeIn(200);
    seeBtm(false);
}

function setListColorTags() {

    var cores = ['#fcba03', '#fc8003', '#03fcf0', '#03fc4e', '#038cfc', '#be03fc', '#fc0356', '#bfa6ff', '#333'];
    var cor = ""
    for (let i = 0; i < cores.length; i++) {
        const element = cores[i];
        cor += `<label style="background-color: ${element};"><input value="${element}" type="radio" name="corTag" checked></label>`;
    }
    $(`.cores`).html(cor)
}

function activeMenu(btm) {
    $(`.menu button`).removeClass('ativo');
    $('.config').fadeOut(200)
    closeCondicao();
    btm.addClass('ativo');
}

function activeSubMenu(menu) {
    $('.condicao .menu').fadeOut(200);
    $(`#${menu}`).fadeIn(200);
}

function activeSubMenuAcao(menu) {
    $('.acao .menu').fadeOut(200);
    $(`#${menu}`).fadeIn(200);
}

async function setListSteps(pipe_id, local) {


    var listaSteps = await axios.get(`/api/step/listar/${pipe_id}`)
    var steps = listaSteps.data;

    var option1 = "";
    var option2 = "";
    var idUnico = newId();

    if (local == 'condicao') {

        for (step of steps) {

            option1 += `<label onclick="ativaAcao();setStepInCondition('step', '${step.id}')" style="background-color: ${step.color}11; color: ${step.color}"><input type="radio" name="step_condition_editing" value="${step.id}">${step.title}</label>`;

        }

        $(`.condicao .list_step`).html(option1);


    }

    if (local == 'acao') {

        for (step of steps) {
            option2 += `<label onclick="seeBtm(true);setStepInAction('step', '${step.id}')" style="background-color: ${step.color}11; color: ${step.color}"><input type="radio" name="step_action_editing" value="${step.id}">${step.title}</label>`;
        }

        $(`.acao .list_step`).html(option2);

    }

}

async function setListPipes() {

    $(`.condicao .list_pipes, .acao .list_pipes`).html('');

    var listaPipes = await axios.get(`/api/pipe/listar`);
    var pipes = listaPipes.data;

    //console.log('Lista montada!')

    var option = "";

    option += `<option value="" selected>Selecione uma opção</option>`;

    for (var i = 0; i < pipes.length; i++) {
        var pipeObj = pipes[i];
        option += `<option value="${pipeObj.id}">${pipeObj.title}</option>`;
    }

    $(`.acao .list_pipes`).html(option);

    $(`.condicao .list_pipes`).html(option);

}

async function setListTags() {

    var tags = pipe.metadata.tags;

    var option1 = "";
    var option2 = "";
    for (tag of tags) {
        option1 += `<label onclick="ativaAcao();setTagInCondition('${tag.id}','${tag.color}','${tag.name}')" style="background-color: ${tag.color}11; color: ${tag.color}"><input type="radio" name="condition_tags" value="${tag.id}">${tag.name}</label>`;
        option2 += `<label onclick="seeBtm(true);setTagInAction('${tag.id}','${tag.color}','${tag.name}')" style="background-color: ${tag.color}11; color: ${tag.color}"><input type="radio" name="action_tags" value="${tag.id}">${tag.name}</label>`;
    }
    $(`.condicao .list_tags`).html(option1);
    $(`.acao .list_tags`).html(option2);

}

function addTag(tag) {

    var option1 = `<label onclick="ativaAcao();setTagInCondition('${tag.id}','${tag.color}','${tag.name}')" style="background-color: ${tag.color}11; color: ${tag.color}"><input type="radio" name="condition_tags" value="${tag.id}">${tag.name}</label>`;
    var option2 = `<label onclick="ativaAcao();setTagInAction('${tag.id}','${tag.color}','${tag.name}')" style="background-color: ${tag.color}11; color: ${tag.color}"><input type="radio" name="action_tags" value="${tag.id}">${tag.name}</label>`;

    $(`.condicao .list_tags`).append(option1);
    $(`.acao .list_tags`).append(option2);

}


function seeBtm(status) {
    if (status) {
        $('.botoes').fadeIn(200)
    } else {
        $('.botoes').fadeOut(200)
    }
}

$('#newTask').keypress((e) => {
    if (e.keyCode == 13) {

        var newTask = $('#newTask').val();
        var idTask = newId();
        var elemento = "";

        elemento += `<div id="${idTask}" class="task">`;
        elemento += `<h5>${newTask}</h5>`;
        elemento += `<i class="fi fi-rr-cross" onclick="$('#${idTask}').remove();"></i>`;
        elemento += `</div>`;

        var task = {
            id: idTask,
            task: newTask,
        }

        automation.action.meta.push(task);

        //console.log(automation);;

        $('#list_tasks').append(elemento);

        $('#newTask').val('');

        var countTasks = $('.task').length;

        if (countTasks > 0) {
            seeBtm(true);
        }

    }
})


async function setListPersons() {

    var listaPersons = await axios.get(`/api/users/listar`)
    var persons = listaPersons.data;

    //console.log(persons);

    var option = "";
    for (person of persons) {
        option += `<label onclick="seeBtm(true);setPersonInAction('${person.id}')"><input type="checkbox" id="${person.id}" value="${person.id}">${person.name}</label>`;
    }
    $(`.list_persons`).html(option);

}

function activeSubMenu(menu) {
    $('.condicao .menu').fadeOut(200);
    $(`#${menu}`).fadeIn(200);

    automation.condition = {
        id: menu,
        meta: [],
    }

    // console.log(automation);
}

function activeSubMenuAcao(menu) {
    $('.acao .menu').fadeOut(200);
    $(`#${menu}`).fadeIn(200);


    automation.action = {
        id: menu,
        meta: [],
    }

    // console.log(automation);
}

async function createPowerUps() {

    var getpipe = await axios.get(`/pipe/view/${pipe.id}`);
    var thisPipe = getpipe.data;

    if ($('#automation_title').val() == "") {
        error('Preencha o título dessa automação...');
        return;
    }

    automation['nome'] = $('#automation_title').val();
    automation['id'] = newId();
    automation['status'] = 'actived';

    thisPipe.metadata.powerups.push(automation);

    // console.log(automation);
    // console.log(thisPipe);

    axios.put(`/api/pipe/update/metadata`, {
        metadata: thisPipe.metadata,
        id: pipe.id,
    }).then((sucess) => {

        if (sucess.status == 200) {
            setPowerUpsOfThisPipe();
            $(`.worktable`).fadeOut(200);
            $('.config').fadeOut(200);
            $('.step').fadeOut(200);
            closeCondicao();
            $('#automation_title').val('')
            console.log('PowerUp Adicionado!');
        }

    }).catch((res) => {
        console.log(res);
    })

}

console.log(pipe)

if (!pipe.metadata.powerups) {
    pipe.metadata['powerups'] = [];
    // console.log('Não existe power-ups');
}


var automation = {
    condition: {},
    action: {},
}


setListPersons();
setListTags();
setListPipes();
setListSteps(pipe.id, 'acao');
setListSteps(pipe.id, 'condicao');
setListColorTags();

$(`.acao .list_pipes`).on('change', () => {
    setListSteps($(`.acao .list_pipes`).val(), 'acao');
    setStepInAction('pipe', $(`.acao .list_pipes`).val());
    $(`.acao .step`).fadeIn(200);
});

$(`.condicao .list_pipes`).on('change', () => {
    setListSteps($(`.condicao .list_pipes`).val(), 'condicao');
    setStepInCondition('pipe', $(`.condicao .list_pipes`).val());
    $(`.condicao .step`).fadeIn(200);
});


$('.menu').removeClass('ativo');
$('.menu_powerups').addClass('ativo');