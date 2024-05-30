import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:3300/productos';
  private productoCambioSubject = new Subject<void>();

  productoCambio$ = this.productoCambioSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto)
    .pipe(tap(() => this.productoCambioSubject.next()));
    ;
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto)
    .pipe(tap(() => this.productoCambioSubject.next()));
    ;
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
    .pipe(tap(() => this.productoCambioSubject.next()));
    ;
  }
}
