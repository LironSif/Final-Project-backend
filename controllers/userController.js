import User from '../models/user.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs" 
import NodeMailer from 'nodemailer'
import fs from 'fs';
import getOpenAiInstance from "../openai.js";


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
    const { userId, shelfConfig, chemicals } = req.body;
    try {
        // Construct the update object
        const updateData = {};
        if (chemicals) updateData.chemicals = chemicals;
        if (shelfConfig) updateData.shelfConfig = shelfConfig;

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const sendScreenShotToEmail = async (req, res) => {
   
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const userId = req.body.userId;

    try {
        // Fetch the user's details from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        console.log("Received request to send screenshot via email");
        const filepath = req.file.path; // Path to the uploaded file

        console.log("Setting up Nodemailer transport");
        const transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email, 
            subject: 'Webpage Screenshot',
            text: 'Here is the screenshot.',
            attachments: [{   
                filename: req.file.originalname,
                path: filepath
            }]
        };

        console.log("Attempting to send email");
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent');

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Error occurred');
    } finally {
  
        try {
            console.log("Attempting to delete the temporary file");
            fs.unlinkSync(filepath);
            console.log('Temporary file deleted successfully');
        } catch (unlinkError) {
            console.error('Error deleting screenshot file:', unlinkError);
        }
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

export const promptOpenAi = async ( req,res) => {
   const {prompt }= req.body
   console.log(prompt)
    const openai = getOpenAiInstance();
    try {
        const systemMessage = {
            role: "system",
            content: `You are a helpful assistant. Your task is to organize provided information about how to store chemicals on an 8-slot shelf, adhering to OSHA guidelines. The chemicals will be provided by the user. You need to suggest how to arrange the shelf, such as which chemicals should be placed above or below others. For example, flammable substances should not be stored near oxidizers. Please provide your recommendations based on these rules:`,
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4", // Make sure to use a valid model name
            messages: [
                systemMessage,
                { role: "user", content:prompt},
            ],
            max_tokens: 250,
            // Additional parameters can be uncommented and adjusted as needed
            // temperature: 1,
            // stop: ":",
            // presence_penalty: 2,
            // seed: 42,
            // n: 2,
        });

        const assistantResponse = response.choices[0].message;
        console.log("##########################################", assistantResponse.content);
        res.send(assistantResponse.content)

    } catch (error) {
        console.log(error.message);
        throw error; 
    }
}
