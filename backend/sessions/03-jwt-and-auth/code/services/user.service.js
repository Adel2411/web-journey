import { User } from "../models/user.model.js";

export async function createUser(email, password, name, age) {
  const user = new User({ email, password, name, age });
  await user.save();

  return user;
}
