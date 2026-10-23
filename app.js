// Variaveis globais do sistema
let unidadeAtual = "recife-antigo";
let categoriaAtual = "todos";
let termoBusca = "";
let apenasVegetariano = false;
let modoVisual = "app";

let carrinho = [];
let cupomAplicado = null;
let recompensaFidelidadeAplicada = null;
let produtoEmPersonalizacao = null;
let metodoPagamento = "pix";

let usuarioLogado = {
  logado: true,
  nome: "Carlos Eduardo",
  cpf: "123.456.789-00",
  pontos: 180
};

let historicoPedidos = [
  { id: 1018, data: "12/10/2026", resumo: "1x Tapioca de Carne de Sol, 1x Suco Natural", total: 32.80, status: "Entregue" },
  { id: 1029, data: "18/10/2026", resumo: "1x Cuscuz Recheado Arretado", total: 24.50, status: "Entregue" }
];

// Elementos da tela
const containerPrincipal = document.getElementById("containerPrincipal");
const selectUnidade = document.getElementById("selectUnidade");
const textoCampanha = document.getElementById("textoCampanha");
const infoUnidade = document.getElementById("infoUnidade");
const listaCategoriasEl = document.getElementById("listaCategorias");
const gradeProdutosEl = document.getElementById("gradeProdutos");
const contadorCarrinhoEl = document.getElementById("contadorCarrinho");
const pontosFidelidadeEl = document.getElementById("pontosFidelidade");

window.addEventListener("DOMContentLoaded", function() {
  carregarSelectUnidades();
  atualizarCabecalhoUnidade();
  atualizarInterfaceUsuario();
  renderizarCategorias();
  renderizarProdutos();
  verificarCookiesLGPD();
});

// Alterna entre tela de celular e totem
function alternarModoVisual(modo) {
  modoVisual = modo;
  const btnModoApp = document.getElementById("btnModoApp");
  const btnModoTotem = document.getElementById("btnModoTotem");

  if (modo === "totem") {
    containerPrincipal.className = "container-totem";
    btnModoTotem.className = "btn-modo ativo";
    btnModoApp.className = "btn-modo";
  } else {
    containerPrincipal.className = "container-app";
    btnModoApp.className = "btn-modo ativo";
    btnModoTotem.className = "btn-modo";
  }
}

function filtrarPorBusca() {
  const input = document.getElementById("inputBusca");
  termoBusca = input.value.toLowerCase();
  renderizarProdutos();
}

function alternarFiltroVeg() {
  apenasVegetariano = !apenasVegetariano;
  const btnVeg = document.getElementById("btnFiltroVeg");
  if (apenasVegetariano) {
    btnVeg.className = "btn-filtro-veg ativo";
  } else {
    btnVeg.className = "btn-filtro-veg";
  }
  renderizarProdutos();
}

// Login e conta do usuario
function atualizarInterfaceUsuario() {
  const btnContaTopo = document.getElementById("btnContaTopo");
  const barraFidelidade = document.getElementById("barraFidelidade");
  const areaLogado = document.getElementById("areaUsuarioLogado");
  const formLogin = document.getElementById("formLoginCadastro");

  if (usuarioLogado.logado) {
    const primeiroNome = usuarioLogado.nome.split(" ")[0];
    btnContaTopo.textContent = "Ola, " + primeiroNome;
    pontosFidelidadeEl.textContent = usuarioLogado.pontos;
    barraFidelidade.style.display = "flex";
    areaLogado.style.display = "block";
    formLogin.style.display = "none";

    document.getElementById("nomeUsuarioModal").textContent = usuarioLogado.nome;
    document.getElementById("cpfUsuarioModal").textContent = usuarioLogado.cpf;
    document.getElementById("pontosUsuarioModal").textContent = usuarioLogado.pontos;
    renderizarHistoricoPedidos();
  } else {
    btnContaTopo.textContent = "Entrar";
    barraFidelidade.style.display = "none";
    areaLogado.style.display = "none";
    formLogin.style.display = "block";
  }
}

