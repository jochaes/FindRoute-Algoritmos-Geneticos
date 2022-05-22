

console.log("hola")

let newGame = new Game( 540, 540, 25,30, "window", "grid", "rect" )

newGame.drawMatrix()

newGame.drawCircle(newGame.testBallObjet, newGame.ventana, "1")

// let ent = new Entorno(35, 10, [32, 32], [2, 2], "", 0.05, 0.5, 0.5, 500);
// ent.generarPoblacionBase();
// ent.colocarPremio(5, 5);
// ent.colocarPremio(10, 11);

// ent.imprimirTablero();
// let terminado = false;
// while (!terminado) { ent.simularEtapa(); terminado = ent.encontroSolucion; }



//Comunicación con el HTML

moveOn = () => {

    newGame.moveOn("1")
    
}