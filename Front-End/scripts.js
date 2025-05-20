document.addEventListener('DOMContentLoaded', ()=> {
    const inputPesquisar = document.getElementById('input-pesquisar');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const pokemonInfo = document.getElementById('pokemon-info');
    const btnsNavegacao = document.getElementById('btns-navegacao');
    const pokemonImagem = document.getElementById('pokemon-imagem');
    const pokemonNome = document.getElementById('nome-pokemon');
    const pokemonDescricao = document.getElementById('pokemon-descricao');
    const mensagemErro = document.getElementById('mensagem-erro');
    const mensagemLoading = document.getElementById('mensagem-loading');
    let idAtualPokemon = 1;

    const fetchPokemon = async (identificadorPokemon) => {
        exibirLoading();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificadorPokemon}`); 

            if (!response.ok) throw new Error('404 NOT FOUND - Pokémon não encontrado!');

            const pokemon = await response.json();
            preencherPokemonInfo(pokemon); 
            mensagemErro.classList.add('hidden');
            pokemonInfo.classList.remove('hidden');
            btnsNavegacao.classList.remove('hidden');
        } catch (error) {
            exibirErro();
        } finally {

        }
    };

    const preencherPokemonInfo = (pokemon) => {
        pokemonImagem.src = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        pokemonNome.textContent = `${pokemon.name} (${pokemon.id})`;
        pokemonDescricao.textContent = `
            Altura: ${pokemon.height / 10}m
            | Peso: ${pokemon.weight / 10}kg
            | Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(',')}
        `;
        idAtualPokemon = pokemon.id; //Atualiza o ID  do Pokémon Atual
        atualizarNavegacaoBotoes(); //Atualizar o estado dos botões de navegação
    };

    const exibirLoading = () => {
        mensagemLoading.classList.remove('hidden');
        pokemonInfo.classList.add('hidden');
        mensagemErro.classList.add('hidden');
        btnsNavegacao.classList.add('hidden');
    }

    const ocultarLoading = () => {
        mensagemLoading.classList.add('hidden');
    };

    const exibirErro = () => {
        mensagemLoading.classList.remove('hidden')
        pokemonDescricao.textContent= '';
        pokemonImagem.src = '';
        mensagemErro.classList.remove('hidden');
        pokemonInfo.classList.add('hidden')
        btnsNavegacao.classList.add('hidden')
    };

    const atualizarNavegacaoBotoes = () => {
        btnAnterior.disabled = (idAtualPokemon <= 1); // true | false
    };

    const atualizarBotaoPesquisar = () => {
        btnPesquisar.disabled = !inputPesquisar.value.trim();
    };

    btnPesquisar.addEventListener('click', () =>{
        const query = inputPesquisar.value.trim().toLowerCase();
        if (query) {
            fetchPokemon(query)
        }
    });

    inputPesquisar.addEventListener('input', atualizarBotaoPesquisar);

    inputPesquisar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter'){
            btnPesquisar.click();
        }
    });

    btnAnterior.addEventListener('click', () => {
        if (idAtualPokemon > 1) {
            fetchPokemon(idAtualPokemon - 1);
        }
    });

    btnProximo.addEventListener('click', () => {
        fetchPokemon(idAtualPokemon + 1);
    });

    fetchPokemon(idAtualPokemon); //Carregando o primeiro Pokémon de Id = 1 por padrão
    atualizarBotaoPesquisar(); //Desabilita o botão de busca inicialmente
});