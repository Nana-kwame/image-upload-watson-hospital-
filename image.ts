import * as mongoose from 'mongoose';

//INTERFACE FOR TS

export interface IImageModel extends mongoose.Document {
    filename: string; 
    originalName: string; 
    desc: string;
    hosID: string;
    created: Date;
};


//Actual DB Model
export var imageSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    hosID: String,
    created: { type: Date, default: Date.now }
});

export const Image = mongoose.model<IImageModel>('Image', imageSchema);