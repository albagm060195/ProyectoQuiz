var models = require('../models');
var Sequelize = require('sequelize');
var url = require('url');

// Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId,{include:[models.Comment]}).then(function(quiz) {
      		if (quiz) {
        		req.quiz = quiz;
        		next();
      		} else { 
      			throw new Error('No existe quizId=' + quizId);
      		}
        }).catch(function(error){ next(error); });
};

// MW que permite acciones solamente si admin o autor del quiz.
exports.ownershipRequired = function(req, res, next){

    var isAdmin      = req.session.user.isAdmin;
    var quizAuthorId = req.quiz.AuthorId;
    var loggedUserId = req.session.user.id;

    if (isAdmin || quizAuthorId === loggedUserId) {
        next();
    } else {
      console.log('Operación prohibida: El usuario logeado no es el autor del quiz, ni un administrador.');
      res.send(403);
    }
};

// GET /quizzes
exports.index = function(req, res, next){

if(req.query.buscador){
var search = '%' + req.query.buscador + '%' ;
search = search.replace(/ /g, "%");
models.Quiz.findAll({where: ["question like ?", search]}).then(function(quizzes) {
res.render('quizzes/index.ejs',{quizzes: quizzes});
}).catch(function(error){next(error);
});
}

else if(req.url=='/quizzes.json'){
models.Quiz.findAll().then(function(quizzes){
res.json({quizzes:quizzes});
}).catch(function(error){
next(error);}
);}

else{
models.Quiz.findAll().then(function(quizzes){
res.render('quizzes/index.ejs',{quizzes: quizzes});
}).catch(function(error){next(error);
});
}
};




//Get /quizzes/:id
exports.show = function(req, res, next){
models.Quiz.findById(req.params.quizId).then(function(quiz){
if(quiz){
var answer = req.query.answer || '';
if(req.url=='/quizzes/'+req.params.quizId+'.json'){
res.json('quizzes/show.ejs',{quiz: req.quiz, answer:answer}); // esto nuevo tambien
}else{
res.render('quizzes/show.ejs',{quiz: req.quiz, answer:answer});} //este else es nuevo
} else { throw new Error('No existe ese quiz en la BBDD.');}
}).catch(function(error){ next(error);});
};

// GET /quizzes/new
exports.new = function(req,res,next){
var quiz = models.Quiz.build({question: "", answer: ""});
res.render('quizzes/new.ejs',{quiz: quiz});
};


// POST /quizzes/create
exports.create = function(req,res,next){
 var authorId = req.session.user && req.session.user.id || 0;
var quiz = models.Quiz.build({ question: req.body.quiz.question,
answer: req.body.quiz.answer,AuthorId: authorId});

//guarda en DB los campos pregunta y respuesta de quiz

  quiz.save({fields: ["question", "answer","AuthorId"]}).then(function(quiz) {
		req.flash('success', 'Quiz creado con éxito.');
    	res.redirect('/quizzes');  // res.redirect
// Redirección HTTP a lista de preguntas
    }).catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('quizzes/new', {quiz: quiz});
    })
    .catch(function(error) {
		req.flash('error', 'Error al crear un Quiz: '+error.message);
		next(error);
	});  
};

// GET /quizzes/: id/edit
exports.edit = function(req,res,next){
var quiz = req.quiz; //req.quiz:autoload
                     // de instancia de quiz
res.render('quizzes/edit.ejs', {quiz:quiz});//Redireccion HTTP a lista de preguntas
};

//DELETE / quizzes/:id
exports.destroy = function(req, res, next) {
  req.quiz.destroy()
    .then( function() {
	  req.flash('success', 'Quiz borrado con éxito.');
      res.redirect('/quizzes');
    })
    .catch(function(error){
	  req.flash('error', 'Error al editar el Quiz:'+error.message);
     next(error);
   });
};


// PUT /quizzes/:quizId
exports.update = function(req, res, next) {

  req.quiz.question = req.body.quiz.question;
  req.quiz.answer   = req.body.quiz.answer;

  req.quiz.save({fields: ["question", "answer"]}).then(function(quiz) {

        req.flash('success', 'Pregunta y Respuesta editadas con éxito.');
        res.redirect('/quizzes');
    }).catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('quizzes/edit.ejs', {quiz: req.quiz});
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};




//GET / quizzes/:id/check
exports.check = function(req, res){
models.Quiz.findById(req.params.quizId).then(function(quiz){
if(quiz){
var answer = req.query.answer || "" ;
var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
res.render('quizzes/result',{quiz: req.quiz, result: result, answer: answer});}
else{throw new Error('No existe ese quiz en la BBDD');}
}).catch(function(error){next(error);});
};

