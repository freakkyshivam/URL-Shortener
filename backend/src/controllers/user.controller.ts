import db from '../db/db.js'
import { userTable } from '../models/user.model.js'
import { Response } from 'express'
import { AuthRequest } from '../types/auth-request.js'
import { urlsTable } from '../models/url.model.js'
 import { clerkClient, getAuth } from '@clerk/express'
import { eq, sql } from 'drizzle-orm'

export const userInfo = async (req: AuthRequest, res: Response) => {

  try {

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credential"
      });
    }

    const [data] = await db
      .select({
        id: userTable.id,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        email: userTable.email
      })
      .from(userTable)
      .where(eq(userTable.clerkId, userId));

    return res.json(data);

  } catch (error: any) {

    console.error(error.message);

    return res.status(500).json({
      success: false
    });

  }

};


export const getUserUrls = async (req: AuthRequest, res: Response) => {

  try {

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "You must be logged in"
      });
    }

    // find user in  DB
    const [dbUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.clerkId, userId));

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    // fetch urls using internal UUID
    const urls = await db
      .select({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetUrl: urlsTable.targetUrl,
        clicks: urlsTable.clicks,
        createdAt: urlsTable.createdAt
      })
      .from(urlsTable)
      .where(eq(urlsTable.userId, dbUser.id))
      .orderBy(urlsTable.createdAt);

    return res.json({
      success: true,
      urls
    });

  } catch (error: any) {

    console.error(error.message);

    return res.status(500).json({
      success: false
    });

  }

};


 
