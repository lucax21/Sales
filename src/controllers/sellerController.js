const Seller = require("../models/Seller");

module.exports = {
    async listAllSellers(req, res) {
        const sellers = await Seller.findAll({
            order: [["name", "ASC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha de conexão." });
        });
        if (sellers) res.status(200).json({ sellers });
        else
            res.status(404).json({ msg: "Não foi possível entrar vendedores." });
    },
};