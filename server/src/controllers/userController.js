import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @SIGNUP_USER
 * @ROUTE @POST {{URL}}/api/v1/user/signup
 * @ACCESS Public (No authentication required)
 */
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email, username });

    // checking conditions
    if (user && user.email === email) {
        return res.status(400).json({ message: "Email already exists" });
    }
    if (user && user.username === username) {
        return res.status(400).json({ message: "Username already exists" });
    }

    try {
        // using hash to encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // creating new user
        const user = await User.create({
            username: username,
            email: email,
            password: encryptedPassword
        });

        await user.save();

        res.status(201).json({ message: "user registration completed" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * @LOGIN_USER
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @ACCESS Public (No authentication required)
 */
export const login = async (req, res) => {
    const { email, username, password } = req.body;

    // fetching the user based on email or username
    let user = null;
    if (email) {
        user = await User.findOne({ email: email })
    }
    if (username) {
        user = await User.findOne({ username: username })
    }

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user) {

        // if user is fetched comparing password to verify the user
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // if the user id is deactivated then re-activate the user profile and make the user public
        if (user.isActive === false) {
            await User.updateOne({ _id: user._id }, { $set: { isActive: true, public: true } });
        }

        // creating user cookie using jwt and signing in with secrete 
        const token = jwt.sign({
            email: user.email,
            username: user.username,
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "1d" });


        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production' ? true : false,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None',
            httpOnly: true,
        });
        return res.status(200).json({ result: user, token });
    }
}


/**
 * @GET
 * @ROUTE @GET {{URL}}/api/v1/user/get
 * @ACCESS Private (Logged in user only)
 */
export const getUser = async (req, res) => {
    const userParam = req.query.username;

    try {
        // if no userParam then return all the user in the collection
        if (userParam === undefined) {
            const users = await User.find({});
            return res.status(200).json(users);
        }

        // if userParam is presents in the query then return the specific user
        const user = await User.findOne({ username: userParam });

        // if user is active is false then return 404
        if (!user || user.isActive === false) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/update/:id
 * @ACCESS Private (Logged in user only)
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;

    // list of fields that can be updated
    const modifiable = ['pic', 'country', 'bio', 'contact', 'public'];

    // checking valid request body and validating the request body
    const checkReqBody = Object.keys(req.body).every(key => modifiable.includes(key));
    if (!checkReqBody) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    // checking if the user exists in the collection
    const user = await User.findOne({ username: id });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    try {
        // updating user
        const updateRes = await User.updateOne(
            { username: id },
            { $set: req.body },
            { multi: true }
        )

        // if user not updated return 400 
        if (updateRes.modifiedCount === 0) {
            return res.status(400).json({ message: "User not updated" });
        }
        return res.status(200).json({ message: "user updated" })
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/**
 * @DELETE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/delete
 * @ACCESS Private (Logged in user only)
 */
export const deleteUser = async (req, res) => {
    const { email, password } = req.body

    // checking if user is in the record
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    try {
        // if user is fetched comparing password to verify the user
        const isUserValid = await bcrypt.compare(password, user.password);

        // if password is invalid return 400
        if (!isUserValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // deleting the user
        const deleteUsr = await User.deleteOne({ email });
        if (deleteUsr.deletedCount === 0) {
            return res.status(400).json({ message: "User not deleted" });
        }
        return res.status(200).json({ message: "user deleted" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/deactivate
 * @ACCESS Private (Logged in user only)
 */
export const deactivateUser = async (req, res) => {
    const { email, password } = req.body

    // fetching the user 
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    try {
        // if user is fetched comparing password to verify the user
        const isUserValid = await bcrypt.compare(password, user.password);

        if (!isUserValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // deactivating the user by setting the isActive to false
        const deactivateUsr = await User.updateOne({ email }, { $set: { isActive: false, public: false } });

        if (deactivateUsr.modifiedCount === 0) {
            return res.status(400).json({ message: "User not deactivated" });
        }
        return res.status(200).json({ message: "user deactivated" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/deactivate
 * @ACCESS Private (Logged in user only)
 */
export const logout = asyncHandler(
    async (req, res) => {
        res.cookie('token', null, {
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 0,
            httpOnly: true,
        });

        // Sending the response
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    }
)

export default { signup, login, getUser, updateUser, deleteUser, deactivateUser };