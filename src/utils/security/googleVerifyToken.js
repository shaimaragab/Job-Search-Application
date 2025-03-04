import { OAuth2Client } from "google-auth-library"
async function verifyGoogleToken(idToken){
const client = new OAuth2Client(process.env.CLIENTID)
const ticket = await client.verifyIdToken({
    idToken,
    audience:process.env.CLIENTID}
)
return ticket.getPayload()
}
export default verifyGoogleToken