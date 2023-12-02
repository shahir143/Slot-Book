const express= require('express');
const route=express.Router();
const controlleradmin=require('../controllers/user');

route.get('/meet',controlleradmin.getMeetings)
route.post('/book-slot',controlleradmin.saveSlot);
route.delete('/cancel-slot/:id',controlleradmin.deleteSlot);
route.get('/slots/:id',controlleradmin.getSlots);


module.exports=route;