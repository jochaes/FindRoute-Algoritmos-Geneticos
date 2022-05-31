/**
 * logica.js
 * 
 * Archivo que contendrá las cuatro clases principales de la aplicación.
 * 
 *  Clase Entorno: simulación del entorno de la aplicación en donde vivirán
 *                 los individuos.
 * 
 *  Clase Individuo: representa un individuo que se encuentra en el entorno.
 * 
 *  Clase Cola: abstracción de una cola de elementos básica.
 * 
 *  Clase Nodo: representa un nodo de una cola, solo tendrá el propósito de
 *              servir en el cálculo de la distancia mínima entre los puntos objetivo.
 */



/**
 * @class Entorno.
 * @classdesc Representa el entorno de juego en donde viviran los individuos.
 * @param {int} tamTablero Tamaño del tablero. (n x n)
 * @param {int} tamPoblacion Tamaño de la población.
 * @param {Array} puntoInicial Punto inicial de la población en la matriz.
 * @param {Array} puntoFinal Punto final de la población en la matriz.
 * @param {string} genInicial Genoma inicial de la población.
 * @param {double} prcObstaculos Probabilidad de que una celda sea obstaculo.
 * @param {double} prcMutacion Probabilidad de que un individuo mute.
 * @param {double} prcCruce Probabilidad de que un individuo cruce.
 * @param {int} maxGeneraciones Máximo de generaciones posibles.
 */

 class Entorno {
  /**
   * Constructor principal.
   * @description Representa el entorno en el que se va a desarrollar la simulación.
   */
  constructor(tamTablero, tamPoblacion, puntoInicial, puntoFinal, genInicial = "",
              prcObstaculos = 0.2, prcMutacion = 0.1, prcCruce = 0.15,
              maxGeneraciones = 500) {
    // Info. del entorno
    this.tamTablero = tamTablero;
    this.tamPoblacion = tamPoblacion;
    this.puntoInicial = puntoInicial;
    this.puntoFinal = puntoFinal;
    this.genInicial = genInicial;
    this.prcObstaculos = prcObstaculos;
    this.prcMutacion = prcMutacion;
    this.prcCruce = prcCruce;
    this.maxGeneraciones = maxGeneraciones;
    this.cantMovOptimos = -1;
    this.generacion = 0;
    this.encontroSolucion = false;
    // Entidades del entorno 
    this.tablero = [];
    this.poblacion = [];
    this.premios = [];
    this.individuoGanador = null;
    this.inicializar();
  }

  /** Inicialización del entorno de la simulación */
  inicializar() {
    this.crearTablero();
    this.tablero[this.puntoInicial[0]][this.puntoInicial[1]] = 2;
    this.tablero[this.puntoFinal[0]][this.puntoFinal[1]] = 3;
    this.calcularDistanciaMinima();
    while (this.cantMovOptimos < 0) {
      this.tablero = [];
      this.inicializar();
    }
  }

  /**
   * Intenta colocar un premio dada coordenadas del tablero.
   * @param {int} x Coordenada en x del tablero.
   * @param {int} y Coordenada en y del tablero.
   * @return {boolean} True, si el premio fue colocado. False si no lo fue.
   */
  colocarPremio(x, y) {
    if (x < 0 || x >= this.tamTablero || y < 0 || y >= this.tamTablero) { return false; }
    if (this.tablero == [] || this.tablero[x][y] != 0 || this.premios.length >= 5) { return false; }
    this.premios.push([x, y]);
    this.tablero[x][y] = 4;
    //console.log("listo");
    return true;
  }

  /** Genera la población inicial del entorno. */
  generarPoblacionBase() {
    //console.log("generando poblacion....")
    for (let i = 0; i < this.tamPoblacion; i++) {
      let ind = new Individuo(this, this.genInicial.split('').join(''), [this.puntoInicial[0], this.puntoInicial[1]], ("Individuo_" + i));
      this.poblacion.push(ind);
    }

  }

  /**
   * Simula una etapa del algoritmo genético, genera movimiento a cada uno
   * de los elementos de la población.
   * @returns {boolean} true si encontró la solución, false si no.
   */
  simularEtapa() {
    if (this.encontroSolucion) { return; console.log(`>>>>>>> Encontro solucion <<<<<<<`); }
    if (this.generacion == this.maxGeneraciones) { this.encontroSolucion = true; return; }
    this.generacion++;
    //console.log("~~~~~~~~~~~~~~~~~~~~~~~~\nGeneracion: " + this.generacion);
    for (let i = 0; i < this.poblacion.length; i++) {
      // borrar
      if (this.poblacion[i].posicion[0] == this.puntoFinal[0] && this.poblacion[i].posicion[1] == this.puntoFinal[1]) {
        this.individuoGanador = this.poblacion[i];
        this.encontroSolucion = true;
        return;
      }
      // borrar
      this.poblacion[i].posicion = [this.puntoInicial[0], this.puntoInicial[1]];
      this.poblacion[i].fitness = 0;
      this.poblacion[i].vivir();
      this.poblacion[i].calcularFitness();
      if (this.poblacion[i].fitness == 0 || (this.poblacion[i].posicion[0] == this.puntoFinal[0] && this.poblacion[i].posicion[1] == this.puntoFinal[1])) {
        if (this.individuoGanador != null) {
          if (this.individuoGanador.fitness > this.poblacion[i].fitness) { this.individuoGanador = this.poblacion[i]; this.encontroSolucion = true; }
        }
        else {
          this.encontroSolucion = true;
          this.individuoGanador = this.poblacion[i];
        }
      }
      //console.log(this.poblacion[i].etiqueta + " | " + this.poblacion[i].gen + " | " + this.poblacion[i].fitness + " | " + this.poblacion[i].posicion + " | " + this.poblacion[i].premiosObtenidos.length + " ~ " + this.poblacion[i].premiosObtenidos.toString());
    }

    if (!this.encontroSolucion) { this.generarNuevaPoblacion(); }
  }

  /** Genera una nueva población, considerando que ya se pasó una etapa inicial de la simulación. */
  generarNuevaPoblacion() {
    if (this.encontroSolucion) { return; console.log(`>>>>>>> Encontro solucion <<<<<<<`); }
    // Ordenamos a la población por fitness y se seleccionan los cuatro mejores.
    let poblacionOrdenada = this.poblacion.sort((a, b) => { return a.fitness - b.fitness; });
    let poblacionNueva = [];
    for (let i = 0; i < 4; i++) {
      poblacionOrdenada[i].etiqueta = "Individuo_" + i;
      poblacionNueva.push(poblacionOrdenada[i]);
    }
    // Genera la nueva población de la siguiente población. Considerando que sean individuos competentes.
    while (poblacionNueva.length < this.tamPoblacion) {
      let ind1 = poblacionOrdenada[Math.floor(Math.random() * 4)];
      let ind2 = poblacionOrdenada[Math.floor(Math.random() * 4)];
      let hijo = null;
      // Intentamos cruzar
      if (Math.random() * 1 < this.prcCruce) { hijo = ind1.cruzar(ind2); }
      if (hijo != null) { hijo = hijo.mutar(); } // cruce previo
      // Si no hubo cruce, ni mutación, se toma al mejor de los elegidos y derivamos al gen desde ahí.
      if (hijo == null) {
        hijo = new Individuo(this, poblacionNueva[0].gen.substring(0, Math.floor(poblacionNueva[0].gen.length / 2)), [this.puntoInicial[0], this.puntoInicial[1]], "Individuo_" + poblacionNueva.length);
        hijo.fitness = 0;
        hijo.premiosObtenidos = [];
        if (Math.random() * 1 < this.prcMutacion) { hijo = hijo.mutar(); }
      }
      hijo.vivir();
      hijo.calcularFitness();
      // Si el hijo que se originó es competente, lo agregamos a la población.
      if (hijo.posicion[0] == this.puntoFinal[0] && hijo.posicion[1] == this.puntoFinal[1] || hijo.fitness == 0) {
        hijo.etiqueta = "Individuo_" + poblacionNueva.length;
        poblacionNueva.push(hijo);
        this.encontroSolucion = true;
        continue;        
      }
      if (hijo.fitness < ((poblacionOrdenada[0].fitness + poblacionOrdenada[1].fitness) * 0.88)) {
        hijo.etiqueta = ("Individuo_" + poblacionNueva.length);
        poblacionNueva.push(hijo);
      }
    }
    this.poblacion = poblacionNueva;
  }

  /** Genera el tablero de la simulación, considerando los obstáculos y el tamaño del mismo. */
  crearTablero() {
    for (let i = 0; i < this.tamTablero; i++) {
      this.tablero[i] = [];
      for (let j = 0; j < this.tamTablero; j++) {
        if (i == 0 || i == this.tamTablero - 1 || j == 0 || j == this.tamTablero - 1) { this.tablero[i][j] = 1; }
        else {
          if (Math.random() < this.prcObstaculos) { this.tablero[i][j] = 1; }
          else { this.tablero[i][j] = 0; } 
        }
      }
    }
  }

  /** Imprime el tablero con formato para visualización fácil en consola. */
  imprimirTablero() {
    for (let i = 0; i < this.tamTablero; i++) {
      let linea = "";
      for (let j = 0; j < this.tamTablero; j++) {
        if (this.tablero[i][j] == 1) { linea += "# "; continue; }
        if (this.tablero[i][j] == 2) { linea += "I "; continue; }
        if (this.tablero[i][j] == 3) { linea += "F "; continue; }
        if (this.tablero[i][j] == 4) { linea += "O "; continue; }
        if (this.tablero[i][j] == 8) { linea += "\u00A4 "; continue; }
        if (this.tablero[i][j] == 9) { linea += "\u00D7 "; continue; }
        linea += "  ";
      }
      console.log(linea);
    }
  }

  /** Realiza el cálculo de la distancia mínima que se requiere para llegar del inicio al fin. */
  calcularDistanciaMinima() {
    let visitados = this.obtenerCopiaTablero();
    let cola = new Cola();
    cola.encolar(new Nodo(this.puntoInicial[0], this.puntoInicial[1], 0));
    visitados[this.puntoInicial[0]][this.puntoInicial[1]] = "X";
    while (!cola.estaVacia()) {
      let nodo = cola.desencolar();
      if (nodo.x == this.puntoFinal[0] && nodo.y == this.puntoFinal[1]) { this.cantMovOptimos = nodo.distancia; return; }
      // Buscar en las demás direcciones
      if ((this.tablero[nodo.x + 1][nodo.y] == 0 || this.tablero[nodo.x + 1][nodo.y] == 3) && visitados[nodo.x + 1][nodo.y] != "X") {
        visitados[nodo.x + 1][nodo.y] = "X";
        cola.encolar(new Nodo(nodo.x + 1, nodo.y, nodo.distancia + 1));
      }
      if ((this.tablero[nodo.x][nodo.y + 1] == 0 || this.tablero[nodo.x][nodo.y + 1] == 3) && visitados[nodo.x][nodo.y + 1] != "X") {
        visitados[nodo.x][nodo.y + 1] = "X";
        cola.encolar(new Nodo(nodo.x, nodo.y + 1, nodo.distancia + 1));
      }
      if ((this.tablero[nodo.x - 1][nodo.y] == 0 || this.tablero[nodo.x - 1][nodo.y] == 3) && visitados[nodo.x - 1][nodo.y] != "X") {
        visitados[nodo.x - 1][nodo.y] = "X";
        cola.encolar(new Nodo(nodo.x - 1, nodo.y, nodo.distancia + 1));
      }
      if ((this.tablero[nodo.x][nodo.y - 1] == 0 || this.tablero[nodo.x][nodo.y - 1] == 3) && visitados[nodo.x][nodo.y - 1] != "X") {
        visitados[nodo.x][nodo.y - 1] = "X";
        cola.encolar(new Nodo(nodo.x, nodo.y - 1, nodo.distancia + 1));
      }
    }
    this.cantMovOptimos = -1; // Error
  }

  /** @returns {Array} Una copia del tablero sin alterar los valores originales.*/
  obtenerCopiaTablero() {
    let copia = [];
    for (let i = 0; i < this.tamTablero; i++) {
      copia[i] = [];
      for (let j = 0; j < this.tamTablero; j++) {
        copia[i][j] = this.tablero[i][j];
      }
    }
    return copia;
  }
}

