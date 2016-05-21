var noeud = {
  donnée: 0,
  droite: null,
  gauche: null,
  pere: null,
}

var arbre = {
  nom: "abre de décision",
  racine: Object.create(noeud),
  actuel: null,
  compteur:0,
  hauteur:0,
  getNom: function(){
    console.log(this.nom);
  }
}

console.log("salut");