function renderizarHistoricoPedidos() {
  const divHistorico = document.getElementById("listaHistoricoPedidos");
  if (!divHistorico) return;

  if (historicoPedidos.length === 0) {
    divHistorico.innerHTML = "<p>Nenhum pedido realizado ainda.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < historicoPedidos.length; i++) {
    const ped = historicoPedidos[i];
    html += '<div style="border-bottom: 1px solid #eee; padding: 6px 0; font-size: 12px;">';
    html += '<strong>Pedido #' + ped.id + '</strong> (' + ped.data + ') - <span style="color:#2e7d32;">' + ped.status + '</span><br>';
    html += '<span style="color:#555;">' + ped.resumo + '</span><br>';
    html += '<strong>Total: ' + formatarMoeda(ped.total) + '</strong>';
    html += '</div>';
  }
  divHistorico.innerHTML = html;
}

function abrirModalLogin() {
  atualizarInterfaceUsuario();
  document.getElementById("modalLogin").style.display = "flex";
}

function fecharModalLogin() {
  document.getElementById("modalLogin").style.display = "none";
}

function realizarLoginCadastro() {
  const nome = document.getElementById("inputNomeUsuario").value.trim();
  const cpf = document.getElementById("inputCpfUsuario").value.trim();

  if (nome === "" || cpf === "") {
    alert("Por favor, preencha seu nome e CPF para continuar.");
    return;
  }

  usuarioLogado = {
    logado: true,
    nome: nome,
    cpf: cpf,
    pontos: 100
  };

  atualizarInterfaceUsuario();
  fecharModalLogin();
  alert("Bem-vindo(a), " + nome + "! Voce ganhou 100 pontos de boas-vindas no programa Raizes Fidelidade.");
}

function deslogarUsuario() {
  usuarioLogado.logado = false;
  recompensaFidelidadeAplicada = null;
  atualizarInterfaceUsuario();
}

// Programa de fidelidade
function abrirModalFidelidade() {
  document.getElementById("saldoModalFidelidade").textContent = usuarioLogado.pontos + " pts";
  document.getElementById("modalFidelidade").style.display = "flex";
}

function fecharModalFidelidade() {
  document.getElementById("modalFidelidade").style.display = "none";
}

function resgatarRecompensa(custoPontos, valorDesconto, nomeRecompensa) {
  if (!usuarioLogado.logado) {
    alert("Faca login na sua conta para resgatar recompensas.");
    return;
  }

  if (recompensaFidelidadeAplicada !== null) {
    alert("Voce ja ativou uma recompensa para este pedido: " + recompensaFidelidadeAplicada.nome);
    return;
  }

  if (usuarioLogado.pontos < custoPontos) {
    alert("Saldo insuficiente. Voce precisa de " + custoPontos + " pontos para resgatar este beneficio.");
    return;
  }

  usuarioLogado.pontos = usuarioLogado.pontos - custoPontos;
  recompensaFidelidadeAplicada = {
    nome: nomeRecompensa,
    descontoReais: valorDesconto,
    custoPontos: custoPontos
  };

  atualizarInterfaceUsuario();
  document.getElementById("saldoModalFidelidade").textContent = usuarioLogado.pontos + " pts";
  alert("Recompensa '" + nomeRecompensa + "' ativada! O desconto de " + formatarMoeda(valorDesconto) + " sera aplicado na sua sacola.");
  fecharModalFidelidade();
}

// Selecao de unidades
function carregarSelectUnidades() {
  selectUnidade.innerHTML = "";
  for (let i = 0; i < dadosLojas.length; i++) {
    const loja = dadosLojas[i];
    const option = document.createElement("option");
    option.value = loja.id;
    option.textContent = loja.nome;
    selectUnidade.appendChild(option);
  }

  selectUnidade.addEventListener("change", function(evento) {
    unidadeAtual = evento.target.value;
    atualizarCabecalhoUnidade();
    renderizarProdutos();
  });
}

