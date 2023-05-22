function setButtons(text, numberButtons, nextStep, backStep) {

    $(`.conteudo`).append(`<section class="botoes"></section>`)
    $(`.botoes`).html('');

    var back = `<button class="back" onclick="setStep('${backStep}')">Voltar</button>`;
    var next = `<button class="next" onclick="setStep('${nextStep}')">${text}</button>`;

    if (numberButtons == 2) {
        $(`.botoes`).append(back)
        $(`.botoes`).append(next)
    } else {
        $(`.botoes`).append(next)
    }
}

function setStep(step) {
    $('.conteudo').load(`/html/selfsign/${step}.html`, () => {
        $('.conteudo').fadeIn(200);
    })
}

function onGeo() {
    if ("geolocation" in navigator) {
        /* geolocation is available */

        navigator.geolocation.getCurrentPosition((position) => {

            var localization = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }

            localStorage.setItem('localization', JSON.stringify(localization))


            $(`#permitirGeo`)
                .css('background-color', '#2bba2b')
                .css('color', 'white')
                .text('Ok')

        });

    } else {
        alert("Desculpa, seu celular não tem suporte a alguns recursos como ");
    }
}

function onCam() {

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Solicita a permissão para acessar a câmera

        const constraints = {
            video: {
                width: 1,
                height: 1,
                facingMode: 'user'
            },
            audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {

            $(`#permitirCam`)
                .css('background-color', '#2bba2b')
                .css('color', 'white')
                .text('Ok')

            stream.getTracks().forEach(track => {
                track.stop();
                setButtons('Próximo', 1, 'dados', '');
            })

        }).catch((error) => {
            console.log(error);
        });

    } else {
        erro('Seu navegador ou celular não tem suporte a câmera.')
    }

}

function soundFoto() {
    var music = new Audio('/mp3/click.wav');
    music.play();
}

async function carragarVideo() {

    var w = 300
    var h = 300

    $(`#registrar_foto`).fadeIn(5)

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Solicita a permissão para acessar a câmera
        const constraints = {
            video: {
                width: h,
                height: w,
                facingMode: 'user'
            },
            audio: false
        };

        const video = document.querySelector('#view_video');

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream
            video.width = h;
            video.height = w;

            video.setAttribute("playsinline", true);
            video.setAttribute("controls", true);
            setTimeout(() => {
                video.removeAttribute("controls");
            }, 50);

        }).catch((error) => {
            video.srcObject = ""
            console.log(error);
        });

    } else {
        erro('Seu navegador ou celular não tem suporte a câmera.')
    }

}

function finalizarVideo(stream) {
    stream.getTracks().forEach(track => { track.stop() })
}

function registraFoto() {
    // capturo o elemento vídeo
    const video = document.querySelector('#view_video');

    //Criando um canvas que vai guardar a imagem temporariamente
    var canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');

    //Desnehando e convertendo as minensões
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    //Criando o JPG
    var dataURI = canvas.toDataURL('image/jpeg'); //O resultado é um BASE64 de uma imagem.
    // document.querySelector("#preview_foto").srcObject = dataURI;

    $("#preview_foto").attr('src', dataURI).fadeIn(200)

    //console.log(dataURI);

    $("#registrar_foto").fadeOut(5)
    $("#gostei, #refazer").fadeIn(5)
    $("video#view_video").hide()
    $(".mockup").hide()

    playSound('clic');

    finalizarVideo(video.srcObject);

}

async function uploadFoto(img) {

    var nome = newIdABC(12);

    var upload = await axios.post(`/api/photo/upload`, {
        name: nome,
        base64: img
    });

    if (upload.status == 200) {
        return upload.data;
    } else {
        error('Erro de upload!')
        console.log(upload);
    }

}

function getSigla(nomeCompleto) {
    var sigla = "";
    var nomes = nomeCompleto.split(' ')

    for (let i = 0; i < nomes.length; i++) {
        const element = nomes[i];

        var letra = element.substr(0, 1)

        sigla += letra

    }

    return sigla;
}

async function getIpClient() {

    var ip = await axios.get('https://api.ipify.org?format=json');

    if (ip.status == 200) {
        return ip.data.ip;
    }

}

function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}