import express from 'express';
const userRouter = express.Router();
import userController from '../controllers/userController.js';
import isAuth from '../middleWare/authMiddleware.js';
import { upload } from '../middleWare/multer.js';



userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/logout/:id', isAuth, userController.logoutUser);
userRouter.get('/getAll', userController.getAllUsers);
userRouter.get('/:id', userController.getSingleUser);
userRouter.delete('/delete/:id', isAuth, userController.deleteUser);
userRouter.put('/updateuser/:id', isAuth, userController.updateUser);
userRouter.put('/updatepassword/:id', isAuth, userController.updatePassword);
userRouter.put('/updateprofilepicture/:id', isAuth, upload.single("image"), userController.updateProfilePicture);

export default userRouter;



