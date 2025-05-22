const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const mysql = require('mysql2/promise');

// Configuração do banco
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pokedex'
};

// CORS para aceitar requisições do front-end
fastify.register(cors, { origin: '*' });

// Rota para cadastrar um Pokémon (Create)
fastify.post('/pokemons', async (request, reply) => {
    const { id, nome, tipo, habitat } = request.body;

    if (!id || !nome || !tipo || !habitat) {
        return reply.status(400).send({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.query('SELECT * FROM pokemons WHERE id = ?', [id]);
        if (rows.length > 0) {
            return reply.status(400).send({ message: 'Já existe um Pokémon com esse ID.' });
        }

        await connection.query(
            'INSERT INTO pokemons (id, nome, tipo, habitat) VALUES (?, ?, ?, ?)',
            [id, nome, tipo, habitat]
        );

        await connection.end();
        reply.status(201).send({ message: 'Pokémon cadastrado com sucesso!' });

    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Erro ao cadastrar Pokémon.' });
    }
});

// 🧠 Rota para listar todos os Pokémons
fastify.get('/pokemons', async (request, reply) => {
    const { tipo, habitat } = request.query;

    let query = 'SELECT * FROM pokemons';
    const params = [];

    if (tipo || habitat) {
        const conditions = [];
        if (tipo) {
            conditions.push('tipo = ?');
            params.push(tipo);
        }
        if (habitat) {
            conditions.push('habitat = ?');
            params.push(habitat);
        }
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(query, params);
        await connection.end();

        reply.send(rows);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Erro ao buscar Pokémons.' });
    }
});

// 🔎 Rota para buscar por ID ou Nome
fastify.get('/pokemons/:idOuNome', async (request, reply) => {
    const { idOuNome } = request.params;
    const isNumeric = !isNaN(idOuNome);

    const query = isNumeric
        ? 'SELECT * FROM pokemons WHERE id = ?'
        : 'SELECT * FROM pokemons WHERE nome LIKE ?';

    const param = isNumeric ? [idOuNome] : [`%${idOuNome}%`];

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(query, param);
        await connection.end();

        if (rows.length === 0) {
            return reply.status(404).send({ message: 'Pokémon não encontrado.' });
        }

        reply.send(rows);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Erro ao buscar Pokémon.' });
    }
});

// Inicializa o servidor
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});
