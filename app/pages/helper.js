export const checkCode = (code,phone)=>{
    for (let i = 0; i < code.length; i++) {
        if (code.charAt(i) !== phone.charAt(i)) {
            return false
        }
    }
    return true;
}