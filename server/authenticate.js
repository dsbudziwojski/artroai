import admin from "./firebaseAdmin.js";

export default async function authenticate(req, res, next) {
    // TODO

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    const idToken = authHeader.split('Bearer ')[1];

    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user=decodedToken;
        next();

    } catch (error){
        console.error('Error verifying token:', error);
        return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
    
}