const bcrypt= require("bcrypt");

/*export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
*/



exports.hashPassword=async function(password){
    try{
      
        const hashpass=await bcrypt.hash(password,10);
        
        return hashpass;
    }
    catch(error){
        console.log(error.message);
    }
  }


exports.comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};