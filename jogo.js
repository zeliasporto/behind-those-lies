"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");
var botao, botaoAbrirPc, botaoCriarInventario, botao3, botao4, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divInventario = document.getElementById("divInventario"), inventario = {};
var abalinkItens = document.getElementById("abalinkItens"), img;
var abalinkMapa = document.getElementById("abalinkMapa");
var Itens = document.getElementById("Itens");
var Mapa = document.getElementById("Mapa");
var frases = document.getElementById("frases");
var mudandoTexto = false;

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

function itemEstaNoInventario(nomeItem) {
    return (nomeItem in inventario);
}

function adicionarAoInventario(nomeItem, urlImagem) {
    if ((nomeItem in inventario)) {
        return;
    }
    img = document.createElement("img");
    img.height = 40;
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
    if (divInventario.style.display == "none") {
        divInventario.style.display = "block";
    } else {
        divInventario.style.display = "none";
    }
}

function itemInventarioClicado(nomeItem) {
    img.className = "usavel";
    toggleDivInventario();
}

function mudarTexto(texto, intervalo, pausaEntreFrases, callback) {
    if (mudandoTexto) {
        return;
    }
    mudandoTexto = true;
    var fraseAtual = 0, i = 0, vetor = ((typeof texto) == "string" ? [texto] : texto), quantidade = vetor.length, frase = vetor[0];
    if (!intervalo || intervalo <= 10) {
        intervalo = 100;
    }
    if (!pausaEntreFrases || pausaEntreFrases <= 10) {
        pausaEntreFrases = 100;
    }
    function proximo() {
        frases.textContent = frase.substr(0, i);
        i++;
        if (i <= frase.length) {
            setTimeout(proximo, intervalo);
        } else {
            i = 0;
            fraseAtual++;
            if (fraseAtual >= quantidade) {
                mudandoTexto = false;
                if (callback)
                    callback();
            } else {
                frase = vetor[fraseAtual];
                setTimeout(proximo, pausaEntreFrases);
            }
        }
    }
    proximo();
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
        
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("chave", "imagens/chave.png");
        game.load.image("quartofred","imagens/quartofred.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("porta", "imagens/porta.png");
        game.load.image("portaAberta", "imagens/portaAberta.png");
        game.load.image("caneca", "imagens/caneca.png");
        game.load.image("chavepequena", "imagens/chavepequena.png");

    }

    var tween = null;
    var popup;
    var inventarioCriado;

    function abrirPc() {
        popup = game.add.image(game.world.centerX, game.world.centerY, 'fundopc');
        popup.alpha = 1.0;
        popup.anchor.set(0.5);
        popup.inputEnabled = true;

        var pw = (popup.width / 2) - 50;
        var ph = (popup.height / 2) - 8;

        var fechar = game.add.image(pw, -ph, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(fecharPc, this);

        popup.addChild(fechar);
        popup.scale.set(0.1);

        if ((tween !== null && tween.isRunning) || popup.scale.x === 1) {
            return;
        }
        tween = game.add.tween(popup.scale).to( { x: 0.9, y: 0.9 }, 200, Phaser.Easing.Linear.Out, true);   
    }

    function fecharPc() {
        popup.kill();
    }

    function criarInventario() {
        inventarioCriado = true;
        botaoCriarInventario.kill();
        inventario = game.add.image(70, 500, "mochila");
        inventario.anchor.set(0.5);
        inventario.alpha = 1.0;
        inventario.inputEnabled = true;
        inventario.input.useHandCursor = true;
        inventario.events.onInputDown.add(toggleDivInventario, this);
    }

    this.create = function () {
        telaAtual = 0;
        botaoPodeClicar = true;
        mudandoTexto = false;
        inventarioCriado = false;
        
        fundo = game.add.image(0, 0, "quartofred");

        botaoCriarInventario = game.add.image(540, 380, "mochila");
        botaoCriarInventario.width = 86;
        botaoCriarInventario.height = 103;
        botaoCriarInventario.alpha = 1.0;
        botaoCriarInventario.inputEnabled = true;
        botaoCriarInventario.input.useHandCursor = true;
        botaoCriarInventario.events.onInputDown.add(criarInventario, this);
        
        var caneca = game.add.image(390, 333, "caneca");
        caneca.width = 35;
        caneca.height = 29;
        caneca.alpha = 1.0;
        caneca.inputEnabled = true;
        caneca.input.useHandCursor = true;
        caneca.events.onInputDown.add(function () {
            caneca.angle = 270;
            caneca.top = 362;
            caneca.left = 365;
            var chavepequena = game.add.image(347, 357, "chavepequena");
            chavepequena.height = 10;
            chavepequena.width = 15;
            chavepequena.anchor.y = 0;
            chavepequena.alpha = 1.0;
            chavepequena.inputEnabled = true;
            chavepequena.input.useHandCursor = true;
            chavepequena.events.onInputDown.add(function () {
                if (inventarioCriado) {
                    adicionarAoInventario("chave", "imagens/chave.png")
                    chavepequena.kill();
                } else {
                    mudarTexto ("eu deveria pegar minha mochila antes", 50)
                }
            }, this);  
            }, this);
        
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        
        var porta = game.add.image(500, 100, "porta");
        porta.anchor.set(0.5);
        porta.alpha = 1.0;
        porta.inputEnabled = true;
        porta.input.useHandCursor = true;
        porta.events.onInputDown.add(function () {
            if (itemEstaNoInventario("chave")) {
                porta.kill();
                removerDoInventario("chave");
                game.add.image(320, 0, "portaAberta");
                var botao = game.add.image(550, 0, "botao");
                botao.alpha = 1.0;
                botao.inputEnabled = true;
                botao.input.useHandCursor = true;
                botao.events.onInputDown.add(function () {
                    game.state.start("Tela2");  
                    if (fraseAtual) {
                        return;
                    }
                });
            } 
        });                

    }
        
    this.update = function () {
        
    }
}


function Tela2(game) {

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
        
        game.load.image("pc", "imagens/pc.png");
        game.load.image("fundopc", "imagens/fundopc.png");
        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("quartobilly","imagens/quartobilly.png");
        game.load.image("gameover", "imagens/gameover.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        
    }

    var tween = null;
    var popup;
    
    function notificacao () {
        document.getElementById("preto").style.display = "none";
        document.getElementById("telabloqueada").style.display = "block";
    }

    function abrirPc() {
        popup = game.add.image(game.world.centerX, game.world.centerY, 'fundopc');
        popup.alpha = 1.0;
        popup.anchor.set(0.5);
        popup.inputEnabled = true;

        var pw = (popup.width / 2) - 50;
        var ph = (popup.height / 2) - 8;

        var fechar = game.add.image(pw, -ph, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(fecharPc, this);

        popup.addChild(fechar);
        popup.scale.set(0.1);

        if ((tween !== null && tween.isRunning) || popup.scale.x === 1) {
            return;
        }
        tween = game.add.tween(popup.scale).to( { x: 0.9, y: 0.9 }, 200, Phaser.Easing.Linear.Out, true);   
    }

    function fecharPc() {
        popup.kill();
    }

    this.create = function () {
        telaAtual = 0;
        botaoPodeClicar = true;
        mudandoTexto = false;
        
        fundo = game.add.image(0, 0, "quartobilly");
        
        setTimeout(function () {
            mudarTexto([
            "ue? cade todo mundo?",
            " "
            ], 50, 800, notificacao);
        }, 1000);
        
        inventario = game.add.image(70, 500, "mochila");
        inventario.anchor.set(0.5);
        inventario.alpha = 1.0;
        inventario.inputEnabled = true;
        inventario.input.useHandCursor = true;
        inventario.events.onInputDown.add(toggleDivInventario, this);
        
        botaoAbrirPc = game.add.image(509, 359, "pc");
        botaoAbrirPc.anchor.set(0.5);
        botaoAbrirPc.alpha = 1.0;
        botaoAbrirPc.inputEnabled = true;
        botaoAbrirPc.input.useHandCursor = true;
        botaoAbrirPc.events.onInputDown.add(abrirPc, this);

        
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        
    }
        
    this.update = function () {
        
    }
}


// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.add("Tela2", Tela2);

window.WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        setTimeout(function () {
            game.state.start("TelaInicial");
        }, 500);
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Press+Start+2P']
    }

};

function blahDepoisTexto() {
    alert("fim!");
}

setTimeout(function () {
    mudarTexto([
        "ughh... eu não devia ter bebido tanto ontem...",
        "11:40... acho que ainda dá pra dormir mais um pouc-",
        "espera, alex mandou mensagem?? a gente não se fala há tanto \n\ tempo. vou ter que responder!",
        " "
    ], 50, 800);
}, 6100);
