// Auth
import {signupController} from './auth/signup.js';
import {loginController} from './auth/login.js';
import {verifyEmailController} from './auth/verifyEmail.js';
import {requestPasswordResetController} from './auth/requestPasswordReset.js';
import {resetPasswordController} from './auth/resetPassword.js';

// Performer
import {addPerformerController} from "./performer/addPerformer.js";
import {getPerformersController} from "./performer/getAllPerformers.js";
import {getPerformerByIdController} from "./performer/getPerformerById.js";
import {updatePerformerController} from "./performer/updatePerformer.js";
import {deletePerformerController} from "./performer/deletePerformer.js";


export default {
    signupController,
    loginController,
    verifyEmailController,
    requestPasswordResetController,
    resetPasswordController,

    addPerformerController,
    getPerformersController,
    getPerformerByIdController,
    updatePerformerController,
    deletePerformerController,
}