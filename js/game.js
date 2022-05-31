/**
    @class Game
    @classdesc Se encarga de manejar los aspectos graficos y de movimientos dentro de la matriz que se dibuja en el HTML 
    @param {int}    pMatrix_window_w  Width de la ventana que muestra la matriz 
    @param {int}    pMatrix_window_h  height de la ventana que muestra la matriz 
    @param {int}    pM_rows           Filas que tendrá la matriz 
    @param {int}    pM_columns        Columnas que tendrá la matriz 
    @param {string} pVentana          ID del SVG en dónde se pinta la matriz 
    @param {string} pPattern          El id del patron que tiene el SVG, que pinta los cuadritos
    @param {string} pRect             El id del rectangulo? que tiene el SVG, que pinta los cuadritos
    @param {matriz} tablero           El tablero de juego 
 */
class Game {

  constructor(pMatrix_window_w, pMatrix_window_h, pM_rows, pM_columns, pVentana, pPattern, pRect, pTablero) {

    this.SVG_NS = "http://www.w3.org/2000/svg"

    this.m_w = pMatrix_window_w
    this.m_h = pMatrix_window_h

    this.m_rows = pM_rows
    this.m_columns = pM_columns

    this.s_w = Math.floor(this.m_w / this.m_columns)  //Width del cuadrito 
    this.s_h = Math.floor(this.m_h / this.m_rows)     //Height del cuadrito 

    this.ventana = pVentana
    this.pattern = pPattern
    this.rect = pRect

    this.generacionActual = []

    this.movList = ["R", "D", "U", "L"]   //Lista de movimientos temporal
    this.tablero = pTablero
  }

  /** 
    Cambia los valores del svg que pinta la matriz,
    para que se ajuste a la cantidad de filas y columnas 
    de la matriz del juego. 
    
    @param {String} ventana   id del svg que pinta la matriz 
    @param {String} m_w       Width en pixeles de la matriz
    @param {String} m_h       Height en pixeles de la matriz
    @param {String} pattern   Patron del SVG que contiene los squares y pinta las lineas 
    @param {String} s_w       Width del cuadrito
    @param {String} s_h       Heitgh del cuadrito
    @param {String} grid      Grid del svg que pinta el pattron 

    @returns {Boolean} True si se pudo mover, false si no es valido.
  */
  drawMatrix = () => {

    let m_window = document.getElementById(this.ventana)
    let s_pattern = document.getElementById(this.pattern)
    let s_grid = document.getElementById(this.rect)

    //Cambia el tamanio de la ventana
    m_window.setAttribute("width", this.m_w + 1)
    m_window.setAttribute("height", this.m_h + 1)

    //Cambia el tamano de los cuadraditos
    s_pattern.setAttribute("width", this.s_w)
    s_pattern.setAttribute("height", this.s_h)
    s_grid.setAttribute("width", this.s_w)
    s_grid.setAttribute("height", this.s_h)

    //this.drawoObject();
  }

  /**
    * Dibuja los obstaculos con la información del constructor
  */
  drawoObject = (pTablero) => {
    let elementFather = document.getElementById(this.ventana);      //Encuentra el elemento en dónde va a dibujar el obstaculo
    let rect, circle, ellipse;
    //Coloca los Atributos al elemento
    let ball_s_x = Math.floor(this.s_w / 2);
    let ball_s_y = Math.floor(this.s_h / 2);
    let pos_y, pos_x;
    for (let i = 0; i < pTablero.length; i++) {
      for (let j = 0; j < pTablero.length; j++) {
        if (pTablero[i][j] == 1) {
          pos_x = j * this.s_w + this.s_w/4;
          pos_y = i * this.s_w + this.s_h/4;

          rect = document.createElementNS(this.SVG_NS, "rect");   
          rect.setAttributeNS(null, "id", "rect" + String(i));
          rect.setAttributeNS(null, "class", "obstaculo")
          rect.setAttributeNS(null, "x", pos_x);
          rect.setAttributeNS(null, "y", pos_y);
          rect.setAttributeNS(null, "width", this.s_w/2);
          rect.setAttributeNS(null, "height", this.s_h/2);
          elementFather.appendChild(rect);
        }
        if (pTablero[i][j] == 2) {
          pos_x = ball_s_x + j * this.s_w;
          pos_y = ball_s_y + i * this.s_w;
          circle = document.createElementNS(this.SVG_NS, "circle");
          circle.setAttributeNS(null, "id", "inicio");
          circle.setAttributeNS(null, "cx", pos_x);
          circle.setAttributeNS(null, "cy", pos_y);
          circle.setAttributeNS(null, "r", "5");
          circle.setAttributeNS(null, "fill", "#39ff14");
          elementFather.appendChild(circle);
        }
        if (pTablero[i][j] == 3) {
          pos_x = ball_s_x + j * this.s_w;
          pos_y = ball_s_y + i * this.s_w;
          circle = document.createElementNS(this.SVG_NS, "circle");
          circle.setAttributeNS(null, "id", "final");
          circle.setAttributeNS(null, "cx", pos_x);
          circle.setAttributeNS(null, "cy", pos_y);
          circle.setAttributeNS(null, "r", "5");
          circle.setAttributeNS(null, "fill", "red");
          elementFather.appendChild(circle);
        }
        if (pTablero[i][j] == 4) {
          pos_x = ball_s_x + j * this.s_w;
          pos_y = ball_s_y + i * this.s_w;
          ellipse = document.createElementNS(this.SVG_NS, "ellipse");
          ellipse.setAttributeNS(null, "id", "obsequio" + String(j));
          ellipse.setAttributeNS(null, "class", "premio");
          ellipse.setAttributeNS(null, "cx", pos_x);
          ellipse.setAttributeNS(null, "cy", pos_y);
          ellipse.setAttributeNS(null, "rx", "7");
          ellipse.setAttributeNS(null, "ry", "4");
          ellipse.setAttributeNS(null, "fill", "blue");
          elementFather.appendChild(ellipse);
        }
      }
    }                           //Introduce el circulo al SVG 



  }
  /** 
    Función de prueba que retorna un movimiento aleatorio de una 
    lista de movimientos. 
    
    @param {String} ventana   id del svg que pinta la matriz 
    @param {String} m_w       Width en pixeles de la matriz
    @param {String} m_h       Height en pixeles de la matriz
    @param {String} pattern   Patron del SVG que contiene los squares y pinta las lineas 
    @param {String} s_w       Width del cuadrito
    @param {String} s_h       Heitgh del cuadrito
    @param {String} grid      Grid del svg que pinta el pattron 

    @returns {String}         Movimiento ( U | D | L | R )
  */
  random_step = () => {
    return this.movList[Math.floor(Math.random() * this.movList.length)];
  }


