import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUsers(req, res) {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin") {
      return res.status(403).json({ error: "You don't have access to this resource" });
    }

    const users = await prisma.user.findMany({
        select: {
        id: true,
        name: true,
        email: true,
        role: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}


export async function findUserById(req, res) {
  const goodId = parseInt(req.params.id);
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You don't have access to this resource" });
    }

    const user = await prisma.user.findUnique({
      where: { id: goodId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}


export async function deleteUser(req, res) {
  const goodId = parseInt(req.params.id);
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You don't have access to this resource" });
    }

    const user = await prisma.user.findUnique({
      where: { id: goodId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: goodId },
    });

    res.send("user deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}


export async function addUser(req, res) {
  const { name, email, password, role } = req.body
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You don't have access to this resource" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || "user",
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req, res) {
  const goodId = parseInt(req.params.id);
  const { name, email, age, role } = req.body;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You don't have access to this resource" });
    }

    const user = await prisma.user.findUnique({
      where: { id: goodId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: goodId },
      data: {
        name: name ,
        email: email,
        age: age,
        role: role,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}