function atualizarCabecalhoUnidade() {
  let lojaSelecionada = null;
  for (let i = 0; i < dadosLojas.length; i++) {
    if (dadosLojas[i].id === unidadeAtual) {
      lojaSelecionada = dadosLojas[i];
      break;
    }
  }
  if (!lojaSelecionada) return;

  textoCampanha.textContent = lojaSelecionada.campanhaAtiva;
  infoUnidade.textContent = lojaSelecionada.endereco + " | Tempo medio: " + lojaSelecionada.tempoMedio;
}

// Categorias e cardapio
function renderizarCategorias() {
  listaCategoriasEl.innerHTML = "";
  for (let i = 0; i < categoriasCardapio.length; i++) {
    const cat = categoriasCardapio[i];
    const botao = document.createElement("button");
    if (cat.id === categoriaAtual) {
      botao.className = "btn-categoria ativo";
    } else {
      botao.className = "btn-categoria";
    }
    botao.textContent = cat.nome;
    botao.onclick = function() {
      categoriaAtual = cat.id;
      renderizarCategorias();
      renderizarProdutos();
    };
    listaCategoriasEl.appendChild(botao);
  }
}

function renderizarProdutos() {
  gradeProdutosEl.innerHTML = "";

  const produtosFiltrados = [];
  for (let i = 0; i < listaProdutos.length; i++) {
    const prod = listaProdutos[i];
    const disponivelNaLoja = prod.unidadesDisponiveis.indexOf(unidadeAtual) !== -1;
    const pertenceCategoria = categoriaAtual === "todos" || prod.categoria === categoriaAtual;
    const bateBusca = termoBusca === "" || prod.nome.toLowerCase().indexOf(termoBusca) !== -1 || prod.descricao.toLowerCase().indexOf(termoBusca) !== -1;
    const bateVeg = !apenasVegetariano || prod.vegetariano === true;

    if (disponivelNaLoja && pertenceCategoria && bateBusca && bateVeg) {
      produtosFiltrados.push(prod);
    }
  }

  if (produtosFiltrados.length === 0) {
    gradeProdutosEl.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 20px; color:#666;">Nenhum item encontrado para este filtro nesta unidade.</p>';
    return;
  }

  for (let i = 0; i < produtosFiltrados.length; i++) {
    const produto = produtosFiltrados[i];
    const card = document.createElement("div");
    card.className = "card-produto";

    let tagSazonal = "";
    if (produto.categoria === "sazonais") {
      tagSazonal = '<span class="tag-sazonal">Edicao Sao Joao</span>';
    }

    let tagVeg = "";
    if (produto.vegetariano) {
      tagVeg = '<span class="tag-sazonal" style="background:#e8f5e9; color:#2e7d32; margin-left:4px;">Vegetariano</span>';
    }

    let html = "";
    html += '<img src="' + produto.imagem + '" alt="' + produto.nome + '">';
    html += '<div class="card-info">';
    html += '<div>' + tagSazonal + tagVeg + '</div>';
    html += '<h3>' + produto.nome + '</h3>';
    html += '<p>' + produto.descricao + '</p>';
    html += '<div class="card-rodape">';
    html += '<span class="preco">' + formatarMoeda(produto.preco) + '</span>';
    html += '<button class="btn-adicionar" onclick="abrirModalProduto(' + produto.id + ')">+ Adicionar</button>';
    html += '</div>';
    html += '</div>';

    card.innerHTML = html;
    gradeProdutosEl.appendChild(card);
  }
}

