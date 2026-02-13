import db from '../db/db.js'
import { userTable } from '../models/user.model.js'
import { eq } from 'drizzle-orm'

export const getUserByEmail = async (email:string)=>{
     const [existingUser] = await db.select({
        id: userTable.id,
        firstName : userTable.firstName,
        lastName : userTable.lastName,
        email : userTable.email,
     })
            .from(userTable)
            .where((table)=> eq(table.email, email))

            return existingUser
}

export const getUserById = async (id:string)=>{
     const [existingUser] = await db.select({
        id: userTable.id,
        firstName : userTable.firstName,
        lastName : userTable.lastName,
        email : userTable.email
     })
            .from(userTable)
            .where((table)=> eq(table.id, id))

            return existingUser
}

 
 