/**
 * @class Individuo
 * @classdesc Representa un individuo de la población.
 */
class Individuo {
  constructor(entorno, gen = "", posicion, etiqueta, fitnessPadre = 100) {
    this.entorno = entorno;
    this.gen = gen;
    this.posicion = posicion;
    this.etiqueta = etiqueta;
    this.premiosObtenidos = [];
    this.fitness = 0;
    this.fitnessPadre = fitnessPadre;
    this.vivo = true;
    this.llego = false;
    this.movimientos = ["U", "D", "L", "R"];
  }

  /**
   * Se refleja el recorrido que hizo el individuo en la matriz.
   * Solamente con propósitos de probar funcionalidad.
   */
  verRecorrido() {
    let x = this.entorno.puntoInicial[0];
    let y = this.entorno.puntoInicial[1];
    for (let i = 0; i < this.gen.length; i++) {
      let mov = this.gen[i];  
      if (mov == "U") { x--; }
      if (mov == "D") { x++; }
      if (mov == "L") { y--; }
      if (mov == "R") { y++; }
      if (this.entorno.tablero[x][y] == 0) { this.entorno.tablero[x][y] = 9 };
      if (this.entorno.tablero[x][y] == 4) { this.entorno.tablero[x][y] = 8 }; // Agarro un premio
    }
  }

