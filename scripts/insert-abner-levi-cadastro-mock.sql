-- ========================================
-- Mock: Lead da Clínica Galvão - Abner Levi
-- ========================================
-- Inserir lead na clinica_galvao_leads para testar o chat
-- O telefone está linkado com as mensagens existentes em n8n_chat_histories_trairi_sec_acao_social
-- Tabela: clinica_galvao_leads

INSERT INTO clinica_galvao_leads (
    nome_completo,
    cpf,
    telefone,
    especialidade_desejada,
    resumo_sintomas,
    status_atendimento,
    horario_preferencia,
    data_nascimento,
    ultima_interacao,
    etapa_follow,
    dia_cadencia,
    created_at
) VALUES (
    'Abner Levi',
    '123.456.789-00',
    '558598397511',
    'Ortopedia',
    'Dores intensas no joelho direito, dificuldade para caminhar e subir escadas. Dor iniciada há cerca de 2 meses após prática de esporte.',
    'em_andamento',
    'Manhã (8h - 12h)',
    '1990-05-15',
    NOW() - INTERVAL '1 hour',
    'Agendamento Pendente',
    'Dia 3',
    NOW() - INTERVAL '2 hours'
);

-- Verificar o lead inserido
SELECT
    id,
    nome_completo,
    telefone,
    cpf,
    especialidade_desejada,
    resumo_sintomas,
    status_atendimento,
    horario_preferencia,
    data_nascimento,
    ultima_interacao,
    created_at
FROM clinica_galvao_leads
WHERE telefone = '558598397511'
ORDER BY created_at DESC
LIMIT 1;
