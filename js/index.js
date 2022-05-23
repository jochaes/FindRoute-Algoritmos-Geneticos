

// Se crea el juego con 
//Una ventana de 540x540 
//Una matriz de 35 x 35 
let newGame = new Game( 540, 540, 35,35, "window", "grid", "rect" )
newGame.drawMatrix()

//Se crea lo del algorito genetivo 
let ent = new Entorno(35, 10, [32, 32], [2, 2], "", 0.05, 0.5, 0.5, 500);
ent.generarPoblacionBase();
ent.colocarPremio(5, 5);
ent.colocarPremio(10, 11);

//ent.imprimirTablero();
let terminado = false;

const showSolucion  = async() => {


    while (!terminado) { 
        ent.simularEtapa();                      //Cada etapa es una generación 
        //console.log(ent.poblacion[0].gen[0]);
        newGame.drawIndividuals(ent.poblacion)  //Se saca la poblacion de individuos de la etaoa actual
        //await newGame.sleep(400);
        await newGame.moveIndividuals()         //Se mueven los individuos de la etapa actual 

        terminado = ent.encontroSolucion;       //Termina cuando encuentra la solución
     }
}

showSolucion()    //Empieza a ejecutar el programa 


//Comunicación con el HTML
moveOn = () => {
    newGame.moveOn(newGame.testBallObjet)
}