  /** @returns {String} Una cadena con el genotipo mutado del individuo. */
  mutar() {
    let individuo = new Individuo(this.entorno, "", [this.entorno.puntoInicial[0], this.entorno.puntoInicial[1]], this.etiqueta);
    let genMutado = this.gen.split("");
    for (let i = 0; i < this.gen.length; i++) {
      if (Math.random() * 1 < this.entorno.prcMutacion) {
        let pos = Math.floor(Math.random() * this.gen.length);
        genMutado[pos] = this.movimientos[Math.floor(Math.random() * this.movimientos.length)];
      }
    }
    individuo.gen = genMutado.join("");
    return individuo;
  }

  /** 
   * @param {Individuo} otroIndividuo El individuo con el que se va a cruzar el individuo actual.
   * @returns {String} Una cadena con el genotipo cruzado del individuo actual con otro individuo.
   */
  cruzar(otroIndividuo) {
    let individuoHijo = new Individuo(this.entorno, "", [this.entorno.puntoInicial[0], this.entorno.puntoInicial[1]], this.etiqueta);
    let posicion = Math.floor(Math.random() * this.gen.length);
    let genHijo = this.gen.substring(0, posicion) + otroIndividuo.gen.substring(posicion);
    individuoHijo.gen = genHijo;
    return individuoHijo;
  }

