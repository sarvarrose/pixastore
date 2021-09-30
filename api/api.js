export const getImages = async (pageNumber = 1, query = "") => {
  const response = await fetch(
    `https://pixabay.com/api/?key=23580743-ffaba0b807ad288992a720125&page=${pageNumber}&q=${query}`
  );
  const images = await response.json();
  return images;
};

export default getImages;
