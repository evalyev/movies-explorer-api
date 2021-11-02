module.exports.checkPermissionsMovie = (movie, thisUser) => {
  if (movie.owner.equals(thisUser._id)) {
    return true;
  }
  return false;
};