  /** Simula la vida del individuo moviendose en el entorno. */
  vivir() {
    if (this.gen == "") { this.generarVidaAleatoria(); }
    else { this.generarVidaHeredada(); }
  }

  /** Calcula el fitness del individuo según la distancia del final y la cantidad de movimientos precisos que realiza */
  calcularFitness() {
    let distDelDestino = Math.abs(this.entorno.puntoFinal[0] - this.posicion[0]) + Math.abs(this.entorno.puntoFinal[1] - this.posicion[1]);
    let ponderacionPremios = (0.5 - (this.premiosObtenidos.length * 0.1));
    //this.fitness = (distDelDestino * ponderacionPremios) + ((this.entorno.premios.length - this.premiosObtenidos.length) * 2);
    this.fitness = (distDelDestino + (this.entorno.premios.length - this.premiosObtenidos.length) * 2) * (this.entorno.cantMovOptimos / this.gen.length);
  }

  /** @returns {String} Una cadena con el mejor movimiento posible del individuo. */
  obtenerMejorMov(genActual) {
    let mejorMov = "";
    let mejorFitness = 100;
    for (let i = 0; i < this.movimientos.length; i++) {
      let individuo = new Individuo(this.entorno, (genActual.split('').join('') + this.movimientos[i]), [this.entorno.puntoInicial[0], this.entorno.puntoInicial[1]], this.etiqueta);
      individuo.vivir();
      individuo.calcularFitness();
      if (individuo.fitness < mejorFitness) {
        mejorFitness = individuo.fitness;
        mejorMov = this.movimientos[i];
      }
    }
    return mejorMov;
  }

