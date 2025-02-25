exports.create = (req, res) => {
    res.send({message: "Create handler"});
};

exports.findAll = (req, res) => {
    res.send({message: "Find all handler"});
};

exports.findOne = (req, res) => {
    res.send({message: "Find one handler"});
};

exports.update = (req, res) => {
    res.send({message: "Update handler"});
};

exports.delete = (req, res) => {
    res.send({message: "Delete handler"});
};

exports.deleteAll = (req, res) => {
    res.send({message: "DeleteAll handler"});
};

exports.findAllFavorites = (req, res) => {
    res.send({message: "FindAllFavorites handler"});
};
