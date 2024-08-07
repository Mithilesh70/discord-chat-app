import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RequestOptions {
  body?: any;
  params?: { [key: string]: any };
  headers?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {


  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('GET', endpoint, options);
  }

  post<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  put<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  private request<T>(method: string, endpoint: string, options?: RequestOptions): Observable<T> {
   
    const { body, params, headers } = options || {};

    const httpOptions = {
      headers: new HttpHeaders(headers),
      params: new HttpParams({ fromObject: params }),
    };

    return this.http
      .request<T>(method, endpoint, { body, headers: httpOptions.headers, params: httpOptions.params })
      
  }
}


