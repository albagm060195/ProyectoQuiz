var express = require('express');
var router = express.Router();

/* GET home page. */

var quizController = require('../controllers/quiz_controller');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author',function(req,res){
res.render('author',{title:'AUTORES' });
});


router.get('/question',quizController.question);
router.get('/check',quizController.check);


module.exports = router;
