# 📝 Prova Prática — Fundamentos de Testes

## Objetivo

Nesta prova prática, você deverá implementar a **lógica das funções** e criar **10 testes** para cada um dos 5 cenários propostos, utilizando o framework de testes que construímos em aula.

Cada cenário já possui:
- ✅ As **interfaces** (tipos) definidas
- ✅ Os **objetos de dados** prontos para uso
- ✅ A **assinatura da função** que você deve implementar
- ✅ Os **10 testes** que você precisa completar com os valores esperados

Você precisa:
- 🔧 **Implementar** a lógica dentro de cada função seguindo as regras de negócio
- 🧪 **Completar** os 10 testes com os valores corretos usando a função `validar()`

---

## Como rodar

### 1. Instalar dependências

```bash
cd fundamentos/prova
npm install
```

### 2. Rodar um cenário específico (com hot-reload)

```bash
npm run dev:cenario01   # 🍕 Restaurante
npm run dev:cenario02   # 🎬 Cinema
npm run dev:cenario03   # 🏋️ Academia
npm run dev:cenario04   # 🅿️ Estacionamento
npm run dev:cenario05   # 🏦 Banco
```

---

## Framework de Testes — `validar()`

Utilizaremos o mesmo framework de testes que criamos em aula. A função `validar()` é importada do arquivo `framework-teste.ts`.

### Como usar

```typescript
import { validar } from '../framework-teste'

validar({
    descricao: 'Descrição do que estou testando',
    atual: resultadoDaMinhaFuncao,    // o valor que a função retornou
    esperado: valorQueEuEspero        // o valor correto segundo as regras
})
```

### Exemplo de saída esperada

Quando o teste **passa** (valor atual === valor esperado):
```
✔ [PASSOU] - calcularPedido() - Pedido com frete grátis acima de R$100
```

Quando o teste **falha** (valor atual !== valor esperado):
```
❌ [FALHOU] - calcularPedido() - Pedido com frete grátis acima de R$100
Esperava: 108 | Recebeu: 0
```

### Exemplo completo de um teste

```typescript
// Suponha que a função calcularPedido retorna o valor total do pedido
const resultado = calcularPedido({ itens: [...], gorjeta: false })

validar({
    descricao: 'calcularPedido() - Pedido simples com frete',
    atual: resultado.valorTotal,
    esperado: 58   // R$ 50 dos itens + R$ 8 do frete
})
```

Se a implementação estiver correta, você verá:
```
✔ [PASSOU] - calcularPedido() - Pedido simples com frete
```

---

## Cenários

---

### 🍕 Cenário 01 — Sistema de Pedidos de Restaurante

**Arquivo:** `cenario01-restaurante/index.ts`

**Regras de Negócio:**
1. A taxa de entrega é de **R$ 8,00** fixo
2. Se o subtotal dos itens for **acima de R$ 100,00**, a entrega é **grátis**
3. Se o pedido contiver um **combo** (pelo menos 1 item de cada categoria: `prato` + `bebida` + `sobremesa`), aplica-se **15% de desconto** no subtotal
4. A **gorjeta** é opcional e equivale a **10%** do subtotal (calculada antes do desconto de combo e antes da taxa de entrega)
5. O pedido mínimo para entrega é de **R$ 25,00** (subtotal, antes de descontos)
6. O máximo de itens (soma das quantidades) por pedido é **20**

**Função a implementar:** `calcularPedido(pedido: IPedido): IResultadoPedido`

**Testes a completar:**
| # | Descrição |
|---|-----------|
| 1 | Pedido simples com frete (subtotal < R$100) |
| 2 | Pedido com frete grátis (subtotal > R$100) |
| 3 | Pedido com combo (prato + bebida + sobremesa) — desconto 15% |
| 4 | Pedido com combo + gorjeta |
| 5 | Pedido abaixo do mínimo R$25 — deve retornar inválido |
| 6 | Pedido vazio (sem itens) — deve retornar inválido |
| 7 | Pedido com mais de 20 itens — deve retornar inválido |
| 8 | Pedido com gorjeta mas sem combo |
| 9 | Pedido com combo + frete grátis + gorjeta (cenário completo) |
| 10 | Pedido só com bebidas (sem combo = sem desconto) |

