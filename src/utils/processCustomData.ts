const path = "./src/customProvider.json";
const file = Bun.file(path);

if (!file.exists) {
  throw new Error(`File ${path} not found, please create one.`);
}

if (!file.json) {
  throw new Error(`File ${path} is not a json file.`);
}

if ((await file.json()).find((item: any) => !item.id)) {
  throw new Error(`File ${path} does not contain id property on each array.`);
}

// if id is not a number, throw error
if ((await file.json()).find((item: any) => typeof item.id !== "number")) {
  throw new Error(`File ${path} the id property is not an number.`);
}

export default [
  ...await file.json(), 
];

