var ultimoGrupoMostrado = "grupo1";
var clicando = false;
  function mostrarGrupo(nomeDoGrupo) {
    if (ultimoGrupoMostrado) {
      document.getElementById(ultimoGrupoMostrado).className = "escondido";
    }
    document.getElementById(nomeDoGrupo).className = "";
    ultimoGrupoMostrado = nomeDoGrupo;
  }
    
    function desbloquear() {
    document.getElementById("telabloqueada").className = "escondido";
    }

  function scroll(){
    var element = document.getElementById("chat")
    element.scrollBy(0, 100)
  }

  function clicar1a() {
    if (clicando === true) {
        return;
    }
    clicando = true;
    setTimeout(function () {document.getElementById("1a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg2").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo2"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar1b() {
    setTimeout(function () {document.getElementById("1b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg2").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo2"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar2a() {
    setTimeout(function () {document.getElementById("2a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg3").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo3"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar2b() {
    setTimeout(function () {document.getElementById("2b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg3").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo3"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar3a() {
    setTimeout(function () {document.getElementById("3a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg4").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo4"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar3b() {
    setTimeout(function () {document.getElementById("3b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg4").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo4"); clicando = false;}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar4a() {
    setTimeout(function () {document.getElementById("4a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg5").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("grupo4").className = "escondido"}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 3500) 
    setTimeout(function () {mudarTexto([
        "Acho bom pegar minha mochila, pode ser útil",
        " "
        ], 50, 800);
    }, 4000); 
    setTimeout(function () {scroll()}, 5100);  
    setTimeout(function () {document.getElementById("msg6").style.display = "block";}, 5150);
    setTimeout(function () {scroll()}, 5000);
    setTimeout(function () {document.getElementById("msg7").style.display = "block";}, 5200);
    setTimeout(function () {scroll()}, 5250);
    setTimeout(function () {mostrarGrupo("grupo7"); clicando = false;}, 5300)
    chat_terminado = true
  }  
  

  function clicar4b() {
    setTimeout(function () {document.getElementById("4b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg5").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("grupo4").className = "escondido"}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 3500) 
    setTimeout(function () {mudarTexto([
        "Acho bom pegar minha mochila, pode ser útil",
        " "
        ], 50, 800);
    }, 4000);  
    setTimeout(function () {scroll()}, 5100);  
    setTimeout(function () {document.getElementById("msg6").style.display = "block";}, 5150);
    setTimeout(function () {scroll()}, 5200);
    setTimeout(function () {document.getElementById("msg7").style.display = "block";}, 5250);
    setTimeout(function () {scroll()}, 5300);
    setTimeout(function () {mostrarGrupo("grupo7"); clicando = false;}, 5350)  
    chat_terminado = true 
  }

function clicar7a() {
    setTimeout(function () {document.getElementById("7a").style.display = "block" }, 500) 
    setTimeout(function () {document.getElementById("grupo7").className = "escondido"}, 1500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 1500)
    setTimeout(function () {mudarTexto([
        "Já cheguei aqui, não vou perder meu dia. Vou ver se encontro \n\ algo importante aqui",
        " "
        ], 50, 800);
    }, 2500);  
    setTimeout(function () {botaoAbrirPc = game.add.image(509, 359, "pc");
                            botaoAbrirPc.anchor.set(0.5);
                            botaoAbrirPc.alpha = 1.0;
                            botaoAbrirPc.inputEnabled = true;
                            botaoAbrirPc.input.useHandCursor = true;
                            botaoAbrirPc.events.onInputDown.add(abrirPc, this);
                            
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
                            });}, 2500)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("msg8").style.display = "block";}, 5000);
    setTimeout(function () {scroll()}, 5050);
    setTimeout(function () {mostrarGrupo("grupo8"); clicando = false;}, 5100)
    
}

function clicar7b() {
    setTimeout(function () {document.getElementById("7b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("grupo7").className = "escondido"}, 1500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 1500)
    setTimeout(function () {mudarTexto([
        "Já cheguei aqui, não vou perder meu dia. Vou ver se encontro \n\ algo importante aqui",
        " "
        ], 50, 800);
    }, 2500);  
    setTimeout(function () {botaoAbrirPc = game.add.image(509, 359, "pc");
                            botaoAbrirPc.anchor.set(0.5);
                            botaoAbrirPc.alpha = 1.0;
                            botaoAbrirPc.inputEnabled = true;
                            botaoAbrirPc.input.useHandCursor = true;
                            botaoAbrirPc.events.onInputDown.add(abrirPc, this);
                            
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
                            });}, 2500)   
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 2000) 
    setTimeout(function () {document.getElementById("msg8").style.display = "block"}, 5000);
    setTimeout(function () {scroll()}, 5050);
    setTimeout(function () {mostrarGrupo("grupo8"); clicando = false;}, 5100);
}

function clicar8a() {
    setTimeout(function () {document.getElementById("8a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("9a").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("msg10").style.display = "block" }, 3500)
    setTimeout(function () {document.getElementById("msg11").style.display = "block" }, 5000)
    setTimeout(function () {mostrarGrupo("grupo11"); clicando = false;}, 5500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
    setTimeout(function () {scroll()}, 3500)
    setTimeout(function () {scroll()}, 5000)
  }

function clicar8b() {
    setTimeout(function () {document.getElementById("8b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("9b").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("msg10").style.display = "block" }, 3500)
    setTimeout(function () {document.getElementById("msg11").style.display = "block" }, 5000)
    setTimeout(function () {mostrarGrupo("grupo11"); clicando = false;}, 5500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
    setTimeout(function () {scroll()}, 3500)
    setTimeout(function () {scroll()}, 5000)
  }

function clicar11a() {
    setTimeout(function () {document.getElementById("11a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("grupo11").className = "escondido"}, 2000)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 3500)
    setTimeout(function () {proximo5()}, 4000)
  }

function clicar11b() {
    setTimeout(function () {document.getElementById("11b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("grupo11").className = "escondido"}, 2000)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 3500) 
    setTimeout(function () {proximo5()}, 4000)
  }
