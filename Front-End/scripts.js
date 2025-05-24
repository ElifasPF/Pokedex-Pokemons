document.addEventListener('DOMContentLoaded', () => {
    const inputPesquisar = document.getElementById('input-pesquisar');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const btnListarTodos = document.getElementById('btn-listar-todos');
    const pokemonInfo = document.getElementById('pokemon-info');
    const pokemonImagem = document.getElementById('pokemon-imagem');
    const pokemonNome = document.getElementById('nome-pokemon');
    const pokemonDescricao = document.getElementById('pokemon-descricao');
    const mensagemErro = document.getElementById('mensagem-erro');
    const mensagemLoading = document.getElementById('mensagem-loading');
    const listaPokemonsContainer = document.getElementById('lista-pokemons');

    const listarTodosPokemons = async () => {
        exibirLoading();
        try {
            const response = await fetch('http://localhost:3000/pokemons');
            if (!response.ok) throw new Error('Erro ao buscar a lista');
            const pokemons = await response.json();

            pokemonInfo.classList.add('hidden');
            mensagemErro.classList.add('hidden');
            listaPokemonsContainer.innerHTML = '';

            if (pokemons.length === 0) {
                listaPokemonsContainer.innerHTML = '<p>Nenhum Pokémon cadastrado.</p>';
                return;
            }

            pokemons.forEach(p => {
                const item = document.createElement('div');
                item.textContent = `${p.id} - ${p.nome} | Tipo: ${p.tipo} | Habitat: ${p.habitat}`;
                listaPokemonsContainer.appendChild(item);
            });
        } catch (error) {
            console.error('Erro ao listar pokémons', error);
            listaPokemonsContainer.innerHTML = '<p>Erro ao listar pokémons.</p>';
        } finally {
            ocultarLoading();
        }
    };

    const fetchPokemon = async (identificador) => {
        exibirLoading();
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${identificador}`);

            if (!response.ok) throw new Error('Pokémon não encontrado');

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Pokémon não encontrado');
            }

            const pokemon = data[0]; // Corrigido: pega o primeiro da lista
            preencherPokemonInfo(pokemon);
            mensagemErro.classList.add('hidden');
            pokemonInfo.classList.remove('hidden');
            listaPokemonsContainer.innerHTML = '';
        } catch (error) {
            exibirErro();
        } finally {
            ocultarLoading();
        }
    };

    const preencherPokemonInfo = (pokemon) => {
        pokemonImagem.src = 'images/pokebola.png'; // Imagem padrão
        pokemonNome.textContent = `${pokemon.nome} (ID: ${pokemon.id})`;
        pokemonDescricao.textContent = `Tipo: ${pokemon.tipo} | Habitat: ${pokemon.habitat}`;
    };

    const exibirLoading = () => {
        mensagemLoading.classList.remove('hidden');
        pokemonInfo.classList.add('hidden');
        mensagemErro.classList.add('hidden');
    };

    const ocultarLoading = () => {
        mensagemLoading.classList.add('hidden');
    };

    const exibirErro = () => {
        mensagemLoading.classList.add('hidden');
        pokemonImagem.src = '';
        pokemonDescricao.textContent = '';
        mensagemErro.classList.remove('hidden');
        pokemonInfo.classList.add('hidden');
        listaPokemonsContainer.innerHTML = '';
    };

    const atualizarBotaoPesquisar = () => {
        btnPesquisar.disabled = !inputPesquisar.value.trim();
    };

    btnPesquisar.addEventListener('click', () => {
        mensagemErro.classList.add('hidden');
        const query = inputPesquisar.value.trim().toLowerCase();
        if (query) {
            fetchPokemon(query);
        }
    });

    inputPesquisar.addEventListener('input', atualizarBotaoPesquisar);

    inputPesquisar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            btnPesquisar.click();
        }
    });

    btnListarTodos.addEventListener('click', () => {
        mensagemErro.classList.add('hidden');
        listarTodosPokemons();
    });
});
