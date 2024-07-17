const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const InvoiceSchema = new mongoose.Schema({
    InvoiceId: {
        type: Number,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: Date,
        default: Date.now
    },
    carModel: {
        type: String,
        required:true
    },
    carColor: {
        type: String,
        required:true
    },
    licencePlate: {
        type: String,
        required:true
    },
    items: [
        {
            description: {
              type: String,
              
            },
            quantity: {
                type: Number,
                
            },
            price: {
                type: Number,
                
            }
        }
    ],

    laborCost: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    }
});

InvoiceSchema.plugin(AutoIncrement, {inc_field: "InvoiceId"});

module.exports = mongoose.model("Invoice", InvoiceSchema);