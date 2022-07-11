
function isUpper(str) {
  const pattern = new RegExp("^(?=.*[A-Z]).+$")
  return pattern.test(str)
}

function getErrors(registrationData, touched) {
  const result = {}
  //email
  if(touched.email){
    if (!registrationData.email){
      result.email = "Email is required"
    }else if(registrationData.email.length < 3){
      result.email = "Email should contain at least 3 characters"
    }else if(!registrationData.email.includes("@")){
      result.email = "Email should contain @ symbol"
    }else if(!registrationData.email.includes(".")){
      result.email = "Email should contain highest order domain"
    }
  }
  //password
  if(touched.password){
    if (!registrationData.password){
      result.password = "Password is required"
    }else if(registrationData.password.length < 5){
      result.password = "Password should contain at least 5 characters"
    }else if(!isUpper(registrationData.password)){
      result.password = "Password should contain a capital letter"
    }
  }
  //passwordAgain
  if(touched.passwordAgain){
    if(registrationData.password.localeCompare(registrationData.passwordAgain) !== 0){
      result.passwordAgain = "Passwords must match"
    }
  }
  return result;
}

export default getErrors;