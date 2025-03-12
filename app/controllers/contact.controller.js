const ContactService = require('../services/contact.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

// create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(404,"Name cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred creating the contact"));
    }
};

// Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
        res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "An error occurred retrieving contacts "+ error.message));
    };
};

// find a single contact with an id
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `An error occurred retrieving contact with id {req.params.id}`));
    }
};

// Update a contact with the specified id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update cannot be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, `cannot update contact with id=${req.params.id}`));
        }
        return res.send({message: "contact was update successfully"});
    } catch (error) {
        return next(new ApiError(500, `An error occurred updating contact with id=${req.params.id}`));
    }
};

// Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, `Cannot delete contact with id=${req.params.id}`));
        }
        return res.send({ message: "contact was deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `An error occurred deleting contact with id=${req.params.id}`));

    }
};

// Delete all contacts of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({ 
            message: `Successfully deleted ${deletedCount} contacts` });
    } catch (error) {
        return next(new ApiError(500, "An error occurred deleting all contacts"));
    }
};

// Retrieve all favorite contacts of a user from the database
exports.findAllFavorites = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "An error occurred retrieving favorite contacts "+ error.message));
    }
};
