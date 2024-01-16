import { orderContant } from "../contant";

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export function renderOptions(arr) {
  let results = [] 
  if(arr) {
    results = arr.data?.map((option) => {
      return {
        value: option,
        label: option
      }
    })
  }

  results.push({
    label:'Thêm type',
    value: 'add-type'
  })
  return results
}

export function renderOptionsCategory(arr) {
  let results = [] 
  
  if(arr) {
    results = arr?.map((option) => {
      return {
        value: option?.name,
        label: option?.name
      }
    })
  }
  return results
}

export function renderOptionsPet(arr) {
  let results = [] 
  if(arr) {
    results = arr?.map((option) => {
      return {
        value: option,
        label: option
      }
    })
  }
  return results
}





export const convertPrice = (price) => {
  try {
      const result  = price?.toLocaleString().replaceAll(',', '.')
      return `${result} VND`
  } catch (error) {
      return null
  }
}

export const convertDataChart = (data, type) => {
  try {
      const object = {}
      Array.isArray(data) && data.forEach((opt) => {
          if(!object[opt[type]]) {
              object[opt[type]] = 1
          } else {
              object[opt[type]]+=1
              console.log('c;getBase64', object[opt[type]], typeof(object[opt[type]]))
          }
      })
      const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
          return {
              name: orderContant.payment[item],
              value: object[item]
          }
      })
      return results
  }catch(e) {
      return []
  }
}