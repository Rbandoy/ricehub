const mapQueryResult = (data) => {
  return data.map((r) => r.toJSON());
};

module.exports = mapQueryResult;
