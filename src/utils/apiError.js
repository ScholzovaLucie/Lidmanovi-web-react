function flattenErrors(data, path = []) {
  if (data == null) return [];

  if (typeof data === "string") {
    return [path.length ? `${path.join(" ")}: ${data}` : data];
  }

  if (Array.isArray(data)) {
    return data.flatMap((item, index) =>
      flattenErrors(item, [...path, `#${index + 1}`]),
    );
  }

  if (typeof data === "object") {
    return Object.entries(data).flatMap(([key, value]) =>
      flattenErrors(value, [...path, key]),
    );
  }

  return [];
}

export function getApiErrorMessages(err, fallback) {
  const messages = flattenErrors(err?.data);
  return messages.length ? messages : [fallback];
}

export function getApiErrorMessage(err, fallback) {
  return getApiErrorMessages(err, fallback)[0];
}
