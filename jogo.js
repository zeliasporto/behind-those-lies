"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");

var botao1, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divInventario = document.getElementById("divInventario"), inventario = {};

var telas = [
        "quarto", //0
        "fundopc" //1
];

var telasAnteriores = [
    0,
    0
];

var telasPosteriores = [
    1
];

function itemEstaNoInventario(nomeItem) {
    return (nomeItem in inventario);
}

function adicionarAoInventario(nomeItem, urlImagem) {
    if ((nomeItem in inventario)) {
        return;
    }
    var img = document.createElement("img");
    img.setAttribute("src", urlImagem);
    img.className = "imagem-inventario";
    img.onclick = function () { itemInventarioClicado(nomeItem); };
    inventario[nomeItem] = img;
    divInventario.appendChild(img);
}

function removerDoInventario(nomeItem) {
    var img = inventario[nomeItem];
    if (!img) {
        return;
    }
    divInventario.removeChild(img);
    delete inventario[nomeItem];
}

function toggleDivInventario() {
    if (divInventario.className == "escondido") {
        divInventario.className = "";
    } else {
        divInventario.className = "escondido";
    }
}

function itemInventarioClicado(nomeItem) {
    // @@@
    alert(nomeItem);
}


function TelaInicial(game) {

    // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)

    this.init = function () {

        game.input.maxPointers = 1;

        // Deixar o jogo executando, mesmo se o browser mudar de aba?
        game.stage.disableVisibilityChange = true;

        if (game.device.desktop) {
            // Configurações específicas para desktop

            // Como criamos o CSS acima, não precisamos centralizar via código
            game.scale.pageAlignHorizontally = false;
        } else {
            // Configurações específicas para celulares

            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // Especifica o tamanho mímino e máximo para a área do jogo (de 400x300 até 800x600)
            game.scale.setMinMax(400, 300, 800, 600);
            game.scale.forceLandscape = true;
            // Como criamos o CSS acima, não precisamos centralizar via código
            game.scale.pageAlignHorizontally = false;
        }

    }

    this.preload = function () {
        game.load.crossOrigin = "anonymous";
        
        game.load.image("quarto", "imagens/quarto.png");
        game.load.image("pc", "imagens/pc.png");
        game.load.image("fundopc", "imagens/fundopc.png");
        game.load.image("exitbutton", "imagens/exitbutton.png");
    }

    this.create = function () {
        telaAtual = 0;
        botaoPodeClicar = true;
        
        fundo = game.add.image(0, 0, telas[telaAtual]);
        
        botao1 = game.add.image(355, 470, "pc");
        botao1.anchor.set(0.5);
        botao1.alpha = 0.7;
        botao1.inputEnabled = true;
        botao1.input.useHandCursor = true;
        botao1.events.onInputDown.add(acaoBotao1, this);
    }
        
    this.update = function () {

    }

    function fadeOutOk() {
        fundo.kill();
        telaAtual = telaDepoisDoFadeOut;
        fundo = game.add.image(0, 0, telas[telaAtual]);
        fundo.alpha = 0;
        fundo.sendToBack();

        game.add.tween(fundo).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(fadeInOk, this);
    }

    function fadeInOk() {
        botaoPodeClicar = true;
    }

    function acaoBotao1() {
        if (botaoPodeClicar == true) {
                telaDepoisDoFadeOut = telasPosteriores[telaAtual];
                botao1.kill();
                if (telaAtual != telaDepoisDoFadeOut) {
                    botaoPodeClicar = false;
                    game.add.tween(fundo).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(fadeOutOk, this);
                    
            }
        }
    }

}


// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.start("TelaInicial");
