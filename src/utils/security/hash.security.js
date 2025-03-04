import bcrypt from "bcrypt"
export const generateHash = ({plainText,salt=parseInt(process.env.SALT_ROUND)}={})=>{
    const hash =  bcrypt.hashSync(plainText,salt)
    return hash
}       
export const compareHash = ({plainText,hashedValue}={})=>{
    console.log(plainText,hashedValue);
    const match = bcrypt.compareSync(plainText,hashedValue)
    return match
}