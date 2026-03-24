import { validar } from '../framework-teste'

// 🏦 Cenário 05 — Sistema Bancário (Conta Corrente)
//
// Regras de Negócio:
// 1. Depósito mínimo: R$ 10,00
// 2. Saque: não pode ultrapassar o saldo (sem cheque especial)
// 3. Transferência: limite de R$ 5.000,00 por transação
// 4. Transferência para outro banco: taxa de R$ 2,50 (descontada do remetente)
// 5. Conta deve estar ativa para qualquer operação
// 6. Extrato: registrar tipo, valor e data de cada movimentação
// 7. Saldo inicial: R$ 0,00

// ==================== INTERFACES ====================

interface IMovimentacao {
    tipo: 'deposito' | 'saque' | 'transferencia_enviada' | 'transferencia_recebida'
    valor: number
    data: Date
}

interface IConta {
    id: number
    titular: string
    banco: string
    saldo: number
    ativa: boolean
    extrato: IMovimentacao[]
}

interface IDepositar {
    contaId: number
    valor: number
}

interface ISacar {
    contaId: number
    valor: number
}

interface ITransferir {
    contaOrigemId: number
    contaDestinoId: number
    valor: number
}

// ==================== DADOS ====================

const contas: IConta[] = [
    { id: 1, titular: 'Fernanda Costa', banco: 'SenaiBanco', saldo: 1000.00, ativa: true, extrato: [] },
    { id: 2, titular: 'Ricardo Alves', banco: 'SenaiBanco', saldo: 500.00, ativa: true, extrato: [] },
    { id: 3, titular: 'Mariana Rocha', banco: 'OutroBanco', saldo: 2000.00, ativa: true, extrato: [] },
    { id: 4, titular: 'Bruno Martins', banco: 'SenaiBanco', saldo: 0.00, ativa: false, extrato: [] },
    { id: 5, titular: 'Camila Ferreira', banco: 'OutroBanco', saldo: 300.00, ativa: true, extrato: [] },
]

// ==================== FUNÇÕES A IMPLEMENTAR ====================

function depositar(dados: IDepositar): boolean {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Buscar a conta pelo contaId
    // 2. Verificar se a conta existe e está ativa
    // 3. Verificar se o valor é >= R$ 10,00
    // 4. Adicionar o valor ao saldo da conta
    // 5. Registrar a movimentação no extrato

    const conta = contas.find(p => p.id === dados.contaId);

    if(!conta || !conta.ativa || dados.valor < 10) {
        return false
    }

    conta.saldo += dados.valor;

    conta.extrato.push({
        tipo: 'deposito',
        valor: dados.valor,
        data: new Date()
    })

    return true
}

function sacar(dados: ISacar): boolean {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Buscar a conta pelo contaId
    // 2. Verificar se a conta existe e está ativa
    // 3. Verificar se o valor do saque <= saldo
    // 4. Subtrair o valor do saldo
    // 5. Registrar a movimentação no extrato

    const conta = contas.find(p => p.id === dados.contaId);

    if(!conta || !conta.ativa || dados.valor > conta.saldo) {
        return false
    }

    conta.saldo -= dados.valor;

    conta.extrato.push({
        tipo: 'saque',
        valor: dados.valor,
        data: new Date()
    })

    return true
}

function transferir(dados: ITransferir): boolean {
    // TODO: Implementar a lógica seguindo as regras de negócio
    //
    // Passos sugeridos:
    // 1. Buscar conta de origem e destino
    // 2. Verificar se ambas existem e estão ativas
    // 3. Verificar se o valor <= R$ 5.000,00
    // 4. Se os bancos forem diferentes, descontar taxa de R$ 2,50 do remetente
    // 5. Verificar se o saldo da origem cobre o valor + taxa (se aplicável)
    // 6. Descontar valor + taxa da origem e adicionar valor ao destino
    // 7. Registrar movimentação no extrato de ambas as contas

    const origem = contas.find(p => p.id === dados.contaOrigemId);
    const destino = contas.find(p => p.id === dados.contaDestinoId);

    if (!origem || !destino || !origem.ativa || !destino.ativa || dados.valor > 5000) {
        return false;
    }

    const taxa = origem.banco !== destino.banco ? 2.50 : 0;
    const custoTotal = dados.valor + taxa;

    if (origem.saldo < custoTotal) {
        return false;
    }

    origem.saldo -= custoTotal;
    destino.saldo += dados.valor;

    origem.extrato.push({
        tipo: 'transferencia_enviada',
        valor: dados.valor,
        data: new Date()
    });

    destino.extrato.push({
        tipo: 'transferencia_recebida',
        valor: dados.valor,
        data: new Date()
    });

    return true
}

// ==================== FUNÇÕES AUXILIARES ====================

