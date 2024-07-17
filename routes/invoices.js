const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

const CANADIAN_TAX_RATE = 0.13;

router.post("/invoices", auth, async(req, res)=>{
    const {clientName, email, carModel, carColor, licencePlate, items, laborCost} = req.body;

    try {
        let itemsTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        console.log("Items total:", itemsTotal); // Add this line for debugging

        let total = laborCost + itemsTotal;
        console.log("Total before tax:", total); // Add this line for debugging

        const tax = total * CANADIAN_TAX_RATE;
        const grandTotal = total + tax;

        console.log("Labor cost:", laborCost, "Tax:", tax, "Grand total:", grandTotal);

        const newInvoice = new Invoice({clientName, email, carModel, carColor, licencePlate, items, laborCost, tax, total: grandTotal});
        await newInvoice.save();
        res.json(newInvoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/invoices", auth, async(req, res)=>{
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/invoices/:id", auth, async(req, res)=>{
    try {
        const invoice = await Invoice.findById(req.params.id);
        if(!invoice){
            return res.status(404).json({msg: "Invoice not found"});
        }

        res.json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put("/invoices/:id", auth, async(req, res)=>{
    const {clientName, email, carModel, carColor, licencePlate, items, laborCost} = req.body;
    try {
        let invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }

        let total = laborCost + items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = total * CANADIAN_TAX_RATE;
        const grandTotal = total + tax;

        invoice.clientName = clientName;
        invoice.email = email;
        invoice.carModel = carModel;
        invoice.carColor = carColor;
        invoice.licencePlate = licencePlate;
        invoice.items = items;
        invoice.laborCost = laborCost;
        invoice.total = grandTotal;

        const updatedInvoice = await invoice.save();
        res.json(updatedInvoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/invoices/:id", auth, async (req, res)=>{
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        await invoice.deleteOne({_id: req.params.id});
        res.json({ msg: 'Invoice removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get("/invoices/:email", auth, async (req, res) => {
    try {
        const email = req.query.email;
        console.log(`Fetching invoices for email: ${email}`); // Debug log

        const invoices = await Invoice.find({ email });
        if (!invoices || invoices.length === 0) {
            console.log('No invoices found for the provided email'); // Debug log
            return res.status(404).send('No invoices found');
        }

        console.log(`Found ${invoices.length} invoices`); // Debug log
        res.json(invoices);
    } catch (err) {
        console.error('Server error:', err.message); // Improved error logging
        res.status(500).send('Server error');
    }
});



module.exports = router