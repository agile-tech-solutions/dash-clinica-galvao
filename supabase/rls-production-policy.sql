-- ============================================
-- POLÍTICAS RLS PARA PRODUÇÃO
-- Secretaria de Ação Social - Trairi
-- ============================================

-- 1. REATIVAR RLS (importante!)
ALTER TABLE sec_acao_social_trairi_cadastros ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Public read access" ON sec_acao_social_trairi_cadastros;
DROP POLICY IF EXISTS "Public insert access" ON sec_acao_social_trairi_cadastros;
DROP POLICY IF EXISTS "Public update access" ON sec_acao_social_trairi_cadastros;
DROP POLICY IF EXISTS "Public delete access" ON sec_acao_social_trairi_cadastros;

-- 3. Criar políticas para AUTENTICADOS (funcionários da prefeitura)
CREATE POLICY "Authenticated read access"
ON sec_acao_social_trairi_cadastros
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated insert access"
ON sec_acao_social_trairi_cadastros
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated update access"
ON sec_acao_social_trairi_cadastros
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated delete access"
ON sec_acao_social_trairi_cadastros
FOR DELETE
TO authenticated
USING (true);

-- 4. Criar mesmas políticas para a tabela de chat
ALTER TABLE n8n_chat_histories_trairi_sec_acao_social ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chat read access" ON n8n_chat_histories_trairi_sec_acao_social;
DROP POLICY IF EXISTS "Chat insert access" ON n8n_chat_histories_trairi_sec_acao_social;

CREATE POLICY "Chat read access"
ON n8n_chat_histories_trairi_sec_acao_social
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Chat insert access"
ON n8n_chat_histories_trairi_sec_acao_social
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Verificar políticas criadas
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('sec_acao_social_trairi_cadastros', 'n8n_chat_histories_trairi_sec_acao_social')
ORDER BY tablename, policyname;

-- ============================================
-- COMO FUNCIONARÁ EM PRODUÇÃO:
-- ============================================

-- 1. ANON_KEY (público) - sem autenticação
--    - NÃO consegue ler/escrever nada (seguro)
--    - Usado para acessar o app sem login

-- 2. SERVICE_ROLE_KEY (backend/n8n)
--    - Pode ler/escrever tudo
--    - NUNCA expor no frontend
--    - Usado pelo n8n e endpoints backend

-- 3. AUTHENTICATED (usuários logados)
--    - Funcionários da prefeitura autenticados
--    - Podem ler/escrever dados

-- ============================================
-- FLUXO DE AUTENTICAÇÃO (Futuro):
-- ============================================

-- O app precisará de uma tela de login:
-- Email: funcionario@trairi.ce.gov.br
-- Senha: ****

-- Supabase Auth irá autenticar e conceder acesso
-- baseado nas políticas "Authenticated" acima

-- Se precisar restringir por setor:
-- CREATE POLICY "CRAS access"
-- ON sec_acao_social_trairi_cadastros
-- FOR ALL
-- TO authenticated
-- USING (
--     auth.jwt() ->> 'user_metadata' ->> 'setor' = 'CRAS'
-- );