---

### 🎬 Cenário 02 — Sistema de Venda de Ingressos de Cinema

**Arquivo:** `cenario02-cinema/index.ts`

**Regras de Negócio:**
1. Ingresso **inteira**: R$ 40,00
2. **Meia-entrada** (estudante ou idoso 60+): 50% de desconto
3. Sessão **3D**: acréscimo de R$ 10,00 por ingresso
4. **Terça-feira** (diaSemana === 2): 30% de desconto no valor base (aplicado antes da meia-entrada)
5. Máximo de **6 ingressos** por compra
6. **Menores de 16 anos** não podem assistir na sessão `noite`
7. A classificação do filme deve ser respeitada (idade do espectador >= classificação)

**Função a implementar:** `comprarIngressos(compra: ICompraIngresso): IResultadoCompra`

**Testes a completar:**
| # | Descrição |
|---|-----------|
| 1 | Compra de ingresso inteira (dia normal, sessão tarde, 2D) |
| 2 | Compra com meia-entrada para estudante |
| 3 | Compra com meia-entrada para idoso (60+) |
| 4 | Compra de ingresso para sessão 3D (inteira) |
| 5 | Compra na terça-feira com meia-entrada |
| 6 | Compra de 6 ingressos (máximo permitido) |
| 7 | Compra de 7 ingressos — deve retornar inválido |
| 8 | Menor de 16 anos na sessão noturna — deve retornar inválido |
| 9 | Sessão 3D na terça-feira (inteira) |
| 10 | Compra mista: 1 inteira + 1 meia-estudante (dia normal, 2D) |

---

### 🏋️ Cenário 03 — Sistema de Academia

**Arquivo:** `cenario03-academia/index.ts`

**Regras de Negócio:**
1. Plano **mensal**: R$ 99,90
2. Plano **trimestral**: R$ 249,90
3. Plano **anual**: R$ 899,90
4. **Personal trainer**: acréscimo de R$ 50,00/mês
5. **Cancelamento** antes do prazo: multa de **20%** do valor restante do contrato
6. Limite de **1 check-in** por dia por aluno
7. Horário de funcionamento: **6h às 23h**
8. Aluno com mensalidade **vencida** ou **inativo**: bloquear check-in

**Funções a implementar:**
- `calcularPlano(plano: string, personal: boolean): IResultadoPlano`
- `realizarCheckin(checkin: ICheckin): IResultadoCheckin`
- `cancelarPlano(alunoId: number): IResultadoCancelamento`

**Testes a completar:**
| # | Descrição |
|---|-----------|
| 1 | Calcular valor do plano mensal sem personal |
| 2 | Calcular valor do plano anual sem personal |
| 3 | Check-in válido (aluno ativo, horário ok, sem duplicata) |
| 4 | Check-in duplicado no mesmo dia — deve retornar inválido |
| 5 | Check-in fora do horário (antes das 6h ou após 23h) — inválido |
| 6 | Cancelamento do plano com multa de 20% |
| 7 | Check-in de aluno inadimplente (vencimento expirado) — inválido |
| 8 | Calcular plano mensal com personal (+R$50) |
| 9 | Calcular valor total do plano anual com personal |
| 10 | Calcular plano com tipo inválido — deve retornar inválido |

---

### 🅿️ Cenário 04 — Sistema de Estacionamento

**Arquivo:** `cenario04-estacionamento/index.ts`

