class Game {
  

  constructor( pMatrix_window_w, pMatrix_window_h, pM_rows, pM_columns, pVentana, pPattern, pRect  ){
    
    this.SVG_NS = "http://www.w3.org/2000/svg"

    this.m_w = pMatrix_window_w
    this.m_h = pMatrix_window_h

    this.m_rows = pM_rows
    this.m_columns = pM_columns

    this.s_w = Math.floor(this.m_w/this.m_columns)  //Width del cuadrito 
    this.s_h = Math.floor(this.m_h/this.m_rows)     //Height del cuadrito 

    this.ventana = pVentana 
    this.pattern = pPattern
    this.rect    = pRect

    this.generacionActual = []
    
    this.movList = ["R","D","U","L"]   //Lista de movimientos temporal
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

    let m_window  = document.getElementById(this.ventana)
    let s_pattern = document.getElementById(this.pattern)
    let s_grid    = document.getElementById(this.rect)
    
    //Cambia el tamanio de la ventana
    m_window.setAttribute("width",this.m_w + 1 )
    m_window.setAttribute("height",this.m_h + 1 )

    //Cambia el tamano de los cuadraditos
    s_pattern.setAttribute("width",this.s_w )
    s_pattern.setAttribute("height",this.s_h )
    s_grid.setAttribute("width",this.s_w )
    s_grid.setAttribute("height",this.s_h )

  }


  // /**
  //  * Dibuja los circulos 
  //  * @param {Array}objet: Atributos de los bicho
  //  * @param {SVG}ventana: Es el tablero de juego 
  //  * @param {String}id: Es es el identificador del bicho
  // */
  // drawCircle = (objet, ventana, id) => {
  //   let elementFather = document.getElementById(ventana);
  //   let circle = document.createElementNS(this.SVG_NS, "circle");
  //   circle.setAttributeNS(null, "id", id);
  //   for (var name in objet) {
  //     if (objet.hasOwnProperty(name)) {
  //       circle.setAttributeNS(null, name, objet[name]);
  //     }
  //   }
  //   elementFather.appendChild(circle);
  //   return circle;
  // }

  random_step = () => {
    return this.movList[Math.floor(Math.random()*this.movList.length)]; 
  } 

  moveOn = (object, move) => {

    let c = document.getElementById(object.id)
  
    //Posicion x,y de la bolita en el cuadrito
    let ball_s_x = Math.floor(this.s_w/2)
    let ball_s_y =  Math.floor(this.s_h/2)
  
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
      else{
        //alert("Can't move on");
      }
    }
    if (step == "L") {
      if (x != 0) {
        x = ball_s_x + (x - 1) *this. s_w;
        c.setAttributeNS(null, "cx", x);
      }
      else{
        //alert("Can't move on");
      }
    }
    //y is file
    if (step == "U") {
      if (y != 0) {
        y = ball_s_y + (y - 1) * this.s_h;
        c.setAttributeNS(null, "cy", y);
      }
      else{
        //alert("Can't move on");
      }
    }
    if (step == "D") {
      if (y < this.m_rows - 1) {
        y = ball_s_y + (y + 1) * this.s_h;
        c.setAttributeNS(null, "cy", y);
      }
      else{
        //alert("Can't move on");
      }
    }
  
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  eraseIndividuals = () => {
    console.log('BORRANDO')
    console.log(this.generacionActual.length)

    this.generacionActual.forEach(element => {
      console.log("hola");
      element.erase()
    });

  }

  drawIndividuals = ( poblacion ) => {
    this.eraseIndividuals()
    this.generacionActual = []

    poblacion.forEach(individuo => {
      console.log(individuo.gen);

      var newIndividuo = new dibujoIndividuo(individuo.etiqueta,this.s_w, this.s_h, this.ventana, this.SVG_NS, individuo.posicion[0],individuo.posicion[1], individuo.gen )
      this.generacionActual.push( newIndividuo )
    });

    
  }

  moveIndividuals = async() => {

    var listaIndividuos = this.generacionActual


    while( listaIndividuos.length != 0 ){

      listaIndividuos.forEach(indiv => {

        if (indiv.movimientos.length != 0) {
          this.moveOn(indiv, indiv.movimientos[0])
          indiv.movimientos = indiv.movimientos.slice(1)
        } else{
          listaIndividuos = listaIndividuos.filter(item => item !== indiv)
        }
        
      })
      await this.sleep(50);
    }
  }

}







// const SVG_NS = "http://www.w3.org/2000/svg";

// const matrix_window_w = 540          //Width del tablero 
// const matrix_window_h = 540          //Height del tablero 

