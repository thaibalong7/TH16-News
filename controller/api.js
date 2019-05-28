const db = require('../models');
const helper = require('../helper');

exports.getAllCatagories = async (req, res) => {
    try {
        const query = {
            include: [{
                model: db.sub_categories
            }]
        }
        db.categories.findAll(query).then(_data => {
            return res.status(200).json({
                data: _data
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getLatestNews = async (req, res) => {
    try {
        const query = {
            attributes: ['id', 'title', 'avatar'],
            limit: 3,
            offset: 0,
            order: [['createdAt', 'DESC']]
        }
        db.news.findAll(query).then(_data => {
            const result = [];
            for (let i = 0, l = _data.length; i < l; i++) {
                _data[i] = _data[i].dataValues;
                _data[i].link = '/news/' + _data[i].id + '/' + helper.slugify(_data[i].title);
                result.push(_data[i]);
            }
            return res.status(200).json({
                data: result
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getLatestNewsByCategory = async (req, res) => {
    try {
        const _sub_categories = await db.sub_categories.findAll({
            where: {
                fk_category: req.params.id
            }
        });
        const list_id_sub_category = [];
        for (let i = 0, l = _sub_categories.length; i < l; i++) {

            list_id_sub_category.push(_sub_categories[i].id);
        }
        const query = {
            where: {
                fk_sub_category: {
                    [db.Sequelize.Op.or]: list_id_sub_category
                }
            },
            attributes: ['id', 'title', 'avatar'],
            limit: 3, //lấy 3 bài thôi
            offset: 0,
            order: [['createdAt', 'DESC']]
        }
        db.news.findAll(query).then(_data => {
            const result = [];
            for (let i = 0, l = _data.length; i < l; i++) {
                _data[i] = _data[i].dataValues;
                _data[i].link = '/news/' + _data[i].id + '/' + helper.slugify(_data[i].title);
                result.push(_data[i]);
            }
            return res.status(200).json({
                data: result
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getLatestNewsByIdNews = async (req, res) => {
    try {
        const _news = await db.news.findOne({
            attributes: ['id', 'fk_sub_category'],
            where: {
                id: req.params.id
            },
            include: [{
                model: db.sub_categories,
                attributes: ['id', 'fk_category'],
                include: [{
                    model: db.categories,
                    attributes: ['id'],
                }]
            }]
        })
        const _sub_categories = await db.sub_categories.findAll({
            where: {
                fk_category: _news.sub_category.category.id
            }
        });
        const list_id_sub_category = [];
        for (let i = 0, l = _sub_categories.length; i < l; i++) {

            list_id_sub_category.push(_sub_categories[i].id);
        }
        const query = {
            where: {
                fk_sub_category: {
                    [db.Sequelize.Op.or]: list_id_sub_category
                }
            },
            attributes: ['id', 'title', 'avatar'],
            limit: 3, //lấy 3 bài thôi
            offset: 0,
            order: [['createdAt', 'DESC']]
        }
        db.news.findAll(query).then(_data => {
            const result = [];
            for (let i = 0, l = _data.length; i < l; i++) {
                _data[i] = _data[i].dataValues;
                _data[i].link = '/news/' + _data[i].id + '/' + helper.slugify(_data[i].title);
                result.push(_data[i]);
            }
            return res.status(200).json({
                data: result
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getCategoriesAndNumNews = async (req, res) => {
    try {
        const query = {
            include: [{
                model: db.sub_categories,
                include: [{
                    model: db.news,
                    attributes: ['id']
                }]
            }]
        }
        db.categories.findAll(query).then(async _categories => {
            const result = [];
            for (let i = 0, l = _categories.length; i < l; i++) {
                let num_news = 0;
                for (let j = 0; j < _categories[i].sub_categories.length; j++) {
                    num_news += _categories[i].sub_categories[j].news.length;
                }
                result.push({
                    name: _categories[i].name,
                    link: '/category/' + _categories[i].id + '/' + helper.slugify(_categories[i].name),
                    num_news: num_news
                })
            }
            return res.status(200).json({
                data: result
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getNewsById = async (req, res) => {
    try {
        db.news.findByPk(req.params.id).then((_news) => {
            if (_news) {
                if (helper.slugify(_news.title) === req.params.name)
                    return res.status(200).json({
                        data: _news
                    })
                else return res.status(400).json({ msg: 'Wrong path' })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id news' })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}