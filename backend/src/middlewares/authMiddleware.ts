import { userTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";
import db from "../db/db.js";
import { Request, Response, NextFunction } from "express";
import { getAuth,clerkClient } from "@clerk/express";



export const ensureUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { userId } = getAuth(req);


    if (!userId) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await db.select()
        .from(userTable)
        .where(eq(userTable.clerkId, userId));

    if (!user.length) {
      const clerkUser = await clerkClient.users.getUser(userId);
        await db.insert(userTable).values({
            clerkId: userId,
            firstName : clerkUser.firstName || "",
            lastName : clerkUser.lastName || "",
            email: clerkUser.emailAddresses[0].emailAddress,
  
        });

    }

    next();

};


