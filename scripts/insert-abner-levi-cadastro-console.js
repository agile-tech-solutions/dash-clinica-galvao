// ========================================
// Script Console: Inserir Lead da Clínica Galvão - Abner Levi
// ========================================
// Para usar: Abra o app, abra o console (F12), e cole este código

(async () => {
    console.log('📝 Inserindo lead da Clínica Galvão - Abner Levi...');

    const LEAD = {
        nome_completo: 'Abner Levi',
        cpf: '123.456.789-00',
        telefone: '558598397511',
        especialidade_desejada: 'Ortopedia',
        resumo_sintomas: 'Dores intensas no joelho direito, dificuldade para caminhar e subir escadas. Dor iniciada há cerca de 2 meses após prática de esporte.',
        status_atendimento: 'em_andamento',
        horario_preferencia: 'Manhã (8h - 12h)',
        data_nascimento: '1990-05-15',
        ultima_interacao: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // -1 hora
        etapa_follow: 'Agendamento Pendente',
        dia_cadencia: 'Dia 3',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // -2 horas
    };

    try {
        const { data, error } = await supabase
            .from('clinica_galvao_leads')
            .insert(LEAD)
            .select();

        if (error) {
            console.error('❌ Erro ao inserir lead:', error);
            console.error('Detalhes:', error.message, error.hint);
        } else {
            console.log('✅ Lead da Clínica Galvão inserido com sucesso!');
            console.log('📊 Dados:', LEAD);
            console.log('📋 Insert result:', data);
            console.log('');
            console.log('💡 Agora você pode:');
            console.log('   1. Ir para /dashboard e ver "Abner Levi" na tabela de leads');
            console.log('   2. Clicar no lead para ir ao chat');
            console.log('   3. Ver todas as informações do lead na página de chat');
        }
    } catch (err) {
        console.error('❌ Erro inesperado:', err);
    }
})();
