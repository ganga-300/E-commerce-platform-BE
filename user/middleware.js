const validateUser = ()=>{
    const { userName, email } = req.body;
    if (!userName || !email || !password || !role) {
        return res.status(400).json({ error: "Name and Email are required." });
    }
}



const validateUpdateuser = ()=>{
    const {name,email} = req.body
    if(!name || !email){
        return res.status(400).json({error:"Name and email are required"})
    }
}