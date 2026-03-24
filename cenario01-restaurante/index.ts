import { validar } from '../framework-teste'

// 🍕 Cenário 01 — Sistema de Pedidos de Restaurante
//
// Regras de Negócio:
// 1. Taxa de entrega: R$ 8,00 fixo
// 2. Pedido acima de R$ 100,00 (subtotal): entrega grátis
// 3. Combo (pelo menos 1 prato + 1 bebida + 1 sobremesa): 15% de desconto no subtotal
// 4. Gorjeta opcional: 10% sobre o subtotal (antes do desconto de combo e antes da taxa)
// 5. Pedido mínimo para entrega: R$ 25,00 (subtotal, antes de descontos)
// 6. Máximo de 20 itens (soma das quantidades) por pedido

// ==================== INTERFACES ====================

interface ItemCardapio {
    id: number
    nome: string
    preco: number
    categoria: 'prato' | 'bebida' | 'sobremesa'
}

interface ItemPedido {
    itemId: number
    quantidade: number
}

interface IPedido {
    itens: ItemPedido[]
    gorjeta: boolean
}

interface IResultadoPedido {
    subtotal: number
    desconto: number
    taxaEntrega: number
    gorjeta: number
    valorTotal: number
    ehValido: boolean
}

// ==================== DADOS ====================

const cardapio: ItemCardapio[] = [
    { id: 1, nome: 'X-Burguer', preco: 32.00, categoria: 'prato' },
    { id: 2, nome: 'Batata Frita', preco: 18.00, categoria: 'prato' },
    { id: 3, nome: 'Refrigerante', preco: 8.00, categoria: 'bebida' },
    { id: 4, nome: 'Suco Natural', preco: 12.00, categoria: 'bebida' },
    { id: 5, nome: 'Pudim', preco: 15.00, categoria: 'sobremesa' },
    { id: 6, nome: 'Sorvete', preco: 10.00, categoria: 'sobremesa' },
    { id: 7, nome: 'Picanha', preco: 65.00, categoria: 'prato' },
    { id: 8, nome: 'Cerveja', preco: 14.00, categoria: 'bebida' },
]

// ==================== FUNÇÃO A IMPLEMENTAR ====================

function calcularPedido(pedido: IPedido): IResultadoPedido {
    // TODO: Implementar a lógica seguindo as regras de negócio
    // 
    // Passos sugeridos:
    // 1. Verificar se o pedido é válido (não vazio, dentro do limite de 20 itens, acima do mínimo)
    // 2. Calcular o subtotal (somar quantidade × preço de cada item usando o cardápio)
    // 3. Verificar se é combo (tem pelo menos 1 prato + 1 bebida + 1 sobremesa)
    // 4. Calcular desconto de combo (15% do subtotal) se aplicável
    // 5. Calcular gorjeta (10% do subtotal, antes de desconto) se solicitada
    // 6. Calcular taxa de entrega (R$ 8,00 ou grátis se subtotal > R$ 100)
    // 7. Calcular valor total: subtotal - desconto + gorjeta + taxaEntrega


    // 1.
    const totalItem = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0)

    if (pedido.itens.length === 0 || totalItem > 20){
        return {
            subtotal: 0,
            desconto: 0,
            taxaEntrega: 0,
            gorjeta: 0,
            valorTotal: 0,
            ehValido: false
        }
    }

    let subtotal = 0
    const categoriasNoPedido = new Set<string>()

    //2.
    for (const item of pedido.itens) {
        const ItemCardapio = cardapio.find(p => p.id === item.itemId)

        if(ItemCardapio) {
            subtotal += ItemCardapio.preco * item.quantidade
            categoriasNoPedido.add(ItemCardapio.categoria)
        }
    }

    //3.
    if (subtotal < 25.00) {
        return {
            subtotal: 0,
            desconto: 0,
            taxaEntrega: 0,
            gorjeta: 0,
            valorTotal: 0,
            ehValido: false
        }
    }

    //4.
    let desconto = 0;
    const temCombo = categoriasNoPedido.has('prato') && 
                     categoriasNoPedido.has('bebida') && 
                     categoriasNoPedido.has('sobremesa');
    
    if (temCombo) {
        desconto = subtotal * 0.15;
    }

    // 5. 
    const gorjeta = pedido.gorjeta ? subtotal * 0.10 : 0;

    // 6. 
    const taxaEntrega = subtotal > 100.00 ? 0 : 8.00;

    // 7. 
    const valorTotal = subtotal - desconto + gorjeta + taxaEntrega;

    // Retornamos os valores garantindo que seja true aqui
    return {
        subtotal: Number(subtotal.toFixed(2)),
        desconto: Number(desconto.toFixed(2)),
        taxaEntrega: taxaEntrega,
        gorjeta: Number(gorjeta.toFixed(2)),
        valorTotal: Number(valorTotal.toFixed(2)),
        ehValido: true
    };

    
    
}

// ==================== TESTES ====================

