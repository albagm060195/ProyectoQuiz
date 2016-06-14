
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
// Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);





exports.Quiz = Quiz;
exports.Comment = Comment;

