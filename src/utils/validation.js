function validateUsername(username) {
    const re = /^[a-zA-Z0-9\_]+$/;
    return re.test(username)
}

function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

module.exports = {validateEmail, validateUsername}