"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)
// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");
var botao, botaoAbrirPc, botaoCriarInventario, botao3, botao4, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divPai, divJogo, divMochila, divInventario = document.getElementById("divInventario"),
    imgMochila = document.getElementById("imgMochila"),
    inventario = {};
var celularToggle = false;
var titulo = document.getElementById("titulo");
var start = document.getElementById("start");
var click = false;
var img, imagem, portao, carro, dialogo;
var frases = document.getElementById("frases");
var completarFrase = null, irParaAProximaFrase = null;
var mudandoTexto = false,
    mudandoTextoAbortado = false,
    ultimoTimeoutDefinido = 0;
var fundopc = document.getElementById("fundopc"),
    fechar, personagem = "fred";
var inicio = document.getElementById("inicio");
var curvabaixo = document.getElementById("curvabaixo");
var reto = document.getElementById("reto");
var curvacima = document.getElementById("curvacima");
var fim = document.getElementById("fim");
var slidingpuzzle = document.getElementById("slidingpuzzle");
var ajuda = document.getElementById("ajuda");
var peca1a = document.getElementById("peca1a");
var peca1b = document.getElementById("peca1b");
var peca2b = document.getElementById("peca2b");
var peca3b = document.getElementById("peca3b");
var peca3c = document.getElementById("peca3c");
var n_rows = 11;
var n_cols = 14;
var start_table = new Array(n_rows);
var chat_terminado = false;
var pingos;
var icon_mensagem1 = document.getElementById("icon_mensagem1");
icon_mensagem1.onclick = toggleCelular;
var icon_mensagem2 = document.getElementById("icon_mensagem2");
icon_mensagem2.onclick = toggleCelular;
for (var row = 0; row < n_rows; row++) {
    start_table[row] = new Array(n_cols);
}
var colours = "blue red green yellow pink purple".split(/\s+/);

function tela1() {
    game.state.start("Tela1");
}

function toggleCelular(){
    var celularzinho = document.getElementById("celularzinho");
    if (celularzinho.style.display == "none") {
        celularzinho.style.display = "block";
        celularToggle = true;
    } else {
        celularzinho.style.display = "none";
    }
}

function notificacao() {
        icon_mensagem1.style.display = "none";
        icon_mensagem2.style.display = "";
        scroll();
        var vezes = 0;
        function mudar() {
            icon_mensagem2.style.marginTop = (Math.random() * 10) + 'px';
            icon_mensagem2.style.marginLeft = (Math.random() * 10) + 'px';

                vezes++;
                if (vezes < 150) {
                    setTimeout(mudar, 20);
                    
                } else {
                    icon_mensagem2.style.marginTop = '';
                    icon_mensagem2.style.marginLeft = '';
                }
            
        }

        mudar();
    }

function criarCarro() {
    carro = game.add.image(201, 223, "carro");
    carro.alpha = 1.0;
    carro.inputEnabled = true;
    carro.input.useHandCursor = true;
    carro.events.onInputDown.add(function () {
        mudarTexto(["É, o carro ainda está aqui...",
                       "E os pneus... Ué, parece que foram rasgados! Que estranho...",
                       " "], 50, 800, 0, notificacao);
    });
}

function notificacao2() {
    document.getElementById("preto").style.display = "none";
    document.getElementById("telabloqueada").className = "";
    document.getElementById("horas").innerHTML = "17:14";
    document.getElementById("conteudo").innerHTML = "Ei, Freddie, descobriu...";
}

function proximo5() {
    icon_mensagem1.style.display = "none";
    icon_mensagem2.style.display = "none";
    botao = game.add.image(735, 5, "botao");
    botao.alpha = 1.0;
    botao.inputEnabled = true;
    botao.input.useHandCursor = true;
    botao.events.onInputDown.add(function () {
        abortarMudancaTexto();
        game.state.start("Tela5");
    })
}

