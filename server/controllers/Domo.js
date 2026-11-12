const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.teethNum) {
        return res.status(400).json({
            error: 'Both name and age are required!',
        });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        teethNum: req.body.teethNum,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({
            name: newDomo.name,
            age: newDomo.age,
            teethNum: newDomo.teethNum,
        });
    } catch (err) {
        console.log(err);
        // duplicate error 
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'Domo already exists!',
            });
        }
        return res.status(500).json({
            error: 'An error ocurred making domo!',
        });
    }
};

const getDomos = async (req, res) => {
    try {
        const query = {
            owner: req.session.account._id,
        };
        const docs = await Domo.find(query).select('name age teethNum createdDate').lean().exec();

        return res.json({
            domos: docs,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Error retrieving domos!',
        });
    }
};

const deleteDomo = async (req, res) => {
    try {
        const query = {
            name: req.body.name,
            age: req.body.age,
            teethNum: req.body.teethNum,
            createdDate: req.body.createdDate,
            owner: req.session.account._id,
        };
        await Domo.deleteOne(query).lean().exec();

        return res.status(204).end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Error deleting domo!',
        });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
};