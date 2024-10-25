const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    sobrenome: { 
        type: String, 
        required: true 
    },
    dataNascimento: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(v) {
                // Verifica se a data de nascimento não é no futuro
                return v <= new Date();
            },
            message: 'Data de nascimento não pode ser no futuro.'
        }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: [validator.isEmail, 'Email inválido'] // Valida se o email é válido
    },
    senha: { 
        type: String, 
        required: true 
    },
    resetPasswordToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date 
    }
}, { timestamps: true }); // Adiciona timestamps para createdAt e updatedAt

// Adiciona índice único para o campo email
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
