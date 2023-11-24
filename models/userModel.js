class UserModel {
  constructor(db) {
    this.db = db;
  }

  registerUser (username, email, encryptedPassword) {
    return this.db("users").returning(["id", "username"]).insert({
      username: username,
      email: email,
      password: encryptedPassword,
    });
  }

  loginByUsername (username) {
    return this.db("users").where("username", username).first();
  }

  async editProfile(id, username, email, name, password, photo) {
    try {
      await this.db("users").where("id", id).update({
        username: username,
        email: email,
        name: name,
        password: password,
        photo: photo,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const data = await this.db.select("*").from("users");
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const data = await this.db.select("*").from("users").where("id", id).first();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createUserByAdmin(username, email, name, password, photo, role) {
    try {
      await this.db("users").insert({
        username: username,
        email: email,
        name: name,
        password: password,
        photo: photo,
        role: role,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserByAdmin(id, username, email, name, password, photo, role) {
    try {
      await this.db("users").where("id", id).update({
        username: username,
        email: email,
        name: name,
        password: password,
        photo: photo,
        role: role,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const result = await this.db("users").where("id", id).delete().returning("id");
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel
