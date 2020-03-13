const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


const { Articles , schema } = require("../ressources/articles");


router.post("/", async function(req, res){
     const body = req.body;
   
    const verif = schema.validate(body);
    if(verif.error){
     res.status(400).send(verif.error.details[0].message);
    return ;
    }

    const articles = new Articles(body);
    const resultat = await articles.save(); 
    res.send(resultat);
});

router.get("/", async function(req, res){
    const resultat = await Articles.find() ; 
    res.send(resultat);
});


router.get("/:id", async function(req, res){
    const id = req.params.id;

    const verifID = mongoose.Types.ObjectId.isValid(id);
    if(!verifID){
    res.status(400).send("id donné n'est pas conforme");
    return ;
    }
   
    // vérifier qu'il y a bien un article avec l'id recherché
    const resultat = await Articles.find({_id : id});
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
    const resultat = await Articles.deleteOne({ _id : id});
   
    if(resultat.deletedCount === 0){
    res.status(404).send("il n'existe pas d'enregistrement avec l'id" + id);
    return ;
    }

    const reponse = await Articles.find();
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
    const resultat = await Articles.findById(id);
    if(!resultat){
    res.status(404).send("aucun enregistrement trouvé pour l'id "+ id);
    return ;
    }

    resultat.titre = body.titre;
    resultat.contenu = body.contenu;
    resultat.nomAuteur = body.nomAuteur;
    resultat.categories = body.categories;
    resultat.emailAuteur = body.emailAuteur;
    resultat.estPublie = body.estPublie;

    const reponse = await resultat.save();

    res.send(reponse);

});



module.exports = router;