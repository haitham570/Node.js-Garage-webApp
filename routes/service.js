const express = require("express");
const router = express.Router();
const Price = require("../models/Price");
const auth = require("../middleware/auth");

router.get("/prices/:serviceName", auth, async (req, res)=>{
    try {
        const {serviceName} = req.params;
        const prices = await Price.find({serviceName});
        res.json(prices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/prices", auth, async(req, res)=>{
    const {serviceName, description, amount} = req.body;
    console.log("Received new price data:", { serviceName, description, amount });
    try {
        const newPrice = new Price({
            serviceName,
            description,
            amount,
        });
        const price = await newPrice.save();
        res.json(price);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put("/prices/:id", auth, async(req, res)=>{
    const {description, amount} = req.body;
    try {
        const price = await Price.findById(req.params.id);
        if(!price){
            return res.status(400).json({msg:"Price not found"});
        }
        price.description = description;
        price.amount = amount;

        await price.save();
        res.json(price);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/prices/:id", auth, async(req, res)=>{
    try {
        const price = await Price.findById(req.params.id);
        if (!price) {
            return res.status(404).json({ msg: "Price not found" });
        }

        await price.deleteOne();
        res.json({ msg: "Price removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;