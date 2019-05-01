var ultimoGrupoMostrado = "grupo1";
  function mostrarGrupo(nomeDoGrupo) {
    if (ultimoGrupoMostrado) {
      document.getElementById(ultimoGrupoMostrado).className = "escondido";
    }
    document.getElementById(nomeDoGrupo).className = "";
    ultimoGrupoMostrado = nomeDoGrupo;
  }
    
    function desbloquear () {
    document.getElementById("telabloqueada").className = "escondido";
    document.getElementById("msg1").style.display = "block";
    }

  function scroll(){
    var element = document.getElementById("chat")
    element.scrollBy(0, 100)
  }

  function clicar1a() {
    setTimeout(function () {document.getElementById("1a").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg2").style.display = "block" }, 2000)
    setTimeout(function () {mostrarGrupo("grupo2")}, 2500)
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
  }

  function clicar4b() {
    setTimeout(function () {document.getElementById("4b").style.display = "block" }, 500)
    setTimeout(function () {document.getElementById("msg5").style.display = "block" }, 2000)
    setTimeout(function () {document.getElementById("grupo4").className = "escondido"}, 2500)
    setTimeout(function () {scroll()}, 500)
    setTimeout(function () {scroll()}, 2000)
    setTimeout(function () {document.getElementById("preto").style.display = "block" }, 3500) 
  }

