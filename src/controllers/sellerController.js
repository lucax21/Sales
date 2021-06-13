const Seller = require("../models/Seller");
const Sequelize = require("sequelize");
const saleRouter = require("../routes/saleRouter");

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

    async searchSellerByName(req, res) {
        const name = req.body.name;
        if (!name)
            res.status(400).json({
                msg: "Parâmetro nome está vazio.",
            });
        const Op = Sequelize.Op;
        const seller = await Seller.findAll({
            where: { name: { [Op.like]: "%" + name + "%" } },
        });
        console.log(seller);
        if (seller) {
            if (seller == "")
                res.status(404).json({ msg: "Vendedor não encontrado." });
            else res.status(200).json({ seller });
        }
        else res.status(404).json({ msg: "Vendedor não encontrado." });
    },
    async newSeller(req, res) {
        const { name, email, password } = req.body;
        if (!name || !name || !password) {
            res
                .status(400)
                .json({
                    msg: "Dados obrigatórios não foram preenchidos."
                });
        }
        // Procura no BD vendedores já existente
        const isSellerNew = await Seller.findOne({
            where: { email },
        });
        if (isSellerNew)
            res.status(403).json({ msg: "Vendedor já cadastrado." });
        else {
            const seller = await Seller.create({
                name, email, password,
            }).catch((error) => {
                res.status(500).json({ msg: "Não fio possível inserir os dados." });
            });
            if (seller)
                res.status(201).json({ msg: "Novo vendedor foi adicionado." });
            else
                res.status(404).json({
                    msg: "Não foi possível cadastrar novo paciente."
                });
        }
    },
    async deleteSeller(req, res) {
        const sellerId = req.params.id;
        const deletedSeller = await Seller.destroy({
            where: { id: sellerId },
        }).catch(async (error) => {
            const sellerHasRef = await Sale.findOne({
                where: { sellerId },
            }).catch((error) => {
                res.status(500).json({ msg: "Falha na conexão." });
            });
            if (sellerHasRef)
                return res
                    .status(403)
                    .json({ msg: "Vendedor possui vendas em seu nome." });
        });
        if (deletedSeller != 0)
            res.status(200).json({ msg: "Vendedor excluido com sucesso." });
        else res.status(404).json({ msg: "Vendedor não encontrado." });
    },
    async updateSaller(req, res) {
        const sellerId = req.body.id;
        const seller = req.body;
        if (!sellerId)
            res.status(400).json({ msg: "ID do vendedor vazio." });
        else {
            const sellerExists = await Seller.findByPk(sellerId);
            if (!sellerExists)
                res.status(404).json({ msg: "Vendedor não encontrado." });
            else {
                if (seller.name || seller.email) {
                    await Seller.update(seller, {
                        where: { id: sellerId },
                    });
                    return res
                        .status(200)
                        .json({ msg: "Vendedor atualizado com sucesso." });
                }
                else
                    return res
                        .status(400)
                        .json({ msg: "Campos obrigatórios não preenchidos." });
            }
        }
    },
};