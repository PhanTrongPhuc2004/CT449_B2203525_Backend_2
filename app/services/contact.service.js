const { ObjectId} = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            address: payload.address,
            favorite: payload.favorite,
        };
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(contact,
            {$set: {favorite: contact.favorite === true}},
            {returnsDocument: "after", upsert: true}
        );
        console.log(result);
        return result;
    }

    // Method to find contacts by filter
    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    // Method to find contacts by name
    async findByName(name) {
        return await this.find({
            name: {$regex: new RegExp(new RegExp(name)), $options: "i"}
        });
    }

    // method find contact by id
    async findById(id) {
        return await this.Contact.findOne({ 
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,});
    }

    // method to update contact by id
    async updateById(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(filter, 
            {$set: update}, 
            {returnDocument: "after"});
    }

    // method to delete contact by id
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id)? new ObjectId(id) : null,
        });
        return result;
    }

    // method to delete all contacts
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }

    // method to find all favorite contacts
    async findFavorite() {
        return await this.find({favorite: true});
    }
}

module.exports = ContactService;