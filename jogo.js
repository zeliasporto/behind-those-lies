"use strict";
// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(800, 600, Phaser.AUTO, "divJogo");
var botao, botaoAbrirPc, botaoCriarInventario, botao3, botao4, fundo, botaoPodeClicar, telaAtual, telaDepoisDoFadeOut,
    divInventario = document.getElementById("divInventario"),
    inventario = {};
var img, imagem;
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
var peca1a = document.getElementById("peca1a");
var peca1b = document.getElementById("peca1b");
var peca2b = document.getElementById("peca2b");
var peca3b = document.getElementById("peca3b");
var peca3c = document.getElementById("peca3c");
var divInspecionar = document.getElementById("divInspecionar"),
    Inspecionar = {};
var PIECE_WIDTH = 250,
    PIECE_HEIGHT = 200,
    BOARD_COLS,
    BOARD_ROWS;

var piecesGroup,
    piecesAmount,
    shuffledIndexArray = [];

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
            mudarTexto(["acabei de lembrar que a última vez que eu vi o Billy foi logo \n\ antes dele sair com a Rachel",
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
    delete Inspecionar[nomeItem];
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
        ], 50, 800, 2, proxima);
}

function proxima() {
    botao = game.add.image(735, 5, "botao");
    botao.alpha = 1.0;
    botao.inputEnabled = true;
    botao.input.useHandCursor = true;
    botao.events.onInputDown.add(function () {
        abortarMudancaTexto();
        game.state.start("Tela6");
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
            "ughh... eu não devia ter bebido tanto ontem...",
            "11:40... acho que ainda dá pra dormir mais um pouc-",
            "espera, alex mandou mensagem?? a gente não se fala há tanto \n\ tempo. vou ter que responder!",
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
                mudarTexto(["não tem nada aqui...",
                        " "], 50, 800)
            });

            var caixa = game.add.image(549, 183, "caixa");
            caixa.alpha = 1.0;
            caixa.inputEnabled = true;
            caixa.input.useHandCursor = true;
            caixa.events.onInputDown.add(function () {
                mudarTexto(["não tem nada aqui...",
                        " "], 50, 800)
            });

            var vaso = game.add.image(364, 239, "vaso");
            vaso.alpha = 1.0;
            vaso.inputEnabled = true;
            vaso.input.useHandCursor = true;
            vaso.events.onInputDown.add(function () {
                mudarTexto(["não tem nada aqui...",
                        " "], 50, 800)
            });

            var caneca = game.add.image(390, 333, "caneca");
            caneca.width = 35;
            caneca.height = 29;
            caneca.alpha = 1.0;
            caneca.inputEnabled = true;
            caneca.input.useHandCursor = true;
            caneca.events.onInputDown.add(function () {
                mudarTexto(["ah, minha caneca, espero que não tenha quebrado... pera, caiu \n\ alguma coisa",
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
                        mudarTexto(["eu deveria pegar minha mochila antes de sair do meu quarto",
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
        "Bom, já estávamos ficando há algum tempo. Na festa ontem, lá \n\ em casa, ele pediu pra gente ficar... um pouco mais serio, \n\ se é que me entende",
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
        "Claro, mas você vai precisar abrir -",
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
        "Ai, desculpa, preciso trabalhar. Mas enfimm, você vai \n\ precisar abrir o portão",
        " "
        ], 50, 800, 1, proximo)
            }

            function proximo() {
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
            game.load.spritesheet("background", "imagens/cadeado.png", PIECE_WIDTH, PIECE_HEIGHT);
            game.load.image("sliding", "imagens/slidingimg.png"); // ***************
        }

        this.create = function () {
            fundo = game.add.image(0, 0, "garagem");
            var dialogo = game.add.image(0, 500, "dialogo");
            dialogo.alpha = 0.7;

            botao = game.add.image(735, 5, "botao");
            botao.alpha = 1.0;
            botao.inputEnabled = true;
            botao.input.useHandCursor = true;
            botao.events.onInputDown.add(function () {
                abortarMudancaTexto();
                game.state.start("Tela5");
                dialogo.kill();
            })

            var slidingimg = game.add.image(100, 100, "sliding");
            slidingimg.alpha = 1.0;
            slidingimg.inputEnabled = true;
            slidingimg.input.useHandCursor = true;
            slidingimg.events.onInputDown.add(toggleSliding, this);

            function toggleSliding() {
                prepareBoard();


                function prepareBoard() {
                    var piecesIndex = 0,
                        i, j,
                        piece;

                    BOARD_COLS = Math.floor(game.world.width / PIECE_WIDTH);
                    BOARD_ROWS = Math.floor(game.world.height / PIECE_HEIGHT);

                    piecesAmount = BOARD_COLS * BOARD_ROWS;
                    shuffledIndexArray = createShuffledIndexArray();
                    piecesGroup = game.add.group();

                    for (i = 0; i < BOARD_ROWS; i++) {
                        for (j = 0; j < BOARD_COLS; j++) {
                            if (shuffledIndexArray[piecesIndex]) {
                                piece = piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT, "background", shuffledIndexArray[piecesIndex]);
                            } else { //initial position of black piece
                                piece = piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT);
                                piece.black = true;
                            }
                            piece.name = 'piece' + i.toString() + 'x' + j.toString();
                            piece.currentIndex = piecesIndex;
                            piece.destIndex = shuffledIndexArray[piecesIndex];
                            piece.inputEnabled = true;
                            piece.events.onInputDown.add(selectPiece, this);
                            piece.posX = j;
                            piece.posY = i;
                            piecesIndex++;
                        }
                    }
                }

                function selectPiece(piece) {
                    var blackPiece = canMove(piece);

                    if (blackPiece) {
                        movePiece(piece, blackPiece);
                    }
                }

                function canMove(piece) {
                    var foundBlackElem = false;

                    piecesGroup.children.forEach(function (element) {
                        if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
                            element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
                            element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
                            element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
                            foundBlackElem = element;
                            return;
                        }
                    });
                    return foundBlackElem;
                }

                function movePiece(piece, blackPiece) {
                    var tmpPiece = {
                        posX: piece.posX,
                        posY: piece.posY,
                        currentIndex: piece.currentIndex
                    };

                    game.add.tween(piece).to({
                        x: blackPiece.posX * PIECE_WIDTH,
                        y: blackPiece.posY * PIECE_HEIGHT
                    }, 300, Phaser.Easing.Linear.None, true);

                    piece.posX = blackPiece.posX;
                    piece.posY = blackPiece.posY;
                    piece.currentIndex = blackPiece.currentIndex;
                    piece.name = 'piece' + piece.posX.toString() + 'x' + piece.posY.toString();

                    blackPiece.posX = tmpPiece.posX;
                    blackPiece.posY = tmpPiece.posY;
                    blackPiece.currentIndex = tmpPiece.currentIndex;

                    checkIfFinished();
                }

                function checkIfFinished() {
                    var isFinished = true;
                    piecesGroup.children.forEach(function (element) {
                        if (element.currentIndex !== element.destIndex) {
                            isFinished = false;
                            return;
                        }
                    });
                    if (isFinished) {
                        showFinishedText();
                    }
                }

                function showFinishedText() {
                    var style = {
                        font: "40px sans-serif",
                        fill: "#fff",
                        align: "center"
                    };
                    var text = game.add.text(game.world.centerX, game.world.centerY, "Desafio completo!", style);
                    text.anchor.set(0.5);
                }

                function createShuffledIndexArray() {
                    var indexArray = [];

                    for (var i = 0; i < piecesAmount; i++) {
                        indexArray.push(i);
                    }
                    return shuffle(indexArray);
                }

                function shuffle(array) {
                    var counter = array.length,
                        temp,
                        index;
                    while (counter > 0) {
                        index = Math.floor(Math.random() * counter);
                        counter--;
                        temp = array[counter];
                        array[counter] = array[index];
                        array[index] = temp;
                    }
                    return array;
                }
            }
            mudarTexto(["consegui!",
                   " "], 50, 800, 0, notificacao2);

            function notificacao2() {
                document.getElementById("preto").style.display = "none";
                document.getElementById("telabloqueada").className = "";
                document.getElementById("horas").innerHTML = "17:14";
                document.getElementById("conteudo").innerHTML = "Ei, Freddie, descobriu...";
            }
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
            game.physics.arcade.overlap(fred, bombaGas, proximaTela, null, this);
        }

        function colisao() {
            fred.kill();
            game.state.start(game.state.current);
        }

        function proximaTela() {
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
            game.load.image("canosimg", "imagens/puzzle.png"); //**************
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
        "Alguns canos dessa bomba nova de gasolina estão fora do lugar.\n\ Preciso que você acerte o caminho deles. Se fizer isso, \n\ eu digo se vi ou quando vi seu amigo.",
        " "
        ], 50, 800, 2, freddie3);
            }

            function freddie3() {
                mudarTexto([
        "Tá bom, então",
        " "
        ], 50, 800, 0);
        }
        

        var canosimg = game.add.image(100, 100, "canosimg");
        canosimg.anchor.set(0.5);
        canosimg.alpha = 1.0;
        canosimg.inputEnabled = true;
        canosimg.input.useHandCursor = true;
        canosimg.events.onInputDown.add(togglePuzzle, this);
    }
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