  /** 
    Se encarga de mover un individuo, en un movimiento indicado 
    
    @param {dibujoIndividuo} object   Objeto que quiere mover, ya que necesita el id para buscar el elemento en el HTML
    @param {String} move              Moviemento a realizar ( U=up, D=Down, L=left, R=right )
   
  */
  moveOn = (object, move) => {

    let c = document.getElementById(object.id)     //Busca el individuio en el HTML, dentro del SVG 

    //Posicion x,y de la bolita en el cuadrito
    //Calcula el centro del cuadrito
    let ball_s_x = Math.floor(this.s_w / 2)
    let ball_s_y = Math.floor(this.s_h / 2)

    //Calcula la posición actual de la bolita 
    let x = (c.getAttributeNS(null, "cx") - ball_s_x) / this.s_w
    let y = (c.getAttributeNS(null, "cy") - ball_s_y) / this.s_h

    let step = move
    //let step = "R"

    //x is column
    if (step == "R") {
      if (x < this.m_columns - 1) {
        x = ball_s_x + (x + 1) * this.s_w;
        c.setAttributeNS(null, "cx", x);
      }
      else {
        //alert("Can't move on");
      }
    }
    if (step == "L") {
      if (x != 0) {
        x = ball_s_x + (x - 1) * this.s_w;
        c.setAttributeNS(null, "cx", x);
      }
      else {
        //alert("Can't move on");
      }
    }
    //y is file
    if (step == "U") {
      if (y != 0) {
        y = ball_s_y + (y - 1) * this.s_h;
        c.setAttributeNS(null, "cy", y);
      }
      else {
        //alert("Can't move on");
      }
    }
    if (step == "D") {
      if (y < this.m_rows - 1) {
        y = ball_s_y + (y + 1) * this.s_h;
        c.setAttributeNS(null, "cy", y);
      }
      else {
        //alert("Can't move on");
      }
    }
  }

  /** 
    Crea una promesa que detiene la ejecución del programa por unos milisegundos 
    
    @param {int} ms Tiempo en milisegundos que detendrá la ejecución
   
  */
  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** 
    Borra los elementos del SVG 
    
  */
  eraseIndividuals = () => {
    console.log('Borrando Elementos de la Matriz y Tabla')

    this.generacionActual.forEach(element => {
      element.erase()
    });

  }

  /** 
    Dibuja los individuos en la matriz 
    
    @param {Array} poblacion La población de la generación actual, generada por el Algoritmo Genético
   
  */
  drawIndividuals = (poblacion, fila_inicio, columna_inicio) => {
    //Antes de empezar borra todos los individuos de la generación pasada
    this.eraseIndividuals()
    this.generacionActual = []

    poblacion.forEach(individuo => {
      //console.log(individuo.gen);
      
      var newIndividuo = new dibujoIndividuo(individuo,this.s_w, this.s_h, this.ventana, this.SVG_NS, fila_inicio, columna_inicio)
      this.generacionActual.push(newIndividuo)

    });

  }


  /** 
    Mueve los individuos, de la generación actual. 
    Cada individuo tiene su string con los movimientos. 
    Por cada individuo, se ejecuta el primer movimiento del string, se elimina ese movimeinto,
      y si el individuo se queda sin movimientos se elimina de la lista. 
    
    
    @param {Array} poblacion La población de la generación actual, generada por el Algoritmo Genético
   
  */
  moveIndividuals = async () => {

    var listaIndividuos = this.generacionActual


    while (listaIndividuos.length != 0) {

      listaIndividuos.forEach(indiv => {

        //Se recorren los movimientos[0] de cada indivudio                                                            
        if (indiv.movimientos.length != 0) {
          this.moveOn(indiv, indiv.movimientos[0])
          indiv.movimientos = indiv.movimientos.slice(1)
        } else {
          indiv.morir()
          listaIndividuos = listaIndividuos.filter(item => item !== indiv)  // Si se queda sin movimientos se elimina de la lista
        }

      })
      await this.sleep(300);   //Espera un tiempo para el siguiente movimiento
    }
  }

}

