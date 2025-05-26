document.addEventListener("DOMContentLoaded", () => {
    const inputPesquisar = document.getElementById("input-pesquisar"); 
    const btnPesquisar = document.getElementById("btn-pesquisar");     
    const btnListarTodos = document.getElementById("btn-listar-todos"); 
    const pokemonInfo = document.getElementById("pokemon-info");    
    const pokemonImagem = document.getElementById("pokemon-imagem"); 
    const pokemonNome = document.getElementById("nome-pokemon");  
    const pokemonDescricao = document.getElementById("pokemon-descricao");
    const mensagemErro = document.getElementById("mensagem-erro"); 
    const mensagemLoading = document.getElementById("mensagem-loading");
    const listaPokemonsContainer = document.getElementById("lista-pokemons");
    const listaContainer = document.getElementById("lista-container"); 

    let pokemonEditandoId = null;

   const listarTodosPokemons = async () => {
        exibirLoading(); 
        try {
            const response = await fetch("http://localhost:3000/pokemons");
            if (!response.ok) throw new Error("Erro ao buscar a lista");
            const pokemons = await response.json();

            pokemonInfo.classList.add("hidden");
            mensagemErro.classList.add("hidden");
            listaPokemonsContainer.innerHTML = "";
            listaContainer.classList.remove("hidden");

            if (pokemons.length === 0) {
                listaPokemonsContainer.innerHTML = "<p>Nenhum Pokémon cadastrado.</p>";
                return; 
            }

            pokemons.forEach(p => {
                const item = document.createElement("div");
                item.innerHTML = `
                    <strong>${p.id} - ${p.nome}</strong> | Tipo: ${p.tipo} | Habitat: ${p.habitat}
                    <button class="btn-editar" data-id="${p.id}" data-nome="${p.nome}" data-tipo="${p.tipo}" data-habitat="${p.habitat}">Editar</button>
                    <button class="btn-excluir" data-id="${p.id}">Excluir</button>
                `;
                listaPokemonsContainer.appendChild(item);
            });

            adicionarEventosEditarExcluir();
        } catch (error) {
            console.error("Erro ao listar pokémons", error);
            listaPokemonsContainer.innerHTML = "<p>Erro ao listar pokémons.</p>";
            listaContainer.classList.remove("hidden"); 
        } finally {
            ocultarLoading();
        }
    };

    const adicionarEventosEditarExcluir = () => {
        document.querySelectorAll(".btn-excluir").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                if (confirm("Tem certeza que deseja excluir este Pokémon?")) {
                    await excluirPokemon(id); 
                    listarTodosPokemons(); 
                }
            });
        });

        document.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const nome = btn.getAttribute("data-nome");
                const tipo = btn.getAttribute("data-tipo");
                const habitat = btn.getAttribute("data-habitat");

                const novoNome = prompt("Novo nome:", nome);
                const novoTipo = prompt("Novo tipo:", tipo);
                const novoHabitat = prompt("Novo habitat:", habitat);

                if (novoNome && novoTipo && novoHabitat) {
                    editarPokemon(id, novoNome, novoTipo, novoHabitat);
                }
            });
        });
    };

    const excluirPokemon = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Erro ao excluir");
            alert("Pokémon excluído com sucesso!"); 
        } catch (error) {
            console.error("Erro ao excluir Pokémon:", error);
            alert("Erro ao excluir Pokémon"); 
        }
    };

    const editarPokemon = async (id, nome, tipo, habitat) => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ nome, tipo, habitat })
            });
            if (!response.ok) throw new Error("Erro ao editar");
            alert("Pokémon atualizado com sucesso!");
            listarTodosPokemons();
        } catch (error) {
            console.error("Erro ao editar Pokémon:", error);
            alert("Erro ao editar Pokémon");
        }
    };

    const fetchPokemon = async (identificador) => {
        exibirLoading(); 
        try {
            const response = await fetch(`http://localhost:3000/pokemons/${identificador}`);

            if (!response.ok) throw new Error("Pokémon não encontrado");

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Pokémon não encontrado");
            }

            const pokemon = data[0];
            preencherPokemonInfo(pokemon); 
            mensagemErro.classList.add("hidden"); 
            pokemonInfo.classList.remove("hidden"); 
            listaPokemonsContainer.innerHTML = ""; 
            listaContainer.classList.add("hidden"); 
        } catch (error) {
            exibirErro(); 
        } finally {
            ocultarLoading();
        }
    };

    const preencherPokemonInfo = (pokemon) => {
        pokemonImagem.src = "images/pokebola.png";
        pokemonNome.textContent = `${pokemon.nome} (ID: ${pokemon.id})`;
        pokemonDescricao.textContent = `Tipo: ${pokemon.tipo} | Habitat: ${pokemon.habitat}`;
    };

    const exibirLoading = () => {
        mensagemLoading.classList.remove("hidden"); 
        pokemonInfo.classList.add("hidden");    
        mensagemErro.classList.add("hidden");    
        listaContainer.classList.add("hidden");   
    };

    const ocultarLoading = () => {
        mensagemLoading.classList.add("hidden"); 
    };

    const exibirErro = () => {
        mensagemLoading.classList.add("hidden");   
        pokemonImagem.src = "";                   
        pokemonNome.textContent = "";           
        pokemonDescricao.textContent = "";      
        mensagemErro.classList.remove("hidden");  
        pokemonInfo.classList.add("hidden");     
        listaPokemonsContainer.innerHTML = "";   
        listaContainer.classList.add("hidden");     
    };

  btnPesquisar.addEventListener("click", () => {
        mensagemErro.classList.add("hidden");
        const query = inputPesquisar.value.trim().toLowerCase(); 
        if (query) { 
            fetchPokemon(query); 
        }
    });

    btnListarTodos.addEventListener("click", () => {
        mensagemErro.classList.add("hidden"); 
        listarTodosPokemons();
    });

    inputPesquisar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            btnPesquisar.click(); 
        }
    });
});
