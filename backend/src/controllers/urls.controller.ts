import { Request, Response } from 'express'
 
import {urlShortenBodySchema } from '../validation/request.validation.js'
import {nanoid} from 'nanoid'

import db from '../db/db.js'
import { urlsTable } from '../models/url.model.js'
 import { userTable } from '../models/user.model.js'
import { eq, sql } from 'drizzle-orm'
import { getAuth } from '@clerk/express'

export const deleteUrl = async (req: Request, res: Response) => {

    try {

        const { userId } = getAuth(req);

        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "You must be logged in"
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                msg: "URL ID is required"
            });
        }

        const [url] = await db
            .select()
            .from(urlsTable)
            .where(eq(urlsTable.id, id));

        if (!url) {
            return res.status(404).json({
                success: false,
                msg: "URL not found"
            });
        }

        if (url.userId !== userId) {
            return res.status(403).json({
                success: false,
                msg: "Forbidden"
            });
        }

        await db.delete(urlsTable)
            .where(eq(urlsTable.id, id));

        return res.json({
            success: true,
            msg: "Deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

};


export const shortUrl = async (req:Request, res:Response)=>{
try {
   const { userId } = getAuth(req);
 
    if(!userId){
        return res.status(401).json({success:false, msg:"You must be login to access this resource"})
    }

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
        userId : dbUser.id
      }).returning({id:urlsTable.id, shortCode:urlsTable.shortCode, targetUrl : urlsTable.targetUrl})

    return res.status(201).json({success:true, data:{id:data.id, targetUrl:data.targetUrl, shortCode:data.shortCode}})
} catch (error : any) {
    console.error(error.message);
}
} 

export const redirectUrl = async (req:Request, res:Response)=>{
    try {
        const shortCode = req.params.shortCode as string;


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