-- ============================================
-- Migration: Add status and unidade fields
-- Date: 2026-03-12
-- ============================================

BEGIN;

-- Adicionar campos faltantes para o dashboard
ALTER TABLE sec_acao_social_trairi_cadastros
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente',
    ADD COLUMN IF NOT EXISTS unidade TEXT DEFAULT 'Geral';

-- Criar índices para performance dos filtros do dashboard
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON sec_acao_social_trairi_cadastros(status);
CREATE INDEX IF NOT EXISTS idx_cadastros_distrito ON sec_acao_social_trairi_cadastros(distrito);
CREATE INDEX IF NOT EXISTS idx_cadastros_unidade ON sec_acao_social_trairi_cadastros(unidade);
CREATE INDEX IF NOT EXISTS idx_cadastros_data_interacao ON sec_acao_social_trairi_cadastros(data_ultima_interacao DESC);
CREATE INDEX IF NOT EXISTS idx_cadastros_telefone ON sec_acao_social_trairi_cadastros(telefone);

-- Atualizar status para 'pendente' (unidade fica NULL para a IA definir)
UPDATE sec_acao_social_trairi_cadastros
SET status = 'pendente'
WHERE status IS NULL;

COMMIT;

-- Verificação: Mostrar distribuição atual
SELECT distrito, COUNT(*) as count
FROM sec_acao_social_trairi_cadastros
GROUP BY distrito
ORDER BY count DESC;

SELECT status, COUNT(*) as count
FROM sec_acao_social_trairi_cadastros
GROUP BY status
ORDER BY count DESC;

SELECT unidade, COUNT(*) as count
FROM sec_acao_social_trairi_cadastros
GROUP BY unidade
ORDER BY count DESC;
