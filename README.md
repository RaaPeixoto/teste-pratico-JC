# JusCash - Aplicação de Gestão de Leads

<div style="display:flex; width:400px; justify-content:center;">

<img src="https://www.juscash.com.br/wp-content/themes/s3/assets/img/logo-white.svg" width="50%"> 
</div>

## Índice

- [Introdução](#introdução)
- [Capturas de Tela](#capturas-de-tela)
- [Descrição da Aplicação](#descrição-da-aplicação)
- [Tecnologias e Bibliotecas Utilizadas](#tecnologias-e-bibliotecas-utilizadas)
- [Como Executar](#como-executar)


## Introdução <a name="introdução"></a>

Este é um projeto front-end desenvolvido como parte do teste prático para a empresa JusCash. A aplicação inclui páginas de login, signup e uma página inicial que serve como uma ferramenta de gestão de leads, permitindo aos usuários gerenciar seus leads em diferentes etapas, com recursos de arrastar e soltar.

## Capturas de Tela <a name="capturas-de-tela"></a>
<figure>
<div style="display:flex; width:100%; flex-wrap:wrap; justify-content:space-around;">
<div style="width: 40%; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela de Login
    <img src="./public/readme_images/signin.png" alt="Tela de Login">
</div>
<div style="width: 300px; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela de Registro
    <img src="./public/readme_images/signup.png" alt="Tela de Registro">
</div>
<div style="width: 40%; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela de Loading
    <img src="./public/readme_images/loading.png" alt="Tela de Loading">
</div>
<div style="width: 40%; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela da Página Inicial
    <img src="./public/readme_images/home.png" alt="Tela da Página Inicial">
</div>
<div style="width: 40%; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela Novo Lead
    <img src="./public/readme_images/modal.png" alt="Tela Novo Lead">
</div>
<div style="width: 40%; display:flex; flex-direction:column; align-items:center; margin-bottom:30px;" >
Tela Exibir Lead
    <img src="./public/readme_images/edit_modal.png" alt="Tela Exibir Lead">
</div>
</div>
</figure>
## Descrição da Aplicação <a name="descrição-da-aplicação"></a>

A aplicação JusCash é uma ferramenta que permite que os usuários gerenciem seus leads de maneira eficaz. As principais funcionalidades incluem:

- **Login e Signup**: Os usuários podem fazer login em suas contas existentes ou se cadastrar como novos usuários.
- **Gestão de Leads**: Os leads podem ser adicionados, movidos entre etapas e editados na página inicial.
- **Arrastar e Soltar**: A funcionalidade de arrastar e soltar facilita a organização dos leads nas diferentes etapas.
- **Local Storage**: Os dados dos leads são armazenados localmente no navegador do usuário.
- **Rotas com React Router**: O aplicativo usa o React Router para criar rotas para as diferentes páginas.
- **Notificações com React Toastify**: Notificações são exibidas ao usuário usando o React Toastify.
- **Dockerização**: A aplicação pode ser executada em um contêiner Docker para facilitar a implantação.
- **Formatação com Prettier**: O código-fonte é formatado automaticamente com o Prettier para manter a consistência.

## Tecnologias e Bibliotecas Utilizadas <a name="tecnologias-e-bibliotecas-utilizadas"></a>

- <img src="https://reactjs.org/favicon.ico" width="16"> [React](https://reactjs.org/)
- <img src="https://avatars.githubusercontent.com/u/20658825?s=200&v=4" width="16"> [Styled Components](https://styled-components.com/)
- <img src="https://react-icons.github.io/react-icons/favicon.ico" width="16"> [React Icons](https://react-icons.github.io/react-icons/)
- <img src="https://repository-images.githubusercontent.com/9108007/d7f26380-443a-11ea-9b05-4f2c6aa556bf" width="16"> [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- <img src="https://static-00.iconduck.com/assets.00/react-router-icon-2048x1116-jfeevj0l.png" width="16"> [React Router DOM](https://reactrouter.com/web/guides/quick-start)
- <img src="https://fkhadra.github.io/react-toastify/img/favicon.ico" width="16"> [React Toastify](https://fkhadra.github.io/react-toastify/)
- <img src="https://www.docker.com/favicon.ico" width="16"> [Docker](https://www.docker.com/)
- <img src="https://prettier.io/icon.png" width="16"> [Prettier](https://prettier.io/)

## Como Executar <a name="como-executar"></a>

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### Com npm

1. Clone este repositório para sua máquina.
2. Navegue até a pasta do projeto.
3. Execute o seguinte comando no terminal, na raiz do projeto, para instalar as dependências:

```
npm install
```

4. Certifique-se que a porta 3000 está disponível:

```
lsof -i :3000
```

Se a porta 3000 estiver em uso, o comando mostrará informações sobre o processo que a está utilizando. Caso contrário, se a porta estiver disponível, o comando não retornará nenhuma saída.

4. 1 Caso esteja em uso utilize o seguinte comando para liberar a porta

```
fuser -k 3000/tcp
```

5. Em seguida, inicie a aplicação com o comando:

```
npm start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000) no seu navegador.

### Com Docker (recomendado)

Certifique-se de ter o Docker instalado na sua máquina.

1. Clone este repositório para sua máquina.
2. Navegue até a pasta do projeto.
3. Execute o seguinte comando no terminal,na raiz do seu projeto, para construir a imagem Docker:

```
docker build -t juscash-app .
```

4. Certifique-se que a porta 4200 está disponível:

```
lsof -i :4200
```

Se a porta 4200 estiver em uso, o comando mostrará informações sobre o processo que a está utilizando. Caso contrário, se a porta estiver disponível, o comando não retornará nenhuma saída.

4. 1 Caso esteja em uso utilize o seguinte comando para liberar a porta

```
fuser -k 4200/tcp
```

5. Após a construção e certificação da porta, inicie um contêiner com o comando:

```
docker run -p 4200:3000 juscash-app
```

A aplicação estará disponível em [http://localhost:4200](http://localhost:4200) no seu navegador.
