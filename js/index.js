

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


let newGame 
let ent 



const showSolucion  = async() => {

    let terminado = false;
    while (!terminado) { 
        ent.simularEtapa();                      //Cada etapa es una generación 
        var gen = "*******Info Generación " + ent.generacion + " *******" 
        console.log(gen);

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

    var sizeMatrix          = parseInt( document.getElementById("sizeMatrix").value )
    var populationSize      = parseInt( document.getElementById("populationSize").value )
    var initPos             = document.getElementById("initPos").value.split(",").map(Number)
    var endPos              = document.getElementById("endPos").value.split(",").map(Number)
    var gene                = document.getElementById("gene").value
    var obsPercentage       = parseInt (document.getElementById("obsPercentage").value) / 100
    var mutationPercentage  = parseInt (document.getElementById("mutationPercentage").value) /100
    var crossoverPercentage = parseInt (document.getElementById("crossoverPercentage").value) /100
    var maxGenerations      = parseInt (document.getElementById("maxGenerations").value)


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
    newGame = new Game( 350, 350, sizeMatrix, sizeMatrix, "window", "grid", "rect" )
    newGame.drawMatrix()

    ent =     new Entorno(sizeMatrix, populationSize, initPos, endPos, gene, obsPercentage, mutationPercentage, crossoverPercentage, maxGenerations);
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