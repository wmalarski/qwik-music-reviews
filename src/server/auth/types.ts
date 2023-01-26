import type { Session, User } from "next-auth";
import { prisma } from "../db/client";

export type ProtectedRequestContext = {
  prisma: typeof prisma;
  session: Session;
  user: User;
};
