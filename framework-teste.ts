interface IValidar {
    descricao: string
    atual: any
    esperado: any
}

export const validar = ({ atual, descricao, esperado }: IValidar) => {
    if (atual === esperado) {
        console.log(`✔ [PASSOU] - ${descricao}`)
    } else {
        console.error(`❌ [FALHOU] - ${descricao}`)
        console.warn(`Esperava: ${esperado} | Recebeu: ${atual}`)
    }
}
