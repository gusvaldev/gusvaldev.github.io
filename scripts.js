function soloNumeros(event) {
    // permite números, Enter y Tab
    if (event.keyCode == 8 || event.keyCode == 48 || event.keyCode == 9 || event.keyCode == 13 || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      return true;
    }
    // previene cualquier otro caracter
    event.preventDefault();
  }

function agregar() {

    let rest = document.getElementById("restricciones")
    let num_rest = rest.childElementCount;
    num_rest++;
  
    let nueva_rest = document.createElement("div");
    nueva_rest.classList.add("restriccion");
  
    nueva_rest.innerHTML = `
      <p>
        <input class="inputs" type="text" id="xRes${num_rest}" value="">
        X${num_rest}
        <select class="combo" name="signo" id="signo${num_rest}">
            <option value="mas">+</option>
            <option value="menos"->-</option>
        </select>
        <input class="inputs" type="text" id="yRes${num_rest}" value="">
        Y${num_rest}
        <select class="combo" name="igualdad" id="igualdad${num_rest}">
            <option value="mayorIgual">>=</option>
            <option value="menorIgual"-><=</option>
        </select>
        <input class="inputs" type="text" id="zRes${num_rest}" value="">
      </p>`;
    document.getElementById("restricciones").appendChild(nueva_rest);
  
}
function quitar() {
 
    let rest = document.getElementById("restricciones");
    let numHijos = rest.childElementCount;
    if (numHijos > 2) {
        let last = rest.lastElementChild;
        restricciones.removeChild(last);
    } 
}


let regionFactible = ""; 
function graficar() {
    regionFactible ="a : (";
    let restri_bien = [];
    restri_bien = convertirIgual();
  
  
    console.log(restri_bien);
  
    let ggbApp = new GGBApplet(
      {
        appName: "classic",
        width: 500,
        height: 500,
        showToolBar: false,
        showMenuBar: false,
        showAlgebraInput: false,
        enableShiftDragZoom: false,
        enableLabelDrags: false,
  
        appletOnLoad(api) {
        
          
          api.setRounding("2");
          for (let i = 0; i < restri_bien.length; i++) {
            api.evalCommand("R" + (i + 1) + " = (" + restri_bien[i] + ")");
            api.setLabelVisible("R" + (i + 1), true);
          }
       
          api.evalCommand(regionFactible + " x >0 ∧ y >0 )");
          api.setColor('a',81,0,93);
          //console.log(api.evalCommandCAS("Vertex(a)"));   
          let nombrePuntos = api.evalCommandGetLabels("Vertice = Vertex(a)").split(',');
          
          //console.log(nombrePuntos);
          nombrePuntos.forEach((element,index) => {
            api.setLabelStyle(element,1);
            console.log(element+": "+ api.getXcoord(element)+", "+ api.getYcoord(element));
            api.renameObject(element,String.fromCharCode(65+index));
          });
          //api.evalCommand(regionFactible + " x>0  ");
          let valoresMaximos = encontrarValoresMaximos(restri_bien);
          //void setCoordSystem(double xmin, double xmax, double ymin, double ymax)
          api.setCoordSystem(0, valoresMaximos.max_x, 0, valoresMaximos.max_y);
          console.log("llegue aqui pa");
          api.evalCommand()
        },
      },//257 x+450 y<3600 ∧ 61 x+73 y<730 ∧ 208 x+69 y<1250 ∧ x>0 ∧ y>0
      "ggbApplet"
    );
  
    ggbApp.inject("ggbApplet");
}

function convertirIgual() {
 
    //debugger;
    let rest_conca = [];
    rest_conca = obten_restric();
   // rest_aRG = obten_restric();
    let aux = "";
    for (let i = 0; i < rest_conca.length; i++) {
      aux = rest_conca[i];
      if (aux.includes("<=")) {
        aux = rest_conca[i].replace("<=", "=");
        
      } else if (aux.includes(">=")) {
        aux = rest_conca[i].replace(">=", "=");
     
        
      } else if (aux.includes("=")) {
        aux = rest_conca[i].replace("=", "=");
      }
      rest_conca[i] = aux;
    }
    return rest_conca;
  
  }
  function encontrarValoresMaximos(ecuaciones) {
    let max_x = -Infinity;
    let max_y = -Infinity;
  
    for (let i = 0; i < ecuaciones.length; i++) {
      const coeficientes = ecuaciones[i].match(/([-]?\d+)x\s*([-+]?\d+)y\s*=+\s*([-]?\d+)/);
  
      const x = coeficientes[1] ? coeficientes[3] / coeficientes[1] : 0;
      const y = coeficientes[2] ? coeficientes[3] / coeficientes[2] : 0;
  
      if (x > max_x && x!= Infinity ) {
        max_x = x;
      }
      else if(x==Infinity)
      {
        max_x+=max_x/5;
      }
      if (y > max_y && y!= Infinity) {
        max_y = y;
      }else if(y==Infinity)
      {
        max_y+=max_y/5;
      }
    }
  
    return { max_x, max_y };
  }
  var agregarRestriccion = 2;
  function obten_restric() {
    //debugger
    let restri = [];
    let cant = document.getElementById("restricciones");
    let cant2 = cant.childElementCount;
    let aux = "";
    for (let i = 1; i <= cant2; i++) {
      aux = aux + document.getElementById(`xRes${i}`).value;
      aux = aux + "x";
      aux =
        aux +
        document.getElementById(`signo${i}`).options[
          document.getElementById(`signo${i}`).selectedIndex
        ].text;
      aux = aux + document.getElementById(`yRes${i}`).value;
      aux = aux + "y";
      aux =
        aux +
        document.getElementById(`igualdad${i}`).options[
          document.getElementById(`igualdad${i}`).selectedIndex
        ].text;
      aux = aux + document.getElementById(`zRes${i}`).value;
     let regionFactibleaux= regionFactible + aux + " ∧ ";
      regionFactible= regionFactibleaux.replace("=","");
      restri.push(aux);
      aux = "";
      console.log(regionFactible);
    }
    return restri;
  }

  