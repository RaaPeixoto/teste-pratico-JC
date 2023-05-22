function onGeo() {
    if ("geolocation" in navigator) {
        /* geolocation is available */

        navigator.geolocation.getCurrentPosition((position) => {

            var localization = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            localStorage.setItem('localization', JSON.stringify(localization));
            localStorage.setItem('permissionGeo', true);

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

            localStorage.setItem('permissionCam', true);

            stream.getTracks().forEach(track => {
                track.stop();
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

async function carragarVideo(facingMode) {

    var w = 640
    var h = 1136

    $(`#registrar_foto`).fadeIn(5)

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Solicita a permissão para acessar a câmera
        const constraints = {
            video: {
                width: h,
                height: w,
                facingMode: facingMode
            },
            audio: false
        };

        const video = document.querySelector('#view_video');

        if (facingMode == 'user') {
            $(`video, #preview_foto`).css('transform', 'scaleX(-1)');
        } else {
            $(`video, #preview_foto`).css('transform', 'scaleX(1)');
        }

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

            video.srcObject = stream
            video.width = h;
            video.height = w;

            video.setAttribute("playsinline", true);

            $(`i.close`).on('click', () => {
                $('#camera').animate({
                    left: '-100%'
                }, 200)
                setTimeout(() => {
                    finalizarVideo(stream);
                    $('#camera').remove();
                }, 201);
            })

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

    var upload = await axios.post(`/api/photo/upload-foto`, {
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

    // return axios.get('https://api.ipify.org/?format=text').then((resposta) => {

    //     console.log(resposta.data.ip);
    //     return resposta.data.ip;
    // }).catch((error) => {
    //     console.log(error);
    // });

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", 'http://meuip.com/api/meuip.php');
    xmlhttp.send();
    xmlhttp.onload = function(e) {
        alert("Seu IP é: " + xmlhttp.response);
        return xmlhttp.response;
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