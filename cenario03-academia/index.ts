import { validar } from '../framework-teste'

// 🏋️ Cenário 03 — Sistema de Academia
//
// Regras de Negócio:
// 1. Plano mensal: R$ 99,90
// 2. Plano trimestral: R$ 249,90
// 3. Plano anual: R$ 899,90
// 4. Personal trainer: acréscimo de R$ 50,00/mês
// 5. Cancelamento antes do prazo: multa de 20% do valor restante do contrato
// 6. Limite de 1 check-in por dia por aluno
// 7. Horário de funcionamento: 6h às 23h
// 8. Aluno com mensalidade vencida ou inativo: bloquear check-in

// ==================== INTERFACES ====================

interface IAluno {
    id: number
    nome: string
    plano: 'mensal' | 'trimestral' | 'anual'
    dataInicio: Date
    personal: boolean
    ativo: boolean
    vencimento: Date
}

interface ICheckin {
    alunoId: number
    horario: Date
}

interface IRegistroCheckin {
    alunoId: number
    data: string  // formato YYYY-MM-DD
}

interface IResultadoPlano {
    valorMensal: number
    valorTotal: number
    ehValido: boolean
}

interface IResultadoCheckin {
    permitido: boolean
    mensagem: string
}

interface IResultadoCancelamento {
    multa: number
    ehValido: boolean
}

// ==================== DADOS ====================

const alunos: IAluno[] = [
    { id: 1, nome: 'Carlos Silva', plano: 'mensal', dataInicio: new Date('2026-03-01'), personal: false, ativo: true, vencimento: new Date('2026-04-01') },
    { id: 2, nome: 'Ana Souza', plano: 'trimestral', dataInicio: new Date('2026-01-15'), personal: true, ativo: true, vencimento: new Date('2026-04-15') },
    { id: 3, nome: 'Pedro Lima', plano: 'anual', dataInicio: new Date('2025-06-01'), personal: false, ativo: true, vencimento: new Date('2026-06-01') },
    { id: 4, nome: 'Julia Santos', plano: 'mensal', dataInicio: new Date('2026-02-01'), personal: false, ativo: true, vencimento: new Date('2026-03-01') }, // vencido
    { id: 5, nome: 'Roberto Dias', plano: 'trimestral', dataInicio: new Date('2026-01-01'), personal: true, ativo: false, vencimento: new Date('2026-04-01') }, // inativo
]

const checkIns: IRegistroCheckin[] = []

// ==================== FUNÇÕES A IMPLEMENTAR ====================

function calcularPlano(plano: string, personal: boolean): IResultadoPlano {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Verificar se o plano é válido ('mensal', 'trimestral' ou 'anual')
    // 2. Obter o valor base do plano
    // 3. Se personal === true, adicionar R$ 50,00/mês
    // 4. Calcular valor mensal e valor total
    //    - mensal: 1 mês | trimestral: 3 meses | anual: 12 meses

    return {
        valorMensal: 0,
        valorTotal: 0,
        ehValido: false
    }
}

function realizarCheckin(checkin: ICheckin): IResultadoCheckin {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Buscar o aluno pelo alunoId
    // 2. Verificar se o aluno está ativo
    // 3. Verificar se a mensalidade não está vencida (vencimento >= data atual)
    // 4. Verificar se o horário está entre 6h e 23h
    // 5. Verificar se já existe check-in do aluno no mesmo dia
    // 6. Se tudo ok, registrar o check-in no array checkIns

    return {
        permitido: false,
        mensagem: ''
    }
}

function cancelarPlano(alunoId: number): IResultadoCancelamento {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Buscar o aluno pelo alunoId
    // 2. Verificar se o aluno existe e está ativo
    // 3. Calcular os meses restantes do contrato (do hoje até o vencimento)
    // 4. Calcular o valor restante (meses restantes × valor mensal do plano)
    // 5. Multa = 20% do valor restante
    // 6. Retornar a multa

    return {
        multa: 0,
        ehValido: false
    }
}

// ==================== TESTES ====================

