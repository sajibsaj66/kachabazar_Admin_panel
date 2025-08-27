import LanguageServices from "@/services/LanguageServices";
import TextTranslateServices from "@/services/TextTranslateServices";

const showingTranslateValue = (data, lang) => {
  return data !== undefined && Object?.keys(data).includes(lang)
    ? data[lang]
    : data?.en;
};

const showingImage = (data) => {
  return data !== undefined && data;
};

const showingUrl = (data) => {
  return data !== undefined ? data : "!#";
};

// translate api call
const handleTranslateCallApi = async (text, tnsForm, tnsTo) => {
  try {
    const res = await TextTranslateServices.translateText(text, tnsForm, tnsTo);

    return res?.responseData?.translatedText;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// text translate handler
const handlerTextTranslateHandler = async (text, tnsForm) => {
  const getAllLanguages = await LanguageServices.getAllLanguages();

  const filterLanguage = getAllLanguages?.filter(
    (lan) => lan?.iso_code !== tnsForm
  );

  const promisesArray = filterLanguage.map((lan) => {
    return text
      ? handleTranslateCallApi(text?.toLowerCase(), tnsForm, lan?.iso_code)
      : "";
  });

  const results = await Promise.all(promisesArray);

  const languageArray = filterLanguage.map((lan, index) => {
    return {
      lang: lan?.iso_code,
      text: results[index],
    };
  });

  let objectTnsLanguage = languageArray.reduce(
    (obj, item) => Object.assign(obj, { [item.lang]: item.text }),
    {}
  );

  return objectTnsLanguage;
};

export {
  showingTranslateValue,
  showingImage,
  showingUrl,
  handlerTextTranslateHandler,
};