// Personalizacao do produto
function abrirModalProduto(idProduto) {
  produtoEmPersonalizacao = null;
  for (let i = 0; i < listaProdutos.length; i++) {
    if (listaProdutos[i].id === idProduto) {
      produtoEmPersonalizacao = listaProdutos[i];
      break;
    }
  }
  if (!produtoEmPersonalizacao) return;

  const conteudo = document.getElementById("conteudoModalProduto");
  let htmlAdicionais = "";

  if (produtoEmPersonalizacao.adicionais.length > 0) {
    htmlAdicionais += '<h4 style="margin-top:12px; font-size:14px;">Adicionais (Opcional):</h4>';
    for (let i = 0; i < produtoEmPersonalizacao.adicionais.length; i++) {
      const ad = produtoEmPersonalizacao.adicionais[i];
      htmlAdicionais += '<label class="item-adicional">';
      htmlAdicionais += '<span><input type="checkbox" class="check-adicional" value="' + ad.id + '" data-nome="' + ad.nome + '" data-preco="' + ad.preco + '"> ' + ad.nome + '</span>';
      htmlAdicionais += '<strong>+ ' + formatarMoeda(ad.preco) + '</strong>';
      htmlAdicionais += '</label>';
    }
  }

  let html = "";
  html += '<h2>' + produtoEmPersonalizacao.nome + '</h2>';
  html += '<p style="font-size:13px; color:#555; margin:6px 0;">' + produtoEmPersonalizacao.descricao + '</p>';
  html += '<p style="font-weight:bold; color:#b33915; font-size:16px;">Preco base: ' + formatarMoeda(produtoEmPersonalizacao.preco) + '</p>';
  html += htmlAdicionais;
  html += '<div style="margin-top:12px;">';
  html += '<label style="font-size:13px; font-weight:bold;">Observacoes para a cozinha:</label>';
  html += '<input type="text" id="obsProduto" placeholder="Ex: Sem coentro, ponto da carne..." style="width:100%; padding:8px; margin-top:4px; border:1px solid #ccc; border-radius:4px;">';
  html += '</div>';
  html += '<button class="btn-primario" onclick="confirmarAdicaoCarrinho()">Adicionar a Sacola</button>';

  conteudo.innerHTML = html;
  document.getElementById("modalProduto").style.display = "flex";
}

function fecharModalProduto() {
  document.getElementById("modalProduto").style.display = "none";
}

function confirmarAdicaoCarrinho() {
  const checkboxes = document.querySelectorAll(".check-adicional:checked");
  const adicionaisEscolhidos = [];
  let somaAdicionais = 0;

  for (let i = 0; i < checkboxes.length; i++) {
    const cb = checkboxes[i];
    const precoAd = parseFloat(cb.getAttribute("data-preco"));
    somaAdicionais = somaAdicionais + precoAd;
    adicionaisEscolhidos.push({
      nome: cb.getAttribute("data-nome"),
      preco: precoAd
    });
  }

  const observacao = document.getElementById("obsProduto").value.trim();
  const precoFinalUnitario = produtoEmPersonalizacao.preco + somaAdicionais;

  carrinho.push({
    idItem: Date.now(),
    produtoId: produtoEmPersonalizacao.id,
    nome: produtoEmPersonalizacao.nome,
    precoUnitario: precoFinalUnitario,
    adicionais: adicionaisEscolhidos,
    observacao: observacao
  });

  atualizarContadorCarrinho();
  fecharModalProduto();
}

function atualizarContadorCarrinho() {
  contadorCarrinhoEl.textContent = carrinho.length;
}

// Sacola e descontos
function abrirModalCarrinho() {
  renderizarItensCarrinho();
  document.getElementById("modalCarrinho").style.display = "flex";
}

function fecharModalCarrinho() {
  document.getElementById("modalCarrinho").style.display = "none";
}

