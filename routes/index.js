var express = require('express');
var router = express.Router();

/* GET home page. */

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

router.get('/', function(req, res, next) {
  res.render('index',{title:'Quiz' });
});

router.get('/author',function(req,res){
res.render('author',{title:'AUTORES' });
});

//Autoload de rutas que usen :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('userId', userController.load); // autoload :userId
router.param('commentId', commentController.load); //autoload :commentId

//Definición de rutas de quizzes

router.get('/quizzes.:format?',quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?',quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
router.get('/quizzes/new',sessionController.loginRequired,quizController.new);
router.post('/quizzes',sessionController.loginRequired,quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.ownershipRequired,quizController.edit);
router.put('/quizzes/:quizId(\\d+)',sessionController.loginRequired,quizController.ownershipRequired,quizController.update);
router.delete('/quizzes/:quizId(\\d+)',sessionController.loginRequired,quizController.ownershipRequired,quizController.destroy);

//Comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new',sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',sessionController.loginRequired,commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', sessionController.loginRequired,quizController.ownershipRequired,commentController.accept);

// Definición de rutas de cuenta
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // formulario sign un
router.post('/users',                   userController.create);  // registrar usuario
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, 
										userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, 
										userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired, 
										sessionController.adminAndNotMyselfRequired, 
										userController.destroy);  // borrar cuenta sesion
router.get('/session',    sessionController.new);     // formulario login
router.post('/session',   sessionController.create);  // crear sesión
router.delete('/session', sessionController.destroy); // destruir sesión


module.exports = router;

//router.get('/quizzes',quizController.index);
//router.get('/quizzes/:quizId(\\d+)',quizController.show);
