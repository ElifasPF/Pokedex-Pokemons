document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');
    const mensagemCadastro = document.getElementById('mensagem-cadastro');

    formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita recarregar a página

        const pokemon = {
            id: parseInt(document.getElementById('id').value),
            nome: document.getElementById('nome').value.trim(),
            tipo: document.getElementById('tipo').value.trim(),
            habitat: document.getElementById('habitat').value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/pokemons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pokemon)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || 'Erro ao cadastrar Pokémon.');
            }

            mensagemCadastro.textContent = 'Pokémon cadastrado com sucesso!';
            mensagemCadastro.style.color = 'green';
            formCadastro.reset();

        } catch (error) {
            mensagemCadastro.textContent = `Erro: ${error.message}`;
            mensagemCadastro.style.color = 'red';
        }
    });
});
