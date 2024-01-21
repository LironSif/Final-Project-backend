import User from '../models/user.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs" 


export const createUser = async (req, res) => {
    const {name, email, password, chemicals,shelfConfig } = req.body;
    try{    

    if(!name || !email || !password ){
        res.status(404)
        throw new Error ("please fill all fields")
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            chemicals,
            shelfConfig

        })

        if(user){
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token:generateToken(user._id)
            });
        } else{
            res.status(400)
            throw new Error ("invalid user data")
        }

    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        if(!email || !password) {
            res.status(401)
            throw new Error ('all fields are required')
        }
        const user  = await User.findOne({email})

        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                user:user,
                _id: user.id,
                name: user.name,
                email: user.email,
                token:generateToken(user._id)
            })
        } else {
            res.status(400)
            throw new Error ("invalid credentials")
        }
    } catch(err){
        res.send(err.message)
    }
}


export const getMe = async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);

    res.status(200).send({
        id: _id,
        name,
        email
    })
}


export const getAllUsers = async(req, res) =>{
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

 export const findUserById = async(req,res) =>{
    const {id} = req.params;
        try {
            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user)
        } catch (error) {
            console.error('Error finding user by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
 }

 export const updateUser = async (req, res) => {
    const {userId} = req.body
    try {
        const chemicalsToUpdate = req.body.chemicals;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { "chemicals": chemicalsToUpdate } },
            { new: true }
        );

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).send(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


 const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:"30d"
    })
 }


// --- jwt.sign: This method is used to create a new JWT.
// --- {id}: The payload of the JWT, which typically contains data
//  you want to encode. In this case, you're including the user's ID.
// --- process.env.JWT_SECRET: The secret key used to sign the JWT. This key
//  should be kept secret and not exposed.
//   It's stored in an environment variable for security reasons.
// --- {expiresIn: "30d"}: This specifies the expiration time of the
//  token. After 30 days, the token will no longer be valid, and
//   the user will need to reauthenticate.


// JWTs are used for authentication and authorization. They 
// contain information about the user (in the payload), are 
// signed with a secret key, and can be decoded to verify 
// the authenticity of the information.
//  The expiration time helps manage security by limiting the
//   validity period of the token.