// Teste 1: Calcular valor do plano mensal sem personal
// Mensal: R$ 99,90 | Sem personal
// Valor mensal: R$ 99,90 | Total: R$ 99,90
const teste1 = calcularPlano('mensal', false)
validar({ descricao: 'calcularPlano() - Plano mensal sem personal', atual: teste1.valorMensal, esperado: 99.90 })

// Teste 2: Calcular valor do plano anual sem personal
// Anual: R$ 899,90 | Sem personal
// Total: R$ 899,90
const teste2 = calcularPlano('anual', false)
validar({ descricao: 'calcularPlano() - Plano anual sem personal', atual: teste2.valorTotal, esperado: 899.90 })

// Teste 3: Check-in válido (aluno ativo, horário ok, sem duplicata)
// Aluno: Carlos Silva (id: 1), ativo, vencimento: 2026-04-01
// Horário: 10h da manhã de hoje
const teste3 = realizarCheckin({
    alunoId: 1,
    horario: new Date('2026-03-20T10:00:00')
})
validar({ descricao: 'realizarCheckin() - Check-in válido', atual: teste3.permitido, esperado: true })

// Teste 4: Check-in duplicado no mesmo dia — deve retornar inválido
// Mesmo aluno (Carlos, id: 1) tentando fazer check-in de novo no mesmo dia
const teste4 = realizarCheckin({
    alunoId: 1,
    horario: new Date('2026-03-20T18:00:00')
})
validar({ descricao: 'realizarCheckin() - Check-in duplicado no dia', atual: teste4.permitido, esperado: false })

// Teste 5: Check-in fora do horário (antes das 6h) — deve retornar inválido
// Aluno: Ana Souza (id: 2), ativo, vencimento ok
// Horário: 5h da manhã
const teste5 = realizarCheckin({
    alunoId: 2,
    horario: new Date('2026-03-20T05:00:00')
})
validar({ descricao: 'realizarCheckin() - Check-in fora do horário (5h)', atual: teste5.permitido, esperado: false })

// Teste 6: Cancelamento do plano com multa de 20%
// Aluno: Ana Souza (id: 2), trimestral, dataInicio: 2026-01-15, vencimento: 2026-04-15
// Data atual: 2026-03-20 → falta ~1 mês (arredondar para cima = 1 mês)
// Valor mensal trimestral: 249.90 / 3 = R$ 83,30
// Valor restante: 1 × 83.30 = R$ 83.30
// Multa: 83.30 × 0.20 = R$ 16.66
const teste6 = cancelarPlano(2)
validar({ descricao: 'cancelarPlano() - Cancelamento com multa 20%', atual: teste6.ehValido, esperado: true })

// Teste 7: Check-in de aluno inadimplente (vencimento expirado) — inválido
// Aluno: Julia Santos (id: 4), vencimento: 2026-03-01 (vencido)
const teste7 = realizarCheckin({
    alunoId: 4,
    horario: new Date('2026-03-20T10:00:00')
})
validar({ descricao: 'realizarCheckin() - Aluno inadimplente bloqueado', atual: teste7.permitido, esperado: false })

// Teste 8: Calcular plano mensal com personal (+R$50)
// Mensal: R$ 99,90 + R$ 50,00 = R$ 149,90
const teste8 = calcularPlano('mensal', true)
validar({ descricao: 'calcularPlano() - Plano mensal com personal', atual: teste8.valorMensal, esperado: 149.90 })

// Teste 9: Calcular valor total do plano anual com personal
// Anual base: R$ 899,90 | Personal: R$ 50,00 × 12 = R$ 600,00
// Total: R$ 899,90 + R$ 600,00 = R$ 1499,90
const teste9 = calcularPlano('anual', true)
validar({ descricao: 'calcularPlano() - Plano anual com personal total', atual: teste9.valorTotal, esperado: 1499.90 })

// Teste 10: Calcular plano com tipo inválido — deve retornar inválido
const teste10 = calcularPlano('semanal', false)
validar({ descricao: 'calcularPlano() - Plano inválido', atual: teste10.ehValido, esperado: false })
