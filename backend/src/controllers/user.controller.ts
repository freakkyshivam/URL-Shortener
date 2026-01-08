import db from '../db/db.js'
import { userTable } from '../models/user.model.js'
import { Response } from 'express'
import { AuthRequest } from '../types/auth-request.js'
import { urlsTable } from '../models/url.model.js'
import { success } from 'zod'
import { eq, sql } from 'drizzle-orm'

export const userInfo = async (req:AuthRequest, res:Response)=>{
    try {
        const user = req.user;

        if(!user){
            return res.status(401).json({success:false, msg:"Invalid credential"})
        }

        const [data] = await db.select({
            id:userTable.id,
            firstName : userTable.firstName,
            lastName : userTable.lastName,
            email : userTable.email
        }).from(userTable).where((table)=> eq(table.id, user.id))

        res.json(data)
    } catch (error:any) {
        console.error(error.message)
    }
}

export const getUserUrls = async (req: AuthRequest, res: Response) => {
    try {
        const user = req?.user

        if (!user?.id) {
            return res.status(401).json({ success: false, msg: "You must be logged in to access this resource" })
        }

        const urls = await db.select({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode,
            targetUrl: urlsTable.targetUrl,
            clicks: urlsTable.clicks,
            createdAt: urlsTable.createdAt
        }).from(urlsTable)
        .where(eq(urlsTable.userId,  sql`${user.id}::uuid`))
        .orderBy(urlsTable.createdAt)

        return res.status(200).json({ success: true, urls })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}