// Teste 1: Pedido simples com frete (subtotal < R$100)
// Itens: 1x X-Burguer (R$32) + 1x Refrigerante (R$8) = R$40 + R$8 frete = R$48
const teste1 = calcularPedido({
    itens: [
        { itemId: 1, quantidade: 1 },
        { itemId: 3, quantidade: 1 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido simples com frete', atual: teste1.valorTotal, esperado: 48 })

// Teste 2: Pedido com frete grátis (subtotal > R$100)
// Itens: 2x X-Burguer (R$64) + 1x Picanha (R$65) = R$129 — frete grátis
const teste2 = calcularPedido({
    itens: [
        { itemId: 1, quantidade: 2 },
        { itemId: 7, quantidade: 1 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido com frete grátis acima de R$100', atual: teste2.valorTotal, esperado: 129 })

// Teste 3: Pedido com combo (prato + bebida + sobremesa) — desconto 15%
// Itens: 1x X-Burguer (R$32) + 1x Refrigerante (R$8) + 1x Pudim (R$15) = R$55
// Desconto combo: 55 * 0.15 = R$8.25 → Subtotal com desconto: R$46.75 + R$8 frete = R$54.75
const teste3 = calcularPedido({
    itens: [
        { itemId: 1, quantidade: 1 },
        { itemId: 3, quantidade: 1 },
        { itemId: 5, quantidade: 1 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido com combo desconto 15%', atual: teste3.valorTotal, esperado: 54.75 })

// Teste 4: Pedido com combo + gorjeta
// Itens: 1x X-Burguer (R$32) + 1x Refrigerante (R$8) + 1x Pudim (R$15) = R$55
// Gorjeta: 55 * 0.10 = R$5.50
// Desconto combo: 55 * 0.15 = R$8.25
// Total: 55 - 8.25 + 5.50 + 8 (frete) = R$60.25
const teste4 = calcularPedido({
    itens: [
        { itemId: 1, quantidade: 1 },
        { itemId: 3, quantidade: 1 },
        { itemId: 5, quantidade: 1 }
    ],
    gorjeta: true
})
validar({ descricao: 'calcularPedido() - Pedido com combo + gorjeta', atual: teste4.valorTotal, esperado: 60.25 })

// Teste 5: Pedido abaixo do mínimo R$25 — deve retornar inválido
// Itens: 1x Refrigerante (R$8) = R$8 (abaixo de R$25)
const teste5 = calcularPedido({
    itens: [
        { itemId: 3, quantidade: 1 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido abaixo do mínimo deve ser inválido', atual: teste5.ehValido, esperado: false })

// Teste 6: Pedido vazio (sem itens) — deve retornar inválido
const teste6 = calcularPedido({
    itens: [],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido vazio deve ser inválido', atual: teste6.ehValido, esperado: false })

// Teste 7: Pedido com mais de 20 itens — deve retornar inválido
// 21x Refrigerante (R$8) = quantidade total 21 > 20
const teste7 = calcularPedido({
    itens: [
        { itemId: 3, quantidade: 21 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido acima de 20 itens deve ser inválido', atual: teste7.ehValido, esperado: false })

// Teste 8: Pedido com gorjeta mas sem combo
// Itens: 1x Picanha (R$65) + 1x Batata Frita (R$18) = R$83
// Gorjeta: 83 * 0.10 = R$8.30
// Sem combo (só pratos, sem bebida/sobremesa): sem desconto
// Total: 83 + 8.30 + 8 (frete) = R$99.30
const teste8 = calcularPedido({
    itens: [
        { itemId: 7, quantidade: 1 },
        { itemId: 2, quantidade: 1 }
    ],
    gorjeta: true
})
validar({ descricao: 'calcularPedido() - Pedido com gorjeta sem combo', atual: teste8.valorTotal, esperado: 99.30 })

// Teste 9: Pedido com combo + frete grátis + gorjeta (cenário completo)
// Itens: 2x Picanha (R$130) + 1x Cerveja (R$14) + 1x Sorvete (R$10) = R$154
// Combo: sim → desconto 15%: 154 * 0.15 = R$23.10
// Gorjeta: 154 * 0.10 = R$15.40
// Frete grátis (154 > 100)
// Total: 154 - 23.10 + 15.40 + 0 = R$146.30
const teste9 = calcularPedido({
    itens: [
        { itemId: 7, quantidade: 2 },
        { itemId: 8, quantidade: 1 },
        { itemId: 6, quantidade: 1 }
    ],
    gorjeta: true
})
validar({ descricao: 'calcularPedido() - Combo + frete grátis + gorjeta', atual: teste9.valorTotal, esperado: 146.30 })

// Teste 10: Pedido só com bebidas (sem combo = sem desconto)
// Itens: 2x Refrigerante (R$16) + 1x Suco Natural (R$12) = R$28
// Sem combo (só bebidas): sem desconto
// Total: 28 + 8 (frete) = R$36
const teste10 = calcularPedido({
    itens: [
        { itemId: 3, quantidade: 2 },
        { itemId: 4, quantidade: 1 }
    ],
    gorjeta: false
})
validar({ descricao: 'calcularPedido() - Pedido só com bebidas sem combo', atual: teste10.valorTotal, esperado: 36 })
