-- ============================
-- TABELA: usuários
-- (clientes e admin/pedreiro)
-- ============================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(120) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash TEXT NOT NULL,
    data_nascimento DATE,
    tipo_usuario SMALLINT DEFAULT 2 CHECK (tipo_usuario IN (1,2)), -- 1 = pedreiro, 2 = cliente
    data_criacao TIMESTAMP DEFAULT NOW()
);
-- FEITO

-- ============================
-- TABELA: servicos
-- (serviços oferecidos pelo pedreiro)
-- ============================
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50), -- Ex: residencial, comercial, acabamento, estrutura
    preco_medio NUMERIC(10,2) CHECK (preco_medio >= 0),
    duracao_estimada VARCHAR(50), -- Ex: '3 dias', '5 horas', '1 dia por 20 m²'
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT NOW()
);
-- FEITO

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    servico_id INTEGER REFERENCES servicos(id),
    endereco_id INTEGER REFERENCES enderecos(id),
    data_agendamento DATE NOT NULL,
    hora_agendamento TIME NOT NULL,
    descricao_local TEXT,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente | confirmado | em andamento | finalizado
    criado_em TIMESTAMP DEFAULT NOW()
);
-- FEITO

CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    cep VARCHAR(9) NOT NULL,
    rua VARCHAR(120),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    complemento VARCHAR(100),
    criado_em TIMESTAMP DEFAULT NOW()
);
-- FEITO

CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    agendamento_id INTEGER REFERENCES agendamentos(id) ON DELETE CASCADE,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);
-- FEITO



-- ============================
-- VIEW: media_avaliacoes
-- (pode usar para exibir a média na Home)
-- ============================
CREATE VIEW media_avaliacoes AS
SELECT 
    ROUND(AVG(nota), 1) AS media_nota,
    COUNT(*) AS total_avaliacoes
FROM avaliacoes;
