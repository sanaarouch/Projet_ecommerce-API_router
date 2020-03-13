const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const { Utilisateurs , schema } = require("../ressources/utilisateurs");


router.post("/", async function(req, res){
    const body = req.body;
    const verif = schema.validate(body);
   if(verif.error){
        res.status(400).send(verif.error.details[0].message);
        return ;
    }
    
    const utilisateurs = new Utilisateurs(body);
    const resultat = await utilisateurs.save();
    res.send(resultat);
});

router.get("/", async function(req, res){
    const resultat = await Utilisateurs.find() ; 
    res.send(resultat);
});

router.get("/:id", async function(req, res){
    const id = req.params.id;
    const verifID = mongoose.Types.ObjectId.isValid(id);
    if(!verifID){
        res.status(400).send("id donné n'est pas conforme");
        return ;
    }
   const resultat = await Utilisateurs.find({_id : id}); 
    if(resultat.length === 0){
        res.status(404).send("aucun enregistrement avec l'id "+ id);
        return ;
    }
    res.send(resultat);
});

router.delete("/:id", async function(req, res){
    const id = req.params.id ;
    const verifID = mongoose.Types.ObjectId.isValid(id);
    if(!verifID){
        res.status(400).send("l'id transmis n'est pas conforme");
        return ;
    }
    const resultat = await Utilisateurs.deleteOne({ _id : id});
   
    if(resultat.deletedCount === 0){
        res.status(404).send("il n'existe pas d'enregistrement avec l'id" + id);
        return ;
    }
    const reponse = await Utilisateurs.find();
    res.send(reponse);
})

router.put("/:id", async function(req,res){
     const id = req.params.id ;
     const verifID = mongoose.Types.ObjectId.isValid(id);

    if(!verifID){
        res.status(400).send("id non conforme !");
        return ;
    }
    
    const body = req.body ;
    const verif = schema.validate(body); 
    if(verif.error){
        res.status(400).send(verif.error.details[0].message);
        return;
    }
    const resultat = await Utilisateurs.findById(id);
    if(!resultat){
        res.status(404).send("aucun enregistrement trouvé pour l'id "+ id);
        return ;
    }
 
    resultat.nom = body.nom;
    resultat.prenom = body.prenom;
    resultat.email = body.email;
    resultat.password = body.password;
    resultat.role = body.role;
    resultat.estActif = body.estActif;

    const reponse = await resultat.save();

    res.send(reponse);

});


module.exports = router;