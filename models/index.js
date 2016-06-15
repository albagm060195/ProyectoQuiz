
var path = require('path');

// Cargar ORM
var Sequelize = require('sequelize');

var url, storage;

if (!process.env.DATABASE_URL) {
    url = "sqlite:///";
    storage = "quiz.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,{ storage:storage,omitNull:true });

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
// Importar la definicion de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));
//Importar definicion USER
var User = sequelize.import(path.join(__dirname,'user'));
// Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relacion 1 a N entre User y Quiz:
User.hasMany(Quiz,{foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});
//Relacion 1 a N entre User y Comment
User.hasMany(Comment,{foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as:'Author',foreignKey:'AuthorId'});



exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;
