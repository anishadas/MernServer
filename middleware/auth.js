import jwt from 'jsonwebtoken'
// ex: user wants to like a post
// click th elike button ==> auth middleware will run and wait for next() ==> like controller

const auth=async (req,res,next)=>{
    try{
        // console.log(req.headers)
        const token=req.headers.authorization.split(" ")[1];
        const isCustomAuth=token.length<500;
        // console.log("iscuston",isCustomAuth);
        let decodedData;
        if(token && isCustomAuth){
            // will give me username and email
            decodedData=jwt.verify(token,'test');
            req.userId=decodedData?.id;
        }
        else{
            decodedData=jwt.decode(token);
            req.userId=decodedData?.sub;
        }
        next();
    }catch(error){
        console.log(error)
    }
}

export default auth;