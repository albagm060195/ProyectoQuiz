var express = require('express');
var router = express.Router();

/* GET home page. */

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');

router.get('/', function(req, res, next) {
  res.render('index',{title:'Quiz' });
});

router.get('/author',function(req,res){
res.render('author',{title:'AUTORES' });
});

//Autoload de rutas que usen :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('userId', userController.load); // autoload :userId

//Definición de rutas

router.get('/quizzes.:format?',quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?',quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
router.get('/quizzes/new',quizController.new);
router.post('/quizzes',quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',quizController.edit);
router.put('/quizzes/:quizId(\\d+)',quizController.update);
router.delete('/quizzes/:quizId(\\d+)',quizController.destroy);

//Comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',commentController.create);

// Definición de rutas de cuenta
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // formulario sign un
router.post('/users',                   userController.create);  // registrar usuario
router.get('/users/:userId(\\d+)/edit', userController.edit);
router.put('/users/:userId(\\d+)',	userController.update);
router.delete('/users/:userId(\\d+)',	userController.destroy);


module.exports = router;

//router.get('/quizzes',quizController.index);
//router.get('/quizzes/:quizId(\\d+)',quizController.show);
