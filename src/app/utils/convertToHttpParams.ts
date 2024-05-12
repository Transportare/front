import { HttpParams } from '@angular/common/http';

export const convertToHttpParams = (data: any): HttpParams => {
  let params = new HttpParams();

  for (const key in data) {
    const element = data[key];
    params = params.set(key, element);
  }

  return params;
};
