# Trabalho Prático I - Frameworks I: Pokedex

## Tema Escolhido

O projeto implementa uma **Pokédex**, um sistema simples para cadastrar e consultar informações básicas sobre Pokémons.

## Tecnologias Utilizadas

*   **Back-end:** Node.js com o framework Fastify.
*   **Banco de Dados:** MySQL.
*   **Front-end:** HTML, CSS e JavaScript puro (sem frameworks front-end).

## Funcionalidades Implementadas (Foco Create/Read)

O sistema atende aos requisitos mínimos de operações de Leitura (Read) e Escrita (Create):

1.  **Cadastro de Pokémon (Create):**
    *   Uma página (`cadastro.html`) com um formulário permite ao usuário inserir ID, Nome, Tipo e Habitat de um novo Pokémon.
    *   Ao submeter o formulário, o JavaScript (`cadastro.js`) envia uma requisição `POST` para a rota `/pokemons` da API back-end.
    *   O back-end (`server.js`) recebe os dados, valida, verifica se o ID já existe e, se tudo estiver correto, insere o novo Pokémon na tabela `pokemons` do banco de dados MySQL.
    *   Uma mensagem de sucesso ou erro é exibida no front-end.

2.  **Consulta de Pokémons (Read):**
    *   A página principal (`index.html`) permite:
        *   **Listar Todos:** Um botão busca todos os Pokémons cadastrados através de uma requisição `GET` para a rota `/pokemons` da API. A lista é exibida dinamicamente na página.
        *   **Buscar por ID ou Nome:** Um campo de busca permite ao usuário digitar um ID ou nome. Ao clicar em "Pesquisar", uma requisição `GET` é enviada para a rota `/pokemons/:idOuNome` da API. As informações do Pokémon encontrado (ou uma mensagem de erro) são exibidas na página.

3.  **Funcionalidades Adicionais (Bônus):**
    *   **Edição (Update):** Na lista de todos os Pokémons, um botão "Editar" permite modificar os dados de um Pokémon existente (usando `prompt` para simplicidade).
    *   **Exclusão (Delete):** Na lista de todos os Pokémons, um botão "Excluir" permite remover um Pokémon do banco de dados, após confirmação.

**Explicação do Fluxo:**

1.  O **Usuário** interage com a interface no **Navegador Web** (clica em botões, preenche formulários).
2.  O **JavaScript do Front-End** captura essas interações e usa a `Fetch API` para criar e enviar **Requisições HTTP** (GET para buscar, POST para cadastrar) para o **Servidor Node.js**.
3.  A **API Fastify** no **Back-End** recebe as requisições, processa a lógica necessária (validações, etc.) e interage com o **Banco de Dados MySQL** para ler (SELECT) ou escrever (INSERT) dados.
4.  O **Banco de Dados MySQL** retorna os dados solicitados ou confirma a escrita para o Back-End.
5.  O **Back-End** envia uma **Resposta HTTP** (geralmente em formato JSON com os dados ou uma mensagem de status) de volta para o **Front-End**.
6.  O **JavaScript do Front-End** recebe a resposta, processa os dados (ou a mensagem) e atualiza dinamicamente o **HTML** da página para exibir as informações ou o feedback para o **Usuário**.

## Instruções para Rodar o Projeto Localmente

**Pré-requisitos:**

*   Node.js e npm (ou yarn) instalados.
*   Servidor MySQL instalado e rodando.

**Passos:**

1.  **Configurar o Banco de Dados:**
    *   Acesse seu servidor MySQL.
    *   Crie um banco de dados chamado `pokedex` (ex: `CREATE DATABASE pokedex;`).
    *   Use o banco de dados criado (ex: `USE pokedex;`).
    *   Crie a tabela `pokemons` com a seguinte estrutura:
        ```sql
        CREATE TABLE pokemons (
            id INT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            tipo VARCHAR(100),
            habitat VARCHAR(100)
        );
        ```
    *   **Importante:** Verifique e, se necessário, ajuste os dados de conexão com o banco no arquivo `Back-End/server.js` (variável `dbConfig` - host, user, password, database).

2.  **Instalar Dependências do Back-end:**
    *   Abra um terminal na pasta raiz do projeto (`pokedex_project`).
    *   Execute o comando: `npm install`
    *   Isso instalará o Fastify, o driver MySQL (`mysql2`) e o CORS.

3.  **Iniciar o Servidor Back-end:**
    *   No mesmo terminal, na pasta raiz do projeto, execute:
        `node Back-End/server.js`
    *   O servidor deverá iniciar e exibir uma mensagem como `Servidor rodando em http://127.0.0.1:3000`.

4.  **Acessar o Front-end:**
    *   Abra o arquivo `Front-End/index.html` diretamente no seu navegador web (clique duplo no arquivo ou use a opção "Abrir com..." do seu sistema operacional).

5.  **Utilizar a Aplicação:**
    *   A Pokédex estará pronta para uso. Você pode cadastrar novos Pokémons e pesquisá-los.

**Observação:** Como o front-end é composto apenas por arquivos HTML, CSS e JS estáticos, ele não precisa de um servidor web dedicado para rodar. A comunicação com o back-end é feita através das requisições `fetch` para `http://localhost:3000`.
