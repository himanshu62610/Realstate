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
//salt pepper way to hasing

//
exports.hashPassword=async function(password){
    try{
      //yaha 10 salt ki value hai;
        const hashpass=await bcrypt.hash(password,10);//10ko bhi pass kaRNA HAI
        //AWAIT CALL MARNA HAI
        return hashpass;
    }
    catch(error){
        console.log(error.message);
    }
  }


exports.comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};