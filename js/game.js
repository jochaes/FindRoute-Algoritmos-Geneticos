const SVG_NS = "http://www.w3.org/2000/svg";
var id = 1
var objet = {id:"circle", cx: 8, cy: 8, r: 5, stroke: "green", fill: "yellow" }
var liststep = ["D","I","A","B"]


function drawCircle(objet, ventana) {
  let elementFather = document.getElementById(ventana);
  let circle = document.createElementNS(SVG_NS, 'circle');
  for (var name in objet) {
    if (objet.hasOwnProperty(name)) {
      circle.setAttributeNS(null, name, objet[name]);
    }
  }
  elementFather.appendChild(circle);
  return circle;
}


function random_step(list){
  return list[Math.floor(Math.random()*list.length)]; 
} 

function moveOn() {
  let c= document.getElementById('circle');
  let i = 0;
  let x = (c.getAttributeNS(null, "cx") - 8) / 15;
  let y = (c.getAttributeNS(null, "cy") - 8) / 15;
  let step = random_step(liststep);

  //x is column
  if (step == "D") {
    if (x != 48) {
      x = 8 + (x + 1) * 15;
      c.setAttributeNS(null, "cx", x);
    }
    else{
      alert("Can't move on");
    }
  }
  if (step == "I") {
    if (x != 0) {
      x = 8 + (x - 1) * 15;
      c.setAttributeNS(null, "cx", x);
    }
    else{
      alert("Can't move on");
    }
  }
  //y is file
  if (step == "A") {
    if (y != 0) {
      y = 8 + (y - 1) * 15;
      c.setAttributeNS(null, "cy", y);
    }
    else{
      alert("Can't move on");
    }
  }
  if (step == "B") {
    if (y != 36) {
      y = 8 + (y + 1) * 15;
      c.setAttributeNS(null, "cy", y);
    }
    else{
      alert("Can't move on");
    }
  }

}



function crearM() {
  let matiz = new Array(36);
  for (let i = 0; i < 36; i++) {
    matiz[i] = new Array(48);
    for (let j = 0; j < 48; j++) {
      matiz[i][j] = []
    }
  }
  return matiz;
}


circ = drawCircle(objet, "window");