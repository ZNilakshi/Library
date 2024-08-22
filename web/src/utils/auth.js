import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const getSession = async (req, res) => {
  return await getServerSession(req, res, authOptions);
};
