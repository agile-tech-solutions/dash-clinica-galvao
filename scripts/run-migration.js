// ============================================
// Script: Executar migration do Supabase
// Uso: node scripts/run-migration.js
// ============================================

import { supabase } from '../src/lib/supabase.js';

const migration = `
-- Adicionar campos faltantes para o dashboard
ALTER TABLE sec_acao_social_trairi_cadastros
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente',
    ADD COLUMN IF NOT EXISTS unidade TEXT DEFAULT 'Geral';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON sec_acao_social_trairi_cadastros(status);
CREATE INDEX IF NOT EXISTS idx_cadastros_distrito ON sec_acao_social_trairi_cadastros(distrito);
CREATE INDEX IF NOT EXISTS idx_cadastros_unidade ON sec_acao_social_trairi_cadastros(unidade);
CREATE INDEX IF NOT EXISTS idx_cadastros_data_interacao ON sec_acao_social_trairi_cadastros(data_ultima_interacao DESC);
CREATE INDEX IF NOT EXISTS idx_cadastros_telefone ON sec_acao_social_trairi_cadastros(telefone);
`;

console.log('⚠️  AVISO: Supabase client JS não suporta DDL (ALTER TABLE, CREATE INDEX)');
console.log('');
console.log('Para executar esta migration, use UMA das opções abaixo:');
console.log('');
console.log('1️⃣  SUPABASE DASHBOARD (Mais Fácil):');
console.log('   - Acesse: https://supabase.com/dashboard/project/unomkawslyiuobosworq/sql');
console.log('   - Copie e cole o SQL do arquivo: supabase/migrations/001_add_status_and_unidade.sql');
console.log('   - Clique em "Run"');
console.log('');
console.log('2️⃣  SUPABASE CLI:');
console.log('   - Instale: npm install -g supabase');
console.log('   - Execute: supabase db push --project-ref unomkawslyiuobosworq');
console.log('');
console.log('3️⃣  VSCODE EXTENSION:');
console.log('   - Instale a extensão "Supabase"');
console.log('   - Conecte com seu project ref');
console.log('   - Execute o SQL diretamente');
