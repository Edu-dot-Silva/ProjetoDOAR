const bcrypt = require('bcrypt');
const senha = 'cliente123';
(async () => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(senha, saltRounds);
  console.log(hash);
})();