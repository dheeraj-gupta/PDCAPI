var express = require('express');

var routes = function (PDC) {
    
    var pdcRouter = express.Router();
    
    pdcRouter.route('/')
.post(function (req, res) {
        PDC.find({'sessionID': req.body.sessionID}).count(function(err,count){
            if(err){
                next(err,null);
            }else{
                if(count!==0){
                    res.status(500).send("sessionID allready Exists");
                } else{

                    var pdc = new PDC(req.body);
                    pdc.save(function(err){

                        if(err)
                            res.status(500).send(err);
                        else{
                            res.status(201).send(pdc);
                        }

                    });
                }
            }

        });

    })
.get(function (req, res) {
        var query = {};
        if (req.query.sessionID) {
            query.sessionID = req.query.sessionID;
        }
        PDC.find(query, function (err, pdckeys) {
            if (err)
                res.status(500).send(err);
            else
                res.json(pdckeys);
        });
	
    });
    
    pdcRouter.use('/:sessionID', function (req, res, next) {
        PDC.findById(req.params.sessionID, function (err, pdcContainer) {
            if (err)
                res.status(500).send(err);
            else if (pdcContainer) {
                req.pdcContainer = pdcContainer;
                next();
            }
            else {
                
                res.status(404).send('no PDC found');
            }
			
        });
    });
    pdcRouter.route('/:sessionID')
.get(function (req, res) {
        
        res.json(req.pdcContainer);
	
    })
.put(function (req, res) {
        
        if(!req.body) return res.sendStatus(400);
        else{

            for(var dbnodeskey in req.pdcContainer._doc.nodes){

                    for( var nodeskey in req.body.nodes){

                        if(req.pdcContainer._doc.nodes[dbnodeskey].appkey == req.body.nodes[nodeskey].appkey){

                            if(req.body.nodes[nodeskey].node.length>0){
                                if(req.pdcContainer._doc.nodes[dbnodeskey].node.length==0){

                                    req.pdcContainer._doc.nodes[dbnodeskey].node = req.body.nodes[nodeskey].node;
                                }

                                for(var dbnodekey in req.pdcContainer._doc.nodes[dbnodeskey].node){

                                    for( var nodekey in req.body.nodes[nodeskey].node){

                                        if(req.pdcContainer._doc.nodes[dbnodeskey].node[dbnodekey].key == req.body.nodes[nodeskey].node[nodekey].key){

                                            req.pdcContainer._doc.nodes[dbnodeskey].node[dbnodekey] = req.body.nodes[nodeskey].node[nodekey];
                                        }
                                    }
                                }
                            }
                        }
                    }
            }


            req.pdcContainer.markModified('nodes');
            req.pdcContainer.save(function(err,next){
            if(err)
                res.status(500).send(err);
            else{
                res.json(req.pdcContainer);
            }
        });
        
        }

	
    })
    
    return pdcRouter;
};


module.exports = routes;