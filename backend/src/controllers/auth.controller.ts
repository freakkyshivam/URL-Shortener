
import db from '../db/db'
import { userTable } from '../models/user.model'
import argon2 from 'argon2'
import { Request,Response } from 'express'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export const signup = async (req:Request, res:Response)=>{
    try {
        const {first_name, last_name, email, password} = req.body;

        if(!first_name || first_name === ""){
            return res.status(400).json({success:false, msg:"First name are required"})
        }

        if(!email || email === ""){
            return res.status(400).json({success:false, msg:"Email are required"})
        }

        if(!password || password === ""){
            return res.status(400).json({success:false, msg:"Password are required"})
        }

        const [existingUser] = await db.select().from(userTable).where((table)=> eq(table.email, email))

        if(existingUser){
            return res.status(400).json({success:false, msg:`User with this email ${email} already exits`})
        }

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 64 * 1024, 
            timeCost: 3,
            parallelism: 1,
        });

        const [data] = await db.insert(userTable).values({
            firstName : first_name,
            lastName : last_name,
            email,
            password:hashedPassword
        }).returning({id:userTable.id})

        return res.status(201).json({success:true, msg:"User created", userId:data.id})
    } catch (error: any ) {
        console.error(error)
    }
}

export const login = async (req:Request, res:Response)=>{
    try {
        const {email, password} = req.body;

        if(!email || email === ""){
            return res.status(400).json({success:false, msg:"Email are required"})
        }

         if(!password || password === ""){
            return res.status(400).json({success:false, msg:"Password are required"})
        }

         const [existingUser] = await db.select()
            .from(userTable)
            .where((table)=> eq(table.email, email))

            if(!existingUser){
            return res.status(404).json({success:false, msg:`User with this email ${email} not found please signup`})
            }

            const isMatch = await argon2.verify(existingUser.password, password)

            if(!isMatch){
                return res.status(400).json({success:false, msg:`Password is incorrect`}) 
            }

            const payload = {
                id : existingUser.id,
                name : existingUser.firstName + " " + existingUser.lastName,
                email : existingUser.email
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET!,{ expiresIn : '15 min'})

            res.cookie("token", token,{
                httpOnly: true,       
                secure: false,         
                sameSite: "strict",  
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({success:true, msg:"Login suceessful", token})
    } catch (error : any) {
        console.error(error.message)
    }
}