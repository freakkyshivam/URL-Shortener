import { Response } from 'express'
import { AuthRequest } from '../types/auth-request'
import {urlShortenBodySchema } from '../validation/request.validation'
import {nanoid} from 'nanoid'

import db from '../db/db'
import { urlsTable } from '../models/url.model'
import { success } from 'zod'
import { eq, sql } from 'drizzle-orm'


export const deleteUrl = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user?.id
        const { id } = req.params

        if (!userId) {
            return res.status(401).json({ success: false, msg: "You must be logged in to access this resource" })
        }

        if (!id) {
            return res.status(400).json({ success: false, msg: "URL ID is required" })
        }

        // First check if the URL belongs to the user
        const [url] = await db.select().from(urlsTable).where(eq(urlsTable.id, id))

        if (!url) {
            return res.status(404).json({ success: false, msg: "URL not found" })
        }

        if (url.userId !== userId) {
            return res.status(403).json({ success: false, msg: "You don't have permission to delete this URL" })
        }

        // Delete the URL
        await db.delete(urlsTable).where(eq(urlsTable.id, id))

        return res.status(200).json({ success: true, msg: "URL deleted successfully" })
    } catch (error: any) {
        console.error(error.message)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

export const shortUrl = async (req:AuthRequest, res:Response)=>{
try {
    const userId = req?.user?.id
 
    if(!userId){
        return res.status(401).json({success:false, msg:"You must be login to access this resource"})
    }
      const validationResult = await urlShortenBodySchema.safeParseAsync(req.body)

      if(validationResult.error){
        return res.status(400).json({success : false, msg:validationResult.error.format() })
      }

      const { url,code } = validationResult.data;

      let shortCode: string;
      
      if (code) {
        // Check if custom code already exists
        const [result] = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, code));
        if (result) {
          return res.status(400).json({success:false, msg:`This code ${code} is already taken please try another`});
        }
        shortCode = code;
      } else {
        // Generate a unique short code
        let attempts = 0;
        do {
          shortCode = nanoid(7);
          const [result] = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, shortCode));
          if (!result) break;
          attempts++;
        } while (attempts < 10); // Prevent infinite loop
        
        if (attempts >= 10) {
          return res.status(500).json({success:false, msg:"Failed to generate unique short code"});
        }
      }

      const [data] = await db.insert(urlsTable).values({
        shortCode,
        targetUrl : url,
        userId
      }).returning({id:urlsTable.id, shortCode:urlsTable.shortCode, targetUrl : urlsTable.targetUrl})

    return res.status(201).json({success:true, data:{id:data.id, targetUrl:data.targetUrl, shortCode:data.shortCode}})
} catch (error : any) {
    console.error(error.message);
}
} 

export const redirectUrl = async (req:AuthRequest, res:Response)=>{
    try {
        const {shortCode} = req.params;

        if(!shortCode){
            return res.status(400).json({success:false, msg:"Short code is required"})
        }

        const [data] = await db.select().from(urlsTable).where((table)=> eq(table.shortCode,shortCode))

        if(!data){
            return res.status(404).json({success:false, msg:"Invalid url"})
        }

        // Increment click count
        await db.update(urlsTable)
            .set({ clicks: sql`${urlsTable.clicks} + 1` })
            .where(eq(urlsTable.id, data.id))

        return res.redirect(data.targetUrl)

    } catch (error) {
        console.error(error)
        return res.status(500).json({success:false, msg:"Internal server error"})
    }
}