/*
Creation d'un arbre d'hauteur 6.
Chaque noeud correspond à un test et débouche sur un autre test.
Chaque feuille représente une valeur à retourner.

*/

var noeud = {
  donnée: 0,
  nbFils:0,
  fils:[];
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
