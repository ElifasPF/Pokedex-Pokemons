const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const mysql = require("mysql2/promise");

const dbConfig = {
    host: "localhost",
    user: "root",      
    password: "",   
    database: "pokedex" 
};

fastify.register(cors, {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] 
});

fastify.post("/pokemons", async (request, reply) => {
    const { id, nome, tipo, habitat } = request.body;

    if (!id || !nome || !tipo || !habitat) {
        return reply.status(400).send({ message: "Todos os campos são obrigatórios." });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.query("SELECT * FROM pokemons WHERE id = ?", [id]);
        if (rows.length > 0) {
            await connection.end();
            return reply.status(400).send({ message: "Já existe um Pokémon com esse ID." });
        }

        await connection.query(
            "INSERT INTO pokemons (id, nome, tipo, habitat) VALUES (?, ?, ?, ?)",
            [id, nome, tipo, habitat]
        );

        await connection.end();
        reply.status(201).send({ message: "Pokémon cadastrado com sucesso!" });

    } catch (error) {
        console.error("Erro no POST /pokemons:", error); 
        reply.status(500).send({ message: "Erro ao cadastrar Pokémon." });
    }
});

fastify.get("/pokemons", async (request, reply) => {
    const { tipo, habitat } = request.query;

    let query = "SELECT * FROM pokemons";
    const params = [];

    if (tipo || habitat) {
        const conditions = []; 
        if (tipo) {
            conditions.push("tipo = ?"); 
            params.push(tipo);        
        }
        if (habitat) {
            conditions.push("habitat = ?"); 
            params.push(habitat);         
        }
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(query, params);
        await connection.end();

        reply.send(rows);
    } catch (error) {
        console.error("Erro no GET /pokemons:", error);
        reply.status(500).send({ message: "Erro ao buscar Pokémons." });
    }
});

fastify.get("/pokemons/:idOuNome", async (request, reply) => {
    const { idOuNome } = request.params;
    const isNumeric = !isNaN(idOuNome);

    const query = isNumeric
        ? "SELECT * FROM pokemons WHERE id = ?" 
        : "SELECT * FROM pokemons WHERE nome LIKE ?";

    const param = isNumeric ? [idOuNome] : [`%${idOuNome}%`];

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(query, param);
        await connection.end();

        if (rows.length === 0) {
            return reply.status(404).send({ message: "Pokémon não encontrado." });
        }

        reply.send(rows);
    } catch (error) {
        console.error("Erro no GET /pokemons/:idOuNome:", error);
        reply.status(500).send({ message: "Erro ao buscar Pokémon." });
    }
});

fastify.put("/pokemons/:id", async (request, reply) => {
    const { id } = request.params; 
    const { nome, tipo, habitat } = request.body; 
    if (!nome || !tipo || !habitat) {
        return reply.status(400).send({ message: "Todos os campos são obrigatórios." });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.query("SELECT * FROM pokemons WHERE id = ?", [id]);
        if (rows.length === 0) {
            await connection.end();
            return reply.status(404).send({ message: "Pokémon não encontrado para atualizar." });
        }

        await connection.query(
            "UPDATE pokemons SET nome = ?, tipo = ?, habitat = ? WHERE id = ?",
            [nome, tipo, habitat, id]
        );

        await connection.end();
        reply.send({ message: "Pokémon atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro no PUT /pokemons/:id:", error);
        reply.status(500).send({ message: "Erro ao atualizar Pokémon." });
    }
});

fastify.delete("/pokemons/:id", async (request, reply) => {
    const { id } = request.params;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.query("SELECT * FROM pokemons WHERE id = ?", [id]);
        if (rows.length === 0) {
            await connection.end();
            return reply.status(404).send({ message: "Pokémon não encontrado para excluir." });
        }

        await connection.query("DELETE FROM pokemons WHERE id = ?", [id]);
        await connection.end();

        reply.send({ message: "Pokémon excluído com sucesso!" });
    } catch (error) {
        console.error("Erro no DELETE /pokemons/:id:", error);
        reply.status(500).send({ message: "Erro ao excluir Pokémon." });
    }
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error("Erro ao iniciar o servidor:", err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});
