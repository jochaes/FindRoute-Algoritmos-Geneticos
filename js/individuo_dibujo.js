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


    constructor( individuo, pCuadro_width, pCuadro_height, pVentana, pSVG_NS, init_row, init_column ){
        
        this.id = individuo.etiqueta
        this.s_w = pCuadro_width
        this.s_h = pCuadro_height

        this.ventana = pVentana
        
        var offset = Math.floor(Math.random() * Math.floor((this.s_w/4)))

        
        this.cx = Math.floor(this.s_w/2 + offset) + (init_column) * this.s_w   // Calcula la mitad del cuadrito, y le suma los espacios para pintarlo en la columna correspondiente 

        this.cy = Math.floor(this.s_h/2 + offset) + (init_row) * this.s_h       // Calcula la mitad del alto del  cuadrito, y le suma los espacios para pintarlo en la fila correspondiente 

        this.r  = Math.min( Math.floor(this.s_w/2), Math.floor(this.s_h/2) ) -  Math.floor((this.s_w/5)) //Calcular el radio de la bolita
        
        this.stroke = "green" 
        this.fill = this.randColor()

        this.SVG_NS = pSVG_NS
        this.movimientos = individuo.gen

        this.drawCircle()       // Pinta el circulo 
        this.writeStats( individuo )
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
     * Genera colores aleatorios
    */

    randColor = () =>  {
        return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    }
    


    /**
     * Borra el circulo del SVG
    */
    erase = () => {
        //Elimina el SVG de la Matriz 
        let element = document.getElementById(this.id);
        element.remove()

        //Elimina el TR de la tabla de stats 
        var indivrowTr = "tr" + this.id 
        var trElement = document.getElementById(indivrowTr)
        trElement.parentNode.removeChild(trElement);

    }


    /**
     * Borra el circulo del SVG
    */
     morir = () => {
        let circle = document.getElementById(this.id);
    
        circle.setAttributeNS(null, "stroke", "orange");
        circle.setAttributeNS(null, "fill", "red");
    }


    // this.gen = gen;
    // this.posicion = posicion;
    // this.premiosObtenidos = [];
    // this.fitness = 0;
    // this.fitnessPadre = fitnessPadre;
    // this.vivo = true;
    // this.llego = false;


    writeStats = (individuo) => {
        var table = document.getElementById("stats_table");


        var row = table.insertRow(-1);
        var rowId = "tr" + this.id

        row.setAttribute("id",rowId )



        var cell1 = row.insertCell(0);  //ID
        var cell2 = row.insertCell(1);  //Gen
        var cell3 = row.insertCell(2);  //PosFinal
        var cell4 = row.insertCell(3);  //Premios
        var cell5 = row.insertCell(4);  //Fitness
        var cell6 = row.insertCell(5);  //Fitness Padre
        var cell7 = row.insertCell(6);  //Sobrevive
        var cell8 = row.insertCell(7);  //Llegó

        // Add some text to the new cells:
        cell1.innerHTML = this.id;
        cell2.innerHTML = this.movimientos;
        cell3.innerHTML = individuo.posicion
        cell4.innerHTML = individuo.premiosObtenidos
        cell5.innerHTML = individuo.fitness
        cell6.innerHTML = individuo.fitnessPadre
        cell7.innerHTML = individuo.vivo
        cell8.innerHTML = individuo.llego

    }


}