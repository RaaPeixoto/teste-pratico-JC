$(`#closeAll, .no`).click(() => {
    $('#new_signature').siblings().css('filter', 'none');
    $('#new_signature').remove();
})



function adicionarSignatario(){
    var novoSignatario = "";
    var email = $('#email').val();
    var emailsCadastrados = $('.emails_assinantes');
    var count = 0;

    for (let i = 0; i < emailsCadastrados.length; i++) {
        const element = emailsCadastrados[i];
        if (email == element.innerText) {
            count++;
        }
    }

    if (count == 0) {
        novoSignatario += `<div class="signer">`;
        novoSignatario += `<span class="emails_assinantes">${email}</span>`;
        novoSignatario += `<i onclick="$(this).parent().remove()" class="fi fi-rr-cross-small"></i>`;
        novoSignatario += `</div>`;

        $('#signatarios').append(novoSignatario)

        $('#email').val('');
    } else {
        error('Email já adicionado!')
    }
}


$('#addSignatario').click(adicionarSignatario);


$('#email').keypress(function(e){
    if(e.which == 13){
        adicionarSignatario();
    }
});
function checkDoc() {
    $(`#textInputFile`).text('Carregando...');
    var file = document.getElementById('newPdf');

    var filename = $('#newPdf').val().replace(/.*(\/|\\)/, '');
    var ext = filename.split('.');
    var tipoFile = $(ext).get(-1);

    if (tipoFile == 'pdf') {

        // $(`#title_sign`).fadeOut(200);

        var file = file.files[0];

        $(`#textInputFile`).html('<i class="fi fi-rr-refresh"></i> Trocar documento').addClass('selected').removeClass('textInputFile');
        getBase64(file).then(async(data) => {

            // console.log(data)

            renderPdfInBase64(data)

        });

    } else {
        alert('Por favor, escolha um documento em PDF');
        $(`#textInputFile`).html('<i class="fi fi-rr-document-signed"></i> Enviar PDF');
    }
}

async function renderPdfInBase64(base64) {


    $(".render").html('<p style="color: white" id="carregando">Carregando...</p>').fadeIn(200);

    var url = base64;
    // console.log(url);

    var loadingTask = pdfjsLib.getDocument(url);

    loadingTask.promise.then(async(pdf) => {

        var numPages = pdf._pdfInfo.numPages;

        for (let i = 1; i <= numPages; i++) {

            console.log("Page " + i);
            var page = await pdf.getPage(i);
            var scale = 1;

            var viewport = page.getViewport({
                scale: scale,
            });

            //ID do elemento HTML onde vou imprimir a pagina

            var id = newId();

            var canvas = $("<canvas />", {
                class: 'preview_pdf',
                id: id,
            });

            $(".render").append(canvas);

            var canvas = document.getElementById(id);

            var context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {

                canvasContext: context,

                viewport: viewport

            };

            page.render(renderContext);


        }

        $(`#carregando`).remove();

    }).catch((erro) => {
        $(`#carregando`).remove();
        $(".render").html('<p style="color: white" id="carregando">Erro ao subir arquivo.</p>');
        alert(erro)
    });
}

async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function uploadPdf(document, nameDoc) {

    var name = newIdABC(12);

    var upload = await axios.post(`/api/pdfs/upload`, {
        name: name,
        base64: document
    })

    if (upload.status != 200) {
        console.log(upload);
        return;
    }

    var emailsCadastrados = $('.emails_assinantes');
    var signers = [];

    for (let i = 0; i < emailsCadastrados.length; i++) {
        const element = emailsCadastrados[i];

        var signer = {
            nome: "",
            cpf: "",
            email: element.innerText,
            faceId: "",
            hash: "",
            ipAdress: ""
        }

        signers.push(signer);

    }

    var metadata = {
        title: nameDoc,
        type: 'faceId'
    }

    createDocForSignature(card.id, upload.data, metadata, signers);

}

async function createDocForSignature(card_id, document, metadata, signers) {

    var signatures = await axios.post(`/api/signatures/create`, {
        card_id: card_id,
        document: document,
        metadata: metadata,
        signers: signers
    })

    if (signatures.status != 200) {
        error(signatures.data);
        return;
    }

    $(".render").html('')
    $('#new_signature').siblings().css('filter', 'none');
    $('#new_signature').remove();

    setTimeout(() => {

        addHistory(card.id, `Adicionou o documento ${title} para assinatura.`);
        setSignatures();
        espera('off', 'Concluído!');

        var url = window.location.host;

        for (signer of signers) {

            var conca = signatures.data.id + '/' + signer.email;
            var base = utf8_to_b64(conca);
            var url = window.location.host + "/aceite-digital/" + base;

            var msg = `Olá!`;
            msg += `<br>`;
            msg += `<br>`;
            msg += `${usuario.name.split(' ')[0]} te enviou um documento para você assinar:`;
            msg += `<br>`;
            msg += `<a href="${url}" target="_blank">${url}</a>`;
            msg += `<br>`;
            msg += `<br>`;
            msg += `Equipe Pipedone`;

            var to = signer.email;
            var subject = `${usuario.name.split(' ')[0]} enviou um documento para você assinar - Pipedone`;

            sentMail(msg, to, subject);

        }


    }, 2000);
}