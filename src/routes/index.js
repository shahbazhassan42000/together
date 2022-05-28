import express from "express";
import user from "./user";

const { Router } = express;
const api = Router();

// book directory apis
api.use("/user", user);

export default api;
