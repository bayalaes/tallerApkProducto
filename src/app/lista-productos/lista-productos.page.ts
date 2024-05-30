import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];

  constructor(
    private router: Router,
    private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
    this.productoService.productoCambio$.subscribe(() => {
      this.cargarProductos();
    });
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe((data) => {
      this.productos = data;
      this.productosFiltrados = data;
    });
  }

  filtrarProductos(query: string) {
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(query.toLowerCase()) || 
      producto.unidad.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe(() => {
      // Redirigir al usuario a la página de lista de productos
      this.router.navigate(['/lista-productos']);
    }, error => {
      // Manejar errores en la eliminación del producto, si es necesario
      console.error('Error al eliminar el producto:', error);
    });
  }
}
