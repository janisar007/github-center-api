import { requireAuth } from "@clerk/express";

export const validateToken = (req, res, next) => {
  requireAuth({
    unauthorized: (req, res) => res.status(401).json({ error: "Unauthorized" }),
  });

  next();
};