  /** Genera una vida heredada, queriendo decir que existe un gen previo en el individuo. */
  generarVidaHeredada() {
    if (this.fitnessPadre < (this.entorno.tamTablero * 1.4)/*36*/) {
      let probSeguirPadre = (1 - ((this.fitnessPadre + 1) / 35));
      for (let i = 0; i < this.gen.length; i++) {
        if (Math.random() * 1 > probSeguirPadre) {
          if (this.gen.length - i > 3) {
            let mejorMov = this.obtenerMejorMov(this.gen.substring(0, i));
            this.gen = this.gen.substring(0, i) + mejorMov + this.gen.substring(i + 1);
          }
          else {
            this.gen = this.gen.substring(0, i) + this.entorno.movimientos[Math.floor(Math.random() * 4)] + this.gen.substring(i + 1);
          }
        }
      }
    }
    // Recorremos el gen y validamos los movimientos, debido a que es un gen heredado
    let genFinal = "";
    for (let i = 0; i < this.gen.length; i++) {
      let movimiento = this.gen[i];
      if (i != 0) {
        let movContrario = this.obtenerMovContrario(this.gen.charAt(i));
        if (movContrario == this.gen[i - 1]) { continue; }
      }
      genFinal += movimiento;
      if (!this.mover(movimiento)) { break; }
      if (this.entorno.tablero[this.posicion[0]][this.posicion[1]] == 3) { this.llego = true; break;}
    }
    this.gen = genFinal;
    // Verificamos si llegamos al destino
    if (!this.vivo) { return; }
    if (!this.llego) { this.generarVidaAleatoria(); }
  }

  /** Si no existe un gen previo, se mueve de forma aleatoria */
  generarVidaAleatoria() {
    while (this.gen.length < this.entorno.cantMovOptimos + 25) {
      let movimiento = this.movimientos[Math.floor(Math.random() * this.movimientos.length)];
      if (this.gen.length != 0) {
        let movContrario = this.obtenerMovContrario(this.gen.charAt(this.gen.length - 1));
        if (movimiento == movContrario) { continue; }
      }
      if (this.entorno.tablero[this.posicion[0]][this.posicion[1]] == 3) { this.llego = true; return; }
      this.gen += movimiento;
      if (!this.mover(movimiento)) { break; }
    }
    // Verificamos si gano
    if (this.entorno.tablero[this.posicion[0]][this.posicion[1]] == 3) { this.llego = true; return; }
    this.vivo = false;
  }

  /**
   * @param {String} movimiento El movimiento que se desea realizar.
   * @returns {Boolean} True si se pudo mover, false si no es valido.
   */
  mover(movimiento) {
    let x = this.posicion[0];
    let y = this.posicion[1];
    // Verificamos que no se esté moviendo desde la meta
    
    if (this.entorno.tablero[x][y] == 3 || this.entorno.tablero[x][y] == 1) { return false; }
    if (this.entorno.tablero[x][y] == 4 && this.premiosObtenidos.length <= 5) {
      let agregarPremio = true;
      for (let i = 0; i < this.premiosObtenidos.length; i++) {
        if (this.premiosObtenidos[i][0] == x && this.premiosObtenidos[i][1] == y) { agregarPremio = false; }
      }
      if (agregarPremio) {
        let nuevoPremio = [x, y];
        this.premiosObtenidos.push(nuevoPremio);
      }
    }
    switch (movimiento) {
      case "U":
        x -= 1; break;
      case "D":
        x += 1; break;
      case "L":
        y -= 1; break;
      case "R":
        y += 1; break;
    }
    this.posicion = [x, y];
    if (this.entorno.tablero[x][y] == 3) { this.llego = true; return true; }
    else if (this.entorno.tablero[x][y] == 1) { this.vivo = false; return false; }
    else { this.vivo = true; return true; }
  }