function renderizarItensCarrinho() {
  const listaEl = document.getElementById("listaItensCarrinho");
  const resumoEl = document.getElementById("resumoValoresCarrinho");

  if (carrinho.length === 0) {
    listaEl.innerHTML = '<p style="text-align:center; padding: 20px 0; color:#666;">Sua sacola esta vazia.</p>';
    resumoEl.innerHTML = "";
    return;
  }

  listaEl.innerHTML = "";
  for (let i = 0; i < carrinho.length; i++) {
    const item = carrinho[i];
    const div = document.createElement("div");
    div.className = "item-carrinho";

    let textoAdicionais = "";
    if (item.adicionais.length > 0) {
      const nomes = [];
      for (let j = 0; j < item.adicionais.length; j++) {
        nomes.push(item.adicionais[j].nome);
      }
      textoAdicionais = "<br><small>+ " + nomes.join(", ") + "</small>";
    }

    let textoObs = "";
    if (item.observacao !== "") {
      textoObs = "<br><small>Obs: " + item.observacao + "</small>";
    }

    let html = "";
    html += '<div>';
    html += '<strong>' + item.nome + '</strong>';
    html += textoAdicionais;
    html += textoObs;
    html += '<br><span style="color:#b33915; font-weight:bold;">' + formatarMoeda(item.precoUnitario) + '</span>';
    html += '</div>';
    html += '<button class="btn-remover" onclick="removerItemCarrinho(' + item.idItem + ')">Remover</button>';

    div.innerHTML = html;
    listaEl.appendChild(div);
  }

  const totais = calcularTotais();
  let htmlResumo = '<p>Subtotal: <strong>' + formatarMoeda(totais.subtotal) + '</strong></p>';

  if (totais.descontoCupom > 0) {
    htmlResumo += '<p style="color: green;">Cupom (' + cupomAplicado + '): <strong>- ' + formatarMoeda(totais.descontoCupom) + '</strong></p>';
  }
  if (totais.descontoFidelidade > 0) {
    htmlResumo += '<p style="color: #b33915;">Recompensa Fidelidade (' + recompensaFidelidadeAplicada.nome + '): <strong>- ' + formatarMoeda(totais.descontoFidelidade) + '</strong></p>';
  }

  htmlResumo += '<p style="font-size:18px; margin-top:6px;">Total a pagar: <strong style="color:#b33915;">' + formatarMoeda(totais.total) + '</strong></p>';
  resumoEl.innerHTML = htmlResumo;
}

function removerItemCarrinho(idItem) {
  const novoCarrinho = [];
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].idItem !== idItem) {
      novoCarrinho.push(carrinho[i]);
    }
  }
  carrinho = novoCarrinho;
  atualizarContadorCarrinho();
  renderizarItensCarrinho();
}

function aplicarCupom() {
  const input = document.getElementById("inputCupom");
  const codigo = input.value.trim().toUpperCase();
  const feedback = document.getElementById("feedbackCupom");

  if (cuponsValidos[codigo]) {
    cupomAplicado = codigo;
    feedback.style.color = "green";
    feedback.textContent = "Cupom aplicado: " + cuponsValidos[codigo].descricao;
  } else {
    cupomAplicado = null;
    feedback.style.color = "red";
    feedback.textContent = "Cupom invalido ou expirado.";
  }

  renderizarItensCarrinho();
}

function calcularTotais() {
  let subtotal = 0;
  for (let i = 0; i < carrinho.length; i++) {
    subtotal = subtotal + carrinho[i].precoUnitario;
  }

  let descontoCupom = 0;
  if (cupomAplicado && cuponsValidos[cupomAplicado]) {
    descontoCupom = subtotal * cuponsValidos[cupomAplicado].desconto;
  }

  let descontoFidelidade = 0;
  if (recompensaFidelidadeAplicada) {
    descontoFidelidade = recompensaFidelidadeAplicada.descontoReais;
  }

  let total = subtotal - descontoCupom - descontoFidelidade;
  if (total < 0) {
    total = 0;
  }

  return {
    subtotal: subtotal,
    descontoCupom: descontoCupom,
    descontoFidelidade: descontoFidelidade,
    total: total
  };
}

// Pagamento externo simulado
function irParaCheckout() {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um item na sacola antes de continuar.");
    return;
  }
  fecharModalCarrinho();
  document.getElementById("statusProcessamentoGateway").style.display = "none";
  document.getElementById("modalCheckout").style.display = "flex";
}

function fecharModalCheckout() {
  document.getElementById("modalCheckout").style.display = "none";
}

function selecionarPagamento(metodo) {
  metodoPagamento = metodo;
  const areaPix = document.getElementById("areaPix");
  const areaCartao = document.getElementById("areaCartao");

  if (metodo === "pix") {
    areaPix.style.display = "block";
    areaCartao.style.display = "none";
  } else {
    areaPix.style.display = "none";
    areaCartao.style.display = "block";
  }
}

