module.exports.generateAccountNumber = () => {
  const no = (3478987664 + Math.floor(Math.random() * 999999999)).toString();

  return no.length > 10 ? no.slice(0, 10) : no;
};
