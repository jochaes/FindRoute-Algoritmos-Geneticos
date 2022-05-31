

// // Se crea el juego con 
// //Una ventana de 540x540 
// //Una matriz de 35 x 35 
// let newGame = new Game( 540, 540, 15,15, "window", "grid", "rect" )
// newGame.drawMatrix()

// //Se crea lo del algorito genetivo 
// let ent = new Entorno(15, 5, [10, 10], [2, 2], "", 0.05, 0.5, 0.5, 500);
// ent.generarPoblacionBase();
// ent.colocarPremio(5, 5);
// ent.colocarPremio(10, 11);

// console.log("*******Tablero Generado por el Algoritmo*******")
// console.log(ent.tablero);
// newGame.drawoObject(ent.tablero)        //Dibuja el Tablero
// console.log("***********************************************")

// console.log("*******Dibujando Población Base*******")
// newGame.drawIndividuals(ent.poblacion, ent.puntoInicial[0], ent.puntoInicial[1])  //Dibuja la población Base
// console.log(ent.poblacion);
// console.log("**************************************")



// //ent.imprimirTablero();


let slider = document.getElementById("myRange");

let newGame 
let ent 
let velocidadMov = slider.value;

slider.oninput = function() {
  slider.innerHTML = this.value;
  velocidadMov = this.value;
}

const showSolucion  = async() => {

    let terminado = false;
    while (!terminado) {
        ent.simularEtapa();
        if (ent.encontroSolucion) { break; }                      //Cada etapa es una generación 
        var gen = "*******Info Generación " + ent.generacion + " *******" 
        console.log(gen);
        let titulo = document.getElementById("stats_title"); 
        let tituloNuevo = ("<h3> Generación actual: " + ent.generacion + "</h3>");
        titulo.innerHTML = tituloNuevo;
        titulo.style.backgroundColor = "black";
        //titulo.innerText = tituloNuevo.replace(/(\r\n|\n|\r)/gm, "");


        ent.poblacion.forEach(element => {
            var indiv = element.etiqueta + " | " + element.gen + " | " + element.fitness + " | " + element.posicion + " | " + element.premiosObtenidos.length + " ~ " + element.premiosObtenidos.toString();
            console.log(indiv);
        });

        console.log("**************************************")

        
        newGame.drawIndividuals(ent.poblacion, ent.puntoInicial[0], ent.puntoInicial[1])  //Se saca la poblacion de individuos de la etaoa actual
        //await newGame.sleep(400);
        await newGame.moveIndividuals()         //Se mueven los individuos de la etapa actual 

        terminado = ent.encontroSolucion;       //Termina cuando encuentra la solución
     }
}

//showSolucion()    //Empieza a ejecutar el programa 

start = () => {
    if (ent != undefined) {
        location.reload();
        return;
    }
    var sizeMatrix          = parseInt( document.getElementById("sizeMatrix").value )
    if (sizeMatrix < 10 || sizeMatrix > 35) { return }
    var populationSize      = parseInt( document.getElementById("populationSize").value )
    if (populationSize < 8 || populationSize > 20) { return }
    var initPos             = document.getElementById("initPos").value.split(",").map(Number)
    if (initPos.length != 2) {
        alert("La posición inicial debe estar en formato (x,y)")
        return
    }
    if (initPos[0] < 2 || initPos[0] > (sizeMatrix-2) || initPos[1] < 2 || initPos[1] > (sizeMatrix-2)) {
        alert("La posición inicial debe estar entre 1 y " + (sizeMatrix-2))
        return
    }
    var endPos              = document.getElementById("endPos").value.split(",").map(Number)
    if (endPos.length != 2) {
        alert("La posición final debe estar en formato (x,y)")
        return
    }
    if (endPos[0] < 2 || endPos[0] > (sizeMatrix-2) || endPos[1] < 2 || endPos[1] > (sizeMatrix-2)) {
        alert("La posición final debe estar entre 1 y " + (sizeMatrix-2))
        return
    }
    var gene                = document.getElementById("gene").value
    // Check if gene only contains the characters: L, D, U, R
    if (!gene.match(/^[LDUR]+$/) && gene.length != 0) {
        alert("El genótipo debe contener solo los caracteres: L, D, U, R")
        return
    }
    var obsPercentage       = parseInt (document.getElementById("obsPercentage").value) / 100
    if (obsPercentage < 0.05 || obsPercentage > 0.2) { return }
    var mutationPercentage  = parseInt (document.getElementById("mutationPercentage").value) /100
    if (mutationPercentage < 0 || mutationPercentage > 0.8) {  return }
    var crossoverPercentage = parseInt (document.getElementById("crossoverPercentage").value) /100
    if (crossoverPercentage < 0 || crossoverPercentage > 0.8) {  return }
    var maxGenerations      = parseInt (document.getElementById("maxGenerations").value)
    if (maxGenerations < 100 || maxGenerations > 500) { return }



    console.log(  "Tam Matriz:" + sizeMatrix + "\n"
                 + "Can Indiv:" + populationSize + " \n" 
                 + "Pos Inici:" + initPos + "\n"
                 + "Pos Final:" + endPos + "\n"
                 + "Gene:"      + gene + "\n"
                 + "Por Obsta:" + obsPercentage + "\n"
                 + "Por Mutac:" + mutationPercentage + "\n"
                 + "Por Cruce:" + crossoverPercentage + "\n"
                 + "Max Gener:" + maxGenerations +  "\n"
                 );

    //Hay que Revizar que los valores sean correctos 
    newGame = new Game( 550, 550, sizeMatrix, sizeMatrix, "window", "grid", "rect" )
    newGame.drawMatrix()

    ent = new Entorno(sizeMatrix, populationSize, initPos, endPos, gene, obsPercentage, mutationPercentage, crossoverPercentage, maxGenerations);
    ent.generarPoblacionBase();
    ent.colocarPremio(5, 5);
    ent.colocarPremio(10, 11);

    newGame.drawoObject(ent.tablero)        //Dibuja el Tablero
    newGame.drawIndividuals(ent.poblacion, ent.puntoInicial[0], ent.puntoInicial[1])  //Dibuja la población Base

    showSolucion()
}


//Comunicación con el HTML
moveOn = () => {
    newGame.moveOn(newGame.testBallObjet)
}