function simularPagamentoExterno(aprovar) {
  const statusBox = document.getElementById("statusProcessamentoGateway");
  const btnConfirmar = document.getElementById("btnConfirmarPagamento");
  const btnFalha = document.getElementById("btnSimularFalha");

  btnConfirmar.disabled = true;
  btnFalha.disabled = true;

  statusBox.style.display = "block";
  statusBox.style.background = "#fff8e1";
  statusBox.style.color = "#856404";
  statusBox.style.borderColor = "#ffe082";
  statusBox.textContent = "Conectando ao servico externo de pagamento e aguardando confirmacao...";

  setTimeout(function() {
    btnConfirmar.disabled = false;
    btnFalha.disabled = false;

    if (aprovar) {
      statusBox.style.background = "#e8f5e9";
      statusBox.style.color = "#1b5e20";
      statusBox.style.borderColor = "#a5d6a7";
      statusBox.textContent = "Pagamento aprovado pela operadora! Enviando pedido para a cozinha...";

      setTimeout(function() {
        finalizarPedidoComSucesso();
      }, 900);
    } else {
      statusBox.style.background = "#ffebee";
      statusBox.style.color = "#b71c1c";
      statusBox.style.borderColor = "#ef9a9a";
      statusBox.textContent = "Pagamento recusado pela operadora. Nenhum pedido foi gerado. Tente outra forma de pagamento.";
    }
  }, 1500);
}

// Finalizacao e acompanhamento do pedido
function finalizarPedidoComSucesso() {
  const totais = calcularTotais();
  const pontosGanhos = Math.floor(totais.total);
  const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

  const nomesItens = [];
  for (let i = 0; i < carrinho.length; i++) {
    nomesItens.push("1x " + carrinho[i].nome);
  }

  historicoPedidos.unshift({
    id: numeroAleatorio,
    data: "Hoje",
    resumo: nomesItens.join(", "),
    total: totais.total,
    status: "Em preparo"
  });

  if (usuarioLogado.logado) {
    usuarioLogado.pontos = usuarioLogado.pontos + pontosGanhos;
  }

  carrinho = [];
  cupomAplicado = null;
  recompensaFidelidadeAplicada = null;
  atualizarContadorCarrinho();
  atualizarInterfaceUsuario();
  fecharModalCheckout();

  document.getElementById("numeroPedidoGerado").textContent = "Senha de Retirada: #" + numeroAleatorio + " (+" + pontosGanhos + " pts fidelidade)";
  document.getElementById("modalStatus").style.display = "flex";

  resetarPassosStatus();
  setTimeout(function() {
    document.getElementById("passoPreparo").classList.add("concluido");
  }, 2000);

  setTimeout(function() {
    document.getElementById("passoPronto").classList.add("concluido");
  }, 4500);
}

function resetarPassosStatus() {
  document.getElementById("passoPreparo").classList.remove("concluido");
  document.getElementById("passoPronto").classList.remove("concluido");
}

function fecharModalStatus() {
  document.getElementById("modalStatus").style.display = "none";
}

// Funcoes de privacidade LGPD
function verificarCookiesLGPD() {
  const aceiteSalvo = localStorage.getItem("lgpd_raizes_nordeste");
  if (aceiteSalvo) {
    document.getElementById("bannerLGPD").style.display = "none";
  }
}

function aceitarLGPD() {
  localStorage.setItem("lgpd_raizes_nordeste", "aceito");
  document.getElementById("bannerLGPD").style.display = "none";
}

function abrirModalLGPD() {
  document.getElementById("modalLGPD").style.display = "flex";
}

function fecharModalLGPD() {
  document.getElementById("modalLGPD").style.display = "none";
}

function salvarPreferenciasLGPD() {
  aceitarLGPD();
  fecharModalLGPD();
  alert("Suas preferencias de privacidade foram salvas.");
}

function solicitarExclusaoDados() {
  localStorage.removeItem("lgpd_raizes_nordeste");
  fecharModalLGPD();
  alert("Solicitacao registrada! Seus dados pessoais e historico foram removidos conforme a LGPD.");
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
