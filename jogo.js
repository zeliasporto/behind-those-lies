"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");
var botao, botao1, botao2, botao3, botao4, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divInventario = document.getElementById("divInventario"), inventario = {};
var abalinkItens = document.getElementById("abalinkItens"), img;
var abalinkMapa = document.getElementById("abalinkMapa");
var Itens = document.getElementById("Itens");
var Mapa = document.getElementById("Mapa");

WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Revalia']
    }

};

var telas = [
        "quartofred",      //0
        "quartobilly",     //1
        "restaurante",     //2
        "casarachel",      //3
        "garagem",         //4
        "posto",           //5
        "conveniencia",    //6
        "floresta1",       //7
        "floresta2",       //8
        "floresta3",       //9
        "gameover"         //10
];

var telasAnteriores = [
    0,
    1,
    2,
    3,
    4,
    6,
    5,
    7,
    8,
    9,
    10
];

var telasPosteriores = [
    1,
    2,
    3,
    4,
    6,
    5,
    7,
    8,
    9,
    10
]; 

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

    function acaoBotao() {
        if (botaoPodeClicar == true) {
                telaDepoisDoFadeOut = telasPosteriores[telaAtual];
                botao.kill();
                if (telaAtual != telaDepoisDoFadeOut) {
                    botaoPodeClicar = false;
                    game.add.tween(fundo).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(fadeOutOk, this);
                    
            }
        }
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
        
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        game.load.image("pc", "imagens/pc.png");
        game.load.image("fundopc", "imagens/fundopc.png");
        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("chave", "imagens/chave.png");
        game.load.image("quartofred","imagens/quartofred.png");
        game.load.image("quartobilly","imagens/quartobilly.png");
        game.load.image("restaurante","imagens/restaurante.png");
        game.load.image("casarachel","imagens/casarachel.png");
        game.load.image("garagem","imagens/garagem.png");
        game.load.image("posto","imagens/posto.png");
        game.load.image("conveniencia","imagens/conveniencia.png");
        game.load.image("floresta1","imagens/floresta1.png");
        game.load.image("floresta2","imagens/floresta2.png");
        game.load.image("floresta3","imagens/floresta3.png");
        game.load.image("gameover", "imagens/gameover.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("porta", "imagens/porta.png");
        game.load.image("portaAberta", "imagens/portaAberta.png");
        
    }

    
    var tween = null;
    var popup; 
    
    this.create = function () {
        telaAtual = 0;
        botaoPodeClicar = true;
        
        fundo = game.add.image(0, 0, telas[telaAtual]);
        
        botao1 = game.add.image(355, 470, "pc");
        botao1.anchor.set(0.5);
        botao1.alpha = 1.0;
        botao1.inputEnabled = true;
        botao1.input.useHandCursor = true;
        botao1.events.onInputDown.add(abrirPc, this);
             
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
        
        botao2 = game.add.image(100, 150, "mochila");
        botao2.anchor.set(0.5);
        botao2.alpha = 1.0;
        botao2.inputEnabled = true;
        botao2.input.useHandCursor = true;
        botao2.events.onInputDown.add(criarInventario, this);
        
        function criarInventario() {
            botao2.kill();
            inventario = game.add.image(70, 500, "mochila");
            inventario.anchor.set(0.5);
            inventario.alpha = 1.0;
            inventario.inputEnabled = true;
            inventario.input.useHandCursor = true;
            inventario.events.onInputDown.add(toggleDivInventario, this);
            
        }
        
        
        var chave = game.add.image(250, 200, "chave");
        chave.height = 10;
        chave.width = 25;
        chave.anchor.set(0.5);
        chave.alpha = 1.0;
        chave.inputEnabled = true;
        chave.input.useHandCursor = true;
        chave.events.onInputDown.add(() => {
            if(botao2.alive){
                
            }else{
                adicionarAoInventario("chave", "imagens/chave.png")
                chave.kill();
            } 
        }, this);  
        
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        
        var porta = game.add.image(500, 100, "porta");
        porta.anchor.set(0.5);
        porta.alpha = 1.0;
        porta.inputEnabled = true;
        porta.input.useHandCursor = true;
        porta.events.onInputDown.add(abrirPorta);
        
        function abrirPorta() {
            if (chave.className = "usavel"){
                porta.kill();
                removerDoInventario("chave");
                game.add.image(320, 0, "portaAberta");
                botao = game.add.image(720, 20, "botao");
                botao.alpha = 1.0;
                botao.inputEnabled = true;
                botao.input.useHandCursor = true;
                botao.events.onInputDown.add(acaoBotao);
                var outroitem = document.getElementById("outroitem");
                outroitem.className = "ele";
            }
            
        }
        
    }
        
    this.update = function () {
        
    }

    function createText() {

    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nrocking with\ngoogle web fonts");
    text.anchor.setTo(0.5);

    text.font = 'Revalia';
    text.fontSize = 60;
    }
   
}


// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.start("TelaInicial");
