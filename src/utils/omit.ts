function omit<T>(obj: T, property: keyof T | (keyof T)[]) {
  if (Array.isArray(property)) {
    const entries = Object.entries(obj).filter((item) => {
      const [key] = item;

      return !property.includes(key as keyof T);
    });

    return Object.fromEntries(entries);
  }

  const { [property]: unused, ...rest } = obj;
  console.log(unused);
  return rest;
}

export default omit;
