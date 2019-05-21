"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");
var botao, botaoAbrirPc, botaoCriarInventario, botao3, botao4, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divInventario = document.getElementById("divInventario"),
    inventario = {};
var img, imagem, portao, carro, dialogo;
var frases = document.getElementById("frases");
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
for (var row = 0; row < n_rows; row++) {
    start_table[row] = new Array(n_cols);
}
var colours = "blue red green yellow pink purple".split(/\s+/);

function criarCarro() {
    carro = game.add.image(201, 223, "carro");
    carro.alpha = 1.0;
    carro.inputEnabled = true;
    carro.input.useHandCursor = true;
    carro.events.onInputDown.add(function () {
        mudarTexto(["É, o carro ainda está aqui...",
                       "E os pneus... Ué, parece que foram rasgados! Que estranho...",
                       " "], 50, 800, 0, notificacao2);
    });
}

function notificacao2() {
    document.getElementById("preto").style.display = "none";
    document.getElementById("telabloqueada").className = "";
    document.getElementById("horas").innerHTML = "17:14";
    document.getElementById("conteudo").innerHTML = "Ei, Freddie, descobriu...";
}

function proximo5() {
    botao = game.add.image(735, 5, "botao");
    botao.alpha = 1.0;
    botao.inputEnabled = true;
    botao.input.useHandCursor = true;
    botao.events.onInputDown.add(function () {
        abortarMudancaTexto();
        game.state.start("Tela5");
    })
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
            mudarTexto(["Acabei de lembrar que a última vez que eu vi o Billy foi logo \n\ antes dele sair com a Rachel",
                           "eu deveria ir no trabalho dela ver se ela sabe de alguma coisa",
                           " "], 50, 800, 0, function () {
                fecharPc();
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
    } else {
        divInventario.style.display = "none";
    }
}

function itemInventarioClicado(nomeItem) {
    img.className = "usavel";
    toggleDivInventario();
}

function mudarTexto(texto, intervalo, pausaEntreFrases, personagem, callback) {
    if (mudandoTexto) {
        return;
    }
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
        frases.style.color = "#e00201";
    }
    if (!pausaEntreFrases || pausaEntreFrases <= 10) {
        pausaEntreFrases = 100;
    }

    function proximo() {
        if (mudandoTextoAbortado === true) {
            return;
        }
        frases.textContent = frase.substr(0, i);
        i++;
        if (i <= frase.length) {
            ultimoTimeoutDefinido = setTimeout(proximo, intervalo);
        } else {
            i = 0;
            fraseAtual++;
            if (fraseAtual >= quantidade) {
                mudandoTexto = false;
                ultimoTimeoutDefinido = 0;
                if (callback)
                    callback();
            } else {
                frase = vetor[fraseAtual];
                ultimoTimeoutDefinido = setTimeout(proximo, pausaEntreFrases);
            }
        }
    }
    proximo();
}

