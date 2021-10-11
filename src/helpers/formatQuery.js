const formatQuery = (text) => {
  return encodeURIComponent(text.toLowerCase()).replace(/%20/g, "+");
};

export default formatQuery;
