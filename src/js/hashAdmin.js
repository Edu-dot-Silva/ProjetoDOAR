const bcrypt = require('bcrypt');
const senha = 'admin123';
(async () => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(senha, saltRounds);
  console.log(hash);
})();