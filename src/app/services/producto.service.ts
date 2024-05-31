import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';
  private productoCambioSubject = new Subject<void>();

  productoCambio$ = this.productoCambioSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerProducto(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: any): Observable<any> {
    // Convertir campos a valores numéricos
    producto.presupuesto = Number(producto.presupuesto);
    producto.cantidad = Number(producto.cantidad);
    producto.valorUnitario = Number(producto.valorUnitario);

    // Validación de campos numéricos
    if (!this.validarNumerico(producto.presupuesto) ||
        !this.validarNumerico(producto.cantidad) ||
        !this.validarNumerico(producto.valorUnitario)) {
      return throwError('Los campos presupuesto, cantidad y valorUnitario deben ser numéricos');
    }

    return this.obtenerProductos().pipe(
      map(productos => {
        const maxId = productos.length > 0 ? Math.max(...productos.map(p => Number(p.id))) : 0;
        producto.id = (maxId + 1).toString(); // Asignar un nuevo ID incrementado y convertirlo a cadena
        return producto;
      }),
      switchMap(nuevoProducto => this.http.post<any>(this.apiUrl, nuevoProducto)),
      tap(() => this.productoCambioSubject.next())
    );
  }

  actualizarProducto(id: number | string, producto: any): Observable<any> {
    // Convertir campos a valores numéricos
    producto.presupuesto = Number(producto.presupuesto);
    producto.cantidad = Number(producto.cantidad);
    producto.valorUnitario = Number(producto.valorUnitario);

    // Validación de campos numéricos
    if (!this.validarNumerico(producto.presupuesto) ||
        !this.validarNumerico(producto.cantidad) ||
        !this.validarNumerico(producto.valorUnitario)) {
      return throwError('Los campos presupuesto, cantidad y valorUnitario deben ser numéricos');
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, producto)
      .pipe(tap(() => this.productoCambioSubject.next()));
  }

  eliminarProducto(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.productoCambioSubject.next()));
  }

  // Función de validación de números
  private validarNumerico(valor: any): boolean {
    return !isNaN(valor) && !isNaN(parseFloat(valor));
  }
}
