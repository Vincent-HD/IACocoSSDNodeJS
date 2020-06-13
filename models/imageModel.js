'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    imageName: String,
    detections: [{
        class: String,
        score: Number
    }],
    date: Date
});

mongoose.model('images', imageSchema);
