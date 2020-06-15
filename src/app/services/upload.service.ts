import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  // SERVER_URL: string = "http://localhost:3001/file";
  constructor(private http:HttpClient) { }

  public upload(formData) {
    return this.http.post<any>("/api/products/file", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