  /** @returns {String} El movimiento contrario a uno dado. */
  obtenerMovContrario(mov) {
    switch (mov) {
      case "U": return "D";
      case "D": return "U";
      case "L": return "R";
      case "R": return "L";
    }
  }
}

/**
 * @class Cola
 * @classdesc Una cola sencilla.
 */
class Cola {
  constructor() {
    this.items = [];
  }

  encolar(item) {
    this.items.push(item);
  }

  desencolar() {
    return this.items.shift();
  }

  estaVacia() {
    return this.items.length == 0;
  }
};

/**
 * @class Nodo
 * @classdesc Un nodo de una cola que representará puntos en el tablero.
 */
class Nodo {
  
  /**
   * Constructor principal.
   * @param {int} x La coordenada x del nodo. 
   * @param {int} y La coordenada y del nodo.
   * @param {int} distancia La distancia del nodo al origen.
   * @param {Array} historial Recorrido realizado.
   */
  constructor(x, y, distancia, historial = []) {
    this.x = x;
    this.y = y;
    this.distancia = distancia;
    this.historial = historial;
  }
}

// Tamaño del tablero (15-30), cant. poblacion (8-20), punto inicial, punto final, gen inicial, prcObstaculos (.10-.25), prcMutacion (.10-.80), prcCruce, cantMaxGeneraciones (100-1500)
//let ent = new Entorno(25, 10, [4, 4], [22, 22], "", 0.05, 0.5, 0.5, 1000);
//let ent = new Entorno(25, 10, [22, 22], [4, 4], "", 0.05, 0.5, 0.5, 1000);
// let ent = new Entorno(35, 10, [32, 32], [2, 2], "", 0.05, 0.5, 0.5, 500);
// ent.generarPoblacionBase();
// ent.colocarPremio(5, 5);
// ent.colocarPremio(10, 11);

/*


// ->> Entorno de pruebas


ent.imprimirTablero();
let terminado = false;
while (!terminado) { ent.simularEtapa(); terminado = ent.encontroSolucion; }

let generacionesGanadoras = [];
let finessGanadores = [];
let partidasSinGanador = 0;
let partidasConGanador = 0;
let fitnessPerfectos = 0;

for (let i = 0; i < 50; i++) {
  let ent = new Entorno(35, 10, [32, 32], [2, 2], "", 0.05, 0.5, 0.5, 500);
  ent.generarPoblacionBase();
  ent.colocarPremio(5, 5);
  ent.colocarPremio(10, 11);
  let terminado = false;
  while (!terminado) { ent.simularEtapa(); terminado = ent.encontroSolucion; }
  if (ent.individuoGanador != null) {
    generacionesGanadoras.push(ent.generacion);
    finessGanadores.push(ent.individuoGanador.fitness);
    partidasConGanador += 1;
    if (ent.individuoGanador.fitness == 0) {fitnessPerfectos += 1;}
  } else { partidasSinGanador += 1;}
}

let prom1 = 0;
for (let i = 0; i < generacionesGanadoras.length; i++) {
  prom1 += generacionesGanadoras[i];
}
console.log("Promedio generacion: " + (prom1 / generacionesGanadoras.length));

let prom2 = 0;
for (let i = 0; i < finessGanadores.length; i++) {
  prom2 += finessGanadores[i];
}
console.log("Finnes prom: " + (prom2 / finessGanadores.length));

console.log("Prc ganadas: " + ((partidasConGanador/50) * 100));
console.log("Cant. fitness perfectos: " + fitnessPerfectos);

*/