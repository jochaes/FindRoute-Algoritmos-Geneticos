


let newGame = new Game( 540, 540, 35,35, "window", "grid", "rect" )
newGame.drawMatrix()


let ent = new Entorno(35, 10, [32, 32], [2, 2], "", 0.05, 0.5, 0.5, 500);
ent.generarPoblacionBase();
ent.colocarPremio(5, 5);
ent.colocarPremio(10, 11);

//ent.imprimirTablero();
let terminado = false;

const showSolucion  = async() => {


    while (!terminado) { 
        ent.simularEtapa();
        //console.log(ent.poblacion[0].gen[0]);
        newGame.drawIndividuals(ent.poblacion)
        //await newGame.sleep(400);
        await newGame.moveIndividuals()

        terminado = ent.encontroSolucion;
     }
}

showSolucion()


//Comunicación con el HTML

moveOn = () => {
    newGame.moveOn(newGame.testBallObjet)
}