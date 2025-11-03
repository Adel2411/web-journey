
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);

    if(password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }

    if(!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
    }

    if(!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
    }

    if(!hasDigit){
        return "Password must contain at least one digit.";
    }

    return null;

}