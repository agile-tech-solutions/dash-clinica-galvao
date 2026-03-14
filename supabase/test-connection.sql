-- ============================================
-- Diagnóstico: Verificar Permissões RLS
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. Verificar se a tabela existe e tem dados
SELECT COUNT(*) as total_registros
FROM sec_acao_social_trairi_cadastros;

-- 2. Verificar se RLS está ativo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'sec_acao_social_trairi_cadastros';

-- 3. Verificar políticas RLS existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'sec_acao_social_trairi_cadastros';

-- 4. Mostrar alguns dados (como admin)
SELECT
    id,
    nome,
    telefone,
    distrito,
    assunto_principal,
    status,
    unidade,
    data_ultima_interacao
FROM sec_acao_social_trairi_cadastros
ORDER BY data_ultima_interacao DESC
LIMIT 5;

-- ============================================
-- SOLUÇÃO: Desabilitar RLS temporariamente
-- ou adicionar política pública
-- ============================================

-- Opção 1: Desabilitar RLS (NÃO recomendado para produção)
-- ALTER TABLE sec_acao_social_trairi_cadastros DISABLE ROW LEVEL SECURITY;

-- Opção 2: Adicionar política pública para leitura (RECOMENDADO)
DROP POLICY IF EXISTS "Public read access" ON sec_acao_social_trairi_cadastros;

CREATE POLICY "Public read access"
ON sec_acao_social_trairi_cadastros
FOR SELECT
TO public
USING (true);

-- Opção 3: Adicionar política para service_role (se usar service_role key)
DROP POLICY IF EXISTS "Service role read access" ON sec_acao_social_trairi_cadastros;

CREATE POLICY "Service role read access"
ON sec_acao_social_trairi_cadastros
FOR SELECT
TO service_role
USING (true);

-- Verificar se as políticas foram criadas
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'sec_acao_social_trairi_cadastros';
