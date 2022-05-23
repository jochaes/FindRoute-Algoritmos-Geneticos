/**
    @class dibujoIndividuo
    @classdesc Se encarga de dibujar los individuos en la interfaz 
    @param {string} id_individuo    El identificador del Individuo, para buscarlo en el HTML
    @param {int}    pCuadro_width   Ancho de los cuadritos en dónde va a vivir el SVG del individuo
    @param {int}    pCuadro_height  Alto de los cuadritos en dónde va a vivir el SVG del individuo
    @param {string} pVentana        El elemento HTML en donde se van a dibujar los individuos
    @param {string} pSVG_NS         "Libreria" de los SVG
    @param {int}    init_row        Indice de la fila inicial
    @param {int}    init_column     Indice de la columna inicila 
    @param {string} pMovimientos    String con los movimientos del individuo en la generación actual
    
 */
class dibujoIndividuo {


    constructor( id_individuo, pCuadro_width, pCuadro_height, pVentana, pSVG_NS, init_row, init_column, pMovimientos ){
        
        this.id = id_individuo
        this.s_w = pCuadro_width
        this.s_h = pCuadro_height

        this.ventana = pVentana
        
        this.cx = Math.floor(this.s_w/2) + (init_column) * this.s_w   // Calcula la mitad del cuadrito, y le suma los espacios para pintarlo en la columna correspondiente 

        this.cy = Math.floor(this.s_h/2) + (init_row) * this.s_h       // Calcula la mitad del alto del  cuadrito, y le suma los espacios para pintarlo en la fila correspondiente 

        this.r  = Math.min( Math.floor(this.s_w/2), Math.floor(this.s_h/2) ) -  Math.floor((this.s_w/5)) //Calcular el radio de la bolita
        
        this.stroke = "green"
        this.fill = "yellow"

        this.SVG_NS = pSVG_NS
        this.movimientos = pMovimientos

        this.drawCircle()       // Pinta el circulo 
    }

    /**
     * Dibuja los circulos con la información del constructor
    */
    drawCircle = () => {
        let elementFather = document.getElementById(this.ventana);      //Encuentra el elemento en dónde va a dibujar el circulo
        let circle = document.createElementNS(this.SVG_NS, "circle");   //Crea el SVG del  Circulo
        
        //Coloca los Atributos al elemento
        circle.setAttributeNS(null, "id", this.id);

        circle.setAttributeNS(null, "cx", this.cx);
        circle.setAttributeNS(null, "cy", this.cy);

        circle.setAttributeNS(null, "r", this.r);
        circle.setAttributeNS(null, "stroke", this.stroke);
        circle.setAttributeNS(null, "fill", this.fill);


        
        // for (var name in objet) {
        //     if (objet.hasOwnProperty(name)) {
        //         circle.setAttributeNS(null, name, objet[name]);
        //     }
        // }

        elementFather.appendChild(circle);                              //Introduce el circulo al SVG 
        //return circle;
    }


    /**
     * Borra el circulo del SVG
    */
    erase = () => {
        let element = document.getElementById(this.id);
        element.remove()
    }


}