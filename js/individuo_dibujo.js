
class dibujoIndividuo {


    constructor( id_individuo, pCuadro_width, pCuadro_height, pVentana, pSVG_NS, init_row, init_column ){
        
        this.id = id_individuo
        this.s_w = pCuadro_width
        this.s_h = pCuadro_height

        this.ventana = pVentana
        
        this.cx = Math.floor(this.s_w/2) + (init_column) * this.s_w

        this.cy = Math.floor(this.s_h/2) + (init_row) * this.s_h

        this.r  = Math.min( Math.floor(this.s_w/2), Math.floor(this.s_h/2) ) -  Math.floor((this.s_w/5)) //Calcular el radio de la bolita
        this.stroke = "green"
        this.fill = "yellow"

        this.SVG_NS = pSVG_NS

        this.drawCircle()
    }

    /**
     * Dibuja los circulos 
     * @param {Array}  objet: Atributos de los bicho
     * @param {SVG}  ventana: Es el tablero de juego 
     * @param {String}    id: Es es el identificador del bicho
    */
    drawCircle = () => {
        let elementFather = document.getElementById(this.ventana);
        let circle = document.createElementNS(this.SVG_NS, "circle");
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

        elementFather.appendChild(circle);
        return circle;
    }


    /**
     * Dibuja los circulos 
     * @param {Array}  objet: Atributos de los bicho
     * @param {SVG}  ventana: Es el tablero de juego 
     * @param {String}    id: Es es el identificador del bicho
    */
    erase = () => {
        let element = document.getElementById(this.id);
        element.remove()
    }


}