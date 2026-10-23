// Dados simulados das lojas e cardapio

const dadosLojas = [
  {
    id: "recife-antigo",
    nome: "Unidade Recife Antigo (PE)",
    endereco: "Rua do Bom Jesus, 145 - Recife/PE",
    tempoMedio: "15-20 min",
    campanhaAtiva: "Combo Recife: Cuscuz + Cafe Coado com 15% de desconto no cupom PRIMEIRACOMPRA"
  },
  {
    id: "caruaru-centro",
    nome: "Unidade Caruaru (PE)",
    endereco: "Av. Agamenon Magalhaes, 510 - Caruaru/PE",
    tempoMedio: "10-15 min",
    campanhaAtiva: "Especial Sao Joao de Caruaru: Pamonha, Canjica e Bolo de Milho no cardapio! Use o cupom SAOJOAO"
  },
  {
    id: "sp-paulista",
    nome: "Unidade Sao Paulo - Paulista (SP)",
    endereco: "Av. Paulista, 1230 - Sao Paulo/SP",
    tempoMedio: "20-25 min",
    campanhaAtiva: "Semana Nordestina em SP: Ganhe pontos em dobro no programa Raizes Fidelidade!"
  }
];

const categoriasCardapio = [
  { id: "todos", nome: "Todos" },
  { id: "tapiocas", nome: "Tapiocas & Cuscuz" },
  { id: "pratos", nome: "Pratos Regionais" },
  { id: "sazonais", nome: "Especiais Sao Joao" },
  { id: "sobremesas", nome: "Doces & Bolos" },
  { id: "bebidas", nome: "Bebidas" }
];

const listaProdutos = [
  {
    id: 1,
    nome: "Tapioca de Carne de Sol com Queijo Coalho",
    descricao: "Goma fresca peneirada na hora, recheada com carne de sol desfiada na manteiga da terra e queijo coalho.",
    preco: 22.90,
    categoria: "tapiocas",
    vegetariano: false,
    imagem: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro", "sp-paulista"],
    adicionais: [
      { id: "a1", nome: "Extra Queijo Coalho", preco: 5.00 },
      { id: "a2", nome: "Manteiga de Garrafa extra", preco: 3.00 },
      { id: "a3", nome: "Cebola Roxa na Manteiga", preco: 2.50 }
    ]
  },
  {
    id: 2,
    nome: "Cuscuz Recheado Arretado",
    descricao: "Cuscuz de milho flocado cozido no vapor com charque acebolado, queijo coalho e ovo frito.",
    preco: 24.50,
    categoria: "tapiocas",
    vegetariano: false,
    imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro", "sp-paulista"],
    adicionais: [
      { id: "a4", nome: "Ovo Caipira Frito", preco: 3.50 },
      { id: "a5", nome: "Catupiry Original", preco: 5.50 },
      { id: "a6", nome: "Banana da Terra Frita", preco: 4.00 }
    ]
  },
  {
    id: 3,
    nome: "Baiao de Dois Cremoso com Macaxeira",
    descricao: "Arroz e feijao verde cozidos juntos no caldo de costela, queijo coalho, bacon, coentro e macaxeira frita.",
    preco: 34.90,
    categoria: "pratos",
    vegetariano: false,
    imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "sp-paulista"],
    adicionais: [
      { id: "a7", nome: "Porcao Extra de Torresmo", preco: 6.00 },
      { id: "a8", nome: "Farofa de Cuscuz", preco: 4.50 }
    ]
  },
  {
    id: 4,
    nome: "Escondidinho de Macaxeira com Carne de Sol",
    descricao: "Pure cremoso de macaxeira gratinado com queijo coalho e recheio de carne de sol desfiada.",
    preco: 31.00,
    categoria: "pratos",
    vegetariano: false,
    imagem: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro", "sp-paulista"],
    adicionais: [
      { id: "a9", nome: "Arroz Branco Soltinho", preco: 6.00 }
    ]
  },
  {
    id: 5,
    nome: "Bolo de Rolo Pernambucano (Fatia)",
    descricao: "Camadas finas de massa de pao de lo enroladas com goiabada derretida, servido com queijo do reino.",
    preco: 14.90,
    categoria: "sobremesas",
    vegetariano: true,
    imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro", "sp-paulista"],
    adicionais: [
      { id: "a10", nome: "Sorvete de Creme", preco: 6.50 },
      { id: "a11", nome: "Lasca de Queijo do Reino", preco: 7.00 }
    ]
  },
  {
    id: 6,
    nome: "Cartola Tradicional do Recife",
    descricao: "Banana madura frita na manteiga, coberta com queijo manteiga derretido e polvilhada com acucar e canela.",
    preco: 16.50,
    categoria: "sobremesas",
    vegetariano: true,
    imagem: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro"],
    adicionais: []
  },
  {
    id: 7,
    nome: "Pamonha Tradicional na Palha (Sao Joao)",
    descricao: "Feita com milho verde ralado na hora e queijo coalho no centro. Produto exclusivo da unidade Caruaru.",
    preco: 12.90,
    categoria: "sazonais",
    vegetariano: true,
    imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["caruaru-centro"],
    adicionais: [
      { id: "a12", nome: "Cafezinho Coado na Hora", preco: 4.00 }
    ]
  },
  {
    id: 8,
    nome: "Canjica Nordestina Cremosa com Canela",
    descricao: "Creme doce de milho verde com leite de coco e canela em po. Exclusivo da unidade Caruaru.",
    preco: 11.50,
    categoria: "sazonais",
    vegetariano: true,
    imagem: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["caruaru-centro"],
    adicionais: []
  },
  {
    id: 9,
    nome: "Suco Natural da Fruta (Copo 400ml)",
    descricao: "Suco feito na hora. Sabores regionais: Caja, Acerola, Graviola ou Maracuja.",
    preco: 9.90,
    categoria: "bebidas",
    vegetariano: true,
    imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    unidadesDisponiveis: ["recife-antigo", "caruaru-centro", "sp-paulista"],
    adicionais: [
      { id: "a13", nome: "Trocar Agua por Leite", preco: 2.50 }
    ]
  }
];

const cuponsValidos = {
  "PRIMEIRACOMPRA": { desconto: 0.15, descricao: "15% de desconto na primeira compra" },
  "SAOJOAO": { desconto: 0.20, descricao: "20% de desconto na campanha de Sao Joao" }
};
