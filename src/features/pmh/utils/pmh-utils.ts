export const initializeTextObject = (defaultValue) => {
  const mapped = Object.entries(defaultValue).map(([key, value]) => {
    return [
      key,
      {
        value: value,
        isEditing: false,
      },
    ];
  });

  const formattedEntries = Object.fromEntries(mapped);
  const defaultTextState = {
    ...formattedEntries,
    hasEdited: false, //一度でも編集したならtrueに変更。
  };

  return defaultTextState;
};