// var m_rows = 20                      //Cantidad de filas del tablero
// var m_columns = 15                   //Cantidad de colunas del tablero

// var s_w = Math.floor(matrix_window_w/m_columns)  //Width del cuadrito 
// var s_h = Math.floor(matrix_window_h/m_rows)     //Height del cuadrito 


// /** 
//   Cambia los valores del svg que pinta la matriz,
//   para que se ajuste a la cantidad de filas y columnas 
//   de la matriz del juego. 
  
//   @param {String} ventana   id del svg que pinta la matriz 
//   @param {String} m_w       Width en pixeles de la matriz
//   @param {String} m_h       Height en pixeles de la matriz
//   @param {String} pattern   Patron del SVG que contiene los squares y pinta las lineas 
//   @param {String} s_w       Width del cuadrito
//   @param {String} s_h       Heitgh del cuadrito
//   @param {String} grid      Grid del svg que pinta el pattron 

//   @returns {Boolean} True si se pudo mover, false si no es valido.
// */
// drawMatrix = ( ventana, pattern, rect,  m_w, m_h, s_w, s_h ) => {

//   let m_window  = document.getElementById(ventana)
//   let s_pattern = document.getElementById(pattern)
//   let s_grid    = document.getElementById(rect)
  
//   //Cambia el tamanio de la ventana
//   m_window.setAttribute("width",m_w + 1 )
//   m_window.setAttribute("height",m_h + 1 )

//   //Cambia el tamano de los cuadraditos
//   s_pattern.setAttribute("width",s_w )
//   s_pattern.setAttribute("height",s_h )
//   s_grid.setAttribute("width",s_w )
//   s_grid.setAttribute("height",s_h )

// }

// /**
//  * Dibuja los circulos 
//  * @param {Array}objet: Atributos de los bicho
//  * @param {SVG}ventana: Es el tablero de juego 
//  * @param {String}id: Es es el identificador del bicho
//  */
// drawCircle = (objet, ventana, id) => {
//   let elementFather = document.getElementById(ventana);
//   let circle = document.createElementNS(SVG_NS, "circle");
//   circle.setAttributeNS(null, "id", id);
//   for (var name in objet) {
//     if (objet.hasOwnProperty(name)) {
//       circle.setAttributeNS(null, name, objet[name]);
//     }
//   }
//   elementFather.appendChild(circle);
//   return circle;
// }

// random_step = (list) => {
//   return list[Math.floor(Math.random()*list.length)]; 
// } 

// moveOn = () => {
//   let c= document.getElementById("circle_1")

//   //Posicion x,y de la bolita en el cuadrito
//   let ball_s_x = Math.floor(s_w/2)
//   let ball_s_y =  Math.floor(s_h/2)

//   let x = (c.getAttributeNS(null, "cx") - ball_s_x) / s_w
//   let y = (c.getAttributeNS(null, "cy") - ball_s_y) / s_h

//   let step = random_step(liststep);
//   //let step = "R"

//   //x is column
//   if (step == "R") {
//     if (x < m_columns - 1) {
//       x = ball_s_x + (x + 1) * s_w;
//       c.setAttributeNS(null, "cx", x);
//     }
//     else{
//       alert("Can't move on");
//     }
//   }
//   if (step == "L") {
//     if (x != 0) {
//       x = ball_s_x + (x - 1) * s_w;
//       c.setAttributeNS(null, "cx", x);
//     }
//     else{
//       alert("Can't move on");
//     }
//   }
//   //y is file
//   if (step == "U") {
//     if (y != 0) {
//       y = ball_s_y + (y - 1) * s_h;
//       c.setAttributeNS(null, "cy", y);
//     }
//     else{
//       alert("Can't move on");
//     }
//   }
//   if (step == "D") {
//     if (y < m_rows - 1) {
//       y = ball_s_y + (y + 1) * s_h;
//       c.setAttributeNS(null, "cy", y);
//     }
//     else{
//       alert("Can't move on");
//     }
//   }

// }



// crearM = () => {
//   let matiz = new Array(36);
//   for (let i = 0; i < 36; i++) {
//     matiz[i] = new Array(48);
//     for (let j = 0; j < 48; j++) {
//       matiz[i][j] = []
//     }
//   }
//   return matiz;
// }



// drawMatrix( "window","grid", "rect",  matrix_window_w, matrix_window_h, s_w, s_h)


// ball_r = Math.min( Math.floor(s_w/2), Math.floor(s_h/2) ) -  Math.floor((s_w/5)) //Calcular el radio de la bolita

// circ = drawCircle(objet, "window","circle_1");