**Regras de Negócio:**
1. Primeira hora: **R$ 10,00**
2. Hora adicional: **R$ 5,00** (frações de hora arredondam para cima)
3. Diária máxima: **R$ 50,00** (nunca cobra mais que isso)
4. **Mensalista**: R$ 300,00/mês (não paga por hora)
5. **Tolerância**: 15 minutos sem custo
6. Veículo **não cadastrado**: não pode registrar entrada
7. Máximo de **100 vagas** — se lotado, não permite entrada
8. **Perda de ticket**: multa fixa de R$ 80,00

**Funções a implementar:**
- `registrarEntrada(dados: IRegistrarEntrada): IResultadoEntrada`
- `registrarSaida(dados: IRegistrarSaida): IResultadoSaida`

**Testes a completar:**
| # | Descrição |
|---|-----------|
| 1 | Estadia dentro da tolerância (15min) — R$ 0,00 |
| 2 | Estadia de exatamente 1 hora — R$ 10,00 |
| 3 | Estadia de 2h30min — R$ 20,00 (1ª hora + 2 adicionais, fração arredondada) |
| 4 | Estadia de 10 horas — teto da diária R$ 50,00 |
| 5 | Saída de veículo mensalista — R$ 0,00 |
| 6 | Entrada de veículo não cadastrado — deve retornar inválido |
| 7 | Entrada com estacionamento lotado — deve retornar inválido |
| 8 | Saída com ticket perdido — multa R$ 80,00 |
| 9 | Estadia de 3 horas exatas — R$ 20,00 |
| 10 | Registro de entrada válido retorna ticket com dados corretos |

---

### 🏦 Cenário 05 — Sistema Bancário (Conta Corrente)

**Arquivo:** `cenario05-banco/index.ts`

**Regras de Negócio:**
1. Depósito mínimo: **R$ 10,00**
2. **Saque**: não pode ultrapassar o saldo (sem cheque especial)
3. **Transferência**: limite de **R$ 5.000,00** por transação
4. Transferência para **outro banco**: taxa de **R$ 2,50** (descontada do remetente)
5. Conta deve estar **ativa** para qualquer operação
6. **Extrato**: registrar tipo, valor e data de cada movimentação
7. Saldo inicial: **R$ 0,00**

**Funções a implementar:**
- `depositar(dados: IDepositar): boolean`
- `sacar(dados: ISacar): boolean`
- `transferir(dados: ITransferir): boolean`

**Testes a completar:**
| # | Descrição |
|---|-----------|
| 1 | Depósito válido (R$ 100,00) |
| 2 | Depósito abaixo do mínimo (R$ 5,00) — deve retornar false |
| 3 | Saque válido (valor menor que saldo) |
| 4 | Saque acima do saldo — deve retornar false |
| 5 | Transferência entre contas do mesmo banco |
| 6 | Transferência para outro banco (com taxa R$ 2,50) |
| 7 | Transferência acima do limite R$ 5.000 — deve retornar false |
| 8 | Operação em conta inativa — deve retornar false |
| 9 | Saldo correto após múltiplas operações |
| 10 | Extrato registra movimentação corretamente |

---

## Critérios de Avaliação

| Critério | Pontos |
|----------|--------|
| Cada teste correto (valor esperado correto + função implementada) | 1 ponto |
| **Total** | **50 pontos** |

- Cada cenário vale **10 pontos** (10 testes × 1 ponto)
- O teste só conta como correto se a saída for `✔ [PASSOU]`
- Testes com valor esperado incorreto (hardcoded errado) **não contam**

---

## Dicas

1. **Leia as regras de negócio com atenção** antes de começar a implementar
2. **Comece pela função** — implemente a lógica primeiro, depois ajuste os testes
3. **Faça um cenário por vez** — rode com `npm run dev:cenarioXX` e veja o resultado
4. **Use os dados fornecidos** — os objetos já estão prontos, não precisa criar novos
5. **Calcule na mão** — antes de colocar o valor esperado, faça a conta manualmente

Boa prova! 🚀
