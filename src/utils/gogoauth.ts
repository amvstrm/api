// CODE is from https://github.com/iotserver24/animeverse-api/blob/9f8800d37473c1307afece06c5f42830da02a1f7/src/gogo.js#L224-L237
// WITH MODIFICATIONS

export const getGogoCookie = async () => {
  const response = await fetch(
    "https://api.github.com/repos/TechShreyash/TechShreyash/contents/gogoCookie.txt",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 9; vivo 1916) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
      },
    }
  );
  const data = await response.json();
  const cookie = data["content"].replaceAll("\n", "");
  console.log(atob(cookie));
  return atob(cookie);
};