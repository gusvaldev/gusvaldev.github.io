const url = window.location;
const host = url.href.split("?")[0],
  formDatosProblema = document.getElementById("datos-problema"),
  formCoeficientesProblema = document.getElementById("formulario-problema"),
  divEcuaciones = document.getElementById("ecuaciones"),
  divResultados = document.getElementById("resultados-simplex"),
  botonreset = document.getElementById("reset-boton");
let nroVariables, nroRestricciones, maxminSeleccionado;
class Interfaz {
  insertarFormularios(variable, restriccion) {
    let contenido = "",
      noNegatividad = "";
    contenido +=
      '<div><p><label >Objetivo:</label><select name="seleccionar-objetivo" id="seleccionar-objetivo" class="combo" required="required" aria-required="true"><option value="Maximizar">Maximizar</option><option value="Minimizar">Minimizar</option></select></p></div><h3>Función Objetivo: </h3><p>';
    for (let i = 1; i <= variable; i++)
      (contenido += `<input autocomplete="off" type="text" id="x${i}" class=" inputs" pattern="[-]?[0-9]+[/.]?[0-9]*" title="Sólo se aceptan números enteros, decimales (con punto) y fracciones"><label for="x${i}">X<sub>${i}</sub></label>+`),
        (noNegatividad += `X<sub>${i}</sub>, `);
    contenido = `${contenido.slice(0, -1)}</p><h3>Restricciones</h3>`;
    for (let i = 1; i <= restriccion; i++) {
      contenido += `<p><strong>Restricción ${i}:</strong></p><p>`;
      for (let j = 1; j <= variable; j++)
        contenido += `<input autocomplete="off" type="text" id="x${i}-${j}" class=" inputs" pattern="[-]?[0-9]+[/.]?[0-9]*" title="Sólo se aceptan números enteros, decimales (con punto) y fracciones"><label for="x${i}-${j}">X<sub>${j}</sub></label>+`;
      contenido = `${contenido.slice(
        0,
        -1
      )}<select id="signo${i}" class="signo-restriccion combo"><option value="≤">≤</option><option value="≥">≥</option><option value="=">=</option></select><input autocomplete="off" type="text" id="y${i}" class=" inputs" pattern="[-]?[0-9]+[/.]?[0-9]*" title="Sólo se aceptan números enteros, decimales (con punto) y fracciones"></p>`;
    }
    (contenido += `<p id="no-negatividad">${noNegatividad.slice(
      0,
      -2
    )} ≥ 0</p><button type="submit" class="btnAction" id="resolver-Simplex">Resolver</button><button type="reset" class="btnAction" id="reset-boton-problema">Limpiar</button>`),
      (formCoeficientesProblema.innerHTML = contenido);
  }
  insertarEcuacion(
    maxmin,
    objetivo,
    restricciones,
    signos,
    resultados,
    nrovar,
    nrohol,
    id
  ) {
    const div = document.createElement("div");
    div.id = id;
    let contenido = "",
      noNegatividad = "",
      h = 1,
      a = 1;
    (contenido += `<h4>Función Objetivo</h4><p><span class="texto-simplex">${maxmin}:</span> Z = `),
      objetivo.forEach(function (element, index) {
        0 == index
          ? ((contenido += `${element.toFraction()}X<sub>${index + 1}</sub> `),
            (noNegatividad += `X<sub>${index + 1}</sub>, `))
          : index < nrovar
          ? (-1 == element.s
              ? (contenido += `- ${element.mul(-1).toFraction()}X<sub>${
                  index + 1
                }</sub> `)
              : (contenido += `+ ${element.toFraction()}X<sub>${
                  index + 1
                }</sub> `),
            (noNegatividad += `X<sub>${index + 1}</sub>, `))
          : index < nrovar + nrohol
          ? (-1 == element.s
              ? (contenido += `- ${element
                  .mul(-1)
                  .toFraction()}S<sub>${h}</sub> `)
              : (contenido += `+ ${element.toFraction()}S<sub>${h}</sub> `),
            (noNegatividad += `S<sub>${h}</sub>, `),
            h++)
          : (-1 == element.s
              ? (contenido += `- ${element
                  .mul(-1)
                  .toFraction()}A<sub>${a}</sub> `)
              : (contenido += `+ ${element.toFraction()}A<sub>${a}</sub> `),
            (noNegatividad += `A<sub>${a}</sub>, `),
            a++);
      }),
      (contenido += "</p><h4>Sujeto a:</h4>");
    for (let i = 0; i < restricciones.length; i++) {
      let hh = 1,
        aa = 1;
      (contenido += "<p>"),
        restricciones[i].forEach(function (element, index) {
          0 == index
            ? (contenido += `${element.toFraction()}X<sub>${index + 1}</sub> `)
            : index < nrovar
            ? -1 == element.s
              ? (contenido += `- ${element.mul(-1).toFraction()}X<sub>${
                  index + 1
                }</sub> `)
              : (contenido += `+ ${element.toFraction()}X<sub>${
                  index + 1
                }</sub> `)
            : index < nrovar + nrohol
            ? (-1 == element.s
                ? (contenido += `- ${element
                    .mul(-1)
                    .toFraction()}S<sub>${hh}</sub> `)
                : (contenido += `+ ${element.toFraction()}S<sub>${hh}</sub> `),
              hh++)
            : (-1 == element.s
                ? (contenido += `- ${element
                    .mul(-1)
                    .toFraction()}A<sub>${aa}</sub> `)
                : (contenido += `+ ${element.toFraction()}A<sub>${aa}</sub> `),
              aa++);
        }),
        (contenido += `${signos[i]} ${resultados[i].toFraction()}</p>`);
    }
    (contenido += `<p>${noNegatividad.slice(0, -2)} ≥ 0</p>`),
      (div.innerHTML = contenido),
      divEcuaciones.appendChild(div);
  }
  insertarTabla(pcostes, psolucion, matriz, indice, fase, vcostes, tabla) {
    const div = document.createElement("div");
    let contenido = "";
    (contenido +=
      0 == indice
        ? 1 == fase
          ? "<h3>Matriz Inicial Primera Fase</h3>"
          : 0 == fase
          ? "<h3>Matriz Inicial</h3>"
          : "<h3>Matriz Segunda Fase</h3>"
        : `<h3>Iteración ${indice}</h3>`),
      (contenido += `<div class="div-tabla"><table class="tabla-simplex" id="tabla-simplex-${tabla}"><tbody><tr><th class="encabezado-tabla esquina-tabla">Tabla ${
        indice + 1
      }</th><th class="encabezado-tabla">C<sub>j</sub></th>`);
    for (let i = 0; i < vcostes.length - 1; i++)
      contenido += `<td>${vcostes[i].toFraction()}</td>`;
    contenido +=
      '<td></td></tr><tr><th class="encabezado-tabla">C<sub>b</sub></th><th class="encabezado-tabla">Base</th>';
    for (let i = 0; i < matriz[0].length; i++)
      contenido += `<th class="encabezado-tabla">${pcostes[i]}</th>`;
    for (let i = 0; i < matriz.length; i++)
      i < matriz.length - 1
        ? (contenido += `<tr><td>${vcostes[
            psolucion[i][1]
          ].toFraction()}</td><th class="encabezado-tabla">${
            psolucion[i][0]
          }</th>`)
        : (contenido += '<tr><td></td><th class="encabezado-tabla">Z</th>'),
        matriz[i].forEach(function (element) {
          contenido += `<td>${element.toFraction()}</td>`;
        }),
        (contenido += "</tr>");
    (contenido += "</tbody></table></div>"),
      (div.innerHTML = contenido),
      divResultados.appendChild(div);
  }
  mostrarMensaje(mensaje, tipo) {
    const div = document.createElement("div");
    "error" === tipo
      ? div.classList.add("mensaje", "error")
      : "correcto" === tipo
      ? div.classList.add("mensaje", "correcto")
      : div.classList.add("mensaje", "intermedio"),
      (div.innerHTML = `${mensaje}`),
      divResultados.appendChild(div);
  }
  btnEditar(texto, contenedor, id) {
    const botonEditar = document.createElement("a");
    (botonEditar.classList = "editar"),
      (botonEditar.id = id),
      (botonEditar.innerText = texto),
      contenedor.insertBefore(botonEditar, contenedor.children[0]);
  }
  btnNuevoProblema() {
    const botonNuevo = document.createElement("a");
    (botonNuevo.classList = "nuevo-problema"),
      (botonNuevo.innerText = ""),
      (botonNuevo.id = "nuevo-problema"),
      divEcuaciones.insertBefore(botonNuevo, divEcuaciones.children[0]),
      botonNuevo.addEventListener("click", function (e) {
        formDatosProblema.reset(),
          (formDatosProblema.style.display = "block"),
          (formCoeficientesProblema.innerHTML = ""),
          (divEcuaciones.innerHTML = ""),
          (divResultados.innerHTML = "");
      });
  }
  explicacion(dosfases, signos, resultado) {
    const div = document.createElement("div");
    div.id = "explicacion";
    let contenido = "";
    contenido +=
      "<ul>";
    let h = 1,
      a = 1;
    for (let i = 0; i < signos.length; i++)
      "≤" == signos[i]
        ? resultado[i] >= 0
          ? ((contenido += '',
            h++))
          : ((contenido += ``),
            h++,
            a++)
        : "≥" == signos[i]
        ? resultado[i] > 0
          ? ((contenido += ``),
            h++,
            a++)
          : ((contenido += ``),
            h++)
        : resultado[i] >= 0
        ? ((contenido += ``),
          a++)
        : ((contenido += ``),
          a++);
    dosfases &&
      (contenido +=
        ""),
      (contenido +=
        ""),
      (div.innerHTML = contenido),
      divEcuaciones.appendChild(div);
  }
  
}
class Problema {
  constructor(
    maxmin,
    funcionObjetivo,
    restriccion,
    signos,
    resultado,
    dosfases
  ) {
    (this.maxmin = maxmin),
      (this.restriccion = clonar(restriccion)),
      (this.funcionObjetivo = clonar(funcionObjetivo)),
      (this.signos = signos.slice()),
      (this.dosfases = dosfases),
      (this.resultado = clonar(resultado)),
      (this.nuevafo = new Array()),
      (this.nuevarestriccion = new Array()),
      (this.matriz = clonar(restriccion)),
      (this.matrizfinal = new Array()),
      (this.artificiales = new Array()),
      (this.holguras = new Array()),
      (this.v_costes = new Array()),
      (this.v_solucion = new Array()),
      (this.v_costesreducidos = new Array()),
      (this.posicion_costes = new Array()),
      (this.posicion_solucion = new Array());
    for (let i = 0; i < this.restriccion.length; i++) {
      let provisional = new Array();
      if ("=" != this.signos[i])
        for (let j = 0; j < this.restriccion.length; j++)
          i == j && "≥" == this.signos[i]
            ? (provisional[provisional.length] = Fraction(-1))
            : i == j && "≤" == this.signos[i]
            ? (provisional[provisional.length] = Fraction(1))
            : (provisional[provisional.length] = Fraction(0));
      provisional.length > 0 && this.holguras.push(provisional);
    }
    if (this.holguras.length > 0)
      for (let i = 0; i < this.holguras.length; i++)
        for (let j = 0; j < this.holguras[0].length; j++)
          this.matriz[j][this.matriz[j].length] = this.holguras[i][j].clone();
    if (this.dosfases) {
      for (let i = 0; i < this.restriccion.length; i++) {
        let provisional = new Array();
        if ("≤" != this.signos[i])
          for (let j = 0; j < this.restriccion.length; j++)
            provisional[provisional.length] =
              j == i ? Fraction(1) : Fraction(0);
        provisional.length > 0 && this.artificiales.push(provisional);
      }
      for (
        let i = 0;
        i < this.funcionObjetivo.length + this.holguras.length;
        i++
      )
        this.v_costes[i] = Fraction(0);
      for (let i = 0; i < this.artificiales.length; i++)
        this.v_costes[this.v_costes.length] = Fraction(1);
      for (let i = 0; i < this.artificiales.length; i++)
        for (let j = 0; j < this.artificiales[0].length; j++)
          this.matriz[j][this.matriz[j].length] =
            this.artificiales[i][j].clone();
      for (let i = 0; i < this.funcionObjetivo.length; i++)
        this.posicion_costes[i] = `X<sub>${i + 1}</sub>`;
      for (let i = 0; i < this.holguras.length; i++)
        this.posicion_costes[this.posicion_costes.length] = `S<sub>${
          i + 1
        }</sub>`;
      for (let i = 0; i < this.artificiales.length; i++)
        this.posicion_costes[this.posicion_costes.length] = `A<sub>${
          i + 1
        }</sub>`;
      this.posicion_costes[this.posicion_costes.length] = "R";
      let s = 0,
        a = 0;
      for (let i = 0; i < this.signos.length; i++)
        "≤" == this.signos[i]
          ? ((this.posicion_solucion[i] = [
              `S<sub>${s + 1}</sub>`,
              this.funcionObjetivo.length + s,
            ]),
            s++)
          : "=" == this.signos[i]
          ? ((this.posicion_solucion[i] = [
              `A<sub>${a + 1}</sub>`,
              this.funcionObjetivo.length + this.holguras.length + a,
            ]),
            a++)
          : ((this.posicion_solucion[i] = [
              `A<sub>${a + 1}</sub>`,
              this.funcionObjetivo.length + this.holguras.length + a,
            ]),
            a++,
            s++);
    } else {
      for (let i = 0; i < this.funcionObjetivo.length; i++)
        this.v_costes[i] = this.funcionObjetivo[i].clone();
      for (let i = 0; i < this.holguras.length; i++)
        this.v_costes[this.v_costes.length] = Fraction(0);
      for (let i = 0; i < this.funcionObjetivo.length; i++)
        this.posicion_costes[i] = `X<sub>${i + 1}</sub>`;
      for (let i = 0; i < this.holguras.length; i++)
        this.posicion_costes[this.posicion_costes.length] = `S<sub>${
          i + 1
        }</sub>`;
      this.posicion_costes[this.posicion_costes.length] = "R";
      for (let i = 0; i < this.restriccion.length; i++)
        this.posicion_solucion[i] = [
          `S<sub>${i + 1}</sub>`,
          this.funcionObjetivo.length + i,
        ];
    }
    for (let i = 0; i < this.posicion_solucion.length; i++)
      this.v_solucion[i] = this.v_costes[this.posicion_solucion[i][1]].clone();
    (this.nuevafo = clonar(this.v_costes)),
      (this.v_costes[this.v_costes.length] = Fraction(0)),
      (this.nuevarestriccion = clonar(this.matriz));
    for (let i = 0; i < this.resultado.length; i++)
      this.matriz[i][this.matriz[i].length] = this.resultado[i].clone();
    this.vectorSolucion(),
      (this.matrizfinal = clonar(this.matriz)),
      this.matrizfinal.push(clonar(this.v_costesreducidos));
  }
  vectorSolucion() {
    for (let i = 0; i < this.v_costes.length; i++) {
      this.v_costesreducidos[i] = Fraction(0);
      for (let j = 0; j < this.matriz.length; j++)
        this.v_costesreducidos[i] = this.v_costesreducidos[i].add(
          this.matriz[j][i].clone() * this.v_solucion[j].clone()
        );
      this.v_costesreducidos[i] = this.v_costesreducidos[i].sub(
        this.v_costes[i].clone()
      );
    }
  }
  condicionOptimalidad() {
    let evaluar = clonar(this.v_costesreducidos);
    evaluar.pop();
    let optimalidad = new Boolean();
    return (
      (optimalidad =
        "Maximizar" == arguments[0]
          ? evaluar.every((element) => element >= 0)
          : evaluar.every((element) => element <= 0)),
      optimalidad
    );
  }
  varEntrante() {
    let evaluar = clonar(this.v_costesreducidos),
      columnapivote;
    return (
      evaluar.pop(),
      (columnapivote =
        "Maximizar" == arguments[0]
          ? Number(evaluar.indexOf(minimo(evaluar)))
          : Number(evaluar.indexOf(maximo(evaluar)))),
      columnapivote
    );
  }
  condicionFactibilidad() {
    let evaluar = new Array(),
      columnapivote = this.varEntrante(arguments[0]);
    for (let i = 0; i < this.matriz.length; i++)
      this.matriz[i][columnapivote] > 0
        ? (evaluar[i] = this.matriz[i][this.matriz[0].length - 1].div(
            this.matriz[i][columnapivote]
          ))
        : (evaluar[i] = Fraction(-1));
    let factibilidad = new Boolean();
    return (
      (factibilidad = evaluar.every((element) => element < 0)), factibilidad
    );
  }
  varSale() {
    let filapivote,
      columnapivote = this.varEntrante(arguments[0]),
      evaluar = new Array();
    for (let i = 0; i < this.matriz.length; i++)
      this.matriz[i][columnapivote] > 0
        ? (evaluar[i] = this.matriz[i][this.matriz[0].length - 1].div(
            this.matriz[i][columnapivote]
          ))
        : (evaluar[i] = 1 / 0);
    return (
      (filapivote = Number(evaluar.indexOf(minimopositivo(evaluar)))),
      filapivote
    );
  }
  iterar() {
    const columnapivote = this.varEntrante(arguments[0]),
      filapivote = this.varSale(arguments[0]),
      pivote = this.matrizfinal[filapivote][columnapivote];
    (this.posicion_solucion[filapivote][0] =
      this.posicion_costes[columnapivote]),
      (this.posicion_solucion[filapivote][1] = columnapivote);
    for (let i = 0; i < this.matrizfinal[0].length; i++)
      this.matrizfinal[filapivote][i] =
        this.matrizfinal[filapivote][i].div(pivote);
    for (let i = 0; i < this.matrizfinal.length; i++) {
      let elementocolumnapivote = this.matrizfinal[i][columnapivote].clone();
      if (i != filapivote)
        for (let j = 0; j < this.matrizfinal[0].length; j++)
          this.matrizfinal[i][j] = this.matrizfinal[i][j].sub(
            elementocolumnapivote.mul(this.matrizfinal[filapivote][j])
          );
    }
    return (
      (this.matriz = clonar(this.matrizfinal)),
      (this.v_costesreducidos = this.matriz.pop()),
      this.matrizfinal
    );
  }
  multiple() {
    let multiple = 0,
      evaluar = clonar(this.v_costesreducidos).slice(0, -1);
    for (let i = 0; i < evaluar.length; i++) 0 == evaluar[i] && (multiple += 1);
    return (
      (multiple > this.restriccion.length &&
        0 != this.v_costesreducidos[this.v_costesreducidos.length - 1]) ||
      multiple == evaluar.length
    );
  }
  acotadoPrimeraFase() {
    const a = clonar(this.matrizfinal).pop().pop();
    return 0 == a;
  }
  artificialenlabase() {
    let a = new Array(),
      en_Base = new Boolean();
    for (let i = 0; i < this.posicion_solucion.length; i++)
      a[i] = this.posicion_solucion[i][0].indexOf("A");
    if (((en_Base = a.every((element) => -1 == element)), en_Base)) return 0;
    {
      let b = 1,
        h = 0;
      for (let i = 0; i < a.length; i++)
        if (-1 != a[i]) {
          if (0 != this.matriz[i - h][this.matriz[i - h].length - 1]) {
            b = 2;
            break;
          }
          this.matriz.splice(i - h, 1),
            this.posicion_solucion.splice(i - h, 1),
            h++;
        }
      return b;
    }
  }
  matrizSegundaFase() {
    for (let i = 0; i < this.matriz.length; i++)
      this.matriz[i].splice(
        this.matriz[i].length - this.artificiales.length - 1,
        this.artificiales.length
      );
    this.posicion_costes.splice(
      this.posicion_costes.length - this.artificiales.length - 1,
      this.artificiales.length
    ),
      (this.v_costesreducidos = []),
      (this.v_costes = []);
    for (let i = 0; i < this.funcionObjetivo.length; i++)
      this.v_costes[i] = this.funcionObjetivo[i].clone();
    for (let i = 0; i < this.holguras.length + 1; i++)
      this.v_costes[this.v_costes.length] = Fraction(0);
    for (let i = 0; i < this.posicion_solucion.length; i++)
      this.v_solucion[i] = this.v_costes[this.posicion_solucion[i][1]].clone();
    return (
      this.vectorSolucion(),
      (this.matrizfinal = clonar(this.matriz)),
      this.matrizfinal.push(clonar(this.v_costesreducidos)),
      this.matrizfinal
    );
  }
}
if (url.search) {
  const problem = url.search.includes("?problem="),
    ejercicio = ampliar(problem ? url.search.slice(9) : url.search.slice(1));
  if (ejercicio) {
    history && history.pushState(null, "", host);
    const { co: co, cr: cr, r: r, s: s, o: o } = ejercicio;
    (document.getElementById("cantidad-variables").value = co.length),
      (document.getElementById("cantidad-restricciones").value = cr.length),
      crearFormularioCoeficientes(),
      (document.getElementById("seleccionar-objetivo").value = o);
    for (let i = 0; i < co.length; i++) {
      document.getElementById(`x${i + 1}`).value = co[i];
      for (let j = 0; j < cr.length; j++)
        (document.getElementById(`x${j + 1}-${i + 1}`).value = cr[j][i]),
          0 === i &&
            ((document.getElementById(`signo${j + 1}`).value = s[j]),
            (document.getElementById(`y${j + 1}`).value = r[j]));
    }
    const a = recogerDatos();
    calcular(
      a.coeficientesRestricciones,
      a.coeficientesObjetivo,
      a.signosRestricciones,
      a.resultadoRestricciones
    );
  }
}
function crearFormularioCoeficientes() {
  (nroVariables = Number(document.getElementById("cantidad-variables").value)),
    (nroRestricciones = Number(
      document.getElementById("cantidad-restricciones").value
    )),
    (divEcuaciones.innerHTML = ""),
    (formCoeficientesProblema.innerHTML = ""),
    (divResultados.innerHTML = "");
  const interfazusuario = new Interfaz();
  interfazusuario.insertarFormularios(nroVariables, nroRestricciones),
    (formDatosProblema.style.display = "none"),
    (formCoeficientesProblema.style.display = "block"),
    interfazusuario.btnEditar(
      "",
      formCoeficientesProblema,
      "editar-problema"
    ),
    editar(formCoeficientesProblema, formDatosProblema, divResultados);
}
function recogerDatos() {
  let coeficientesRestricciones = [],
    coeficientesObjetivo = [],
    signosRestricciones = [],
    resultadoRestricciones = [];
  const objetivo = document.getElementById("seleccionar-objetivo");
  maxminSeleccionado = objetivo.options[objetivo.selectedIndex].value;
  for (let i = 1; i <= nroVariables; i++)
    document.getElementById("x" + i).value.length > 0
      ? (coeficientesObjetivo[i - 1] = Fraction(
          document.getElementById("x" + i).value
        ))
      : (coeficientesObjetivo[i - 1] = Fraction(0));
  for (let i = 1; i <= nroRestricciones; i++) {
    let signoInput = document.getElementById(`signo${i}`);
    signosRestricciones[i - 1] =
      signoInput.options[signoInput.selectedIndex].value;
  }
  for (let i = 1; i <= nroRestricciones; i++) {
    let provisional = new Array();
    for (let j = 1; j <= nroVariables; j++)
      document.getElementById("x" + i + "-" + j).value.length > 0
        ? (provisional[j - 1] = Fraction(
            document.getElementById("x" + i + "-" + j).value
          ))
        : (provisional[j - 1] = Fraction(0));
    document.getElementById("y" + i).value.length > 0
      ? (resultadoRestricciones[i - 1] = Fraction(
          document.getElementById("y" + i).value
        ))
      : (resultadoRestricciones[i - 1] = Fraction(0)),
      coeficientesRestricciones.push(provisional);
  }
  return {
    coeficientesRestricciones: coeficientesRestricciones,
    coeficientesObjetivo: coeficientesObjetivo,
    maxminSeleccionado: maxminSeleccionado,
    signosRestricciones: signosRestricciones,
    resultadoRestricciones: resultadoRestricciones,
  };
}
function calcular(
  coeficientesRestricciones,
  coeficientesObjetivo,
  signosRestricciones,
  resultadoRestricciones
) {
  (divResultados.innerHTML = ""),
    (formCoeficientesProblema.style.display = "none"),
    (divEcuaciones.style.display = "block"),
    (divEcuaciones.innerHTML = "");
  let segundaFase = !1,
    fase,
    optimo = new Boolean();
  const signosigual = Array(nroRestricciones).fill("="),
    interfazusuario = new Interfaz();
  interfazusuario.insertarEcuacion(
    maxminSeleccionado,
    coeficientesObjetivo,
    coeficientesRestricciones,
    signosRestricciones,
    resultadoRestricciones,
    nroVariables,
    0,
    "ecuacion-inicial"
  ),
    interfazusuario.btnNuevoProblema(),
    interfazusuario.btnEditar(
      "",
      divEcuaciones,
      "editar-coeficientes"
    ),
    editar(divEcuaciones, formCoeficientesProblema, divResultados);
  let explicacionsignos = signosRestricciones.slice(),
    verificacionResultados = new Boolean(),
    explicacionresultados = clonar(resultadoRestricciones);
  if (
    ((verificacionResultados = resultadoRestricciones.every(
      (element) => element > "0"
    )),
    !verificacionResultados)
  )
    for (let i = 0; i < nroRestricciones; i++)
      if (resultadoRestricciones[i] <= 0) {
        if ("≤" == signosRestricciones[i] && 0 == resultadoRestricciones[i])
          continue;
        "≥" == signosRestricciones[i]
          ? (signosRestricciones[i] = "≤")
          : "≤" == signosRestricciones[i] && (signosRestricciones[i] = "≥");
        for (let j = 0; j < nroVariables; j++)
          coeficientesRestricciones[i][j] =
            coeficientesRestricciones[i][j].mul(-1);
        resultadoRestricciones[i] = resultadoRestricciones[i].mul(-1);
      }
  for (let i = 0; i < signosRestricciones.length; i++)
    ("≤" == signosRestricciones[i] && 1 != segundaFase) || (segundaFase = !0);
  (fase = segundaFase ? 1 : 0),
    verificacionResultados
      ? interfazusuario.explicacion(
          segundaFase,
          signosRestricciones,
          resultadoRestricciones
        )
      : interfazusuario.explicacion(
          segundaFase,
          explicacionsignos,
          explicacionresultados
        );
  const problema = new Problema(
    maxminSeleccionado,
    coeficientesObjetivo,
    coeficientesRestricciones,
    signosRestricciones,
    resultadoRestricciones,
    segundaFase
  );
  interfazusuario.insertarEcuacion(
    maxminSeleccionado,
    problema.nuevafo,
    problema.nuevarestriccion,
    signosigual,
    resultadoRestricciones,
    nroVariables,
    problema.holguras.length,
    "ecuacion-final"
  );
  let indice = 0,
    tabla = 1;
  if (
    ((divResultados.innerHTML = "<h2>Solución</h2>"),
    interfazusuario.insertarTabla(
      problema.posicion_costes,
      problema.posicion_solucion,
      problema.matrizfinal,
      indice,
      fase,
      problema.v_costes,
      tabla
    ),
    segundaFase)
  ) {
    let h = 0;
    for (; !problema.condicionOptimalidad("Minimizar") && h < 50; )
      if (!problema.condicionFactibilidad("Minimizar")) {
        const columnapivote = problema.varEntrante("Minimizar"),
          filapivote = problema.varSale("Minimizar"),
          pivote = problema.matrizfinal[filapivote][columnapivote].toFraction(),
          entra = problema.posicion_costes[columnapivote],
          sale = problema.posicion_solucion[filapivote][0];
        document
          .getElementById(`tabla-simplex-${tabla}`)
          .rows[filapivote + 2].cells[columnapivote + 2].classList.add(
            "pivote"
          ),
          interfazusuario.mostrarMensaje(
            `<p>Ingresa la variable <strong>${entra}</strong> y sale de la base la variable <strong>${sale}</strong>. El elemento pivote es <strong>${pivote}</strong></p>`,
            "intermedio"
          ),
          indice++,
          tabla++,
          problema.iterar("Minimizar"),
          interfazusuario.insertarTabla(
            problema.posicion_costes,
            problema.posicion_solucion,
            problema.matrizfinal,
            indice,
            fase,
            problema.v_costes,
            tabla
          ),
          h++;
      }
    tabla++, (indice = 0), (fase = 2);
    let b = problema.artificialenlabase();
    if (problema.acotadoPrimeraFase() && 2 != b)
      for (
        0 == b
          ? interfazusuario.mostrarMensaje(
              "<p>Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. Eliminamos las variables artificiales y pasamos a la segunda fase:</p>",
              "correcto"
            )
          : interfazusuario.mostrarMensaje(
              "<p>Se finalizaron las iteraciones de la primera fase y existen variables artificales en la base. Sin embargo, tienen valor 0, por lo que sus filas son linealmente dependientes y pueden eliminarse de la matriz. Pasamos a la segunda fase:</p>",
              "correcto"
            ),
          problema.matrizSegundaFase(),
          interfazusuario.insertarTabla(
            problema.posicion_costes,
            problema.posicion_solucion,
            problema.matrizfinal,
            indice,
            fase,
            problema.v_costes,
            tabla
          );
        !problema.condicionOptimalidad(maxminSeleccionado);

      ) {
        if (problema.condicionFactibilidad(maxminSeleccionado)) {
          const columnapivote = problema.varEntrante(maxminSeleccionado),
            entra = problema.posicion_costes[columnapivote];
          interfazusuario.mostrarMensaje(
            `<p>El problema tiene solución ilimitada (no acotada). La variable ${entra} debe entrar a la base pero ninguna variable puede salir.</p>`,
            "error"
          ),
            (optimo = !1);
          break;
        }
        {
          const columnapivote = problema.varEntrante(maxminSeleccionado),
            filapivote = problema.varSale(maxminSeleccionado),
            pivote =
              problema.matrizfinal[filapivote][columnapivote].toFraction(),
            entra = problema.posicion_costes[columnapivote],
            sale = problema.posicion_solucion[filapivote][0];
          document
            .getElementById(`tabla-simplex-${tabla}`)
            .rows[filapivote + 2].cells[columnapivote + 2].classList.add(
              "pivote"
            ),
            interfazusuario.mostrarMensaje(
              `<p>Ingresa la variable <strong>${entra}</strong> y sale de la base la variable <strong>${sale}</strong>. El elemento pivote es <strong>${pivote}</strong></p>`,
              "intermedio"
            ),
            indice++,
            tabla++,
            problema.iterar(maxminSeleccionado),
            interfazusuario.insertarTabla(
              problema.posicion_costes,
              problema.posicion_solucion,
              problema.matrizfinal,
              indice,
              fase,
              problema.v_costes,
              tabla
            ),
            (optimo = !0);
        }
      }
    else
      interfazusuario.mostrarMensaje(
        "<p>Se han finalizado las iteraciones de la primera fase y existen variables artificiales en la base con valores estrictamente mayor que 0, por lo que el problema no tiene solución (infactible).</p>",
        "error"
      ),
        (optimo = !1);
  } else
    for (; !problema.condicionOptimalidad(maxminSeleccionado); ) {
      if (problema.condicionFactibilidad(maxminSeleccionado)) {
        const columnapivote = problema.varEntrante(maxminSeleccionado),
          entra = problema.posicion_costes[columnapivote];
        interfazusuario.mostrarMensaje(
          `<p>El problema tiene solución ilimitada (no acotada). La variable ${entra} debe entrar a la base pero ninguna variable puede salir.</p>`,
          "error"
        ),
          (optimo = !1);
        break;
      }
      {
        const columnapivote = problema.varEntrante(maxminSeleccionado),
          filapivote = problema.varSale(maxminSeleccionado),
          pivote = problema.matrizfinal[filapivote][columnapivote].toFraction(),
          entra = problema.posicion_costes[columnapivote],
          sale = problema.posicion_solucion[filapivote][0];
        document
          .getElementById(`tabla-simplex-${tabla}`)
          .rows[filapivote + 2].cells[columnapivote + 2].classList.add(
            "pivote"
          ),
          interfazusuario.mostrarMensaje(
            `<p>Ingresa la variable <strong>${entra}</strong> y sale de la base la variable <strong>${sale}</strong>. El elemento pivote es <strong>${pivote}</strong></p>`,
            "intermedio"
          ),
          indice++,
          tabla++,
          problema.iterar(maxminSeleccionado),
          interfazusuario.insertarTabla(
            problema.posicion_costes,
            problema.posicion_solucion,
            problema.matrizfinal,
            indice,
            fase,
            problema.v_costes,
            tabla
          ),
          (optimo = !0);
      }
    }
  const ultimaTabla = document.getElementById(`tabla-simplex-${tabla}`);
  if ((ultimaTabla && (ultimaTabla.id = "ultima-tabla"), optimo)) {
    let contenido = "",
      respuestas = new Array();
    for (let i = 0; i < problema.posicion_costes.length - 1; i++) {
      (respuestas[i] = new Array(2)),
        (respuestas[i][0] = problema.posicion_costes[i]),
        (respuestas[i][1] = 0);
      for (let j = 0; j < problema.posicion_solucion.length; j++)
        if (respuestas[i][0] === problema.posicion_solucion[j][0]) {
          respuestas[i][1] = problema.matriz[j][problema.matriz[j].length - 1]
            .clone()
            .toFraction();
          break;
        }
    }
    for (let i = 0; i < respuestas.length; i++)
      contenido += `${respuestas[i][0]}= ${respuestas[i][1]}, `;
    if (problema.multiple()) {
      let recta = "";
      coeficientesObjetivo.forEach(function (element, index) {
        0 == index
          ? (recta += `${element.toFraction()}X<sub>${index + 1}</sub> `)
          : -1 == element.s
          ? (recta += `- ${element.mul(-1).toFraction()}X<sub>${
              index + 1
            }</sub> `)
          : (recta += `+ ${element.toFraction()}X<sub>${index + 1}</sub> `);
      }),
        (recta += `= ${problema.v_costesreducidos[
          problema.v_costesreducidos.length - 1
        ].toFraction()}`),
        (contenido = `<p>Nos encontramos en un punto óptimo y hay variables no básicas con coste reducido igual a 0, por lo que existen múltiples valores para las variables de decisión que permiten obtener el valor óptimo de Z = ${problema.v_costesreducidos[
          problema.v_costesreducidos.length - 1
        ].toFraction()}, los cuáles están contenidos en el segmento de la recta: </p><p>${recta}</p><p>Una de las soluciones es:</p><p>${contenido.slice(
          0,
          -2
        )}</p>`);
    } else
      contenido = `<p>La solución óptima es Z = ${problema.v_costesreducidos[
        problema.v_costesreducidos.length - 1
      ].toFraction()}</p><p>${contenido.slice(0, -2)}</p>`;
    interfazusuario.mostrarMensaje(contenido, "correcto");
  }
  interfazusuario.enlaces({
    cr: atexto(coeficientesRestricciones),
    co: atexto(coeficientesObjetivo),
    s: signosRestricciones,
    r: atexto(resultadoRestricciones),
    o: maxminSeleccionado,
  }),
    divEcuaciones.scrollIntoView();
}
function editar(a, b, c) {
  a.children[0].addEventListener("click", function (e) {
    (a.style.display = "none"),
      (b.style.display = "block"),
      (c.innerHTML = ""),
      b.scrollIntoView();
  });
}
function atexto() {
  let a = new Array();
  if (1 == arguments.length && arguments[0] instanceof Array)
    if (arguments[0][0] instanceof Array)
      for (let i = 0; i <= arguments[0].length - 1; i++)
        (a[i] = []),
          arguments[0][i].forEach(function (element, index) {
            a[i][index] = element.toFraction();
          });
    else
      arguments[0].forEach(function (element, index) {
        a[index] = element.toFraction();
      });
  return a;
}
function clonar() {
  let a = new Array();
  if (1 == arguments.length && arguments[0] instanceof Array)
    if (arguments[0][0] instanceof Array)
      for (let i = 0; i < arguments[0].length; i++)
        (a[i] = []),
          arguments[0][i].forEach(function (element, index) {
            a[i][index] = element.clone();
          });
    else
      arguments[0].forEach(function (element, index) {
        a[index] = element.clone();
      });
  return a;
}
function maximo() {
  let a;
  if (1 == arguments.length && arguments[0] instanceof Array)
    if (arguments[0].length >= 2) {
      a = arguments[0][0];
      for (let i = 1; i <= arguments[0].length - 1; i++)
        a < arguments[0][i] && (a = arguments[0][i]);
    } else
      1 == arguments[0].length
        ? (a = arguments[0][0])
        : alert("No se puede calcular el máximo de un array vacío");
  return a;
}
function minimo() {
  let a;
  if (1 == arguments.length && arguments[0] instanceof Array)
    if (arguments[0].length >= 2) {
      a = arguments[0][0];
      for (let i = 1; i < arguments[0].length; i++)
        a > arguments[0][i] && (a = arguments[0][i]);
    } else
      1 == arguments[0].length
        ? (a = arguments[0][0])
        : alert("No se puede calcular el mínimo de un array vacío");
  return a;
}
function minimopositivo() {
  let a;
  if (1 == arguments.length && arguments[0] instanceof Array)
    if (((a = 1 / 0), arguments[0].length >= 2))
      for (let i = 0; i < arguments[0].length; i++)
        a > arguments[0][i] && arguments[0][i] >= 0 && (a = arguments[0][i]);
    else
      1 == arguments[0].length && arguments[0][0] >= 0
        ? (a = a = arguments[0][0])
        : alert("No se encuentra ningún valor positivo");
  return a;
}
function reducir(datos) {
  const string = JSON.stringify(datos),
    enlace = JSONCrush.crush(string);
  return enlace;
}
function ampliar(id) {
  let objeto;
  try {
    const uncrushed = JSONCrush.uncrush(decodeURIComponent(id));
    objeto = JSON.parse(uncrushed);
  } catch {
    objeto = null;
  }
  return "object" == typeof objeto && null !== objeto
    ? objeto
    : ((objeto = null), objeto);
}
formDatosProblema.addEventListener("submit", function (e) {
  e.preventDefault(), crearFormularioCoeficientes();
}),
  formCoeficientesProblema.addEventListener("submit", function (e) {
    e.preventDefault();
    const objeto = recogerDatos(),
      enlace = reducir({
        cr: atexto(objeto.coeficientesRestricciones),
        co: atexto(objeto.coeficientesObjetivo),
        s: objeto.signosRestricciones,
        r: atexto(objeto.resultadoRestricciones),
        o: objeto.maxminSeleccionado,
      });
    window.location.replace(host + "?problem=" + enlace);
  });