function abortarMudancaTexto() {
    frases.textContent = "";
    mudandoTextoAbortado = true;
    if (ultimoTimeoutDefinido !== 0) {
        clearTimeout(ultimoTimeoutDefinido);
        ultimoTimeoutDefinido = 0;
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
            togglePuzzle();
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
        "Ah sim, lembro de um garoto assim, estava mesmo alterado. Foi \n\ ali pra floresta, com uma garota.",
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
        game.load.image("quartofred", "imagens/quartofred.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("porta", "imagens/porta.png");
        game.load.image("portaaberta", "imagens/portaaberta.png");
        game.load.image("caneca", "imagens/caneca.png");
        game.load.image("chavepequena", "imagens/chavepequena.png");
        game.load.image("armario", "imagens/armario.png");
        game.load.image("caixa", "imagens/caixa.png");
        game.load.image("vaso", "imagens/vaso.png");
    }

    var tween = null;
    var popup;
    var inventarioCriado;

    setTimeout(function () {
        mudarTexto([
            "Ughh... eu não devia ter bebido tanto ontem...",
            "11:40... acho que ainda dá pra dormir mais um pouc-",
            "Espera, alex mandou mensagem?? a gente não se fala há tanto \n\ tempo. vou ter que responder!",
            " "
        ], 50, 800, 0);
    }, 6100);

    document.getElementById("msg1").style.display = "block";

    function criarInventario() {
        inventarioCriado = true;
        botaoCriarInventario.kill();
        var imgMochila = document.getElementById("imgMochila");
        imgMochila.style.display = "";
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
            mudarTexto(["Ah, minha caneca, espero que não tenha quebrado... pera, caiu \n\ alguma coisa",
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
            if (itemEstaNoInventario("chave")) {
                porta.kill();
                removerDoInventario("chave");
                var portaaberta = game.add.image(0, 180, "portaaberta");
                portaaberta.height = 320;
                var botao = game.add.image(735, 5, "botao");
                botao.alpha = 1.0;
                botao.inputEnabled = true;
                botao.input.useHandCursor = true;
                botao.events.onInputDown.add(function () {
                    abortarMudancaTexto();
                    game.state.start("Tela2");
                });
            } else {
                mudarTexto(["Nossa, eu tranquei a porta? Nunca faço isso... devia estar \n\ muito louco. Mas cadê a chave?",
                            " "], 50, 800)
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
        game.load.image("quartobilly", "imagens/quartobilly.png");
        game.load.image("botao", "imagens/botao.png");
        game.load.image("dialogo", "imagens/dialogo.png");
        game.load.image("avengers", "imagens/avengers.png");
        game.load.image("flash", "imagens/flash.png");
        game.load.image("estante", "imagens/estante.png");
    }

    function notificacao() {
        document.getElementById("preto").style.display = "none";
        document.getElementById("telabloqueada").className = "";
        document.getElementById("horas").innerHTML = "12:02";
        document.getElementById("conteudo").innerHTML = "desculpa pelo desencontro...";
    }

    function abrirPc() {
        fundopc.style.display = "block";
        fechar = game.add.image(740, 5, "fechar");
        fechar.inputEnabled = true;
        fechar.input.priorityID = 1;
        fechar.input.useHandCursor = true;
        fechar.events.onInputDown.add(fecharPc, this);
    }

    this.create = function () {

        var conteudo = document.getElementById('conteudo');
        conteudo.onclick = desbloquear;

        telaAtual = 0;
        botaoPodeClicar = true;
        mudandoTexto = false;

        fundo = game.add.image(0, 0, "quartobilly");

        setTimeout(function () {
            mudarTexto([
            "Olá? é o Freddie!",
            "Alex? Tia Hellen? Onde vocês estão?",
            "Ue, será que não tem ninguém em casa?",
            " "
            ], 50, 800, 0, notificacao);
        }, 1000);

        var avengers = game.add.image(467, 167, "avengers");
        avengers.alpha = 1.0;
        avengers.inputEnabled = true;
        avengers.input.useHandCursor = true;
        avengers.events.onInputDown.add(function () {
            mudarTexto(["Billy anda mesmo viciado em Avengers, não fala de outra coisa...",
                        " "], 50, 800)
        });

        var flash = game.add.image(366, 199, "vaso");
        flash.alpha = 1.0;
        flash.inputEnabled = true;
        flash.input.useHandCursor = true;
        flash.events.onInputDown.add(function () {
            mudarTexto(["Lembro que Flash era o herói favorito dele quando éramos \n\ crianças...",
                        " "], 50, 800)
        });
        var estante = game.add.image(0, 155, "estante");
        estante.alpha = 1.0;
        estante.inputEnabled = true;
        estante.input.useHandCursor = true;
        estante.events.onInputDown.add(function () {
            mudarTexto(["Nossa, até quadrinhos de Avengers ele tem. E Billy nem gosta \n\ muito de ler",
                        " "], 50, 800)
        });

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
    }

    this.create = function () {

        fundo = game.add.image(0, 0, "restaurante");
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;

        mudarTexto([
        "Freddie? Você por aqui?",
        " "
        ], 50, 800, 1, fred1);

        function fred1() {
            mudarTexto([
        "Oi, Rachel. Como vai?",
        " "
        ], 50, 800, 0, rachel1);
        }

        function rachel1() {
            mudarTexto([
        "Trabalhando muito",
        "Na verdade a minha festa de ontem acabou comigo, tive a sorte de \n\ não ter levado bronca dos meus pais.",
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
        "Bom, já estávamos ficando há algum tempo. Na festa ontem, lá \n\ em casa, ele pediu pra gente ficar... um pouco mais sério, \n\ se é que me entende",
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
        "Enfim, ele já tinha deixado o carro na garagem do meu pai, como \n\ a gente tinha planejado",
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
        "Só que quando chegamos lá, os dois bêbados, ele ficou muito \n\ bravo com alguma coisa e saiu sem mais nem menos.",
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
        "Não o vi mais. Também não sei o que deu errado. Até agora não \n\ sei o que deu nele.",
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
        "Claro, mas você vai precisar o portão com-",
        " "
        ], 50, 800, 1, chefe);
        }

        function chefe() {
            mudarTexto([
        "RACHEL!! esses copos não vão se lavar sozinhos",
        " "
        ], 50, 800, 3, rachel10);
        }

        function rachel10() {
            mudarTexto([
        "JA VOU",
        "Ai, desculpa, preciso trabalhar. Mas enfim, preste \n\ atenção nas cores",
        " "
        ], 50, 800, 1, proximo4)
        }

        function proximo4() {
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
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;

        var sliding = game.add.image(707, 190, "sliding");
        sliding.alpha = 1.0;
        sliding.inputEnabled = true;
        sliding.input.useHandCursor = true;
        sliding.events.onInputDown.add(toggleSliding, this);

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
    }
}

function Tela5(game) {
    var fred, cursors, cone1, cone2, cone3, cone4, cone5, cone6, bombaGas;
    var carro1, carro2, carro3, carro4, bicicleta, caminhao;


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
        game.load.image("fred", "imagens/cursor.png");
        game.load.image("carro1", "imagens/carro1.png");
        game.load.image("carro2", "imagens/carro2.png");
        game.load.image("botao", "imagens/botao.png");

        game.load.image("bombaGas", "imagens/bombaGas.png");
        game.load.image("carro3", "imagens/carro3.png");
        game.load.image("carro4", "imagens/carro4.png");
        game.load.image("bicicleta", "imagens/bicicleta.png");
        game.load.image("cone", "imagens/cone.png");
        game.load.image("caminhao", "imagens/caminhao.png");
    }

    this.create = function () {

        fundo = game.add.image(0, 0, "ruaPuzzle");

        var imgMochila = document.getElementById("imgMochila");
        imgMochila.style.display = "none";

        var dialogo = game.add.image(0, 0, "dialogo");
        dialogo.kill();

        bombaGas = game.add.sprite(5, -13, "bombaGas");
        game.physics.arcade.enable(bombaGas, Phaser.Physics.ARCADE);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();

        fred = game.add.sprite(400, 600, "fred");
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
        if (cursors.left.isDown) {
            fred.x -= 8;
            fred.scale.x = -1;
        } else if (cursors.right.isDown) {
            fred.x += 8;
            fred.scale.x = 1;
        }

        if (cursors.up.isDown) {
            fred.y -= 8;
        } else if (cursors.down.isDown) {
            fred.y += 8;
        }

        game.physics.arcade.overlap(carro1, fred, colisao, null, this);
        game.physics.arcade.overlap(fred, cone1, colisao, null, this);
        game.physics.arcade.overlap(fred, carro2, colisao, null, this);
        game.physics.arcade.overlap(fred, cone2, colisao, null, this);
        game.physics.arcade.overlap(fred, cone3, colisao, null, this);
        game.physics.arcade.overlap(fred, cone4, colisao, null, this);
        game.physics.arcade.overlap(fred, cone5, colisao, null, this);
        game.physics.arcade.overlap(fred, caminhao, colisao, null, this);
        game.physics.arcade.overlap(fred, bicicleta, colisao, null, this);
        game.physics.arcade.overlap(fred, carro3, colisao, null, this);
        game.physics.arcade.overlap(fred, carro4, colisao, null, this);
        game.physics.arcade.overlap(fred, bombaGas, proximo6, null, this);
    }

    function colisao() {
        fred.kill();
        game.state.start(game.state.current);
    }

    function proximo6() {
        botao = game.add.image(735, 5, "botao");
        botao.alpha = 1.0;
        botao.inputEnabled = true;
        botao.input.useHandCursor = true;
        botao.events.onInputDown.add(function () {
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
        game.load.image("canosimg", "imagens/puzzle.png");
        game.load.image("postoconcertado", "imagens/postoconcertado.png");
    }

    this.create = function () {
        fundo = game.add.image(0, 0, "posto");
        var dialogo = game.add.image(0, 500, "dialogo");
        dialogo.alpha = 0.7;
        var imgMochila = document.getElementById("imgMochila");
        imgMochila.style.display = "";

        mudarTexto([
        "Olá?",
        " "
        ], 50, 800, 0, cp1);

        function cp1() {
            mudarTexto([
        "O que quer aqui?",
        " "
        ], 50, 800, 2, freddie1);
        }

        function freddie1() {
            mudarTexto([
        "Ah, me disseram que um amigo apareceu aqui ontem a noite, cabelo \n\ castanho, quase da minha altura, provavelmente bêbado. \n\ Queria saber se você o viu…",
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
        "Alguns canos da loja de conveniência estão quebrados.\n\ Preciso que você conserte o caminho deles. Se fizer isso, \n\ eu digo se vi ou quando vi seu amigo.",
        " "
        ], 50, 800, 2, freddie3);
        }

        function freddie3() {
            mudarTexto([
        "Tá bom, então",
        " "
        ], 50, 800, 0);
        }


        var canosimg = game.add.image(275, 402, "canosimg");
        canosimg.anchor.set(0.5);
        canosimg.alpha = 1.0;
        canosimg.inputEnabled = true;
        canosimg.input.useHandCursor = true;
        canosimg.events.onInputDown.add(togglePuzzle, this);
    }
}

function Tela7(game) {
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

        game.load.image();
        game.load.image();
        game.load.image();
        game.load.image();
        game.load.image();
        game.load.image();
        game.load.image();
    }

    this.create = function () {

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
            game.load.image("floresta3", "imagens/floresta3.png");
        }

        this.create = function () {
            fundo = game.add.image(0, 0, "floresta1");
            var dialogo = game.add.image(0, 500, "dialogo");
            dialogo.alpha = 0.7;
            var imgMochila = document.getElementById("imgMochila");
            imgMochila.style.display = "";
        }


        // Os estados do jogo podem ser entendidos como "telas" ou "cenários"
        // Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
        // dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
        // executar jogo.state.start("Nome da tela") a qualquer momento)
        game.state.add("TelaInicial", TelaInicial);
        game.state.add("Tela2", Tela2);
        game.state.add("Tela3", Tela3);
        game.state.add("Tela4", Tela4);
        game.state.add("Tela5", Tela5);
        game.state.add("Tela6", Tela6);
        game.state.add("Tela7", Tela7);
        game.state.add("Tela8", Tela8);

        window.WebFontConfig = {
            //  'active' means all requested fonts have finished loading
            //  We set a 1 second delay before calling 'createText'.
            //  For some reason if we don't the browser cannot render the text the first time it's created.
            active: function () {
                setTimeout(function () {
                    game.state.start("Tela6"); //GAME STARTING ON WRONG SCREEN FOR TESTING PURPOSES
                }, 500);
            },

            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
                families: ['Press+Start+2P']
            }
        }
