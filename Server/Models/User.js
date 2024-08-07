const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    registered: { type: Date, default: Date.now },
    sessionToken: { type: String, default: null },
    session: { type: Date, default: null },
    theme: { type: String, default: '#FFFFFF' }
}, { versionKey: 'version' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// User = Model Name
// userSchema = Schema Definition
// User(s) = Collection Name
const User = mongoose.model('User', userSchema, 'User(s)');

module.exports = User;