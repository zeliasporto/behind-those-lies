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
    setTimeout(function () {mostrarGrupo("grupo2")}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar2a() {
    setTimeout(function () {document.getElementById("2a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg3").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo3")}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar2b() {
    setTimeout(function () {document.getElementById("2b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg3").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo3")}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar3a() {
    setTimeout(function () {document.getElementById("3a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg4").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo4")}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
  }

  function clicar3b() {
    setTimeout(function () {document.getElementById("3b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg4").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo4")}, 2500)
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
    setTimeout(function () {mostrarGrupo("grupo7")}, 5300)
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
    setTimeout(function () {mostrarGrupo("grupo7")}, 5350)  
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
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("msg8").style.display = "block";}, 5000);
    setTimeout(function () {scroll()}, 5050);
    setTimeout(function () {mostrarGrupo("grupo8")}, 5100)
    
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
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 2000) 
    setTimeout(function () {document.getElementById("msg8").style.display = "block"}, 5000);
    setTimeout(function () {scroll()}, 5050);
    setTimeout(function () {mostrarGrupo("grupo8")}, 5100);
}

function clicar8a() {
    setTimeout(function () {document.getElementById("8a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("9a").style.display = "block" }, 3000)
    setTimeout(function () {document.getElementById("msg10").style.display = "block" }, 5500)
    setTimeout(function () {document.getElementById("msg11").style.display = "block" }, 8000)
    setTimeout(function () {mostrarGrupo("grupo11")}, 9500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 3000)
    setTimeout(function () {scroll()}, 5500)
    setTimeout(function () {scroll()}, 8000)
  }

function clicar8b() {
    setTimeout(function () {document.getElementById("8b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("9b").style.display = "block" }, 3000)
    setTimeout(function () {document.getElementById("msg10").style.display = "block" }, 5500)
    setTimeout(function () {document.getElementById("msg11").style.display = "block" }, 8000)
    setTimeout(function () {mostrarGrupo("grupo11")}, 9500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 3000)
    setTimeout(function () {scroll()}, 5500)
    setTimeout(function () {scroll()}, 8000)
  }

function clicar11a() {
    setTimeout(function () {document.getElementById("11a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("grupo11").className = "escondido"}, 3000)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 4500)
    setTimeout(function () {proximo5()}, 5000)
  }

function clicar11b() {
    setTimeout(function () {document.getElementById("11b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("grupo11").className = "escondido"}, 3000)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 4500) 
    setTimeout(function () {proximo5()}, 5000)
  }
