-- ============================================
-- Dados de Teste para Dashboard
-- Inserir no Supabase SQL Editor
-- ============================================

-- Limpar dados de teste anteriores (opcional)
-- DELETE FROM sec_acao_social_trairi_cadastros WHERE id <= 10;

-- Inserir cadastros de teste com dados completos
INSERT INTO sec_acao_social_trairi_cadastros (id, nome, telefone, distrito, assunto_principal, data_ultima_interacao, status, unidade) VALUES
(1, 'Maria Silva', '5585999999999', 'Trairi', 'Preciso de cesta básica', '2026-03-12 10:30:00', 'resolvido', 'CRAS 1'),
(3, 'João Santos', '5585988888888', 'Mundaú', 'Cadastro Único', '2026-03-12 14:20:00', 'em_andamento', 'CadUnico'),
(4, 'Ana Oliveira', '5585977777777', 'Flecheiras', 'Auxílio gás', '2026-03-11 09:15:00', 'pendente', NULL),
(5, 'Carlos Souza', '5585966666666', 'Canaã', 'Documento de identidade', '2026-03-11 16:45:00', 'encaminhado', 'CRAS 2'),
(6, 'Dona Francisca', '5585955555555', 'Trairi', 'Bolsa Família', '2026-03-10 11:00:00', 'resolvido', 'CRAS 1'),
(7, 'Pedro Lima', '5585944444444', 'Gualdrapas', 'Creas atendimento', '2026-03-10 13:30:00', 'em_andamento', 'CRAS 3'),
(8, 'José Ribeiro', '5585933333333', 'Munguba', 'Auxílio funeral', '2026-03-09 15:20:00', 'pendente', NULL),
(9, 'Mariana Costa', '5585922222222', 'Córrego Fundo', 'Cesta básica urgente', '2026-03-09 08:45:00', 'resolvido', 'CRAS 1'),
(10, 'Francisco Alves', '5585911111111', 'Mundaú', 'Atendimento CRAS', '2026-03-08 10:10:00', 'em_andamento', 'CRAS 2')
ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    distrito = EXCLUDED.distrito,
    assunto_principal = EXCLUDED.assunto_principal,
    data_ultima_interacao = EXCLUDED.data_ultima_interacao,
    status = EXCLUDED.status,
    unidade = EXCLUDED.unidade;

-- Verificar os dados inseridos
SELECT
    id,
    nome,
    distrito,
    assunto_principal,
    status,
    unidade,
    data_ultima_interacao
FROM sec_acao_social_trairi_cadastros
ORDER BY data_ultima_interacao DESC
LIMIT 20;