function toggleinstrucoes() {
    if (instrucao.style.display == "none") {
        instrucao.style.display = "block";
        fechar = game.add.image(740, 5, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(toggleinstrucoes, this);
    } else {
        instrucao.style.display = "none";
        fechar.kill();
    }
}

function toggleSliding() {
    if (slidingpuzzle.style.display == "none") {
        slidingpuzzle.style.display = "block";
        new_game();
    } else {
        slidingpuzzle.style.display = "none";
    }
}

function create_node(type, parent) {
    var new_node = document.createElement(type);
    parent.appendChild(new_node);
    return new_node;
}

function append_text(parent, text) {
    var text_node = document.createTextNode(text);
    clear(parent);
    parent.appendChild(text_node);
}

function get_by_id(id) {
    var element = document.getElementById(id);
    return element;
}

function clear(element) {
    while (element.lastChild)
        element.removeChild(element.lastChild);
}

/* Flood fill game. */

var moves;
var max_moves = 26;
var finished;

/* Alter one element of the game table to be flooded. */

function flood_element(row, col, colour) {
    game_table[row][col].colour = colour;
    game_table[row][col].element.className = "piece " + colour;
}

function test_colour_flood(row, col, colour) {
    if (game_table[row][col].flooded)
        return;
    if (game_table[row][col].colour == colour) {
        game_table[row][col].flooded = true;
        /* Recurse to make sure that we get any connected neighbours. */
        flood_neighbours(row, col, colour);
    }
}

function flood_neighbours(row, col, colour) {
    if (row < n_rows - 1)
        test_colour_flood(row + 1, col, colour);
    if (row > 0)
        test_colour_flood(row - 1, col, colour);
    if (col < n_cols - 1)
        test_colour_flood(row, col + 1, colour);
    if (col > 0)
        test_colour_flood(row, col - 1, colour);
}

function all_flooded() {
    for (var row = 0; row < n_rows; row++) {
        for (var col = 0; col < n_cols; col++) {
            if (!game_table[row][col].flooded) {
                return false;
            }
        }
    }
    return true;
}

function flood(colour, initial) {
    if (finished)
        return;
    var old_colour = game_table[0][0].colour;
    if (!initial && colour == old_colour)
        return;
    moves++;
    append_text(get_by_id("moves"), moves);

    for (var row = 0; row < n_rows; row++)
        for (var col = 0; col < n_cols; col++)
            if (game_table[row][col].flooded)
                flood_element(row, col, colour);

    for (var row = 0; row < n_rows; row++)
        for (var col = 0; col < n_cols; col++)
            if (game_table[row][col].flooded)
                flood_neighbours(row, col, colour);
    if (all_flooded()) { //all_flooded()
        finished = true;
        if (moves <= max_moves) {
            mudarTexto(["Consegui!", " "], 50, 800);
            toggleSliding();
            setTimeout(function () {
                fundo = game.add.image(0, 0, "garagem")
                var caixa1 = game.add.image(595, 167, "caixa1");
                caixa1.alpha = 1.0;
                caixa1.inputEnabled = true;
                caixa1.input.useHandCursor = true;
                caixa1.events.onInputDown.add(function () {
                    mudarTexto(["Eu não deveria mexer aqui",
                                " "], 50, 800)
                });

                var livros = game.add.image(585, 73, "livros");
                livros.alpha = 1.0;
                livros.inputEnabled = true;
                livros.input.useHandCursor = true;
                livros.events.onInputDown.add(function () {
                    mudarTexto(["Não sabia que a Rachel também gostava de HQs",
                                " "], 50, 800)
                });

                var prateleiras = game.add.image(292, 44, "prateleiras");
                prateleiras.alpha = 1.0;
                prateleiras.inputEnabled = true;
                prateleiras.input.useHandCursor = true;
                prateleiras.events.onInputDown.add(function () {
                    mudarTexto(["Eu não deveria mexer aqui",
                                " "], 50, 800)
                });

                var caixa2 = game.add.image(73, 163, "caixa2");
                caixa2.alpha = 1.0;
                caixa2.inputEnabled = true;
                caixa2.input.useHandCursor = true;
                caixa2.events.onInputDown.add(function () {
                    mudarTexto(["Eu não deveria mexer aqui",
                                " "], 50, 800)
                });
            }, 1000);
            setTimeout(function () {
                dialogo = game.add.image(0, 500, "dialogo");
                dialogo.alpha = 0.7;
            }, 1000);
            setTimeout(function () {
                criarCarro()
            }, 1000);
        }
    } else if (moves == max_moves) {
        mudarTexto(["Merda!", " "], 50, 800)
        new_game();
    }
}

function random_colour() {
    var colour_no = Math.floor(Math.random() * 6);
    return colours[colour_no];
}

var game_table = new Array(n_rows);
for (var row = 0; row < n_rows; row++) {
    game_table[row] = new Array(n_cols);
    for (var col = 0; col < n_cols; col++) {
        game_table[row][col] = new Object();
    }
}

function create_table() {
    moves = -1;
    finished = false;
    var game_table_element = get_by_id("game-table-tbody");
    for (var row = 0; row < n_rows; row++) {
        var tr = create_node("tr", game_table_element);
        for (var col = 0; col < n_cols; col++) {
            var td = create_node("td", tr);
            var colour = random_colour();
            td.className = "piece " + colour;
            game_table[row][col].colour = colour;
            start_table[row][col] = colour;
            game_table[row][col].element = td;
            game_table[row][col].flooded = false;
        }
    }
    /* Mark the first element of the table as flooded. */
    game_table[0][0].flooded = true;
    /* Initialize the adjacent elements with the same colour to be flooded
       from the outset. */
    flood(game_table[0][0].colour, true);
    append_text(get_by_id("max-moves"), max_moves);
}

function new_game() {
    clear(get_by_id("game-table-tbody"));
    create_table();
}

function abrirPc() {
        fundopc.style.display = "block";
        fechar = game.add.image(740, 5, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(fecharPc, this);
    }

function fecharPc() {
    fundopc.style.display = "none";
    fechar.kill();
}

function esqueceu() {
    document.getElementById("puzzleSenha").className = "";

    function validarSenha() {
        var senha = document.getElementById("inputSenha").value;
        if (senha == "avengers") {
            document.getElementById("post").className = "";
            mudarTexto(["Acabei de lembrar que a última vez que eu vi o Billy foi logo  antes dele sair com a Rachel",
                           "eu deveria ir no trabalho dela ver se ela sabe de alguma coisa",
                           " "], 50, 800, 0, function () {
                fecharPc();
                icon_mensagem1.style.display = "none";
                icon_mensagem2.style.display = "none";
                var botao = game.add.image(735, 5, "botao");
                botao.alpha = 1.0;
                botao.inputEnabled = true;
                botao.input.useHandCursor = true;
                botao.events.onInputDown.add(function () {
                    abortarMudancaTexto();
                    game.state.start("Tela3");
                })
            })
        } else {
            document.getElementById("invalido").className = "";
        }
    }
    document.getElementById("buttonSenha").onclick = validarSenha;
}

function fadeOutOk() {
    fundo.kill();
    telaAtual = telaDepoisDoFadeOut;
    fundo = game.add.image(0, 0, telas[telaAtual]);
    fundo.alpha = 0;
    fundo.sendToBack();

    game.add.tween(fundo).to({
        alpha: 1
    }, 500, Phaser.Easing.Linear.None, true).onComplete.add(fadeInOk, this);
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
    img.className = "imgInventario";
    img.onclick = function () {
        itemInventarioClicado(nomeItem);
    };
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
        fechar = game.add.image(740, 5, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(toggleDivInventario, this);
    } else {
        divInventario.style.display = "none";
        fechar.kill();
    }
}

function itemInventarioClicado(nomeItem) {
    img.className = "usavel";
    toggleDivInventario();
}

function mudarTexto(texto, intervalo, pausaEntreFrases, personagem, callback) {
    //game.input.mouse.capture = true;
    
    if (mudandoTexto) {
        return;
    }
    
    completarFrase = null;
    irParaAProximaFrase = null;
    
    mudandoTexto = true;
    mudandoTextoAbortado = false;
    var fraseAtual = 0,
        i = 0,
        vetor = ((typeof texto) == "string" ? [texto] : texto),
        quantidade = vetor.length,
        frase = vetor[0];
    if (!intervalo || intervalo <= 10) {
        intervalo = 100;
    }
    if (personagem === 0 || personagem === null) {
        frases.style.color = "#fff";
    }
    if (personagem === 1) {
        frases.style.color = "#857ce4";
    }
    if (personagem === 2) {
        frases.style.color = "#84a793";
    }
    if (personagem === 3) {
        frases.style.color = "#F4FA58";
    }
    if (personagem === 4) {
        frases.style.color = "#E2A9F3";
    }
    if (personagem === 5) {
        frases.style.color = "#DF0101";
    }
    if (!pausaEntreFrases || pausaEntreFrases <= 10) {
        pausaEntreFrases = 100;
    }

    function pular() {
        if (completarFrase) {
            document.removeEventListener("click", completarFrase, true);
            completarFrase = null;
            i = frase.length;
            if (ultimoTimeoutDefinido) {
                clearTimeout(ultimoTimeoutDefinido);
                ultimoTimeoutDefinido = 0;
            }
            proximo();
        }
    }
    
    function proximo() {
        if (irParaAProximaFrase) {
            document.removeEventListener("click", irParaAProximaFrase, true);
            irParaAProximaFrase = null;
        }
        if (mudandoTextoAbortado === true) {
            return;
        }
        if (!i) {
            completarFrase = pular;
            document.addEventListener("click", completarFrase, true);
        }
        frases.textContent = frase.substr(0, i);
        i++;
        if (i < frase.length) {
            ultimoTimeoutDefinido = setTimeout(proximo, intervalo);
        } else {
            if (completarFrase) {
                document.removeEventListener("click", completarFrase, true);
                completarFrase = null;
            }
            frases.textContent = frase;
            i = 0;
            fraseAtual++;
            ultimoTimeoutDefinido = 0;
            if (fraseAtual >= quantidade) {
                mudandoTexto = false;
                //ultimoTimeoutDefinido = 0;
                if (callback)
                    callback();
            } else {
                frase = vetor[fraseAtual];
                irParaAProximaFrase = proximo;
                document.addEventListener("click", irParaAProximaFrase, true);
                //ultimoTimeoutDefinido = setTimeout(proximo, pausaEntreFrases);
            }
        }
    }
    proximo();
}

function abortarMudancaTexto() {
    frases.textContent = "";
    mudandoTextoAbortado = true;
    if (ultimoTimeoutDefinido) {
        clearTimeout(ultimoTimeoutDefinido);
        ultimoTimeoutDefinido = 0;
    }
    if (completarFrase) {
        document.removeEventListener("click", completarFrase, true);
        completarFrase = null;
    }
    if (irParaAProximaFrase) {
        document.removeEventListener("click", irParaAProximaFrase, true);
        irParaAProximaFrase = null;
    }
}

function togglePuzzle() {
    var puzzle = document.getElementById("puzzle");
    if (puzzle.style.display == "block") {
        puzzle.style.display = "none";
    } else {
        puzzle.style.display = "block";
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.style.opacity = "1.0";
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    if (peca1a.childNodes.length > 0 && peca1b.childNodes.length > 0 && peca2b.childNodes.length > 0 && peca3b.childNodes.length > 0 && peca3c.childNodes.length > 0) {
        if (peca1a.childNodes[0].id == "inicio" && peca1b.childNodes[0].id == "curvabaixo" && peca2b.childNodes[0].id == "reto" && peca3b.childNodes[0].id == "curvacima" && peca3c.childNodes[0].id == "fim") {
            fundo = game.add.image(0, 0, "postoconcertado");
            dialogo = game.add.image(0, 500, "dialogo");
            dialogo.alpha = 0.7;
            pingos.destroy();
            togglePuzzle();
            var postoguynaoclicavel = game.add.sprite(628, 272, "postoguy");
            mudarTexto([
                "Ótimo trabalho. O que queria saber mesmo?",
                " "
            ], 50, 800, 2, freddie5);
        }
    }
}

function freddie5() {
    mudarTexto([
        "Se viu um garoto moreno e bêbado passar aqui ontem a noite.",
        " "
        ], 50, 800, 0, freddie6);
}

function freddie6() {
    mudarTexto([
        "Ah sim, lembro de um garoto assim, estava mesmo alterado. Foi  ali pra floresta, com uma garota.",
        " "
        ], 50, 800, 2, cp6);
}

function cp6() {
    mudarTexto([
        "Garota? Ela tinha cabelo loiro?",
        " "
        ], 50, 800, 0, freddie7);
}

function freddie7() {
    mudarTexto([
        "Não. era roxo...",
        " "
        ], 50, 800, 2, proximo7);
}

function proximo7() {
    icon_mensagem1.style.display = "none";
    icon_mensagem2.style.display = "none";
    botao = game.add.image(735, 5, "botao");
    botao.alpha = 1.0;
    botao.inputEnabled = true;
    botao.input.useHandCursor = true;
    botao.events.onInputDown.add(function () {
        abortarMudancaTexto();
        game.state.start("Tela7");
    })
}

function TelaInicial(game) {

    // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)

    this.init = function () {

        game.input.maxPointers = 1;
        // Deixar o jogo executando, mesmo se o browser mudar de aba?
        game.stage.disableVisibilityChange = true;
        
        // https://phaser.io/docs/2.6.2/Phaser.ScaleManager.html
        // Due to a few issues in the scaling performed by Phaser 2.6.2, we will do it ourselves!
        // And since we are doing it manually, just turn off all automatic options...
        game.scale.compatibility.orientationFallback = "viewport";
        game.scale.compatibility.noMargins = true;
        game.scale.pageAlignHorizontally = false;
        game.scale.pageAlignVertically = false;

        // https://phaser.io/docs/2.6.2/Phaser.ScaleManager.html#startFullScreen
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

        function atualizarScale() {
            var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            divPai.style.width = windowWidth + "px";
            divPai.style.height = windowHeight + "px";
            // If we are not in a desktop environment, apply the scale regardless the screen dimensions
            var width, height;
            //if (!game.device.desktop || windowWidth <= game.width || windowHeight <= game.height) {
                var ratioJogo = game.width / game.height;
                var ratioTela = windowWidth / windowHeight;
                if (ratioTela > ratioJogo) {
                    // Vertical borders on each side
                    height = windowHeight;
                    width = ((game.width * (windowHeight / game.height)) + 0.5) | 0;
                } else {
                    // Horizontal borders above and below
                    width = windowWidth;
                    height = ((game.height * (windowWidth / game.width)) + 0.5) | 0;
                }
                game.scale.setUserScale(width / game.width, height / game.height);
            //} else {
            //    width = game.width;
            //    height = game.height;
            //    game.scale.setUserScale(1, 1);
            //}
            // Phaser creates a div inside divJogo when in fullscreen mode...
            var paddingH = ((windowWidth > width) ? ((windowWidth - width) >> 1) : "0");
            var paddingV = ((windowHeight > height) ? ((windowHeight - height) >> 1) : "0");
            divMochila.style.width = width + "px";
            divMochila.style.left = paddingH + "px";
            divMochila.style.bottom = paddingV + "px";
            imgMochila.style.width = (width * 0.15) + "px";
            frases.style.width = (windowWidth - paddingH - paddingH - ((width * 0.2) | 0) + "px" );
            frases.style.height = (height * 0.16) + "px";
            frases.style.left = (paddingH + ((width * 0.2) | 0)) + "px";
            frases.style.bottom = paddingV + "px";
            icon_mensagem1.style.width = (width/16) + "px";
            icon_mensagem1.style.right = (paddingH+10) + "px";
            icon_mensagem1.style.top = (paddingV+10) + "px";
            icon_mensagem2.style.width = (width/16) + "px";
            icon_mensagem2.style.right = (paddingH+10) + "px";
            icon_mensagem2.style.top = (paddingV+10) + "px";            

            var div = divJogo.getElementsByTagName("div");
            if (div && div.length && div[0]) {
                div[0].style.paddingTop = paddingV + "px";
            }
            game.scale.refresh();
        }
        if (!divPai) {
            divPai = document.getElementById("divPai");
            divJogo = document.getElementById("divJogo");
            divMochila = document.getElementById("divMochila");
            window.addEventListener("resize", atualizarScale);
        }
        atualizarScale();

    }

    this.preload = function () {
        game.load.crossOrigin = "anonymous";

        game.load.image("telaInicial", "imagens/telaInicial.png");

    }
    
    this.create = function () {

        fundo = game.add.image(0, 0, "telaInicial");
        
        document.getElementById("telaInicial").className = "telaInicial";
        
    }
}

function Tela1(game) {

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
        document.getElementById("topEyelid").className = "topEyelid";
        document.getElementById("bottomEyelid").className = "bottomEyelid";
        
        game.load.crossOrigin = "anonymous";

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("quartofredy", "imagens/quartofred.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");      
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("chave", "imagens/chave.png");
        game.load.image("porta", "imagens/porta.png");
        game.load.image("portaaberta", "imagens/portaaberta.png");
        game.load.image("caneca", "imagens/caneca.png");
        game.load.image("chavepequena", "imagens/chavepequena.png");
        game.load.image("armario", "imagens/armario.png");
        game.load.image("caixa", "imagens/caixa.png");
        game.load.image("vaso", "imagens/vaso.png");
        game.load.audio("portaabrindo", "audios/opendoor.mp3");        
    }

    var tween = null;
    var popup;
    var inventarioCriado;

    function criarInventario() {
        inventarioCriado = true;
        botaoCriarInventario.kill();
        imgMochila.style.display = "";
    }

    this.create = function () {
        document.getElementById("telaInicial").className = "escondido";
        
        document.getElementById("frases").className = "dialogo";
        
        icon_mensagem1.style.display = "";
        
        tween = null;
        setTimeout(function () {
            mudarTexto([
                "Ughh... eu não devia ter bebido tanto ontem...",
                "11:40... acho que ainda dá pra dormir mais um pouc-",
                "Espera, alex mandou mensagem?? a gente não se fala há tanto  tempo. vou ter que responder!",
                " "
            ], 50, 800, 0, notificacao)
        }, 6100);

        document.getElementById("msg1").style.display = "block";

        telaAtual = 0;
        botaoPodeClicar = true;
        mudandoTexto = false;
        inventarioCriado = false;

        fundo = game.add.image(0, 0, "quartofredy");

        botaoCriarInventario = game.add.image(540, 380, "mochila");
        botaoCriarInventario.width = 86;
        botaoCriarInventario.height = 103;
        botaoCriarInventario.alpha = 1.0;
        botaoCriarInventario.inputEnabled = true;
        botaoCriarInventario.input.useHandCursor = true;
        botaoCriarInventario.events.onInputDown.add(criarInventario, this);

        var armario = game.add.image(238, 365, "armario");
        armario.alpha = 1.0;
        armario.inputEnabled = true;
        armario.input.useHandCursor = true;
        armario.events.onInputDown.add(function () {
            mudarTexto(["Não tem nada aqui...",
                        " "], 50, 800)
        });

        var caixa = game.add.image(549, 183, "caixa");
        caixa.alpha = 1.0;
        caixa.inputEnabled = true;
        caixa.input.useHandCursor = true;
        caixa.events.onInputDown.add(function () {
            mudarTexto(["Não tem nada aqui...",
                        " "], 50, 800)
        });

        var vaso = game.add.image(364, 239, "vaso");
        vaso.alpha = 1.0;
        vaso.inputEnabled = true;
        vaso.input.useHandCursor = true;
        vaso.events.onInputDown.add(function () {
            mudarTexto(["Não tem nada aqui...",
                        " "], 50, 800)
        });

        var caneca = game.add.image(390, 333, "caneca");
        caneca.width = 35;
        caneca.height = 29;
        caneca.alpha = 1.0;
        caneca.inputEnabled = true;
        caneca.input.useHandCursor = true;
        caneca.events.onInputDown.add(function () {
            mudarTexto(["Ah, minha caneca, espero que não tenha quebrado... pera, caiu  alguma coisa",
                        " "], 50, 800)
            caneca.angle = 270;
            caneca.top = 362;
            caneca.left = 365;
            var chavepequena = game.add.image(347, 354, "chavepequena");
            chavepequena.height = 10;
            chavepequena.width = 15;
            chavepequena.anchor.y = 0;
            chavepequena.alpha = 1.0;
            chavepequena.inputEnabled = true;
            chavepequena.input.useHandCursor = true;
            chavepequena.events.onInputDown.add(function () {
                if (inventarioCriado) {
                    adicionarAoInventario("chave", "imagens/chave.png");
                    chavepequena.kill();
                } else {
                    mudarTexto(["Eu deveria pegar minha mochila antes de sair do meu quarto",
                                " "], 50, 800)
                }
            }, this);
        }, this);

        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        dialogo.zIndex = 0;

        var porta = game.add.image(0, 0, "porta");
        porta.alpha = 1.0;
        porta.inputEnabled = true;
        porta.input.useHandCursor = true;
        porta.events.onInputDown.add(function () {
            if (itemEstaNoInventario("chave") && chat_terminado) {
                porta.kill();
                var portaabrindo = game.add.audio("portaabrindo", 1.0, false);
                portaabrindo.play();
                removerDoInventario("chave");
                var portaaberta = game.add.image(0, 180, "portaaberta");
                var portaabrindo = game.add.audio("portaabrindo")
                portaaberta.height = 320;
                icon_mensagem1.style.display = "none";
                icon_mensagem2.style.display = "none";
                var botao = game.add.image(735, 5, "botao");
                botao.alpha = 1.0;
                botao.inputEnabled = true;
                botao.input.useHandCursor = true;
                botao.events.onInputDown.add(function () {
                    abortarMudancaTexto();
                    game.state.start("Tela2");
                });
            } else {
                if(chat_terminado){
                    mudarTexto(["Nossa, eu tranquei a porta? Nunca faço isso... devia estar  muito louco. Mas cadê a chave?",
                            " "], 50, 800)
                }
                else if(itemEstaNoInventario("chave")){
                    mudarTexto(["Preciso responder a mensagem",
                            " "], 50, 800)
                }
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

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("quartobilly", "imagens/quartobilly.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("pc", "imagens/pc.png");
        game.load.image("fundopc", "imagens/fundopc.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("avengers", "imagens/avengers.png");
        game.load.image("flash", "imagens/flash.png");
        game.load.image("estante", "imagens/estante.png");
        game.load.audio("knock", "audios/knockdoor.mp3");
    }

    this.create = function () {

        var conteudo = document.getElementById('conteudo');

        telaAtual = 0;
        botaoPodeClicar = true;
        mudandoTexto = false;

        fundo = game.add.image(0, 0, "quartobilly");
        icon_mensagem1.style.display = "";

        
        var knock = game.add.audio("knock", 1.0, false);
        knock.play();

        setTimeout(function () {
            mudarTexto([
            "Olá? é o Freddie!",
            "Alex? Tia Hellen? Onde vocês estão?",
            "Ue, será que não tem ninguém em casa?",
            " "
            ], 50, 800, 0, notificacao);
        }, 2000); 

        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;

    }

    this.update = function () {

    }
}

function Tela3(game) {
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

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("restaurante", "imagens/restaurante.png");
        game.load.image("rachel", "imagens/rachel.png");
        game.load.audio("campainha", "audios/campainha.mp3");
    }

    this.create = function () {

        fundo = game.add.image(0, 0, "restaurante");
        icon_mensagem1.style.display = "";
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
    
        var rachel = game.add.image(200, 165, "rachel");
        //rachel.animations.add('falar', [0, 1], 4, true);
        rachel.inputEnabled = true;
        rachel.input.useHandCursor = true;
        rachel.events.onInputDown.add(function () {
        mudarTexto([
        "Freddie? Você por aqui?",
        " "
        ], 50, 800, 1, fred1);
        //rachel.animations.play("falar");
        })

        function fred1() {
            mudarTexto([
        "Oi, Rachel. Como vai?",
        " "
        ], 50, 800, 0, rachel1);
        }

        function rachel1() {
            mudarTexto([
        "Trabalhando muito",
        "Na verdade a minha festa de ontem acabou comigo, tive a sorte de  não ter levado bronca dos meus pais.",
        " "
        ], 50, 800, 1, fred2);
        }

        function fred2() {
            mudarTexto([
        "Tem razão. Deixa eu te perguntar, você viu o Billy?",
        " "
        ], 50, 800, 0, rachel2);
        }

        function rachel2() {
            mudarTexto([
        "Só ontem. E espero não vê-lo tão cedo.",
        " "
        ], 50, 800, 1, fred3);
        }

        function fred3() {
            mudarTexto([
        "Mas vocês não estavam... sei lá, quase namorando?",
        " "
        ], 50, 800, 0, rachel3);
        }

        function rachel3() {
            mudarTexto([
        "Pois é, mas eu descobri que ele é um babaca.",
        " "
        ], 50, 800, 1, fred4);
        }

        function fred4() {
            mudarTexto([
        "O que ele fez dessa vez?",
        " "
        ], 50, 800, 0, rachel4);
        }

        function rachel4() {
            mudarTexto([
        "Bom, já estávamos ficando há algum tempo. Na festa ontem, lá  em casa, ele pediu pra gente ficar... um pouco mais sério,  se é que me entende",
        " "
        ], 50, 800, 1, fred5);
        }

        function fred5() {
            mudarTexto([
        "Ew",
        " "
        ], 50, 800, 0, rachel5);
        }

        function rachel5() {
            mudarTexto([
        "Enfim, ele já tinha deixado o carro na garagem do meu pai, como  a gente tinha planejado",
        " "
        ], 50, 800, 1, fred6);
        }

        function fred6() {
            mudarTexto([
        "Sei...",
        " "
        ], 50, 800, 0, rachel6);
        }

        function rachel6() {
            mudarTexto([
        "Só que quando chegamos lá, os dois bêbados, ele ficou muito  bravo com alguma coisa e saiu sem mais nem menos.",
        " "
        ], 50, 800, 1, fred7);
        }

        function fred7() {
            mudarTexto([
        "E depois?",
        " "
        ], 50, 800, 0, rachel7);
        }

        function rachel7() {
            mudarTexto([
        "Não o vi mais. Também não sei o que deu errado. Até agora não  sei o que deu nele.",
        " "
        ], 50, 800, 1, fred8);
        }

        function fred8() {
            mudarTexto([
        "E ele não voltou pra pegar o carro?",
        " "
        ], 50, 800, 0, rachel8);
        }

        function rachel8() {
            mudarTexto([
        "Não, ainda está lá.",
        " "
        ], 50, 800, 1, fred9);
        }

        function fred9() {
            mudarTexto([
        "Posso ir lá dar uma olhada?",
        " "
        ], 50, 800, 0, rachel9);
        }

        function rachel9() {
            mudarTexto([
        "Claro, mas você vai precisar abrir o portão com-",
        " "
        ], 50, 800, 1, chefe);
        }
        
        function chefe() {
            var campainha = game.add.audio("campainha", 1.0, false);
            campainha.play();

        setTimeout(function () {
            mudarTexto([
        "RACHEL!! esses copos não vão se lavar sozinhos",
        " "
        ], 50, 800, 3, rachel10);
        }, 1500)
        }

        function rachel10() {
            mudarTexto([
        "JA VOU",
        "Ai, desculpa, preciso trabalhar. Mas enfim, preste  atenção nas cores",
        " "
        ], 50, 800, 1, proximo4)
        }

        function proximo4() {
            icon_mensagem1.style.display = "none";
            icon_mensagem2.style.display = "none";
            var botao = game.add.image(735, 5, "botao");
            botao.alpha = 1.0;
            botao.inputEnabled = true;
            botao.input.useHandCursor = true;
            botao.events.onInputDown.add(function () {
                abortarMudancaTexto();
                game.state.start("Tela4");

            })
        }
    }
}


function Tela4(game) {
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

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("garagem", "imagens/garagem.png");
        game.load.image("sliding", "imagens/slidingimg.png");
        game.load.image("portao", "imagens/portao.png");
        game.load.image("carro", "imagens/carrobilly.png");
        game.load.image("caixa1", "imagens/caixagaragem1.png");
        game.load.image("livros", "imagens/livros.png");
        game.load.image("prateleiras", "imagens/prateleiras.png");
        game.load.image("caixa2", "imagens/caixagaragem2.png");
    }

    this.create = function () {
        fundo = game.add.image(0, 0, "portao");
        icon_mensagem1.style.display = "";
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        imgMochila.style.display = "";

        var sliding = game.add.image(707, 190, "sliding");
        sliding.alpha = 1.0;
        sliding.inputEnabled = true;
        sliding.input.useHandCursor = true;
        sliding.events.onInputDown.add(toggleSliding, this);

    }
}

function Tela5(game) {
    var fred, cursors, cone1, cone2, cone3, cone4, cone5, cone6, bombaGas;
    var carros, carro1, carro2, carro3, carro4, bicicleta, caminhao, animacaoAtual;
    var posicao = 'parado';

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

        game.load.image("ruaPuzzle", "imagens/rua.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.spritesheet("fred", "imagens/minifred.png", 36, 36);
        game.load.image("carro1", "imagens/carro1.png");
        game.load.image("carro2", "imagens/carro2.png");
        game.load.image("botao", "imagens/botao.png");

        game.load.image("bombaGas", "imagens/bombaGas.png");
        game.load.image("carro3", "imagens/carro3.png");
        game.load.image("carro4", "imagens/carro4.png");
        game.load.image("bicicleta", "imagens/bicicleta.png");
        game.load.image("cone", "imagens/cone.png");
        game.load.image("caminhao", "imagens/caminhao.png");
        game.load.audio("carros", "audios/carpuzzle.mp3");
    }

    this.create = function () {

        fundo = game.add.image(0, 0, "ruaPuzzle");
        
        carros = game.add.audio("carros", 1.0, true);
        carros.play();

        imgMochila.style.display = "none";

        var dialogo = game.add.image(0, 0, "dialogo");
        dialogo.kill();

        bombaGas = game.add.sprite(5, -13, "bombaGas");
        game.physics.arcade.enable(bombaGas, Phaser.Physics.ARCADE);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();

        fred = game.add.sprite(400, 600, "fred");
        fred.animations.add('cima', [2, 3], 8, true);
        fred.animations.add('baixo', [3, 2], 8, true);
        fred.animations.add('esquerda', [2, 3], 8, true);
        fred.animations.add('direita', [3, 2], 8, true);
        fred.animations.add('parado', [3], 1, true);
        
        //animacaoAtual = 0;
        fred.animations.play("cima");
        
        game.physics.arcade.enable(fred, Phaser.Physics.ARCADE);
        fred.anchor.setTo(0.5, 0.5);
        fred.body.collideWorldBounds = true;
        fred.body.bounce.set(1);

        carro4 = game.add.sprite(800, 125, "carro4");
        game.physics.arcade.enable(carro4, Phaser.Physics.ARCADE);
        game.add.tween(carro4.body).to({
            x: -813
        }, 780, Phaser.Easing.Linear.None, 2000, -1, false);

        cone5 = game.add.sprite(580, 160, "cone");
        game.physics.arcade.enable(cone5, Phaser.Physics.ARCADE);

        cone3 = game.add.sprite(290, 160, "cone");
        game.physics.arcade.enable(cone3, Phaser.Physics.ARCADE);

        carro3 = game.add.sprite(-300, 210, "carro3");
        game.physics.arcade.enable(carro3, Phaser.Physics.ARCADE);
        game.add.tween(carro3.body).to({
            x: 803
        }, 2000, Phaser.Easing.Linear.None, 2000, -1, false);

        bicicleta = game.add.sprite(-100, 280, "bicicleta");
        game.physics.arcade.enable(bicicleta, Phaser.Physics.ARCADE);
        game.add.tween(bicicleta.body).to({
            x: 1000
        }, 2800, Phaser.Easing.Linear.None, 2000, -1, false);

        cone2 = game.add.sprite(400, 350, "cone");
        game.physics.arcade.enable(cone2, Phaser.Physics.ARCADE);

        caminhao = game.add.sprite(1500, 340, "caminhao");
        game.physics.arcade.enable(caminhao, Phaser.Physics.ARCADE);
        game.add.tween(caminhao.body).to({
            x: -860
        }, 2000, Phaser.Easing.Linear.None, 3000, -1, false);

        carro2 = game.add.sprite(800, 360, "carro2");
        game.physics.arcade.enable(carro2, Phaser.Physics.ARCADE);
        game.add.tween(carro2.body).to({
            x: -820
        }, 2000, Phaser.Easing.Linear.None, 2000, -1, false);

        cone6 = game.add.sprite(140, 480, "cone");
        game.physics.arcade.enable(cone6, Phaser.Physics.ARCADE);

        cone4 = game.add.sprite(580, 420, "cone");
        game.physics.arcade.enable(cone4, Phaser.Physics.ARCADE);

        cone1 = game.add.sprite(30, 400, "cone");
        game.physics.arcade.enable(cone1, Phaser.Physics.ARCADE);

        carro1 = game.add.sprite(-280, 440, "carro1");
        game.physics.arcade.enable(carro1, Phaser.Physics.ARCADE);
        game.add.tween(carro1.body).to({
            x: 810
        }, 1000, Phaser.Easing.Linear.None, 2000, -1, false);
    }

    this.update = function () {
        //fred.animations.play("cima");
        //fred.animations.play("parado");
        
        if (cursors.left.isDown) {
            //posicao = 'esquerda';
            fred.angle = 270;
            fred.x -= 8;
            fred.animations.play("esquerda");            
        } else if (cursors.right.isDown) {
            //posicao = 'direita';
            fred.angle = 90;
            fred.x += 8;
            fred.animations.play("direita");            
        }else if (cursors.up.isDown) {
            //posicao = 'cima';
            fred.angle = 0;
            fred.y -= 8;
            fred.animations.play("cima");    
        } else if (cursors.down.isDown) {
            //posicao = 'baixo';
            fred.angle = 180;
            fred.y += 8;
            fred.animations.play("baixo");
        } else {
            //posicao = "parado";
            fred.animations.stop("cima");
            fred.animations.stop("baixo");
            fred.animations.stop("esquerda");
            fred.animations.stop("direita");
        }
        
        


        game.physics.arcade.overlap(carro1, fred, colisao, null, this);
        game.physics.arcade.overlap(fred, cone1, colisao, null, this);
        game.physics.arcade.overlap(fred, carro2, colisao, null, this);
        game.physics.arcade.overlap(fred, cone2, colisao, null, this);
        game.physics.arcade.overlap(fred, cone3, colisao, null, this);
        game.physics.arcade.overlap(fred, cone4, colisao, null, this);
        game.physics.arcade.overlap(fred, cone5, colisao, null, this);
        game.physics.arcade.overlap(fred, cone6, colisao, null, this);
        game.physics.arcade.overlap(fred, caminhao, colisao, null, this);
        game.physics.arcade.overlap(fred, bicicleta, colisao, null, this);
        game.physics.arcade.overlap(fred, carro3, colisao, null, this);
        game.physics.arcade.overlap(fred, carro4, colisao, null, this);
        game.physics.arcade.overlap(fred, bombaGas, proximo6, null, this);
    }

    function colisao() {
        fred.kill();
        carros.destroy();
        game.state.start(game.state.current);
    }

    function proximo6() {
        icon_mensagem1.style.display = "none";
        icon_mensagem2.style.display = "none";
        botao = game.add.image(735, 5, "botao");
        botao.alpha = 1.0;
        botao.inputEnabled = true;
        botao.input.useHandCursor = true;
        botao.events.onInputDown.add(function () {
            carros.destroy();
            abortarMudancaTexto();
            game.state.start("Tela6");
        })
    }
}

function Tela6(game) {
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

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("posto", "imagens/posto.png");
        game.load.spritesheet("postoguy", "imagens/postoguy.png", 66, 228);
        game.load.image("canosimg", "imagens/puzzle.png");
        game.load.image("postoconcertado", "imagens/postoconcertado.png");
        game.load.audio("pingos", "audios/dropdrop.mp3");
    }

    this.create = function () {
        fundo = game.add.image(0, 0, "posto");
        icon_mensagem1.style.display = "";
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        imgMochila.style.display = "";
        pingos = game.add.audio("pingos", 1.0, true);
        pingos.play();

        var postoguy = game.add.sprite(628, 272, "postoguy");
        //rachel.animations.add('falar', [0, 1], 4, true);
        postoguy.inputEnabled = true;
        postoguy.input.useHandCursor = true;
        postoguy.events.onInputDown.add(function () {
        mudarTexto([
        "Olá?",
        " "
        ], 50, 800, 0, cp1);})

        function cp1() {
            mudarTexto([
        "O que quer aqui?",
        " "
        ], 50, 800, 2, freddie1);
        }

        function freddie1() {
            mudarTexto([
        "Ah, me disseram que um amigo apareceu aqui ontem a noite, cabelo  castanho, quase da minha altura, provavelmente bêbado.  Queria saber se você o viu…",
        " "
        ], 50, 800, 0, cp2);
        }

        function cp2() {
            mudarTexto([
        "Olha, eu posso te ajudar... se você me ajudar.",
        " "
        ], 50, 800, 2, freddie2);
        }

        function freddie2() {
            mudarTexto([
        "Oh, ok. O que eu posso fazer?",
        " "
        ], 50, 800, 0, cp3);
        }

        function cp3() {
            mudarTexto([
        "Alguns canos da loja de conveniência estão quebrados. Preciso que você conserte o caminho deles. Se fizer isso,  eu digo se vi ou quando vi seu amigo.",
        " "
        ], 50, 800, 2, freddie3);
        }

        function freddie3() {
            mudarTexto([
        "Tá bom, então",
        " "
        ], 50, 800, 0);
        var canosimg = game.add.image(275, 402, "canosimg");
        canosimg.anchor.set(0.5);
        canosimg.alpha = 1.0;
        canosimg.inputEnabled = true;
        canosimg.input.useHandCursor = true;
        canosimg.events.onInputDown.add(togglePuzzle, this);
        }
    }
}

function Tela7(game) {
    var gravidade = 900;
    var plataforma, chao1, chao2, chao3, chao4;
    var animacaoAtual, agua;
    var parando;
    var armadilha, buraco1, buraco2;
    var voarD;
    var bolaFogo;
    var plataforma2, plataforma4, plataforma3, cursors;
    var coruja, fred, barbatana, coruja2;

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
        game.load.image("puzzleFloresta", "imagens/puzzleFloresta.png");
        game.load.image("chao1", "imagens/chao1.png");
        game.load.image("chao2", "imagens/chao2.png");
        game.load.image("chao3", "imagens/chao3.png");
        game.load.image("chao4", "imagens/chao4.png");
        game.load.image("agua", "imagens/agua.png");
        game.load.image("plataforma", "imagens/plataforma.png");
        game.load.image("plataforma2", "imagens/plataforma.png");
        game.load.image("plataforma3", "imagens/plataforma3.png");
        game.load.image("plataforma4", "imagens/plataforma3.png");
        game.load.spritesheet("fred", "imagens/fredandando.png", 30, 114);
        game.load.image("armadilha", "imagens/armadilha.png");
        game.load.spritesheet("barbatana", "imagens/barbatana.png");
        game.load.image("bolaFogo", "imagens/bolaFogo.png");
        game.load.spritesheet("coruja", "imagens/coruja.png", 77, 48);
        game.load.spritesheet("coruja2", "imagens/coruja.png", 77, 48);
        game.load.image("botao", "imagens/botao.png");
        game.load.image("buraco1", "imagens/buraco1.png");
        game.load.image("buraco2", "imagens/buraco2.png");
    }

    this.create = function () {
        imgMochila.style.display = "none";
        game.world.setBounds(0, 0, 2260, 600);
        fundo = game.add.tileSprite(0, 0, 2260, 600, "puzzleFloresta");
        game.physics.startSystem(Phaser.Physics.ARCADE);

        /*
        coruja = game.add.sprite(400, 100, 'coruja');
        game.physics.arcade.enable(coruja, Phaser.Physics.ARCADE);
        coruja.animations.add("voarE", [12, 13, 14], 4, true);
        coruja.animations.add("voarD", [24, 25, 26], 3, true);
        coruja.body.collideWorldBounds = true; */

        barbatana = game.add.sprite(170, 498, "barbatana");
        barbatana.anchor.setTo(.5);
        game.physics.arcade.enable(barbatana, Phaser.Physics.ARCADE);
        barbatana.body.collideWorldBounds = true;

        buraco1 = game.add.sprite(887, 581, "buraco1");
        game.physics.arcade.enable(buraco1, Phaser.Physics.ARCADE);
        buraco1.body.collideWorldBounds = true;
        
        buraco2 = game.add.sprite(1311, 581, "buraco2");
        game.physics.arcade.enable(buraco2, Phaser.Physics.ARCADE);
        buraco2.body.collideWorldBounds = true;
        
        plataforma2 = game.add.sprite(1300, 200, "plataforma2");
        game.physics.arcade.enable(plataforma2, Phaser.Physics.ARCADE);
        plataforma2.body.immovable = true;
        
        plataforma4 = game.add.sprite(1450, 200, "plataforma4");
        game.physics.arcade.enable(plataforma4, Phaser.Physics.ARCADE);
        plataforma4.body.immovable = true;

        chao1 = game.add.sprite(0, 489, "chao1");
        game.physics.arcade.enable(chao1, Phaser.Physics.ARCADE);
        chao1.body.immovable = true;
        
        chao2 = game.add.sprite(600, 475, "chao2");
        game.physics.arcade.enable(chao2, Phaser.Physics.ARCADE);
        chao2.body.immovable = true;
        
        chao3 = game.add.sprite(1075, 515, "chao3");
        game.physics.arcade.enable(chao3, Phaser.Physics.ARCADE);
        chao3.body.immovable = true;
        
        chao4 = game.add.sprite(2089, 510, "chao4");
        game.physics.arcade.enable(chao4, Phaser.Physics.ARCADE);
        chao4.body.immovable = true;

        plataforma = game.add.physicsGroup();
        plataforma.create(436, 320, "plataforma");//do meio
        plataforma.create(220, 430, "plataforma");//1
        plataforma.setAll("body.immovable", true);
        
        plataforma3 = game.add.physicsGroup();
        plataforma3.create(1600, 260, "plataforma3");
        plataforma3.create(1751, 320, "plataforma3");
        plataforma3.create(1900, 380, "plataforma3");
        plataforma3.setAll("body.immovable", true);

        
        agua = game.add.sprite(126, 514, "agua");
        game.physics.arcade.enable(agua, Phaser.Physics.ARCADE);

        fred = game.add.sprite(100, 400, "fred");
        game.physics.arcade.enable(fred, Phaser.Physics.ARCADE);
        fred.body.collideWorldBounds = true;
        fred.body.gravity.y = gravidade;
        fred.anchor.setTo(0.5, 0.5);
        game.camera.follow(fred);

        fred.body.bounce.y = 0.2;

        fred.animations.add("direita", [1, 2, 3, 4, 5, ], 5, true);
        fred.animations.add("parado", [0], 1, true);
        fred.animations.add("esquerda", [6, 7, 8, 9, 10], 5, true);
        animacaoAtual = 0;
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    this.update = function () {

        game.physics.arcade.collide(fred, plataforma);
        game.physics.arcade.collide(fred, plataforma2);
        game.physics.arcade.collide(fred, plataforma3);
        game.physics.arcade.collide(fred, plataforma4);
        game.physics.arcade.collide(fred, chao1);
        game.physics.arcade.collide(fred, chao2);
        game.physics.arcade.collide(fred, chao3);
        game.physics.arcade.collide(fred, chao4);
        fred.body.velocity.x = 0;
        

        if(fred.x >= 2089){
            icon_mensagem1.style.display = "none";
            icon_mensagem2.style.display = "none";
            var botao = game.add.image(2195, 5, "botao");
            botao.alpha = 1.0;
            botao.inputEnabled = true;
            botao.input.useHandCursor = true;
            botao.events.onInputDown.add(function () {
                abortarMudancaTexto();
                game.state.start("Tela8");
            })
        }
        
        if(fred.x >= 605){
              armadilha = game.add.sprite(603, 450, "armadilha");
              game.physics.arcade.enable(armadilha, Phaser.Physics.ARCADE);
        }

        /*if (coruja.x >= 800) {

            coruja.animations.play("voarE");
            coruja.body.velocity.x = -200;
            coruja.body.velocity.y = 200;

            if (coruja.y >= 400) {
                coruja.body.velocity.y = -200;
                //coruja.body.gravity.y = -100;
            }

        } else if (coruja.x <= 400) {
            coruja.animations.play("voarD");
            coruja.body.velocity.x = 200;

            if (coruja.y >= 400) {
                coruja.body.velocity.y = 200;
                //coruja.body.gravity.y = -100;
            }
        }*/

        if (plataforma2.x >= 1000) {
            plataforma2.body.velocity.x = -100;

        } else if (plataforma2.x <= 603) {
            plataforma2.body.velocity.x = 100;
        }
        
        if (plataforma4.y >= 500) {
            plataforma4.body.velocity.y = -100;

        } else if (plataforma4.y <= 200) {
            plataforma4.body.velocity.y = 100;
        }
        
        if (barbatana.x >= 540) {
            barbatana.scale.x *= -1;
            barbatana.animations.play("voarEsquerda");
            barbatana.body.velocity.x = -200;
            game.physics.arcade.enable(barbatana, Phaser.Physics.ARCADE);
            
        } else if (barbatana.x <= 170) {
            barbatana.scale.x *= -1;
            barbatana.animations.play("voarDireita");
            barbatana.body.velocity.x = 200;
        }

        if (cursors.left.isDown) {
            fred.body.velocity.x = -200;
            
        } else if (cursors.right.isDown) {
            fred.body.velocity.x = 200;

        } else {
            fred.angle = 0;
        }

        if (cursors.up.isDown && (fred.body.onFloor() || fred.body.touching.down)) {
            fred.body.velocity.y = -470;
        }

        if (fred.body.velocity.x > 0) {
            if (animacaoAtual !== 1) {
                animacaoAtual = 1;
                fred.animations.play("direita");
            }
        } else if (fred.body.velocity.x < 0) {
            if (animacaoAtual !== -1) {
                animacaoAtual = -1;
                fred.animations.play("esquerda");
            }
        } else {
            if (animacaoAtual !== 0) {
                animacaoAtual = 0;
                fred.animations.play("parado");
            }
        }

        game.physics.arcade.overlap(fred, armadilha, morte, null, this);
        game.physics.arcade.overlap(fred, bolaFogo, morte, null, this);
        game.physics.arcade.overlap(fred, barbatana, morte, null, this);
        //game.physics.arcade.overlap(fred, coruja, morte, null, this);
        game.physics.arcade.overlap(fred, agua, morte, null, this);
        game.physics.arcade.overlap(fred, buraco1, morte, null, this);
        game.physics.arcade.overlap(fred, buraco2, morte, null, this);


    }

    function morte() {
        fred.kill();
        game.state.start(game.state.current);
    }
}
function Tela8(game) {
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

        game.load.image("fechar", "imagens/fechar.png");
        game.load.image("mochila", "imagens/mochila.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("floresta1", "imagens/floresta1.png");
        game.load.image("floresta2", "imagens/floresta2.png");
        game.load.image("sangue", "imagens/sangue.png");
        game.load.image("placa", "imagens/placa.png");
        game.load.spritesheet("alex", "imagens/alexchorando.png", 66, 222);
        game.load.spritesheet("billy", "imagens/billy.png", 66, 234);
        game.load.audio("passos", "audios/audiopassos.mp3");
    }

    this.create = function () {
        fundo = game.add.image(0, 0, "floresta1");
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        imgMochila.style.display = "";
        
        /*var placa = game.add.image(709, 317, "placa");
            placa.alpha = 1.0;
            placa.inputEnabled = true;
            placa.input.useHandCursor = true;
            placa.events.onInputDown.add(floresta2, this); */
        
        
        var alex = game.add.sprite(470, 200, "alex");
        alex.animations.add('chorar', [0, 1, 2, 3], 4, true);
        alex.inputEnabled = true;
        alex.input.useHandCursor = true;
        alex.events.onInputDown.add(function () {
            mudarTexto(["Até que enfim, você conseguiu chegar.",
                        " "], 50, 800, 4, f1)
            alex.animations.play("chorar");
        })

        function f1() {
            mudarTexto([" Alex? O que…?", " "], 50, 800, 0, alex1);
        } 

        function alex1() {
            mudarTexto(["Eu não sabia como contar, nem com quem falar… Por isso eu te  conduzi até aqui.",
                        "Pra te pedir ajuda pessoalmente...", " "], 50, 800, 4, f2);
        }

        function f2() {
            mudarTexto(["Ah… ajuda com o que?", " "], 50, 800, 0, alex2)
        }

        function alex2() {
            mudarTexto(["Acho que é melhor contar desde o começo… Billy nunca foi…  uma pessoa legal.",
                                " "], 50, 800, 4, f3)
        }

        function f3() {
            mudarTexto(["Como assim? A gente se conhece desde sempre.", " "], 50, 800, 0, alex3)
        }

        function alex3() {
            mudarTexto(["Você não esteve presente em todos os momentos… Nos piores, no  caso. Quando tínhamos 12 anos, Billy me chamava  pra ir na casa dele pra jogar “verdade ou desafio”.",
                        "No começo eram coisas bobas, como um selinho… mas Billy foi  ficando invasivo",
                        " "], 50, 800, 4, f4)
        }

        function f4() {
            mudarTexto(["Invasivo...?", " "], 50, 800, 0, alex4)
        }

        function alex4() {
            mudarTexto(["Ele colocava a mão por baixo da minha blusa, me segurava na  parede… Eu não tinha noção dessas coisas, pra mim era  um pouco estranho mas nada demais…", " "], 50, 800, 4, f5)
        }

        function f5() {
            mudarTexto(["Você podia ter falado comigo, não devia ficar sozinha com ele.", " "], 50, 800, 0, alex5)
        }

        function alex5() {
            mudarTexto(["Ele disse que era um segredo nosso e que a gente só tava se  divertindo.",
                        "Passei uns anos afastada dele, até mudei de turma.", "Mas aí na festa de 17 da Rachel, ele chegou em mim de novo.  Tentou me beijar mas eu me afastei. Nisso ele agarrou meu  braço e me arrastou pro banheiro.",
                        "E-eu não queria, mas Billy sempre foi muito mais forte que eu.  Ele puxou minha calça… e acho que o resto você consegue entender.",
                        " "], 50, 800, 4, f6)
        }

        function f6() {
            mudarTexto(["Meu Deus…", " "], 50, 800, 0, alex6)
        }

        function alex6() {
            mudarTexto(["Durante esse último ano ele me perseguia, e não fez o  que fez uma vez só. Eu mudei meus horários, mas não podia  sair do colégio, é o melhor da cidade.",
                        "Me afastei de você também, porque estava sempre com ele.",
                        " "], 50, 800, 4, f7)
        }

        function f7() {
            mudarTexto(["Eu não sabia que ele era assim…", " "], 50, 800, 0, alex7)
        }

        function alex7() {
            mudarTexto(["Na festa de ontem eu fui comprar chicletes na loja de conve-  niência do posto atrás da casa da Rachel.",
                        "Billy apareceu, bêbado e puto, reclamando que alguém na festa  tinha estragado o carro dele. Eu não sabia pra onde fugir.  Ele me viu e recebi aquele mesmo olhar. Eu fiquei com medo.",
                       " "], 50, 800, 4, f8)
        }

        function f8() {
            mudarTexto(["E como veio parar aqui?", " "], 50, 800, 0, alex8)
        }

        function alex8() {
            mudarTexto(["Ele me arrastou até aqui, tentou de novo. Me prendeu entre ele  e uma árvore. Eu estava com medo, mas não ia deixar  ele tocar em mim de novo.", " "], 50, 800, 4, f9)
        }

        function f9() {
            mudarTexto(["E o que você fez?", " "], 50, 800, 0, alex9)
        }

        function alex9() {
            mudarTexto(["Peguei um galho que estava perto da minha mão.", "Acertei o olho dele duas ou três vezes. Achei que ele so tivesse caído, mas esperei por muito tempo e ele não se mexeu, então eu fugi, mas… ele ainda deve  estar ali.",
                        "Não sei o que fazer…",
                        " "], 50, 800, 4, f10)
        }

        function f10() {
            mudarTexto(["Ei, calma, você fez o que foi preciso.", " "], 50, 800, 0, alex10)
        }

        function alex10() {
            mudarTexto(["Eu posso ter MATADO alguém, Freddie!! Matado Billy...", " "], 50, 800, 4, f11)
        }

        function f11() {
            mudarTexto(["Foi legítima defesa, Alex. Onde ele estava? Vamos até lá.", " "], 50, 800, 0, alex11)
        }

        function alex11() {
            mudarTexto(["Ta bem... É só seguir o caminho da floresta", " "], 50, 800, 4, placa)
        }

        function placa() {
            var placa = game.add.image(709, 317, "placa");
            placa.alpha = 1.0;
            placa.inputEnabled = true;
            placa.input.useHandCursor = true;
            placa.events.onInputDown.add(floresta2, this);
        }

        function floresta2() {
            fundo = game.add.image(0, 0, "floresta2");
            var dialogo = game.add.image(0, 500, "dialogo");
            dialogo.alpha = 0.7;
            alex.kill();
            var alexnaoclicavel = game.add.sprite(350, 200, "alex");
            alexnaoclicavel.animations.add('chorar', [0, 1, 2, 3], 4, true);
            alexnaoclicavel.animations.play("chorar");
            

            var sangue = game.add.image(450, 376, "sangue");
            sangue.width = 100;
            sangue.height = 100;
            sangue.alpha = 1.0;
            sangue.inputEnabled = true;
            sangue.input.useHandCursor = true;
            sangue.events.onInputDown.add(function () {
                mudarTexto(["Alex, cadê ele?", " "], 50, 800, 0, alex12)
            })

            function alex12() {
                mudarTexto(["Ele… estava aqui, eu juro!", " "], 50, 800, 4, f13)
            }

            function f13() {
                mudarTexto(["Ele fez essa merda toda e não consegue nem arcar com as  consequências, cadê esse filho da-",
                           " "], 50, 0, 0, passos)
            }

            function passos() {
                var audiopassos = game.add.audio("passos", 1.0, false);
                audiopassos.play()
                setTimeout(function () {
                    mudarTexto(["Que barulho foi esse? Freddie...", " "], 50, 800, 4, mudarTexto(["Aleeex... Eu posso te ouvir", " "], 10, 800, 5, function () {
                        setTimeout(billyaparece)
                }, 3000))
            })

            function billyaparece() {
                var billy = game.add.sprite(470, 188, "billy");
                billy.alpha = 0;
                game.add.tween(billy).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
                setTimeout(function () {
                    game.state.start("Tela9")
                }, 1500)
                }
            }
        }
    }
} //zelia ama a sophia s2

function Tela9(game) {
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

        document.getElementById("titles").className = "titles";
        
        game.load.image("creditos", "imagens/creditos.png");
    }

    this.create = function () {
        imgMochila.style.display = "none";
        fundo = game.add.image(0, 0, "creditos");
    }
}



// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.add("Tela1", Tela1);
game.state.add("Tela2", Tela2);
game.state.add("Tela3", Tela3);
game.state.add("Tela4", Tela4);
game.state.add("Tela5", Tela5);
game.state.add("Tela6", Tela6);
game.state.add("Tela7", Tela7);
game.state.add("Tela8", Tela8);
game.state.add("Tela9", Tela9);

window.WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        setTimeout(function () {
            game.state.start("TelaInicial"); //GAME STARTING ON WRONG SCREEN FOR TESTING PURPOSES
        }, 500);
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Press+Start+2P']
    }
}
