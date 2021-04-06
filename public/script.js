let socket = io();

let form = document.querySelector('#form');
let chat = document.querySelector('.chat');
let digitando = document.querySelector('#digitando > li');
let body = document.querySelector('body');
let pessoasOnline = document.querySelector('#pessoasOnline > p');
let chatLi = document.querySelector('.chat > li')

let mensagem = document.querySelector('#mensagem');
let nome = localStorage.getItem('nome');
let id = localStorage.getItem('id');

function salvarNome() {

    if(!nome) {

        nome = prompt('Nome');
        id = Math.floor(Math.random() * 100000000000000000000);

        localStorage.setItem('nome', nome);
        localStorage.setItem('id', id);

        salvarNome();

    }

}

salvarNome();  

form.addEventListener('submit', (event) => {

    event.preventDefault();

    if(!nome){
        return alert('Nome não preenchido');
    }

    if(!id){
        return alert('Id não preenchido');
    }

    if(!mensagem.value.trim()){
        return alert('Mensagem não preenchido');
    }

    if(mensagem.value.length >= 2000){
        return alert('Limite de caracteres utrapasado');
    }

    socket.emit('enviar mensagem', {nome: nome, msg: mensagem.value, id: id});
    socket.emit('usuario dijitando', false);
    
    mensagem.value = '';
    
});


socket.on('carregou', () => {
    chatLi.style.display = 'none'
})

socket.on('mostrar mensagem', (dados) => {

    let li = document.createElement('li');

    if(id == dados.id) {

        li.innerHTML = `${checarComandos(dados.msg)} `;
        li.classList.add('eu');

    }else {

        li.innerHTML = `<strong> ${checarComandos(dados.nome)}: </strong> ${checarComandos(dados.msg)}`;
        li.classList.add('outros')

        try {

            if(!document.hasFocus()) {
                if(("Notification" in window) && Notification.permission === "granted") {
                new Notification(`${checarComandos(dados.nome)}`, {body: `${checarComandos(dados.msg)}` });
                }
            }

        }catch (erro) {
            console.log(`Não foi possivel enviar a notificação erro: ${erro}`)
        } 

    }                                                                   
    
    chat.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);

});


socket.on('mostrar mensagens quando usuario entrar', (dados) => {

    dados.forEach((dados) => {

        let li = document.createElement('li');

        if(id == dados.id) {

            li.innerHTML = `${checarComandos(dados.msg)} `;
            li.classList.add('eu');

        }else {

            li.innerHTML = `<strong> ${checarComandos(dados.nome)}: </strong> ${checarComandos(dados.msg)} `;
            li.classList.add('outros');

        }  

        chat.appendChild(li);
        window.scrollTo(0, document.body.scrollHeight);

    });

});

mensagem.addEventListener('focus', () => {
    socket.emit('usuario dijitando', true)
})

mensagem.addEventListener('keypress', () => {
    socket.emit('usuario dijitando', true)
})

mensagem.addEventListener('blur', () => {
    socket.emit('usuario dijitando', false)
})

socket.on('pessoasNaSala', (dados) => {

    if(dados == 1) {
        pessoasOnline.innerHTML = `Somente você esta na sala`
    }else {
        pessoasOnline.innerHTML = `Você e mais ${dados - 1} pessoas estão na sala`
    }
    
})

socket.on('mostrar usuario dijitando', (dados) => {

    if(dados) {
        digitando.style.display = 'block';
    }else {
        digitando.style.display = 'none';
    }

    window.scrollTo(0, document.body.scrollHeight);

});

// socket.on('pessoas', (i) => {

//     let li = document.createElement('li');

//     if(i) {
//         li.innerHTML = `Alguem entrou na sala`;
//     }else { 
//         li.innerHTML = `Alguem saiu da sala`;
//     }
    
//     li.classList.add('outros');
//     chat.appendChild(li);
//     window.scrollTo(0, document.body.scrollHeight);

// })

function checarComandos(x){
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");  
};

if(!("Notification" in window)) {
    alert("Este browser não suporta notificações de Desktop");
}else {
    
    if(Notification.permission === 'denied' || Notification.permission === 'default') {
        Notification.requestPermission()
    }
    
}