// Use esta função para resetar os dados entre os testes se necessário
function resetarContas() {
    contas[0] = { id: 1, titular: 'Fernanda Costa', banco: 'SenaiBanco', saldo: 1000.00, ativa: true, extrato: [] }
    contas[1] = { id: 2, titular: 'Ricardo Alves', banco: 'SenaiBanco', saldo: 500.00, ativa: true, extrato: [] }
    contas[2] = { id: 3, titular: 'Mariana Rocha', banco: 'OutroBanco', saldo: 2000.00, ativa: true, extrato: [] }
    contas[3] = { id: 4, titular: 'Bruno Martins', banco: 'SenaiBanco', saldo: 0.00, ativa: false, extrato: [] }
    contas[4] = { id: 5, titular: 'Camila Ferreira', banco: 'OutroBanco', saldo: 300.00, ativa: true, extrato: [] }
}

// ==================== TESTES ====================

// Teste 1: Depósito válido (R$ 100,00) na conta de Fernanda (id: 1)
// Saldo anterior: R$ 1000,00 → Saldo após: R$ 1100,00
resetarContas()
const teste1 = depositar({ contaId: 1, valor: 100 })
validar({ descricao: 'depositar() - Depósito válido R$100', atual: teste1, esperado: true })

// Teste 2: Depósito abaixo do mínimo (R$ 5,00) — deve retornar false
resetarContas()
const teste2 = depositar({ contaId: 1, valor: 5 })
validar({ descricao: 'depositar() - Depósito abaixo do mínimo', atual: teste2, esperado: false })

// Teste 3: Saque válido (R$ 200,00) da conta de Fernanda (saldo: R$ 1000)
resetarContas()
const teste3 = sacar({ contaId: 1, valor: 200 })
validar({ descricao: 'sacar() - Saque válido R$200', atual: teste3, esperado: true })

// Teste 4: Saque acima do saldo — deve retornar false
// Ricardo (id: 2) tem saldo de R$ 500, tenta sacar R$ 600
resetarContas()
const teste4 = sacar({ contaId: 2, valor: 600 })
validar({ descricao: 'sacar() - Saque acima do saldo', atual: teste4, esperado: false })

// Teste 5: Transferência entre contas do mesmo banco (SenaiBanco)
// Fernanda (id: 1) → Ricardo (id: 2), R$ 300,00 — sem taxa
resetarContas()
const teste5 = transferir({ contaOrigemId: 1, contaDestinoId: 2, valor: 300 })
validar({ descricao: 'transferir() - Mesmo banco sem taxa', atual: teste5, esperado: true })

// Teste 6: Transferência para outro banco (com taxa R$ 2,50)
// Fernanda (id: 1, SenaiBanco) → Mariana (id: 3, OutroBanco), R$ 200,00
// Desconta R$ 200 + R$ 2,50 = R$ 202,50 de Fernanda
resetarContas()
const teste6 = transferir({ contaOrigemId: 1, contaDestinoId: 3, valor: 200 })
const contaFernanda = contas.find(c => c.id === 1)!
validar({ descricao: 'transferir() - Outro banco com taxa R$2,50', atual: contaFernanda.saldo, esperado: 797.50 })

// Teste 7: Transferência acima do limite R$ 5.000 — deve retornar false
resetarContas()
const teste7 = transferir({ contaOrigemId: 1, contaDestinoId: 2, valor: 6000 })
validar({ descricao: 'transferir() - Acima do limite R$5000', atual: teste7, esperado: false })

// Teste 8: Operação em conta inativa — deve retornar false
// Bruno (id: 4) tem conta inativa
resetarContas()
const teste8 = depositar({ contaId: 4, valor: 100 })
validar({ descricao: 'depositar() - Conta inativa', atual: teste8, esperado: false })

// Teste 9: Saldo correto após múltiplas operações
// Fernanda (id: 1): saldo inicial R$ 1000
// Depositar R$ 500 → R$ 1500
// Sacar R$ 200 → R$ 1300
// Transferir R$ 300 para Ricardo → R$ 1000
resetarContas()
depositar({ contaId: 1, valor: 500 })
sacar({ contaId: 1, valor: 200 })
transferir({ contaOrigemId: 1, contaDestinoId: 2, valor: 300 })
const contaAposTeste9 = contas.find(c => c.id === 1)!
validar({ descricao: 'Saldo correto após múltiplas operações', atual: contaAposTeste9.saldo, esperado: 1000 })

// Teste 10: Extrato registra movimentação corretamente
// Após o teste 9, Fernanda deve ter 3 movimentações no extrato
resetarContas()
depositar({ contaId: 1, valor: 100 })
const contaTeste10 = contas.find(c => c.id === 1)!
validar({ descricao: 'Extrato registra movimentação', atual: contaTeste10.extrato.length, esperado: 1 })
