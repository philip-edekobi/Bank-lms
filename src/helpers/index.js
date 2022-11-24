module.exports.generateAccountNumber = () => {
  let no = (3478987664 + Math.floor(Math.random() * 999999999)).toString();

  no = no.slice(0, 6);

  return parseInt(no, 10);
};
